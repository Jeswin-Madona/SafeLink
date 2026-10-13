package com.safelink.controller;

import com.safelink.dto.ApiResponse;
import com.safelink.dto.EmergencyCreateRequest;
import com.safelink.dto.EmergencyDto;
import com.safelink.dto.EmergencyStatusUpdateRequest;
import com.safelink.entity.Role;
import com.safelink.entity.User;
import com.safelink.service.AuthService;
import com.safelink.service.EmergencyService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergencies")
public class EmergencyController {

    private final EmergencyService emergencyService;
    private final AuthService authService;

    public EmergencyController(EmergencyService emergencyService, AuthService authService) {
        this.emergencyService = emergencyService;
        this.authService = authService;
    }

    @PostMapping("/sos")
    public ResponseEntity<ApiResponse<EmergencyDto>> triggerSos(
            @Valid @RequestBody EmergencyCreateRequest request,
            HttpServletRequest httpRequest) {
        User user = authService.getCurrentAuthenticatedUser();
        String clientIp = httpRequest.getRemoteAddr();
        EmergencyDto dto = emergencyService.triggerSos(user, request, clientIp);
        return ResponseEntity.ok(ApiResponse.ok("Emergency SOS triggered immediately. Guardians and dispatchers notified.", dto));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<EmergencyDto>>> getMyEmergencies() {
        User user = authService.getCurrentAuthenticatedUser();
        List<EmergencyDto> list = emergencyService.getUserEmergencies(user);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('OFFICIAL', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<EmergencyDto>>> getActiveEmergencies() {
        List<EmergencyDto> list = emergencyService.getActiveEmergencies();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('OFFICIAL', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<EmergencyDto>>> getAllEmergencies() {
        List<EmergencyDto> list = emergencyService.getAllEmergencies();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmergencyDto>> getEmergencyById(@PathVariable Long id) {
        EmergencyDto dto = emergencyService.getEmergencyById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<EmergencyDto>> updateEmergencyStatus(
            @PathVariable Long id,
            @Valid @RequestBody EmergencyStatusUpdateRequest request,
            HttpServletRequest httpRequest) {
        User user = authService.getCurrentAuthenticatedUser();
        String clientIp = httpRequest.getRemoteAddr();
        EmergencyDto dto = emergencyService.updateEmergencyStatus(id, request, user, clientIp);
        return ResponseEntity.ok(ApiResponse.ok("Emergency status updated successfully", dto));
    }
}
