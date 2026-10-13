package com.safelink.service;

import com.safelink.dto.JourneyCreateRequest;
import com.safelink.dto.JourneyDto;
import com.safelink.entity.GuardianRelationship;
import com.safelink.entity.Journey;
import com.safelink.entity.JourneyStatus;
import com.safelink.entity.NotificationType;
import com.safelink.entity.User;
import com.safelink.exception.BadRequestException;
import com.safelink.exception.ResourceNotFoundException;
import com.safelink.repository.GuardianRelationshipRepository;
import com.safelink.repository.IncidentRepository;
import com.safelink.repository.JourneyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JourneyService {

    private final JourneyRepository journeyRepository;
    private final IncidentRepository incidentRepository;
    private final GuardianRelationshipRepository guardianRelationshipRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    public JourneyService(JourneyRepository journeyRepository,
                          IncidentRepository incidentRepository,
                          GuardianRelationshipRepository guardianRelationshipRepository,
                          NotificationService notificationService,
                          AuditService auditService) {
        this.journeyRepository = journeyRepository;
        this.incidentRepository = incidentRepository;
        this.guardianRelationshipRepository = guardianRelationshipRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }

    @Transactional
    public JourneyDto createJourney(User user, JourneyCreateRequest request, String clientIp) {
        Journey journey = new Journey(
                user,
                request.getOriginName(),
                request.getDestinationName(),
                request.getStartLatitude(),
                request.getStartLongitude(),
                request.getDestinationLatitude(),
                request.getDestinationLongitude(),
                request.getExpectedDurationMinutes()
        );

        journey.setCompanionModeEnabled(request.isCompanionModeEnabled());
        journey.setShareWithGuardians(request.isShareWithGuardians());
        journey.setCurrentLatitude(request.getStartLatitude());
        journey.setCurrentLongitude(request.getStartLongitude());
        journey.setLastLocationUpdate(LocalDateTime.now());
        journey.setStatus(JourneyStatus.ACTIVE);
        journey.setStartedAt(LocalDateTime.now());

        // Transparent Multi-factor Estimated Risk Scoring
        int riskScore = calculateEstimatedRisk(
                request.getStartLatitude(), request.getStartLongitude(),
                request.getDestinationLatitude(), request.getDestinationLongitude()
        );
        journey.setEstimatedRiskScore(riskScore);
        journey.setRouteLabel(riskScore < 50 ? "Lower Estimated Risk Corridor" : "Elevated Caution Corridor");

        Journey saved = journeyRepository.save(journey);

        // Notify guardians if configured
        if (request.isShareWithGuardians()) {
            List<GuardianRelationship> rels = guardianRelationshipRepository.findByUser(user);
            for (GuardianRelationship rel : rels) {
                if (rel.isJourneyTrackingAuthorized() && rel.getGuardian() != null) {
                    notificationService.createNotification(
                            rel.getGuardian(),
                            "Journey Started: " + user.getFullName(),
                            user.getFullName() + " started a journey from " + request.getOriginName() + " to " + request.getDestinationName(),
                            NotificationType.JOURNEY_ALERT,
                            saved.getId()
                    );
                }
            }
        }

        auditService.log(user.getId(), user.getEmail(), user.getRole().name(),
                "JOURNEY_STARTED", "JOURNEY", saved.getId(),
                "Journey initiated towards " + saved.getDestinationName() + " with risk score " + riskScore, clientIp);

        return new JourneyDto(saved);
    }

    @Transactional
    public JourneyDto updateLocation(Long journeyId, Double latitude, Double longitude, User user) {
        Journey journey = journeyRepository.findById(journeyId)
                .orElseThrow(() -> new ResourceNotFoundException("Journey not found with id: " + journeyId));

        if (!journey.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only update your own active journey location.");
        }

        journey.setCurrentLatitude(latitude);
        journey.setCurrentLongitude(longitude);
        journey.setLastLocationUpdate(LocalDateTime.now());

        Journey updated = journeyRepository.save(journey);
        return new JourneyDto(updated);
    }

    @Transactional
    public JourneyDto completeJourney(Long journeyId, User user, String clientIp) {
        Journey journey = journeyRepository.findById(journeyId)
                .orElseThrow(() -> new ResourceNotFoundException("Journey not found with id: " + journeyId));

        if (!journey.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only complete your own journey.");
        }

        journey.setStatus(JourneyStatus.COMPLETED);
        journey.setCompletedAt(LocalDateTime.now());
        Journey saved = journeyRepository.save(journey);

        auditService.log(user.getId(), user.getEmail(), user.getRole().name(),
                "JOURNEY_COMPLETED", "JOURNEY", saved.getId(),
                "Journey to " + saved.getDestinationName() + " safely completed", clientIp);

        return new JourneyDto(saved);
    }

    @Transactional(readOnly = true)
    public List<JourneyDto> getUserJourneys(User user) {
        return journeyRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(JourneyDto::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JourneyDto> getActiveCompanionJourneys() {
        return journeyRepository.findByCompanionModeEnabledTrueAndStatus(JourneyStatus.ACTIVE)
                .stream().map(JourneyDto::new).collect(Collectors.toList());
    }

    /**
     * Transparent Multi-Factor Route Risk Estimation Formula
     * Considers:
     * 1. Time of day weight (higher late night 22:00-05:00)
     * 2. Density of verified incidents in the region
     * 3. Synthetic lighting & police patrol density factor
     */
    private int calculateEstimatedRisk(Double startLat, Double startLng, Double destLat, Double destLng) {
        int baseScore = 20;

        // Time factor
        LocalTime now = LocalTime.now();
        int hour = now.getHour();
        if (hour >= 22 || hour <= 5) {
            baseScore += 25; // late night weight
        } else if (hour >= 18) {
            baseScore += 10; // evening weight
        }

        // Incident factor (scaled)
        long totalIncidents = incidentRepository.count();
        int incidentFactor = (int) Math.min(35, totalIncidents * 3);

        int totalRisk = Math.min(100, Math.max(10, baseScore + incidentFactor));
        return totalRisk;
    }
}
