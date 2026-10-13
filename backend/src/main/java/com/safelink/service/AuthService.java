package com.safelink.service;

import com.safelink.dto.AuthResponse;
import com.safelink.dto.LoginRequest;
import com.safelink.dto.RegisterRequest;
import com.safelink.dto.UserDto;
import com.safelink.entity.Role;
import com.safelink.entity.User;
import com.safelink.exception.BadRequestException;
import com.safelink.exception.ResourceNotFoundException;
import com.safelink.repository.UserRepository;
import com.safelink.security.JwtTokenProvider;
import com.safelink.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AuditService auditService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.auditService = auditService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, String clientIp) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setFullName(request.getFullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole() != null ? request.getRole() : Role.ROLE_USER);

        if (user.getRole() == Role.ROLE_OFFICIAL) {
            user.setBadgeNumber(request.getBadgeNumber());
            user.setDepartment(request.getDepartment());
        }

        User savedUser = userRepository.save(user);

        // Authenticate the newly registered user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        auditService.log(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name(),
                "USER_REGISTERED", "USER", savedUser.getId(),
                "Registered new account with role " + savedUser.getRole(), clientIp);

        return new AuthResponse(token, new UserDto(savedUser));
    }

    public AuthResponse login(LoginRequest request, String clientIp) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        auditService.log(user.getId(), user.getEmail(), user.getRole().name(),
                "USER_LOGIN", "USER", user.getId(),
                "User successfully logged in", clientIp);

        return new AuthResponse(token, new UserDto(user));
    }

    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            throw new ResourceNotFoundException("No authenticated user in current session context");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
