package com.safelink.repository;

import com.safelink.entity.GuardianRelationship;
import com.safelink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuardianRelationshipRepository extends JpaRepository<GuardianRelationship, Long> {
    List<GuardianRelationship> findByUser(User user);
    List<GuardianRelationship> findByGuardian(User guardian);
    Optional<GuardianRelationship> findByUserAndGuardian(User user, User guardian);
}
