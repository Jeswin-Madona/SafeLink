package com.safelink.repository;

import com.safelink.entity.Incident;
import com.safelink.entity.IncidentStatus;
import com.safelink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByReporterOrderByCreatedAtDesc(User reporter);
    List<Incident> findByStatusOrderByCreatedAtDesc(IncidentStatus status);
    List<Incident> findAllByOrderByCreatedAtDesc();
    long countByStatus(IncidentStatus status);
    long count();
}
