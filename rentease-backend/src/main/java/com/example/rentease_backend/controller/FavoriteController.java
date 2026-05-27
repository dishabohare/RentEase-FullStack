package com.example.rentease_backend.controller;

import com.example.rentease_backend.entity.Property;
import com.example.rentease_backend.entity.SavedProperty;
import com.example.rentease_backend.entity.User;
import com.example.rentease_backend.repository.PropertyRepository;
import com.example.rentease_backend.repository.SavedPropertyRepository;
import com.example.rentease_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    private final SavedPropertyRepository savedPropertyRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    public FavoriteController(SavedPropertyRepository savedPropertyRepository,
                              UserRepository userRepository,
                              PropertyRepository propertyRepository) {
        this.savedPropertyRepository = savedPropertyRepository;
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
    }

    private User getAuthenticatedUser(Principal principal) {
        if (principal == null) return null;
        return userRepository.findByEmail(principal.getName());
    }

    @GetMapping
    public ResponseEntity<?> getFavorites(Principal principal) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        List<SavedProperty> savedList = savedPropertyRepository.findByUserId(user.getId());
        List<Property> properties = savedList.stream()
                .map(SavedProperty::getProperty)
                .collect(Collectors.toList());
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/ids")
    public ResponseEntity<?> getFavoriteIds(Principal principal) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        List<SavedProperty> savedList = savedPropertyRepository.findByUserId(user.getId());
        List<Long> ids = savedList.stream()
                .map(sp -> sp.getProperty().getId())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ids);
    }

    @PostMapping("/{propertyId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long propertyId, Principal principal) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }

        Property property = propertyRepository.findById(propertyId).orElse(null);
        if (property == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Property not found"));
        }

        if (savedPropertyRepository.existsByUserIdAndPropertyId(user.getId(), propertyId)) {
            return ResponseEntity.ok(Map.of("message", "Property already saved", "saved", true));
        }

        SavedProperty savedProperty = new SavedProperty(user, property);
        savedPropertyRepository.save(savedProperty);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Property saved successfully", "saved", true));
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long propertyId, Principal principal) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }

        if (!savedPropertyRepository.existsByUserIdAndPropertyId(user.getId(), propertyId)) {
            return ResponseEntity.ok(Map.of("message", "Property was not saved", "saved", false));
        }

        savedPropertyRepository.deleteByUserIdAndPropertyId(user.getId(), propertyId);
        return ResponseEntity.ok(Map.of("message", "Property removed from saved listings", "saved", false));
    }
}
