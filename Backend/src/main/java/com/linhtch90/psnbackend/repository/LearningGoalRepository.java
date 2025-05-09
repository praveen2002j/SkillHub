package com.linhtch90.psnbackend.repository;

import com.linhtch90.psnbackend.entity.LearningGoal;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LearningGoalRepository extends MongoRepository<LearningGoal, String> {
    List<LearningGoal> findByUserId(String userId);
}
