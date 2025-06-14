package com.dental.controller;

import com.dental.model.Notification;
import com.dental.model.User;
import com.dental.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {
    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationRepository.findByUserOrderByCreatedAtDesc(user));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user));
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadNotificationCount(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationRepository.countByUserAndIsReadFalse(user));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        notification.setRead(true);
        return ResponseEntity.ok(notificationRepository.save(notification));
    }
} 