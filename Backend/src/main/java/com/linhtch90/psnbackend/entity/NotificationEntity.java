package com.linhtch90.psnbackend.entity;

import java.time.Instant;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notification")
public class NotificationEntity {
    @Id
    private String id;
    private String recipientUserId;
    private String fromUserId;
    private String postId;
    private String type; // "like" or "comment"
    private String message;
    private boolean isRead;
    private Instant createdAt;
}
