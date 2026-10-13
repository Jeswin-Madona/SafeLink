package com.safelink.service;

import com.safelink.entity.AuditLog;
import com.safelink.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;

@Service
public class AuditService {

    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(Long actorId, String actorEmail, String actorRole,
                    String action, String entityType, Long entityId,
                    String details, String clientIp) {
        try {
            AuditLog log = new AuditLog(actorId, actorEmail, actorRole, action, entityType, entityId, details, clientIp);
            
            // Compute tamper-evident SHA-256 hash of log entry
            String rawEntry = String.format("%s|%s|%s|%s|%s|%s|%s",
                    actorEmail != null ? actorEmail : "SYSTEM",
                    action,
                    entityType,
                    entityId != null ? entityId.toString() : "0",
                    details != null ? details : "",
                    clientIp != null ? clientIp : "127.0.0.1",
                    LocalDateTime.now().toString());

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawEntry.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            log.setRecordHash(hexString.toString());

            auditLogRepository.save(log);
            logger.info("AUDIT LOG [{}] by {} ({}) on {} id {}: {}", action, actorEmail, actorRole, entityType, entityId, details);
        } catch (Exception e) {
            logger.error("Failed to persist audit log: {}", e.getMessage(), e);
        }
    }
}
