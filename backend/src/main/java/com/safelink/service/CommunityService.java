package com.safelink.service;

import com.safelink.dto.CommunityPostCreateRequest;
import com.safelink.dto.CommunityPostDto;
import com.safelink.entity.CommunityPost;
import com.safelink.entity.IncidentStatus;
import com.safelink.entity.Role;
import com.safelink.entity.User;
import com.safelink.exception.BadRequestException;
import com.safelink.exception.ResourceNotFoundException;
import com.safelink.repository.CommunityPostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    private final CommunityPostRepository communityPostRepository;
    private final AuditService auditService;

    public CommunityService(CommunityPostRepository communityPostRepository, AuditService auditService) {
        this.communityPostRepository = communityPostRepository;
        this.auditService = auditService;
    }

    @Transactional
    public CommunityPostDto createPost(User author, CommunityPostCreateRequest request, String clientIp) {
        CommunityPost post = new CommunityPost(
                author,
                request.getTitle(),
                request.getContent(),
                request.getCategory(),
                request.getLocationName(),
                request.getLatitude(),
                request.getLongitude(),
                request.isAnonymous()
        );

        CommunityPost saved = communityPostRepository.save(post);

        auditService.log(author.getId(), author.getEmail(), author.getRole().name(),
                "COMMUNITY_POST_CREATED", "COMMUNITY_POST", saved.getId(),
                "Community report submitted: " + saved.getTitle(), clientIp);

        return new CommunityPostDto(saved, author.getId(), false);
    }

    @Transactional(readOnly = true)
    public List<CommunityPostDto> getAllPosts(User currentUser) {
        boolean isOfficial = currentUser != null && (currentUser.getRole() == Role.ROLE_OFFICIAL || currentUser.getRole() == Role.ROLE_ADMIN);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        return communityPostRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(p -> new CommunityPostDto(p, currentUserId, isOfficial))
                .collect(Collectors.toList());
    }

    @Transactional
    public CommunityPostDto confirmPost(Long postId, User user) {
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Community post not found with id: " + postId));

        post.setConfirmationsCount(post.getConfirmationsCount() + 1);
        CommunityPost updated = communityPostRepository.save(post);

        boolean isOfficial = user != null && (user.getRole() == Role.ROLE_OFFICIAL || user.getRole() == Role.ROLE_ADMIN);
        return new CommunityPostDto(updated, user != null ? user.getId() : null, isOfficial);
    }

    @Transactional
    public CommunityPostDto reviewPost(Long postId, IncidentStatus newStatus, String officialNote, User official, String clientIp) {
        if (official.getRole() != Role.ROLE_OFFICIAL && official.getRole() != Role.ROLE_ADMIN) {
            throw new BadRequestException("Only officials can verify or moderate community reports.");
        }

        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Community post not found with id: " + postId));

        post.setStatus(newStatus);
        post.setOfficialReviewNote(officialNote);
        post.setReviewedBy(official);

        CommunityPost updated = communityPostRepository.save(post);

        auditService.log(official.getId(), official.getEmail(), official.getRole().name(),
                "COMMUNITY_POST_REVIEWED", "COMMUNITY_POST", updated.getId(),
                "Moderation status set to " + newStatus, clientIp);

        return new CommunityPostDto(updated, official.getId(), true);
    }
}
