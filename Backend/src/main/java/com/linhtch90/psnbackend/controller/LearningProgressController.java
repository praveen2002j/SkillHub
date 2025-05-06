package com.linhtch90.psnbackend.controller;

import com.linhtch90.psnbackend.entity.LearningProgressModel;
import com.linhtch90.psnbackend.repository.LearningProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/learningProgress")
public class LearningProgressController {

    @Autowired
    private LearningProgressRepository repository;

    @PostMapping
    public LearningProgressModel createLearningProgress(@RequestBody LearningProgressModel model) {
        // Only required fields are handled; others can be null
        return repository.save(model);
    }

    @GetMapping
    public List<LearningProgressModel> getAllLearningProgress() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public LearningProgressModel getLearningProgressById(@PathVariable String id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "No record with id=" + id)
                );
    }

    @PutMapping(
            value    = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public LearningProgressModel updateLearningProgress(
            @PathVariable String id,
            @RequestBody LearningProgressModel updatedModel
    ) {
        return repository.findById(id)
                .map(existingModel -> {
                    existingModel.setFullName(updatedModel.getFullName());
                    existingModel.setUserID(updatedModel.getUserID());
                    existingModel.setTitle(updatedModel.getTitle());
                    existingModel.setDescription(updatedModel.getDescription());
                    existingModel.setTemplateName(updatedModel.getTemplateName());
                    existingModel.setLearningSkills(updatedModel.getLearningSkills());
                    existingModel.setDate(updatedModel.getDate());
                    existingModel.setTutorialName(updatedModel.getTutorialName());
                    existingModel.setDuration(updatedModel.getDuration());
                    existingModel.setCompletedProgress(updatedModel.getCompletedProgress());
                    existingModel.setKeyTakeaways(updatedModel.getKeyTakeaways());
                    existingModel.setTutorialLink(updatedModel.getTutorialLink());
                    existingModel.setSkillName(updatedModel.getSkillName());
                    existingModel.setProficiencyLevel(updatedModel.getProficiencyLevel());
                    existingModel.setPracticeTime(updatedModel.getPracticeTime());
                    existingModel.setNewProgress(updatedModel.getNewProgress());
                    existingModel.setConfidenceLevel(updatedModel.getConfidenceLevel());
                    existingModel.setMilestoneName(updatedModel.getMilestoneName());
                    existingModel.setDateAchieved(updatedModel.getDateAchieved());
                    existingModel.setProof(updatedModel.getProof());
                    existingModel.setMilestoneProgress(updatedModel.getMilestoneProgress());
                    existingModel.setNotes(updatedModel.getNotes());
                    return repository.save(existingModel);
                })
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "No record with id=" + id)
                );
    }

    @DeleteMapping("/{id}")
    public void deleteLearningProgress(@PathVariable String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No record with id=" + id);
        }
        repository.deleteById(id);
    }
}