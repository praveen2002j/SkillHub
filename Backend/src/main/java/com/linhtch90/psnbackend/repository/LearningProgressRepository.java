package com.linhtch90.psnbackend.repository;

import com.linhtch90.psnbackend.entity.LearningProgressModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningProgressRepository extends MongoRepository<LearningProgressModel, String> {

}
