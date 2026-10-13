package com.safelink.repository;

import com.safelink.entity.Incident;
import com.safelink.entity.IncidentMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentMediaRepository extends JpaRepository<IncidentMedia, Long> {
    List<IncidentMedia> findByIncident(Incident incident);
}
