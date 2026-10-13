package com.safelink.dto;

import com.safelink.entity.Journey;
import com.safelink.entity.JourneyStatus;

import java.time.LocalDateTime;

public class JourneyDto {
    private Long id;
    private Long userId;
    private String userName;
    private String originName;
    private String destinationName;
    private Double startLatitude;
    private Double startLongitude;
    private Double destinationLatitude;
    private Double destinationLongitude;
    private Double currentLatitude;
    private Double currentLongitude;
    private LocalDateTime lastLocationUpdate;
    private Integer expectedDurationMinutes;
    private JourneyStatus status;
    private Integer estimatedRiskScore;
    private String routeLabel;
    private boolean companionModeEnabled;
    private boolean shareWithGuardians;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;

    public JourneyDto() {
    }

    public JourneyDto(Journey journey) {
        if (journey != null) {
            this.id = journey.getId();
            if (journey.getUser() != null) {
                this.userId = journey.getUser().getId();
                this.userName = journey.getUser().getFullName();
            }
            this.originName = journey.getOriginName();
            this.destinationName = journey.getDestinationName();
            this.startLatitude = journey.getStartLatitude();
            this.startLongitude = journey.getStartLongitude();
            this.destinationLatitude = journey.getDestinationLatitude();
            this.destinationLongitude = journey.getDestinationLongitude();
            this.currentLatitude = journey.getCurrentLatitude();
            this.currentLongitude = journey.getCurrentLongitude();
            this.lastLocationUpdate = journey.getLastLocationUpdate();
            this.expectedDurationMinutes = journey.getExpectedDurationMinutes();
            this.status = journey.getStatus();
            this.estimatedRiskScore = journey.getEstimatedRiskScore();
            this.routeLabel = journey.getRouteLabel();
            this.companionModeEnabled = journey.isCompanionModeEnabled();
            this.shareWithGuardians = journey.isShareWithGuardians();
            this.startedAt = journey.getStartedAt();
            this.completedAt = journey.getCompletedAt();
            this.createdAt = journey.getCreatedAt();
        }
    }

    // Getters and Setters
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

    public Double getCurrentLatitude() {
        return currentLatitude;
    }

    public void setCurrentLatitude(Double currentLatitude) {
        this.currentLatitude = currentLatitude;
    }

    public Double getCurrentLongitude() {
        return currentLongitude;
    }

    public void setCurrentLongitude(Double currentLongitude) {
        this.currentLongitude = currentLongitude;
    }

    public LocalDateTime getLastLocationUpdate() {
        return lastLocationUpdate;
    }

    public void setLastLocationUpdate(LocalDateTime lastLocationUpdate) {
        this.lastLocationUpdate = lastLocationUpdate;
    }

    public Integer getExpectedDurationMinutes() {
        return expectedDurationMinutes;
    }

    public void setExpectedDurationMinutes(Integer expectedDurationMinutes) {
        this.expectedDurationMinutes = expectedDurationMinutes;
    }

    public JourneyStatus getStatus() {
        return status;
    }

    public void setStatus(JourneyStatus status) {
        this.status = status;
    }

    public Integer getEstimatedRiskScore() {
        return estimatedRiskScore;
    }

    public void setEstimatedRiskScore(Integer estimatedRiskScore) {
        this.estimatedRiskScore = estimatedRiskScore;
    }

    public String getRouteLabel() {
        return routeLabel;
    }

    public void setRouteLabel(String routeLabel) {
        this.routeLabel = routeLabel;
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

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
