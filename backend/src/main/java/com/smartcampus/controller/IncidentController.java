package com.smartcampus.controller;

import com.smartcampus.entity.Incident;
import com.smartcampus.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    public ResponseEntity<Incident> createIncident(
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("priority") Incident.Priority priority,
            @RequestParam("location") String location,
            @RequestParam("reporterId") String reporterId,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        
        Incident incident = Incident.builder()
                .category(category)
                .description(description)
                .priority(priority)
                .location(location)
                .reporterId(reporterId)
                .build();
        
        return ResponseEntity.ok(incidentService.createIncident(incident, images));
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.getIncidentById(id));
    }

    @GetMapping("/reporter/{reporterId}")
    public ResponseEntity<List<Incident>> getIncidentsByReporter(@PathVariable String reporterId) {
        return ResponseEntity.ok(incidentService.getIncidentsByReporter(reporterId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Incident> updateStatus(
            @PathVariable Long id,
            @RequestParam Incident.IncidentStatus status) {
        return ResponseEntity.ok(incidentService.updateStatus(id, status));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<Incident> assignTechnician(
            @PathVariable Long id,
            @RequestParam String technicianId) {
        return ResponseEntity.ok(incidentService.assignTechnician(id, technicianId));
    }
}
