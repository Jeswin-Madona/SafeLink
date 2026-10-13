package com.safelink.repository;

import com.safelink.entity.Emergency;
import com.safelink.entity.EmergencyStatus;
import com.safelink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyRepository extends JpaRepository<Emergency, Long> {
    List<Emergency> findByUserOrderByCreatedAtDesc(User user);
    List<Emergency> findByStatusOrderByCreatedAtDesc(EmergencyStatus status);
    List<Emergency> findByStatusInOrderByCreatedAtDesc(List<EmergencyStatus> statuses);
    List<Emergency> findAllByOrderByCreatedAtDesc();
    long countByStatus(EmergencyStatus status);
}
