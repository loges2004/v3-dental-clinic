package com.dental.repository;

import com.dental.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Removed user-specific notification queries as user_id is no longer in the notifications table
    // List<Notification> findByUserOrderByCreatedAtDesc(User user);
    // List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
    // long countByUserAndIsReadFalse(User user);
} 