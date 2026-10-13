package com.safelink;

import com.safelink.dto.LoginRequest;
import com.safelink.dto.RegisterRequest;
import com.safelink.entity.Role;
import com.safelink.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SafelinkApplicationTests {

    @Autowired
    private AuthService authService;

    @Test
    void contextLoads() {
        assertNotNull(authService, "AuthService should be injected successfully");
    }

    @Test
    void testUserRegistrationAndLogin() {
        String testEmail = "testuser" + System.currentTimeMillis() + "@safelink.org";
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setEmail(testEmail);
        registerReq.setPassword("Password@123");
        registerReq.setFullName("Test Student User");
        registerReq.setPhoneNumber("+91-9988776655");
        registerReq.setRole(Role.ROLE_USER);

        var regResponse = authService.register(registerReq, "127.0.0.1");
        assertNotNull(regResponse.getToken());
        assertEquals(testEmail, regResponse.getUser().getEmail());

        LoginRequest loginReq = new LoginRequest(testEmail, "Password@123");
        var loginResponse = authService.login(loginReq, "127.0.0.1");
        assertNotNull(loginResponse.getToken());
        assertEquals(Role.ROLE_USER, loginResponse.getUser().getRole());
    }
}
