package com.safelink.controller;

import com.safelink.dto.ApiResponse;
import com.safelink.dto.AuditLogDto;
import com.safelink.repository.AuditLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/audit-logs")
@PreAuthorize("hasAnyRole('OFFICIAL', 'ADMIN')")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getAuditLogs() {
        List<AuditLogDto> logs = auditLogRepository.findAllByOrderByTimestampDesc()
                .stream().map(AuditLogDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }
}
