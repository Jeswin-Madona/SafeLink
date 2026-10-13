package com.safelink.controller;

import com.safelink.dto.ApiResponse;
import com.safelink.dto.IncidentCreateRequest;
import com.safelink.dto.IncidentDto;
import com.safelink.dto.IncidentUpdateRequest;
import com.safelink.entity.User;
import com.safelink.service.AuthService;
import com.safelink.service.IncidentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;
    private final AuthService authService;

    public IncidentController(IncidentService incidentService, AuthService authService) {
        this.incidentService = incidentService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IncidentDto>> reportIncident(
            @Valid @RequestBody IncidentCreateRequest request,
            HttpServletRequest httpRequest) {
        User user = authService.getCurrentAuthenticatedUser();
        String clientIp = httpRequest.getRemoteAddr();
        IncidentDto dto = incidentService.createIncident(user, request, clientIp);
        return ResponseEntity.ok(ApiResponse.ok("Incident report submitted successfully for review.", dto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<IncidentDto>>> getAllIncidents() {
        User user = authService.getCurrentAuthenticatedUser();
        List<IncidentDto> list = incidentService.getAllIncidents(user);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/verified")
    public ResponseEntity<ApiResponse<List<IncidentDto>>> getVerifiedIncidents() {
        User user = authService.getCurrentAuthenticatedUser();
        List<IncidentDto> list = incidentService.getVerifiedIncidents(user);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IncidentDto>> getIncidentById(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        IncidentDto dto = incidentService.getIncidentById(id, user);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PatchMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('OFFICIAL', 'ADMIN')")
    public ResponseEntity<ApiResponse<IncidentDto>> reviewIncident(
            @PathVariable Long id,
            @Valid @RequestBody IncidentUpdateRequest request,
            HttpServletRequest httpRequest) {
        User reviewer = authService.getCurrentAuthenticatedUser();
        String clientIp = httpRequest.getRemoteAddr();
        IncidentDto dto = incidentService.reviewIncident(id, request, reviewer, clientIp);
        return ResponseEntity.ok(ApiResponse.ok("Incident status updated and logged to audit trail.", dto));
    }
}
