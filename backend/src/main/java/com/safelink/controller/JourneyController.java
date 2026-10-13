package com.safelink.controller;

import com.safelink.dto.ApiResponse;
import com.safelink.dto.JourneyCreateRequest;
import com.safelink.dto.JourneyDto;
import com.safelink.entity.User;
import com.safelink.service.AuthService;
import com.safelink.service.JourneyService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/journeys")
public class JourneyController {

    private final JourneyService journeyService;
    private final AuthService authService;

    public JourneyController(JourneyService journeyService, AuthService authService) {
        this.journeyService = journeyService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JourneyDto>> startJourney(
            @Valid @RequestBody JourneyCreateRequest request,
            HttpServletRequest httpRequest) {
        User user = authService.getCurrentAuthenticatedUser();
        String clientIp = httpRequest.getRemoteAddr();
        JourneyDto dto = journeyService.createJourney(user, request, clientIp);
        return ResponseEntity.ok(ApiResponse.ok("Journey initiated with estimated risk assessment.", dto));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<JourneyDto>>> getMyJourneys() {
        User user = authService.getCurrentAuthenticatedUser();
        List<JourneyDto> list = journeyService.getUserJourneys(user);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/companions")
    public ResponseEntity<ApiResponse<List<JourneyDto>>> getActiveCompanions() {
        List<JourneyDto> list = journeyService.getActiveCompanionJourneys();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PatchMapping("/{id}/location")
    public ResponseEntity<ApiResponse<JourneyDto>> updateLocation(
            @PathVariable Long id,
            @RequestBody Map<String, Double> coords) {
        User user = authService.getCurrentAuthenticatedUser();
        Double lat = coords.get("latitude");
        Double lng = coords.get("longitude");
        JourneyDto dto = journeyService.updateLocation(id, lat, lng, user);
        return ResponseEntity.ok(ApiResponse.ok("Live journey location updated.", dto));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<JourneyDto>> completeJourney(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        User user = authService.getCurrentAuthenticatedUser();
        String clientIp = httpRequest.getRemoteAddr();
        JourneyDto dto = journeyService.completeJourney(id, user, clientIp);
        return ResponseEntity.ok(ApiResponse.ok("Journey successfully marked completed.", dto));
    }
}
