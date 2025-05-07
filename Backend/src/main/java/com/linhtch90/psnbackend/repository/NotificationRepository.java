package com.linhtch90.psnbackend.repository;

import com.linhtch90.psnbackend.entity.NotificationEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<NotificationEntity, String> {
    List<NotificationEntity> findByRecipientUserIdOrderByCreatedAtDesc(String recipientUserId);
}
