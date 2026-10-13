package com.safelink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class JourneyCreateRequest {

    @NotBlank(message = "Origin name is required")
    private String originName;

    @NotBlank(message = "Destination name is required")
    private String destinationName;

    @NotNull(message = "Start latitude is required")
    private Double startLatitude;

    @NotNull(message = "Start longitude is required")
    private Double startLongitude;

    @NotNull(message = "Destination latitude is required")
    private Double destinationLatitude;

    @NotNull(message = "Destination longitude is required")
    private Double destinationLongitude;

    @NotNull(message = "Expected duration is required")
    private Integer expectedDurationMinutes;

    private boolean companionModeEnabled = false;
    private boolean shareWithGuardians = true;

    public JourneyCreateRequest() {
    }

    public String getOriginName() {
        return originName;
    }

    public void setOriginName(String originName) {
        this.originName = originName;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public Double getStartLatitude() {
        return startLatitude;
    }

    public void setStartLatitude(Double startLatitude) {
        this.startLatitude = startLatitude;
    }

    public Double getStartLongitude() {
        return startLongitude;
    }

    public void setStartLongitude(Double startLongitude) {
        this.startLongitude = startLongitude;
    }

    public Double getDestinationLatitude() {
        return destinationLatitude;
    }

    public void setDestinationLatitude(Double destinationLatitude) {
        this.destinationLatitude = destinationLatitude;
    }

    public Double getDestinationLongitude() {
        return destinationLongitude;
    }

    public void setDestinationLongitude(Double destinationLongitude) {
        this.destinationLongitude = destinationLongitude;
    }

    public Integer getExpectedDurationMinutes() {
        return expectedDurationMinutes;
    }

    public void setExpectedDurationMinutes(Integer expectedDurationMinutes) {
        this.expectedDurationMinutes = expectedDurationMinutes;
    }

    public boolean isCompanionModeEnabled() {
        return companionModeEnabled;
    }

    public void setCompanionModeEnabled(boolean companionModeEnabled) {
        this.companionModeEnabled = companionModeEnabled;
    }

    public boolean isShareWithGuardians() {
        return shareWithGuardians;
    }

    public void setShareWithGuardians(boolean shareWithGuardians) {
        this.shareWithGuardians = shareWithGuardians;
    }
}
