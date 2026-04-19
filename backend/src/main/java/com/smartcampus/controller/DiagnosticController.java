package com.smartcampus.controller;

import com.smartcampus.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public/diagnostics")
public class DiagnosticController {

    private final JdbcTemplate jdbcTemplate;
    private final FileStorageService storageService;

    public DiagnosticController(JdbcTemplate jdbcTemplate, FileStorageService storageService) {
        this.jdbcTemplate = jdbcTemplate;
        this.storageService = storageService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> runDiagnostics() {
        Map<String, Object> results = new HashMap<>();

        // 1. Test Database
        try {
            Integer dbResult = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            results.put("database", Map.of(
                "status", "UP",
                "message", "Successfully queried Supabase PostgreSQL"
            ));
        } catch (Exception e) {
            results.put("database", Map.of(
                "status", "DOWN",
                "error", e.getMessage()
            ));
        }

        // 2. Test Supabase Storage
        try {
            String testUrl = storageService.getPublicUrl("test-connection.txt");
            results.put("storage", Map.of(
                "status", "CONNECTED",
                "public_url_base", testUrl,
                "message", "Storage service is initialized. Use /api/storage/upload to test a real upload."
            ));
        } catch (Exception e) {
            results.put("storage", Map.of(
                "status", "ERROR",
                "error", e.getMessage()
            ));
        }

        return ResponseEntity.ok(results);
    }
}
