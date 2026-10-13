package com.safelink.controller;

import com.safelink.dto.ApiResponse;
import com.safelink.entity.Incident;
import com.safelink.repository.IncidentRepository;
import com.safelink.service.AiServiceClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiServiceClient aiServiceClient;
    private final IncidentRepository incidentRepository;

    public AiController(AiServiceClient aiServiceClient, IncidentRepository incidentRepository) {
        this.aiServiceClient = aiServiceClient;
        this.incidentRepository = incidentRepository;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<Map<String, Object>>> analyzeReport(@RequestBody Map<String, String> body) {
        String title = body.getOrDefault("title", "");
        String description = body.getOrDefault("description", "");
        String category = body.getOrDefault("category", "General Hazard");
        String location = body.getOrDefault("location", "");

        Map<String, Object> analysis = aiServiceClient.analyzeIncident(title, description, category, location);
        return ResponseEntity.ok(ApiResponse.ok("AI Incident Intelligence analysis completed.", analysis));
    }

    @PostMapping("/similar-incidents")
    public ResponseEntity<ApiResponse<Map<String, Object>>> findSimilar(@RequestBody Map<String, String> body) {
        String queryText = body.getOrDefault("queryText", "");

        List<Incident> all = incidentRepository.findAll();
        List<Map<String, Object>> corpus = new ArrayList<>();
        for (Incident i : all) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", i.getId());
            item.put("title", i.getTitle());
            item.put("description", i.getDescription());
            item.put("category", i.getCategory());
            item.put("severity", i.getSeverity().name());
            item.put("location", i.getApproximateAddress());
            item.put("date", i.getCreatedAt().toString());
            corpus.add(item);
        }

        Map<String, Object> result = aiServiceClient.findSimilarIncidents(queryText, corpus);
        return ResponseEntity.ok(ApiResponse.ok("Similar incident query completed.", result));
    }
}
