package com.smartcampus.controller;

import com.smartcampus.entity.Incident;
import com.smartcampus.service.IncidentService;
import com.smartcampus.repository.AppUserRepository;
import com.smartcampus.entity.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;
    private final AppUserRepository appUserRepository;

    @Autowired
    public IncidentController(IncidentService incidentService, AppUserRepository appUserRepository) {
        this.incidentService = incidentService;
        this.appUserRepository = appUserRepository;
    }

    private Long getAuthenticatedUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return null;
        return appUserRepository.findByEmail(auth.getName())
               .map(AppUser::getId)
               .orElse(null);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Incident> createIncident(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @org.springframework.security.core.annotation.AuthenticationPrincipal Object unused,
            Authentication authentication) {

        Long userId = getAuthenticatedUserId(authentication);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        Incident incident = incidentService.createIncident(title, description, location, userId, images);
        return new ResponseEntity<>(incident, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/user")
    public ResponseEntity<List<Incident>> getUserIncidents(Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(incidentService.getUserIncidents(userId));
    }
}
