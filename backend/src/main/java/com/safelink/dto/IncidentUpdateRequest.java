package com.safelink.dto;

import com.safelink.entity.IncidentSeverity;
import com.safelink.entity.IncidentStatus;
import jakarta.validation.constraints.NotNull;

public class IncidentUpdateRequest {

    @NotNull(message = "Status is required")
    private IncidentStatus status;

    private IncidentSeverity severity;
    private String officialNotes;

    public IncidentUpdateRequest() {
    }

    public IncidentUpdateRequest(IncidentStatus status, IncidentSeverity severity, String officialNotes) {
        this.status = status;
        this.severity = severity;
        this.officialNotes = officialNotes;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }

    public IncidentSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(IncidentSeverity severity) {
        this.severity = severity;
    }

    public String getOfficialNotes() {
        return officialNotes;
    }

    public void setOfficialNotes(String officialNotes) {
        this.officialNotes = officialNotes;
    }
}
