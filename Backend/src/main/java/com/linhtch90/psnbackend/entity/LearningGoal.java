package com.linhtch90.psnbackend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "learning_goals")
public class LearningGoal {

    @Id
    private String id;

    private String userId;
    private String title;
    private String description;
    private String targetDate;
    private boolean completed;

    // Constructors
    public LearningGoal() {}

    public LearningGoal(String userId, String title, String description, String targetDate, boolean completed) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.targetDate = targetDate;
        this.completed = completed;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(String targetDate) {
        this.targetDate = targetDate;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
