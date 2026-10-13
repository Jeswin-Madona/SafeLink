package com.safelink.dto;

import com.safelink.entity.Emergency;
import com.safelink.entity.EmergencyStatus;

import java.time.LocalDateTime;

public class EmergencyDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userPhone;
    private Double latitude;
    private Double longitude;
    private String address;
    private EmergencyStatus status;
    private String triggerReason;
    private String responseNotes;
    private String assignedOfficialName;
    private LocalDateTime acknowledgedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;

    public EmergencyDto() {
    }

    public EmergencyDto(Emergency emergency) {
        if (emergency != null) {
            this.id = emergency.getId();
            if (emergency.getUser() != null) {
                this.userId = emergency.getUser().getId();
                this.userName = emergency.getUser().getFullName();
                this.userPhone = emergency.getUser().getPhoneNumber();
            }
            this.latitude = emergency.getLatitude();
            this.longitude = emergency.getLongitude();
            this.address = emergency.getAddress();
            this.status = emergency.getStatus();
            this.triggerReason = emergency.getTriggerReason();
            this.responseNotes = emergency.getResponseNotes();
            if (emergency.getAssignedOfficial() != null) {
                this.assignedOfficialName = emergency.getAssignedOfficial().getFullName();
            }
            this.acknowledgedAt = emergency.getAcknowledgedAt();
            this.resolvedAt = emergency.getResolvedAt();
            this.createdAt = emergency.getCreatedAt();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public EmergencyStatus getStatus() {
        return status;
    }

    public void setStatus(EmergencyStatus status) {
        this.status = status;
    }

    public String getTriggerReason() {
        return triggerReason;
    }

    public void setTriggerReason(String triggerReason) {
        this.triggerReason = triggerReason;
    }

    public String getResponseNotes() {
        return responseNotes;
    }

    public void setResponseNotes(String responseNotes) {
        this.responseNotes = responseNotes;
    }

    public String getAssignedOfficialName() {
        return assignedOfficialName;
    }

    public void setAssignedOfficialName(String assignedOfficialName) {
        this.assignedOfficialName = assignedOfficialName;
    }

    public LocalDateTime getAcknowledgedAt() {
        return acknowledgedAt;
    }

    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) {
        this.acknowledgedAt = acknowledgedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
