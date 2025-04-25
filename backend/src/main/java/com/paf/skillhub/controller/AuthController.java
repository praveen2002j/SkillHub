package main.java.controller;

import com.skillshare.backend.model.User;
import com.skillshare.backend.model.LoginRequest;
import com.skillshare.backend.model.LoginResponse;
import com.skillshare.backend.security.JwtUtil;
import com.skillshare.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
 // allow frontend calls
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ✅ Register Endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            savedUser.setPassword(null); // Don't send password back
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // ✅ Login Endpoint (JWT Auth)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userService.getUserByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return ResponseEntity.ok(new LoginResponse(token, user.getId(), user.getName(), user.getRole()));
    }

    // ✅ OAuth2 Success Handler
   @GetMapping("/oauth/success")
public ResponseEntity<?> oauthSuccess(@AuthenticationPrincipal OAuth2User user) {
    String email = user.getAttribute("email");
    String name = user.getAttribute("name");

    // You can log or register the user here
    Optional<User> userOpt = userService.getUserByEmail(email);
    User foundUser = userOpt.orElseGet(() -> userService.registerOAuthUser(email, name));

    String token = jwtUtil.generateToken(foundUser.getId(), foundUser.getRole());
    return ResponseEntity.ok(new LoginResponse(token, foundUser.getId(), foundUser.getName(), foundUser.getRole()));
}

@GetMapping("/oauth/failure")
public ResponseEntity<?> oauthFailure() {
    return ResponseEntity.status(401).body("OAuth login failed");
}

}
