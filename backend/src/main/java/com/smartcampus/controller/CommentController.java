package com.smartcampus.controller;

import com.smartcampus.entity.Comment;
import com.smartcampus.entity.Incident;
import com.smartcampus.repository.CommentRepository;
import com.smartcampus.repository.IncidentRepository;
import com.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents/{incidentId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentRepository commentRepository;
    private final IncidentRepository incidentRepository;
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long incidentId) {
        return ResponseEntity.ok(commentRepository.findByIncidentIdOrderByCreatedAtDesc(incidentId));
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(
            @PathVariable Long incidentId,
            @RequestBody String content,
            @AuthenticationPrincipal OAuth2User principal) {

        String userId = principal != null ? principal.getAttribute("email") : "testuser@student.com";
        
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
                "New comment on your incident ticket #" + incidentId + " from " + userId
            );
        }

        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }
}
