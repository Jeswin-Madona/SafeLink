package com.safelink.config;

import com.safelink.entity.*;
import com.safelink.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final GuardianRelationshipRepository guardianRelationshipRepository;
    private final IncidentRepository incidentRepository;
    private final CommunityPostRepository communityPostRepository;
    private final EmergencyRepository emergencyRepository;
    private final JourneyRepository journeyRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           GuardianRelationshipRepository guardianRelationshipRepository,
                           IncidentRepository incidentRepository,
                           CommunityPostRepository communityPostRepository,
                           EmergencyRepository emergencyRepository,
                           JourneyRepository journeyRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.guardianRelationshipRepository = guardianRelationshipRepository;
        this.incidentRepository = incidentRepository;
        this.communityPostRepository = communityPostRepository;
        this.emergencyRepository = emergencyRepository;
        this.journeyRepository = journeyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already contains data. Skipping default initialization.");
            return;
        }

        logger.info("Initializing SAFELINK academic demo seed dataset...");

        // 1. Create Demo Users
        User womanUser = new User("user@safelink.org", passwordEncoder.encode("User@123"), "Ananya Sharma", "+91-9876543210", Role.ROLE_USER);
        User guardianUser = new User("guardian@safelink.org", passwordEncoder.encode("Guardian@123"), "Rajesh Sharma", "+91-9876543211", Role.ROLE_GUARDIAN);
        
        User officialUser = new User("official@safelink.org", passwordEncoder.encode("Official@123"), "Insp. Vikram Patil", "+91-9876543212", Role.ROLE_OFFICIAL);
        officialUser.setBadgeNumber("BLR-POL-4412");
        officialUser.setDepartment("Central Emergency Command & Patrol");

        User adminUser = new User("admin@safelink.org", passwordEncoder.encode("Admin@123"), "System Administrator", "+91-9876543213", Role.ROLE_ADMIN);
        adminUser.setDepartment("Platform Operations & Security");

        userRepository.save(womanUser);
        userRepository.save(guardianUser);
        userRepository.save(officialUser);
        userRepository.save(adminUser);

        // 2. Establish Guardian Relationship
        GuardianRelationship relationship = new GuardianRelationship(womanUser, guardianUser, "Father");
        guardianRelationshipRepository.save(relationship);

        // 3. Seed Synthetic Incidents (Clearly labeled as benchmark safety research data)
        Incident incident1 = new Incident(
                womanUser,
                "Broken High-Mast Streetlights on 4th Cross",
                "Four consecutive streetlights have been completely non-functional for past two weeks, creating pitch-dark pedestrian walkway.",
                "Poor Lighting",
                IncidentSeverity.MEDIUM,
                12.97194, 77.59369,
                "4th Cross, Ashok Nagar, Bengaluru",
                false
        );
        incident1.setStatus(IncidentStatus.VERIFIED);
        incident1.setOfficialNotes("Patrol car verified lighting failure. Escalated to municipal corporation.");
        incident1.setReviewedBy(officialUser);
        incident1.setReviewedAt(LocalDateTime.now().minusHours(24));
        incident1.setAiAnalyzed(true);
        incident1.setAiSummary("Public infrastructure hazard: Non-operational streetlights leading to severe visibility reduction.");
        incident1.setAiSuggestedCategory("Poor Lighting");
        incident1.setAiSuggestedSeverity("MEDIUM");
        incident1.setAiRiskFactors("Poor nighttime illumination, isolated walkway");

        Incident incident2 = new Incident(
                womanUser,
                "Aggressive Verbal Harassment near Metro Gate 2",
                "Group of men loitering near gate 2 passing lewd remarks to women commuters exiting metro after 9:30 PM.",
                "Harassment",
                IncidentSeverity.HIGH,
                12.97520, 77.59910,
                "MG Road Metro Station Exit 2, Bengaluru",
                true // anonymous report
        );
        incident2.setStatus(IncidentStatus.VERIFIED);
        incident2.setOfficialNotes("CCTV footage reviewed. Evening beat patrol assigned from 8 PM to 11 PM.");
        incident2.setReviewedBy(officialUser);
        incident2.setReviewedAt(LocalDateTime.now().minusHours(12));
        incident2.setAiAnalyzed(true);
        incident2.setAiSummary("Targeted verbal harassment incident occurring during evening commute hours.");
        incident2.setAiSuggestedCategory("Harassment");
        incident2.setAiSuggestedSeverity("HIGH");
        incident2.setAiRiskFactors("Commuter choke point, repetitive harassment pattern");

        Incident incident3 = new Incident(
                womanUser,
                "Dark Isolated Pedestrian Underpass",
                "Underpass lacks security guards and has blind corners with zero mobile signal coverage.",
                "Poor Lighting",
                IncidentSeverity.LOW,
                12.96980, 77.60450,
                "Richmond Circle Underpass, Bengaluru",
                false
        );
        incident3.setStatus(IncidentStatus.UNDER_REVIEW);

        incidentRepository.save(incident1);
        incidentRepository.save(incident2);
        incidentRepository.save(incident3);

        // 4. Seed Community Safety Feed Posts
        CommunityPost post1 = new CommunityPost(
                womanUser,
                "Well-lit Safe Zone: All-night Kiosk & Auto Stand",
                "The 24/7 medical store and auto stand near Cathedral junction is continuously staffed and well-lit. Good safe spot if waiting for transit.",
                "Safe Zone / Well Lit",
                "Cathedral Junction, MG Road",
                12.97250, 77.60120,
                false
        );
        post1.setStatus(IncidentStatus.VERIFIED);
        post1.setConfirmationsCount(14);
        post1.setOfficialReviewNote("Recognized community safe zone checkpoint.");
        post1.setReviewedBy(officialUser);

        CommunityPost post2 = new CommunityPost(
                womanUser,
                "Notice: Road Construction created narrow unlit corridor",
                "Construction scaffolding blocks the footpath on 8th Main; pedestrians have to walk in dark road margins.",
                "Suspicious Activity",
                "8th Main Road, Brigade Junction",
                12.97410, 77.59650,
                true
        );
        post2.setStatus(IncidentStatus.SUBMITTED);
        post2.setConfirmationsCount(6);

        communityPostRepository.save(post1);
        communityPostRepository.save(post2);

        // 5. Seed a Sample Completed Journey
        Journey sampleJourney = new Journey(
                womanUser,
                "City Tech Park, Outer Ring Rd",
                "Home - Ashok Nagar",
                12.9352, 77.6245,
                12.9719, 77.5937,
                35
        );
        sampleJourney.setStatus(JourneyStatus.COMPLETED);
        sampleJourney.setEstimatedRiskScore(28);
        sampleJourney.setRouteLabel("Lower Estimated Risk Corridor (Via Main Arterial Road)");
        sampleJourney.setStartedAt(LocalDateTime.now().minusHours(3));
        sampleJourney.setCompletedAt(LocalDateTime.now().minusHours(2).minusMinutes(25));
        journeyRepository.save(sampleJourney);

        logger.info("SAFELINK demo dataset initialized successfully!");
        logger.info("Demo User: user@safelink.org / User@123");
        logger.info("Demo Guardian: guardian@safelink.org / Guardian@123");
        logger.info("Demo Official: official@safelink.org / Official@123");
        logger.info("Demo Admin: admin@safelink.org / Admin@123");
    }
}
