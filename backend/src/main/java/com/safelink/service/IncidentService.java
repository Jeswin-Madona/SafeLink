package com.safelink.service;

import com.safelink.dto.IncidentCreateRequest;
import com.safelink.dto.IncidentDto;
import com.safelink.dto.IncidentUpdateRequest;
import com.safelink.entity.Incident;
import com.safelink.entity.IncidentStatus;
import com.safelink.entity.Role;
import com.safelink.entity.User;
import com.safelink.exception.BadRequestException;
import com.safelink.exception.ResourceNotFoundException;
import com.safelink.repository.IncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final AuditService auditService;
    private final AiServiceClient aiServiceClient;

    public IncidentService(IncidentRepository incidentRepository, AuditService auditService, AiServiceClient aiServiceClient) {
        this.incidentRepository = incidentRepository;
        this.auditService = auditService;
        this.aiServiceClient = aiServiceClient;
    }

    @Transactional
    public IncidentDto createIncident(User reporter, IncidentCreateRequest request, String clientIp) {
        Incident incident = new Incident(
                reporter,
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getSeverity(),
                request.getLatitude(),
                request.getLongitude(),
                request.getApproximateAddress(),
                request.isAnonymous()
        );

        // Perform AI Intelligence Analysis via Python FastAPI microservice
        try {
            var analysis = aiServiceClient.analyzeIncident(
                    request.getTitle(), request.getDescription(), request.getCategory(), request.getApproximateAddress()
            );
            if (analysis != null) {
                incident.setAiAnalyzed(true);
                incident.setAiSummary((String) analysis.get("summary"));
                incident.setAiSuggestedCategory((String) analysis.get("suggested_category"));
                incident.setAiSuggestedSeverity((String) analysis.get("estimated_severity"));
                if (analysis.get("key_risk_indicators") != null) {
                    incident.setAiRiskFactors(analysis.get("key_risk_indicators").toString());
                }
            }
        } catch (Exception ex) {
            // Graceful non-blocking degradation
        }

        Incident saved = incidentRepository.save(incident);

        auditService.log(reporter.getId(), reporter.getEmail(), reporter.getRole().name(),
                "INCIDENT_REPORTED", "INCIDENT", saved.getId(),
                "Incident created with category " + saved.getCategory() + " (Anonymous: " + saved.isAnonymous() + ")", clientIp);

        boolean isOfficial = reporter.getRole() == Role.ROLE_OFFICIAL || reporter.getRole() == Role.ROLE_ADMIN;
        return new IncidentDto(saved, isOfficial || true);
    }

    @Transactional
    public IncidentDto reviewIncident(Long incidentId, IncidentUpdateRequest request, User reviewer, String clientIp) {
        if (reviewer.getRole() != Role.ROLE_OFFICIAL && reviewer.getRole() != Role.ROLE_ADMIN) {
            throw new BadRequestException("Only authorized officials can review and verify incident reports.");
        }

        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + incidentId));

        IncidentStatus oldStatus = incident.getStatus();
        incident.setStatus(request.getStatus());

        if (request.getSeverity() != null) {
            incident.setSeverity(request.getSeverity());
        }
        if (request.getOfficialNotes() != null) {
            incident.setOfficialNotes(request.getOfficialNotes());
        }

        incident.setReviewedBy(reviewer);
        incident.setReviewedAt(LocalDateTime.now());

        Incident updated = incidentRepository.save(incident);

        auditService.log(reviewer.getId(), reviewer.getEmail(), reviewer.getRole().name(),
                "INCIDENT_REVIEWED", "INCIDENT", updated.getId(),
                "Status updated from " + oldStatus + " to " + updated.getStatus() + ". Notes: " + updated.getOfficialNotes(), clientIp);

        return new IncidentDto(updated, true);
    }

    @Transactional(readOnly = true)
    public List<IncidentDto> getAllIncidents(User currentUser) {
        boolean isOfficial = currentUser != null && (currentUser.getRole() == Role.ROLE_OFFICIAL || currentUser.getRole() == Role.ROLE_ADMIN);
        return incidentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(i -> new IncidentDto(i, isOfficial || (currentUser != null && i.getReporter().getId().equals(currentUser.getId()))))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IncidentDto> getVerifiedIncidents(User currentUser) {
        boolean isOfficial = currentUser != null && (currentUser.getRole() == Role.ROLE_OFFICIAL || currentUser.getRole() == Role.ROLE_ADMIN);
        return incidentRepository.findByStatusOrderByCreatedAtDesc(IncidentStatus.VERIFIED)
                .stream()
                .map(i -> new IncidentDto(i, isOfficial || (currentUser != null && i.getReporter().getId().equals(currentUser.getId()))))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public IncidentDto getIncidentById(Long id, User currentUser) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));
        boolean isOfficial = currentUser != null && (currentUser.getRole() == Role.ROLE_OFFICIAL || currentUser.getRole() == Role.ROLE_ADMIN);
        return new IncidentDto(incident, isOfficial || (currentUser != null && incident.getReporter().getId().equals(currentUser.getId())));
    }
}
