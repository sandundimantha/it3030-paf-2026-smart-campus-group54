package com.smartcampus.controller;

import com.smartcampus.entity.Incident;
import com.smartcampus.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Incident> createIncident(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal OAuth2User principal) {

        String userId = principal != null ? principal.getAttribute("email") : "testuser@student.com";
        Incident incident = incidentService.createIncident(title, description, location, userId, images);
        return new ResponseEntity<>(incident, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/user")
    public ResponseEntity<List<Incident>> getUserIncidents(@AuthenticationPrincipal OAuth2User principal) {
        String userId = principal != null ? principal.getAttribute("email") : "testuser@student.com";
        return ResponseEntity.ok(incidentService.getUserIncidents(userId));
    }
}
