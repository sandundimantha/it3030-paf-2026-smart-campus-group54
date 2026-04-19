package com.smartcampus.controller;

import com.smartcampus.entity.Comment;
import com.smartcampus.entity.Incident;
import com.smartcampus.repository.CommentRepository;
import com.smartcampus.repository.IncidentRepository;
import com.smartcampus.repository.AppUserRepository;
import com.smartcampus.entity.AppUser;
import com.smartcampus.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents/{incidentId}/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final IncidentRepository incidentRepository;
    private final AppUserRepository appUserRepository;
    private final NotificationService notificationService;

    @Autowired
    public CommentController(CommentRepository commentRepository, 
                             IncidentRepository incidentRepository, 
                             AppUserRepository appUserRepository,
                             NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.incidentRepository = incidentRepository;
        this.appUserRepository = appUserRepository;
        this.notificationService = notificationService;
    }

    private Long getAuthenticatedUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return null;
        return appUserRepository.findByEmail(auth.getName())
               .map(AppUser::getId)
               .orElse(null);
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long incidentId) {
        return ResponseEntity.ok(commentRepository.findByIncidentIdOrderByCreatedAtDesc(incidentId));
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(
            @PathVariable Long incidentId,
            @RequestBody String content,
            Authentication authentication) {

        Long userId = getAuthenticatedUserId(authentication);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        Comment comment = Comment.builder()
                .incidentId(incidentId)
                .autorId(userId)
                .content(content)
                .build();
        
        comment = commentRepository.save(comment);

        // Notify the incident reporter if someone else commented
        if (!incident.getReportedBy().equals(userId)) {
            notificationService.createNotification(
                incident.getReportedBy(),
                "New comment on your incident ticket #" + incidentId + " from user ID " + userId
            );
        }

        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }
}
