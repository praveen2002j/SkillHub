package com.linhtch90.psnbackend.controller;

import com.linhtch90.psnbackend.entity.Certification;
import com.linhtch90.psnbackend.entity.Experience;
import com.linhtch90.psnbackend.entity.User;
import com.linhtch90.psnbackend.repository.UsersRepository;
import com.linhtch90.psnbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {

    @Autowired
    private UserService userService;

    @Autowired
    private UsersRepository userRepository;

    // ✅ Get user profile by ID
    // @GetMapping("/{id}")
    // public ResponseEntity<User> getUserProfile(@PathVariable String id) {
    //     Optional<User> user = userService.getUserById(id);
    //     return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    // }

    // ✅ Update profile
    @PutMapping("/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable String id, @RequestBody User updatedUser) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setHeadline(updatedUser.getHeadline());
            user.setBio(updatedUser.getBio());
            user.setSkills(updatedUser.getSkills());
            user.setExperiences(updatedUser.getExperiences());
            user.setCertifications(updatedUser.getCertifications());

            return ResponseEntity.ok(userRepository.save(user));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Add Skill
    @PostMapping("/{id}/skills")
    public ResponseEntity<?> addSkill(@PathVariable String id, @RequestBody String skill) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.getSkills().add(skill);
            userRepository.save(user);
            return ResponseEntity.ok("Skill added successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Remove Skill
    @DeleteMapping("/{id}/skills/{skillIndex}")
    public ResponseEntity<?> deleteSkill(@PathVariable String id, @PathVariable int skillIndex) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (skillIndex >= 0 && skillIndex < user.getSkills().size()) {
                user.getSkills().remove(skillIndex);
                userRepository.save(user);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
    
    

    // ✅ Add Certification
    @PostMapping("/{id}/certifications")
    public ResponseEntity<?> addCertification(@PathVariable String id, @RequestBody Certification certification) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.getCertifications().add(certification);
            userRepository.save(user);
            return ResponseEntity.ok("Certification added successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Add Experience
    @PostMapping("/{id}/experiences")
    public ResponseEntity<?> addExperience(@PathVariable String id, @RequestBody Experience experience) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.getExperiences().add(experience);
            userRepository.save(user);
            return ResponseEntity.ok("Experience added successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}