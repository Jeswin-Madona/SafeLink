package com.safelink.controller;

import com.safelink.dto.ApiResponse;
import com.safelink.dto.CommunityPostCreateRequest;
import com.safelink.dto.CommunityPostDto;
import com.safelink.entity.IncidentStatus;
import com.safelink.entity.User;
import com.safelink.service.AuthService;
import com.safelink.service.CommunityService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    private final CommunityService communityService;
    private final AuthService authService;

    public CommunityController(CommunityService communityService, AuthService authService) {
        this.communityService = communityService;
        this.authService = authService;
    }

    @PostMapping("/posts")
    public ResponseEntity<ApiResponse<CommunityPostDto>> createPost(
            @Valid @RequestBody CommunityPostCreateRequest request,
            HttpServletRequest httpRequest) {
        User author = authService.getCurrentAuthenticatedUser();
        String clientIp = httpRequest.getRemoteAddr();
        CommunityPostDto dto = communityService.createPost(author, request, clientIp);
        return ResponseEntity.ok(ApiResponse.ok("Community safety report published.", dto));
    }

    @GetMapping("/posts")
    public ResponseEntity<ApiResponse<List<CommunityPostDto>>> getAllPosts() {
        User user = authService.getCurrentAuthenticatedUser();
        List<CommunityPostDto> list = communityService.getAllPosts(user);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/posts/{id}/confirm")
    public ResponseEntity<ApiResponse<CommunityPostDto>> confirmPost(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        CommunityPostDto dto = communityService.confirmPost(id, user);
        return ResponseEntity.ok(ApiResponse.ok("Community confirmation recorded.", dto));
    }

    @PatchMapping("/posts/{id}/review")
    @PreAuthorize("hasAnyRole('OFFICIAL', 'ADMIN')")
    public ResponseEntity<ApiResponse<CommunityPostDto>> reviewPost(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest httpRequest) {
        User official = authService.getCurrentAuthenticatedUser();
        String clientIp = httpRequest.getRemoteAddr();
        IncidentStatus status = IncidentStatus.valueOf(body.getOrDefault("status", "VERIFIED"));
        String note = body.getOrDefault("note", "Reviewed by official authority.");

        CommunityPostDto dto = communityService.reviewPost(id, status, note, official, clientIp);
        return ResponseEntity.ok(ApiResponse.ok("Post reviewed and status updated.", dto));
    }
}
