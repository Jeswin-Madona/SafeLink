package com.safelink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "guardian_relationships")
public class GuardianRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guardian_id", nullable = false)
    private User guardian;

    @Column(length = 50)
    private String relationshipType; // e.g. Mother, Father, Spouse, Friend

    @Column(nullable = false)
    private boolean isSosRecipient = true;

    @Column(nullable = false)
    private boolean isJourneyTrackingAuthorized = true;

    @Column(nullable = false)
    private boolean verified = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public GuardianRelationship() {
    }

    public GuardianRelationship(User user, User guardian, String relationshipType) {
        this.user = user;
        this.guardian = guardian;
        this.relationshipType = relationshipType;
        this.isSosRecipient = true;
        this.isJourneyTrackingAuthorized = true;
        this.verified = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getGuardian() {
        return guardian;
    }

    public void setGuardian(User guardian) {
        this.guardian = guardian;
    }

    public String getRelationshipType() {
        return relationshipType;
    }

    public void setRelationshipType(String relationshipType) {
        this.relationshipType = relationshipType;
    }

    public boolean isSosRecipient() {
        return isSosRecipient;
    }

    public void setSosRecipient(boolean sosRecipient) {
        isSosRecipient = sosRecipient;
    }

    public boolean isJourneyTrackingAuthorized() {
        return isJourneyTrackingAuthorized;
    }

    public void setJourneyTrackingAuthorized(boolean journeyTrackingAuthorized) {
        isJourneyTrackingAuthorized = journeyTrackingAuthorized;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
