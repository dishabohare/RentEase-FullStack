package com.example.rentease_backend.controller;

import com.example.rentease_backend.entity.User;
import com.example.rentease_backend.repository.UserRepository;
import com.example.rentease_backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // ─── REGISTER ────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        // Check duplicate email
        if (userRepository.findByEmail(req.email()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered. Please login."));
        }

        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPassword(passwordEncoder.encode(req.password())); // BCrypt hash
        user.setRole(req.role() != null ? req.role().toUpperCase() : "TENANT");
        if (req.phone() != null) user.setPhone(req.phone());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.status(HttpStatus.CREATED).body(buildResponse(user, token));
    }

    // ─── LOGIN ────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = userRepository.findByEmail(req.email());

        if (user == null || !passwordEncoder.matches(req.password(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password."));
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(buildResponse(user, token));
    }

    // ─── HELPERS ──────────────────────────────────────────────────────────────
    private Map<String, Object> buildResponse(User user, String token) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id",    user.getId());
        userMap.put("name",  user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("role",  user.getRole());
        userMap.put("phone", user.getPhone());
        userMap.put("avatar", user.getAvatar());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user",  userMap);
        return response;
    }

    // ─── REQUEST RECORDS ─────────────────────────────────────────────────────
    public record RegisterRequest(String name, String email, String password,
                                  String role, String phone) {}

    public record LoginRequest(String email, String password) {}
}
