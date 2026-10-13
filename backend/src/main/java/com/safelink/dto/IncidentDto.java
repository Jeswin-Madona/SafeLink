package com.safelink.dto;

import com.safelink.entity.Incident;
import com.safelink.entity.IncidentSeverity;
import com.safelink.entity.IncidentStatus;

import java.time.LocalDateTime;

public class IncidentDto {
    private Long id;
    private Long reporterId;
    private String reporterDisplayName;
    private String title;
    private String description;
    private String category;
    private IncidentSeverity severity;
    private IncidentStatus status;
    private Double latitude;
    private Double longitude;
    private String approximateAddress;
    private boolean anonymous;

    // AI Intelligence analysis fields
    private boolean aiAnalyzed;
    private String aiSummary;
    private String aiSuggestedCategory;
    private String aiSuggestedSeverity;
    private String aiRiskFactors;

    // Official review fields
    private String officialNotes;
    private String reviewedByName;
    private LocalDateTime reviewedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public IncidentDto() {
    }

    public IncidentDto(Incident incident) {
        this(incident, false);
    }

    public IncidentDto(Incident incident, boolean isOfficialOrAuthor) {
        if (incident != null) {
            this.id = incident.getId();
            this.title = incident.getTitle();
            this.description = incident.getDescription();
            this.category = incident.getCategory();
            this.severity = incident.getSeverity();
            this.status = incident.getStatus();
            this.latitude = incident.getLatitude();
            this.longitude = incident.getLongitude();
            this.approximateAddress = incident.getApproximateAddress();
            this.anonymous = incident.isAnonymous();

            if (incident.getReporter() != null) {
                if (incident.isAnonymous() && !isOfficialOrAuthor) {
                    this.reporterId = null;
                    this.reporterDisplayName = "Anonymous Reporter";
                } else {
                    this.reporterId = incident.getReporter().getId();
                    this.reporterDisplayName = incident.getReporter().getFullName();
                }
            }

            this.aiAnalyzed = incident.isAiAnalyzed();
            this.aiSummary = incident.getAiSummary();
            this.aiSuggestedCategory = incident.getAiSuggestedCategory();
            this.aiSuggestedSeverity = incident.getAiSuggestedSeverity();
            this.aiRiskFactors = incident.getAiRiskFactors();

            this.officialNotes = incident.getOfficialNotes();
            if (incident.getReviewedBy() != null) {
                this.reviewedByName = incident.getReviewedBy().getFullName();
            }
            this.reviewedAt = incident.getReviewedAt();
            this.createdAt = incident.getCreatedAt();
            this.updatedAt = incident.getUpdatedAt();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReporterId() {
        return reporterId;
    }

    public void setReporterId(Long reporterId) {
        this.reporterId = reporterId;
    }

    public String getReporterDisplayName() {
        return reporterDisplayName;
    }

    public void setReporterDisplayName(String reporterDisplayName) {
        this.reporterDisplayName = reporterDisplayName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public IncidentSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(IncidentSeverity severity) {
        this.severity = severity;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
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

    public String getApproximateAddress() {
        return approximateAddress;
    }

    public void setApproximateAddress(String approximateAddress) {
        this.approximateAddress = approximateAddress;
    }

    public boolean isAnonymous() {
        return anonymous;
    }

    public void setAnonymous(boolean anonymous) {
        this.anonymous = anonymous;
    }

    public boolean isAiAnalyzed() {
        return aiAnalyzed;
    }

    public void setAiAnalyzed(boolean aiAnalyzed) {
        this.aiAnalyzed = aiAnalyzed;
    }

    public String getAiSummary() {
        return aiSummary;
    }

    public void setAiSummary(String aiSummary) {
        this.aiSummary = aiSummary;
    }

    public String getAiSuggestedCategory() {
        return aiSuggestedCategory;
    }

    public void setAiSuggestedCategory(String aiSuggestedCategory) {
        this.aiSuggestedCategory = aiSuggestedCategory;
    }

    public String getAiSuggestedSeverity() {
        return aiSuggestedSeverity;
    }

    public void setAiSuggestedSeverity(String aiSuggestedSeverity) {
        this.aiSuggestedSeverity = aiSuggestedSeverity;
    }

    public String getAiRiskFactors() {
        return aiRiskFactors;
    }

    public void setAiRiskFactors(String aiRiskFactors) {
        this.aiRiskFactors = aiRiskFactors;
    }

    public String getOfficialNotes() {
        return officialNotes;
    }

    public void setOfficialNotes(String officialNotes) {
        this.officialNotes = officialNotes;
    }

    public String getReviewedByName() {
        return reviewedByName;
    }

    public void setReviewedByName(String reviewedByName) {
        this.reviewedByName = reviewedByName;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
