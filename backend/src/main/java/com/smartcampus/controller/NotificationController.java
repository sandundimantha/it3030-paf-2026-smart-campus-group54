package com.smartcampus.controller;

import com.smartcampus.entity.Notification;
import com.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(@AuthenticationPrincipal OAuth2User principal) {
        String userId = principal != null ? principal.getAttribute("email") : "testuser@student.com";
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal != null ? principal.getAttribute("email") : "testuser@student.com";
        notificationService.markAsRead(id, userId);
        return ResponseEntity.noContent().build();
    }
}
