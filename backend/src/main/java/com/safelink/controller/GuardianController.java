package com.safelink.controller;

import com.safelink.dto.ApiResponse;
import com.safelink.dto.EmergencyDto;
import com.safelink.dto.JourneyDto;
import com.safelink.dto.UserDto;
import com.safelink.entity.Emergency;
import com.safelink.entity.GuardianRelationship;
import com.safelink.entity.Journey;
import com.safelink.entity.JourneyStatus;
import com.safelink.entity.User;
import com.safelink.repository.EmergencyRepository;
import com.safelink.repository.GuardianRelationshipRepository;
import com.safelink.repository.JourneyRepository;
import com.safelink.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/guardian")
@PreAuthorize("hasAnyRole('GUARDIAN', 'ADMIN')")
public class GuardianController {

    private final AuthService authService;
    private final GuardianRelationshipRepository guardianRelationshipRepository;
    private final EmergencyRepository emergencyRepository;
    private final JourneyRepository journeyRepository;

    public GuardianController(AuthService authService,
                              GuardianRelationshipRepository guardianRelationshipRepository,
                              EmergencyRepository emergencyRepository,
                              JourneyRepository journeyRepository) {
        this.authService = authService;
        this.guardianRelationshipRepository = guardianRelationshipRepository;
        this.emergencyRepository = emergencyRepository;
        this.journeyRepository = journeyRepository;
    }

    @GetMapping("/wards")
    public ResponseEntity<ApiResponse<List<UserDto>>> getConnectedUsers() {
        User guardian = authService.getCurrentAuthenticatedUser();
        List<GuardianRelationship> rels = guardianRelationshipRepository.findByGuardian(guardian);
        List<UserDto> wards = rels.stream()
                .map(r -> new UserDto(r.getUser()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(wards));
    }

    @GetMapping("/active-emergencies")
    public ResponseEntity<ApiResponse<List<EmergencyDto>>> getWardEmergencies() {
        User guardian = authService.getCurrentAuthenticatedUser();
        List<GuardianRelationship> rels = guardianRelationshipRepository.findByGuardian(guardian);
        List<EmergencyDto> emergencies = new ArrayList<>();

        for (GuardianRelationship rel : rels) {
            if (rel.isSosRecipient()) {
                List<Emergency> list = emergencyRepository.findByUserOrderByCreatedAtDesc(rel.getUser());
                for (Emergency e : list) {
                    emergencies.add(new EmergencyDto(e));
                }
            }
        }
        return ResponseEntity.ok(ApiResponse.ok(emergencies));
    }

    @GetMapping("/active-journeys")
    public ResponseEntity<ApiResponse<List<JourneyDto>>> getWardActiveJourneys() {
        User guardian = authService.getCurrentAuthenticatedUser();
        List<GuardianRelationship> rels = guardianRelationshipRepository.findByGuardian(guardian);
        List<JourneyDto> journeys = new ArrayList<>();

        for (GuardianRelationship rel : rels) {
            if (rel.isJourneyTrackingAuthorized()) {
                journeyRepository.findByUserAndStatus(rel.getUser(), JourneyStatus.ACTIVE)
                        .ifPresent(j -> journeys.add(new JourneyDto(j)));
            }
        }
        return ResponseEntity.ok(ApiResponse.ok(journeys));
    }
}
