package com.linhtch90.psnbackend.controller;

import com.linhtch90.psnbackend.entity.LearningGoal;
import com.linhtch90.psnbackend.repository.LearningGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:3000")
public class LearningGoalController {

    @Autowired
    private LearningGoalRepository goalRepo;

    @GetMapping("/{userId}")
    public List<LearningGoal> getGoals(@PathVariable String userId) {
        return goalRepo.findByUserId(userId);
    }

    @PostMapping
    public LearningGoal addGoal(@RequestBody LearningGoal goal) {
        return goalRepo.save(goal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningGoal> updateGoal(@PathVariable String id, @RequestBody LearningGoal updated) {
        return goalRepo.findById(id)
            .map(goal -> {
                goal.setTitle(updated.getTitle());
                goal.setDescription(updated.getDescription());
                goal.setTargetDate(updated.getTargetDate());
                goal.setCompleted(updated.isCompleted());
                return ResponseEntity.ok(goalRepo.save(goal));
            }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable String id) {
        goalRepo.deleteById(id);
    }
}
