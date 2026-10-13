package com.safelink.service;

import com.safelink.dto.EmergencyCreateRequest;
import com.safelink.dto.EmergencyDto;
import com.safelink.dto.EmergencyStatusUpdateRequest;
import com.safelink.entity.*;
import com.safelink.exception.BadRequestException;
import com.safelink.exception.ResourceNotFoundException;
import com.safelink.repository.EmergencyRepository;
import com.safelink.repository.GuardianRelationshipRepository;
import com.safelink.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;
    private final GuardianRelationshipRepository guardianRelationshipRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    public EmergencyService(EmergencyRepository emergencyRepository,
                            GuardianRelationshipRepository guardianRelationshipRepository,
                            UserRepository userRepository,
                            NotificationService notificationService,
                            AuditService auditService) {
        this.emergencyRepository = emergencyRepository;
        this.guardianRelationshipRepository = guardianRelationshipRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }

    @Transactional
    public EmergencyDto triggerSos(User user, EmergencyCreateRequest request, String clientIp) {
        Emergency emergency = new Emergency(
                user,
                request.getLatitude(),
                request.getLongitude(),
                request.getAddress() != null ? request.getAddress() : "Location coordinates: " + request.getLatitude() + ", " + request.getLongitude(),
                request.getTriggerReason() != null ? request.getTriggerReason() : "Direct SOS Button Triggered"
        );

        Emergency saved = emergencyRepository.save(emergency);

        // 1. Notify authorized guardians
        List<GuardianRelationship> relationships = guardianRelationshipRepository.findByUser(user);
        for (GuardianRelationship rel : relationships) {
            if (rel.isSosRecipient() && rel.getGuardian() != null) {
                notificationService.createNotification(
                        rel.getGuardian(),
                        "EMERGENCY SOS ALERT: " + user.getFullName(),
                        "Emergency SOS activated at " + emergency.getAddress() + ". Coords: " + emergency.getLatitude() + ", " + emergency.getLongitude(),
                        NotificationType.SOS,
                        saved.getId()
                );
            }
        }

        // 2. Notify on-duty officials
        List<User> officials = userRepository.findByRole(Role.ROLE_OFFICIAL);
        for (User official : officials) {
            notificationService.createNotification(
                    official,
                    "URGENT: Active SOS from " + user.getFullName(),
                    "Emergency dispatch alert at " + emergency.getAddress() + " (User: " + user.getPhoneNumber() + ")",
                    NotificationType.SOS,
                    saved.getId()
            );
        }

        // 3. Record Audit Log
        auditService.log(user.getId(), user.getEmail(), user.getRole().name(),
                "SOS_ACTIVATED", "EMERGENCY", saved.getId(),
                "SOS event activated at (" + saved.getLatitude() + ", " + saved.getLongitude() + ")", clientIp);

        return new EmergencyDto(saved);
    }

    @Transactional
    public EmergencyDto updateEmergencyStatus(Long emergencyId, EmergencyStatusUpdateRequest request, User actor, String clientIp) {
        Emergency emergency = emergencyRepository.findById(emergencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency event not found with id: " + emergencyId));

        EmergencyStatus oldStatus = emergency.getStatus();
        EmergencyStatus newStatus = request.getStatus();

        // If user is cancelling their own SOS:
        if (actor.getRole() == Role.ROLE_USER) {
            if (!emergency.getUser().getId().equals(actor.getId())) {
                throw new BadRequestException("You can only cancel your own emergency alert.");
            }
            if (newStatus != EmergencyStatus.CANCELLED) {
                throw new BadRequestException("Users can only cancel active emergency alerts.");
            }
        }

        emergency.setStatus(newStatus);
        if (request.getResponseNotes() != null) {
            emergency.setResponseNotes(request.getResponseNotes());
        }

        if (newStatus == EmergencyStatus.ACKNOWLEDGED && emergency.getAcknowledgedAt() == null) {
            emergency.setAcknowledgedAt(LocalDateTime.now());
            if (actor.getRole() == Role.ROLE_OFFICIAL) {
                emergency.setAssignedOfficial(actor);
            }
        }

        if (newStatus == EmergencyStatus.RESOLVED || newStatus == EmergencyStatus.CANCELLED) {
            emergency.setResolvedAt(LocalDateTime.now());
        }

        Emergency updated = emergencyRepository.save(emergency);

        // Notify user about status change
        notificationService.createNotification(
                emergency.getUser(),
                "Emergency Status Update",
                "Your SOS status changed from " + oldStatus + " to " + newStatus,
                NotificationType.SOS,
                updated.getId()
        );

        auditService.log(actor.getId(), actor.getEmail(), actor.getRole().name(),
                "EMERGENCY_STATUS_UPDATED", "EMERGENCY", updated.getId(),
                "Status transitioned from " + oldStatus + " to " + newStatus, clientIp);

        return new EmergencyDto(updated);
    }

    @Transactional(readOnly = true)
    public List<EmergencyDto> getActiveEmergencies() {
        return emergencyRepository.findByStatusInOrderByCreatedAtDesc(
                Arrays.asList(EmergencyStatus.ACTIVE, EmergencyStatus.ACKNOWLEDGED, EmergencyStatus.RESPONDING)
        ).stream().map(EmergencyDto::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmergencyDto> getAllEmergencies() {
        return emergencyRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(EmergencyDto::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmergencyDto> getUserEmergencies(User user) {
        return emergencyRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(EmergencyDto::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmergencyDto getEmergencyById(Long id) {
        Emergency emergency = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + id));
        return new EmergencyDto(emergency);
    }
}
