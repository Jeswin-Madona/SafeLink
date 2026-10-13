package com.safelink.dto;

import com.safelink.entity.AuditLog;

import java.time.LocalDateTime;

public class AuditLogDto {
    private Long id;
    private Long actorId;
    private String actorEmail;
    private String actorRole;
    private String action;
    private String entityType;
    private Long entityId;
    private String details;
    private String clientIp;
    private String recordHash;
    private LocalDateTime timestamp;

    public AuditLogDto() {
    }

    public AuditLogDto(AuditLog log) {
        if (log != null) {
            this.id = log.getId();
            this.actorId = log.getActorId();
            this.actorEmail = log.getActorEmail();
            this.actorRole = log.getActorRole();
            this.action = log.getAction();
            this.entityType = log.getEntityType();
            this.entityId = log.getEntityId();
            this.details = log.getDetails();
            this.clientIp = log.getClientIp();
            this.recordHash = log.getRecordHash();
            this.timestamp = log.getTimestamp();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getActorId() {
        return actorId;
    }

    public void setActorId(Long actorId) {
        this.actorId = actorId;
    }

    public String getActorEmail() {
        return actorEmail;
    }

    public void setActorEmail(String actorEmail) {
        this.actorEmail = actorEmail;
    }

    public String getActorRole() {
        return actorRole;
    }

    public void setActorRole(String actorRole) {
        this.actorRole = actorRole;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getClientIp() {
        return clientIp;
    }

    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }

    public String getRecordHash() {
        return recordHash;
    }

    public void setRecordHash(String recordHash) {
        this.recordHash = recordHash;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
