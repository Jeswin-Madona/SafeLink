package com.safelink.dto;

import jakarta.validation.constraints.NotNull;

public class EmergencyCreateRequest {

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String address;
    private String triggerReason; // "Manual SOS Button", "Quick Shortcut", etc.

    public EmergencyCreateRequest() {
    }

    public EmergencyCreateRequest(Double latitude, Double longitude, String address, String triggerReason) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.triggerReason = triggerReason;
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

    public String getTriggerReason() {
        return triggerReason;
    }

    public void setTriggerReason(String triggerReason) {
        this.triggerReason = triggerReason;
    }
}
