package com.safelink.controller;

import com.safelink.dto.ApiResponse;
import com.safelink.dto.EmergencyCreateRequest;
import com.safelink.dto.EmergencyDto;
import com.safelink.entity.User;
import com.safelink.service.AuthService;
import com.safelink.service.EmergencyService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/iot")
public class IotSimulationController {

    private static final Logger logger = LoggerFactory.getLogger(IotSimulationController.class);

    private final AuthService authService;
    private final EmergencyService emergencyService;

    public IotSimulationController(AuthService authService, EmergencyService emergencyService) {
        this.authService = authService;
        this.emergencyService = emergencyService;
    }

    @PostMapping("/events")
    public ResponseEntity<ApiResponse<Map<String, Object>>> processSensorEvent(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        String deviceId = (String) payload.getOrDefault("deviceId", "ESP32-WEARABLE-01");
        Double acceleration = payload.get("acceleration") != null ? Double.valueOf(payload.get("acceleration").toString()) : 1.0;
        Double lat = payload.get("latitude") != null ? Double.valueOf(payload.get("latitude").toString()) : 12.9716;
        Double lng = payload.get("longitude") != null ? Double.valueOf(payload.get("longitude").toString()) : 77.5946;

        logger.info("IOT TELEMETRY received from device {}: acceleration={}g, lat={}, lng={}", deviceId, acceleration, lat, lng);

        Map<String, Object> response = new HashMap<>();
        response.put("deviceId", deviceId);
        response.put("receivedAcceleration", acceleration);

        // Simulated High Impact / Fall Detection threshold (> 3.5g)
        if (acceleration > 3.5) {
            EmergencyCreateRequest sosReq = new EmergencyCreateRequest(
                    lat, lng, "Auto-detected high impact from wearable " + deviceId, "Wearable Impact Sensor Alert"
            );
            EmergencyDto sos = emergencyService.triggerSos(user, sosReq, request.getRemoteAddr());
            response.put("anomalyDetected", true);
            response.put("emergencyTriggered", true);
            response.put("emergencyId", sos.getId());
            return ResponseEntity.ok(ApiResponse.ok("High-G impact threshold exceeded! Emergency SOS triggered automatically.", response));
        }

        response.put("anomalyDetected", false);
        response.put("status", "NORMAL_TELEMETRY");
        return ResponseEntity.ok(ApiResponse.ok("Wearable telemetry recorded normally.", response));
    }
}
