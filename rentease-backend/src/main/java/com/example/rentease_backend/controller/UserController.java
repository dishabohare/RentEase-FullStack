package com.example.rentease_backend.controller;

import com.example.rentease_backend.entity.User;
import com.example.rentease_backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET all users (admin use)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET user by ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // GET users by role — e.g. /api/users/role/OWNER
    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable String role) {
        return userRepository.findByRole(role.toUpperCase());
    }

    // PUT /api/users/{id}/avatar
    @PutMapping("/{id}/avatar")
    public User updateAvatar(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        String avatarData = payload.get("avatar");
        return userRepository.findById(id).map(user -> {
            user.setAvatar(avatarData);
            return userRepository.save(user);
        }).orElse(null);
    }

    // NOTE: POST (create user) is handled by /api/auth/register — NOT here.
    // Keeping POST here would bypass BCrypt hashing and JWT flow.
}
