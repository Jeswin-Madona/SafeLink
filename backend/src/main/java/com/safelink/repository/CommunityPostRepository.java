package com.safelink.repository;

import com.safelink.entity.CommunityPost;
import com.safelink.entity.IncidentStatus;
import com.safelink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    List<CommunityPost> findByStatusOrderByCreatedAtDesc(IncidentStatus status);
    List<CommunityPost> findAllByOrderByCreatedAtDesc();
    List<CommunityPost> findByAuthorOrderByCreatedAtDesc(User author);
    long countByStatus(IncidentStatus status);
}
