package com.safelink.dto;

import com.safelink.entity.EmergencyStatus;
import jakarta.validation.constraints.NotNull;

public class EmergencyStatusUpdateRequest {

    @NotNull(message = "Emergency status is required")
    private EmergencyStatus status;

    private String responseNotes;

    public EmergencyStatusUpdateRequest() {
    }

    public EmergencyStatusUpdateRequest(EmergencyStatus status, String responseNotes) {
        this.status = status;
        this.responseNotes = responseNotes;
    }

    public EmergencyStatus getStatus() {
        return status;
    }

    public void setStatus(EmergencyStatus status) {
        this.status = status;
    }

    public String getResponseNotes() {
        return responseNotes;
    }

    public void setResponseNotes(String responseNotes) {
        this.responseNotes = responseNotes;
    }
}
