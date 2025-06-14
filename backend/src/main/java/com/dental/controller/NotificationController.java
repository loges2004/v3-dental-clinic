package com.dental.controller;

import com.dental.model.Notification;
import com.dental.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {
    private final NotificationRepository notificationRepository;

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setRead(true);
        return ResponseEntity.ok(notificationRepository.save(notification));
    }
    
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationRepository.findAll());
    }
} 