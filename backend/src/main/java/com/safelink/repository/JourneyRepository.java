package com.safelink.repository;

import com.safelink.entity.Journey;
import com.safelink.entity.JourneyStatus;
import com.safelink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JourneyRepository extends JpaRepository<Journey, Long> {
    List<Journey> findByUserOrderByCreatedAtDesc(User user);
    Optional<Journey> findByUserAndStatus(User user, JourneyStatus status);
    List<Journey> findByStatus(JourneyStatus status);
    List<Journey> findByCompanionModeEnabledTrueAndStatus(JourneyStatus status);
}
