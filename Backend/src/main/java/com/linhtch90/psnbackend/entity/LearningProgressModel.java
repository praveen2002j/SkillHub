package com.linhtch90.psnbackend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "learningProgress")
public class LearningProgressModel {
    @Id
    private String id;
    private String fullName;
    private String userID;
    private String title;
    private String description;
    private String templateName;
    //Completed Tutorials
    private String learningSkills;
    private String date;
    private String tutorialName;
    private String duration;
    private String completedProgress;
    private String keyTakeaways;
    private String tutorialLink;
    //New Skill Learned
    private String skillName;
    private String proficiencyLevel;
    private String practiceTime;
    private String newProgress;
    private String confidenceLevel;
    //Milestone Achieved
    private String milestoneName;
    private String dateAchieved;
    private String proof;
    private String milestoneProgress;
    private String notes;

    public LearningProgressModel() {

    }

    public LearningProgressModel(String id, String fullName, String userID, String title, String description, String templateName, String learningSkills, String date, String tutorialName, String duration, String completedProgress, String keyTakeaways, String tutorialLink, String skillName, String proficiencyLevel, String practiceTime, String newProgress, String confidenceLevel, String milestoneName, String dateAchieved, String proof, String milestoneProgress, String notes) {
        this.id = id;
        this.fullName = fullName;
        this.userID = userID;
        this.title = title;
        this.description = description;
        this.templateName = templateName;
        this.learningSkills = learningSkills;
        this.date = date;
        this.tutorialName = tutorialName;
        this.duration = duration;
        this.completedProgress = completedProgress;
        this.keyTakeaways = keyTakeaways;
        this.tutorialLink = tutorialLink;
        this.skillName = skillName;
        this.proficiencyLevel = proficiencyLevel;
        this.practiceTime = practiceTime;
        this.newProgress = newProgress;
        this.confidenceLevel = confidenceLevel;
        this.milestoneName = milestoneName;
        this.dateAchieved = dateAchieved;
        this.proof = proof;
        this.milestoneProgress = milestoneProgress;
        this.notes = notes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
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

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getLearningSkills() {
        return learningSkills;
    }

    public void setLearningSkills(String learningSkills) {
        this.learningSkills = learningSkills;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTutorialName() {
        return tutorialName;
    }

    public void setTutorialName(String tutorialName) {
        this.tutorialName = tutorialName;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getCompletedProgress() {
        return completedProgress;
    }

    public void setCompletedProgress(String completedProgress) {
        this.completedProgress = completedProgress;
    }

    public String getKeyTakeaways() {
        return keyTakeaways;
    }

    public void setKeyTakeaways(String keyTakeaways) {
        this.keyTakeaways = keyTakeaways;
    }

    public String getTutorialLink() {
        return tutorialLink;
    }

    public void setTutorialLink(String tutorialLink) {
        this.tutorialLink = tutorialLink;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(String proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public String getPracticeTime() {
        return practiceTime;
    }

    public void setPracticeTime(String practiceTime) {
        this.practiceTime = practiceTime;
    }

    public String getNewProgress() {
        return newProgress;
    }

    public void setNewProgress(String newProgress) {
        this.newProgress = newProgress;
    }

    public String getConfidenceLevel() {
        return confidenceLevel;
    }

    public void setConfidenceLevel(String confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public String getMilestoneName() {
        return milestoneName;
    }

    public void setMilestoneName(String milestoneName) {
        this.milestoneName = milestoneName;
    }

    public String getDateAchieved() {
        return dateAchieved;
    }

    public void setDateAchieved(String dateAchieved) {
        this.dateAchieved = dateAchieved;
    }

    public String getProof() {
        return proof;
    }

    public void setProof(String proof) {
        this.proof = proof;
    }

    public String getMilestoneProgress() {
        return milestoneProgress;
    }

    public void setMilestoneProgress(String milestoneProgress) {
        this.milestoneProgress = milestoneProgress;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
