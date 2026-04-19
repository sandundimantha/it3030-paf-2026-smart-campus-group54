package com.smartcampus.controller;

import com.smartcampus.entity.MaintenanceTicket;
import com.smartcampus.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping("/report")
    public ResponseEntity<MaintenanceTicket> reportIssue(
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("priority") MaintenanceTicket.Priority priority,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            Authentication authentication) {
        
        // reporterID get automatically from Security Context
        String reporterId = authentication != null ? authentication.getName() : "anonymous";
        
        MaintenanceTicket ticket = MaintenanceTicket.builder()
                .category(category)
                .description(description)
                .location(location)
                .priority(priority)
                .reporterId(reporterId)
                .build();
        
        return ResponseEntity.ok(maintenanceService.createTicket(ticket, images));
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<MaintenanceTicket>> getAllTickets() {
        return ResponseEntity.ok(maintenanceService.getAllTickets());
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<MaintenanceTicket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getTicketById(id));
    }

    @PatchMapping("/tickets/{id}/status")
    public ResponseEntity<MaintenanceTicket> updateStatus(
            @PathVariable Long id,
            @RequestParam MaintenanceTicket.TicketStatus status) {
        return ResponseEntity.ok(maintenanceService.updateStatus(id, status));
    }
}
