package com.safelink.dto;

import com.safelink.entity.CommunityPost;
import com.safelink.entity.IncidentStatus;

import java.time.LocalDateTime;

public class CommunityPostDto {
    private Long id;
    private Long authorId;
    private String authorDisplayName;
    private boolean isAuthorSelf;
    private String title;
    private String content;
    private String category;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private boolean anonymous;
    private IncidentStatus status;
    private int confirmationsCount;
    private String officialReviewNote;
    private LocalDateTime createdAt;

    public CommunityPostDto() {
    }

    public CommunityPostDto(CommunityPost post, Long currentUserId, boolean isOfficial) {
        if (post != null) {
            this.id = post.getId();
            this.title = post.getTitle();
            this.content = post.getContent();
            this.category = post.getCategory();
            this.locationName = post.getLocationName();
            this.latitude = post.getLatitude();
            this.longitude = post.getLongitude();
            this.anonymous = post.isAnonymous();
            this.status = post.getStatus();
            this.confirmationsCount = post.getConfirmationsCount();
            this.officialReviewNote = post.getOfficialReviewNote();
            this.createdAt = post.getCreatedAt();

            if (post.getAuthor() != null) {
                boolean isSelf = currentUserId != null && currentUserId.equals(post.getAuthor().getId());
                this.isAuthorSelf = isSelf;

                if (post.isAnonymous() && !isOfficial && !isSelf) {
                    this.authorId = null;
                    this.authorDisplayName = "Anonymous Community Member";
                } else {
                    this.authorId = post.getAuthor().getId();
                    this.authorDisplayName = post.getAuthor().getFullName();
                }
            }
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public String getAuthorDisplayName() {
        return authorDisplayName;
    }

    public void setAuthorDisplayName(String authorDisplayName) {
        this.authorDisplayName = authorDisplayName;
    }

    public boolean isAuthorSelf() {
        return isAuthorSelf;
    }

    public void setAuthorSelf(boolean authorSelf) {
        isAuthorSelf = authorSelf;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
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

    public boolean isAnonymous() {
        return anonymous;
    }

    public void setAnonymous(boolean anonymous) {
        this.anonymous = anonymous;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }

    public int getConfirmationsCount() {
        return confirmationsCount;
    }

    public void setConfirmationsCount(int confirmationsCount) {
        this.confirmationsCount = confirmationsCount;
    }

    public String getOfficialReviewNote() {
        return officialReviewNote;
    }

    public void setOfficialReviewNote(String officialReviewNote) {
        this.officialReviewNote = officialReviewNote;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
