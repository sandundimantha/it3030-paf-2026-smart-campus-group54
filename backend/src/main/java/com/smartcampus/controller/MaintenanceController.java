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
    public ResponseEntity<List<MaintenanceTicket>> getAllTickets(Authentication authentication) {
        String reporterId = authentication != null ? authentication.getName() : "anonymous";
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        return ResponseEntity.ok(maintenanceService.getTicketsForUser(reporterId, isAdmin));
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<MaintenanceTicket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getTicketById(id));
    }

    @PatchMapping("/tickets/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam MaintenanceTicket.TicketStatus status,
            Authentication authentication) {
        
        // Check if user is attempting to resolve the ticket
        if (status == MaintenanceTicket.TicketStatus.RESOLVED) {
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("Only administrators can resolve tickets.");
            }
        }
        
        return ResponseEntity.ok(maintenanceService.updateStatus(id, status));
    }

    @PatchMapping("/tickets/{id}/assign")
    public ResponseEntity<MaintenanceTicket> assignTechnician(
            @PathVariable Long id,
            @RequestParam String technicianId) {
        return ResponseEntity.ok(maintenanceService.assignTechnician(id, technicianId));
    }

    @PatchMapping("/tickets/{id}/feedback")
    public ResponseEntity<?> submitFeedback(
            @PathVariable Long id,
            @RequestParam("comment") String comment,
            @RequestParam("rating") Integer rating,
            Authentication authentication) {
        
        MaintenanceTicket ticket = maintenanceService.getTicketById(id);
        String currentUserId = authentication != null ? authentication.getName() : "anonymous";
        
        // Ownership Check: only the reporter can give feedback
        if (!ticket.getReporterId().equals(currentUserId)) {
            return ResponseEntity.status(403).body("Only the original reporter can submit feedback for this ticket.");
        }
        
        return ResponseEntity.ok(maintenanceService.submitFeedback(id, comment, rating));
    }
}
