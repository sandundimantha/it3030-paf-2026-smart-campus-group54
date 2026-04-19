package com.smartcampus.controller;

import com.smartcampus.entity.Notification;
import com.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // Helper to safely extract email from principal (fallback for testing without OAuth)
    private String getEmail(OAuth2User principal) {
        return principal != null
                ? principal.getAttribute("email")
                : "testuser@student.com";
    }

    /**
     * Function 2 — GET /api/notifications
     * Get all notifications for the logged-in user
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(
            @AuthenticationPrincipal OAuth2User principal) {
        return ResponseEntity.ok(notificationService.getUserNotifications(getEmail(principal)));
    }

    /**
     * Function 2 — GET /api/notifications/unread-count
     * Get count of unread notifications (used for bell badge in UI)
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal OAuth2User principal) {
        long count = notificationService.getUnreadCount(getEmail(principal));
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Function 3 — PATCH /api/notifications/{id}/read
     * Mark a single notification as read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User principal) {
        notificationService.markAsRead(id, getEmail(principal));
        return ResponseEntity.noContent().build();
    }

    /**
     * Function 3 — PATCH /api/notifications/read-all
     * Mark ALL notifications as read at once
     */
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal OAuth2User principal) {
        notificationService.markAllAsRead(getEmail(principal));
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /api/notifications/{id}
     * Delete a specific notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User principal) {
        notificationService.deleteNotification(id, getEmail(principal));
        return ResponseEntity.noContent().build();
    }
}
