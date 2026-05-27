package com.example.rentease_backend.controller;

import com.example.rentease_backend.entity.Property;
import com.example.rentease_backend.entity.User;
import com.example.rentease_backend.repository.PropertyRepository;
import com.example.rentease_backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyController(PropertyRepository propertyRepository, UserRepository userRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    // GET /api/properties - public
    @GetMapping
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // GET /api/properties/owner/{ownerId} - public / owner's own view
    @GetMapping("/owner/{ownerId}")
    public List<Property> getPropertiesByOwner(@PathVariable Long ownerId) {
        return propertyRepository.findByOwnerId(ownerId);
    }

    // POST /api/properties - authenticated
    @PostMapping
    public Property createProperty(@RequestBody Property property, Principal principal) {
        if (principal != null) {
            String email = principal.getName();
            User owner = userRepository.findByEmail(email);
            property.setOwner(owner);
        }
        return propertyRepository.save(property);
    }

    // GET /api/properties/{id} - public
    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyRepository.findById(id).orElse(null);
    }

    // PUT /api/properties/{id} - authenticated & owned
    @PutMapping("/{id}")
    public Property updateProperty(@PathVariable Long id, @RequestBody Property propertyDetails, Principal principal) {
        return propertyRepository.findById(id).map(property -> {
            if (principal != null) {
                String email = principal.getName();
                User caller = userRepository.findByEmail(email);
                boolean isOwner = property.getOwner() != null && property.getOwner().getEmail().equals(email);
                boolean isAdmin = caller != null && "ADMIN".equalsIgnoreCase(caller.getRole());
                if (!isOwner && !isAdmin) {
                    throw new RuntimeException("Unauthorized to update this property.");
                }
            }
            property.setTitle(propertyDetails.getTitle());
            property.setDescription(propertyDetails.getDescription());
            property.setAddress(propertyDetails.getAddress());
            property.setCity(propertyDetails.getCity());
            property.setRent(propertyDetails.getRent());
            property.setPropertyType(propertyDetails.getPropertyType());
            property.setBhk(propertyDetails.getBhk());
            property.setAreaSqFt(propertyDetails.getAreaSqFt());
            property.setFurnished(propertyDetails.getFurnished());
            if (propertyDetails.getVerified() != null) {
                property.setVerified(propertyDetails.getVerified());
            }
            return propertyRepository.save(property);
        }).orElse(null);
    }

    // DELETE /api/properties/{id} - authenticated & owned
    @DeleteMapping("/{id}")
    public void deleteProperty(@PathVariable Long id, Principal principal) {
        propertyRepository.findById(id).ifPresent(property -> {
            if (principal != null) {
                String email = principal.getName();
                if (property.getOwner() != null && !property.getOwner().getEmail().equals(email)) {
                    throw new RuntimeException("Unauthorized to delete this property.");
                }
            }
            propertyRepository.deleteById(id);
        });
    }

    // GET /api/properties/city/Indore
    @GetMapping("/city/{city}")
    public List<Property> getByCity(@PathVariable String city) {
        return propertyRepository.findByCity(city);
    }

    // GET /api/properties/max-rent/15000
    @GetMapping("/max-rent/{rent}")
    public List<Property> getByMaxRent(@PathVariable Double rent) {
        return propertyRepository.findByRentLessThanEqual(rent);
    }

    // GET /api/properties/search?city=Indore&type=FLAT
    @GetMapping("/search")
    public List<Property> searchByCityAndType(@RequestParam String city,
                                              @RequestParam String type) {
        return propertyRepository.findByCityAndPropertyType(city, type);
    }
}
