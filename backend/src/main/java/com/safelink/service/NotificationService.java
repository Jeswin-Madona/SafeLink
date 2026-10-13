package com.safelink.service;

import com.safelink.entity.Notification;
import com.safelink.entity.NotificationType;
import com.safelink.entity.User;
import com.safelink.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(User recipient, String title, String message,
                                           NotificationType type, Long referenceId) {
        Notification notification = new Notification(recipient, title, message, type, referenceId);
        Notification saved = notificationRepository.save(notification);
        logger.info("NOTIFICATION dispatched to {}: [{}] {}", recipient.getEmail(), title, message);
        return saved;
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
    }

    public void markAsRead(Long notificationId, User user) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getRecipient().getId().equals(user.getId())) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByRecipientAndReadFalse(user);
    }
}
