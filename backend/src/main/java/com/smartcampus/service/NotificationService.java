package com.smartcampus.service;

import com.smartcampus.entity.Notification;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Used internally by BookingService / IncidentService to create notifications
     */
    @Transactional
    public Notification createNotification(String userId, String message, Notification.NotificationType type) {
        Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        log.info("Creating notification for user {}: {}", userId, message);
        return notificationRepository.save(notification);
    }

    /**
     * Convenience overload with GENERAL type (for backward compatibility)
     */
    @Transactional
    public Notification createNotification(String userId, String message) {
        return createNotification(userId, message, Notification.NotificationType.GENERAL);
    }

    /**
     * Function 2: Get all notifications for the logged-in user
     */
    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get only UNREAD notifications for the logged-in user
     */
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    /**
     * Get count of unread notifications (used for badge)
     */
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    /**
     * Function 3: Mark a single notification as read
     */
    @Transactional
    public void markAsRead(Long notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Cannot mark another user's notification as read");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        log.info("Notification {} marked as read by {}", notificationId, userId);
    }

    /**
     * Function 3: Mark ALL notifications as read for the user
     */
    @Transactional
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        log.info("Marked {} notifications as read for user {}", unread.size(), userId);
    }

    /**
     * Delete a notification (user can only delete their own)
     */
    @Transactional
    public void deleteNotification(Long notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Cannot delete another user's notification");
        }

        notificationRepository.deleteById(notificationId);
        log.info("Notification {} deleted by {}", notificationId, userId);
    }
}
