package com.safelink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 80)
    private String category; // e.g., Harassment, Stalking, Poor Lighting, Physical Threat, Suspicious Activity

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private IncidentSeverity severity = IncidentSeverity.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private IncidentStatus status = IncidentStatus.SUBMITTED;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 255)
    private String approximateAddress;

    @Column(nullable = false)
    private boolean anonymous = false;

    // AI Analysis Attributes
    @Column(nullable = false)
    private boolean aiAnalyzed = false;

    @Column(columnDefinition = "TEXT")
    private String aiSummary;

    @Column(length = 50)
    private String aiSuggestedCategory;

    @Column(length = 30)
    private String aiSuggestedSeverity;

    @Column(columnDefinition = "TEXT")
    private String aiRiskFactors;

    // Official Review Attributes
    @Column(columnDefinition = "TEXT")
    private String officialNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_id")
    private User reviewedBy;

    private LocalDateTime reviewedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Incident() {
    }

    public Incident(User reporter, String title, String description, String category,
                    IncidentSeverity severity, Double latitude, Double longitude,
                    String approximateAddress, boolean anonymous) {
        this.reporter = reporter;
        this.title = title;
        this.description = description;
        this.category = category;
        this.severity = severity;
        this.latitude = latitude;
        this.longitude = longitude;
        this.approximateAddress = approximateAddress;
        this.anonymous = anonymous;
        this.status = IncidentStatus.SUBMITTED;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getReporter() {
        return reporter;
    }

    public void setReporter(User reporter) {
        this.reporter = reporter;
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

    public User getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(User reviewedBy) {
        this.reviewedBy = reviewedBy;
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
