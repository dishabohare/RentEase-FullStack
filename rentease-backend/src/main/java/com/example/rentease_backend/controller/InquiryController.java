package com.example.rentease_backend.controller;

import com.example.rentease_backend.entity.Inquiry;
import com.example.rentease_backend.entity.Notification;
import com.example.rentease_backend.entity.Property;
import com.example.rentease_backend.entity.User;
import com.example.rentease_backend.repository.InquiryRepository;
import com.example.rentease_backend.repository.NotificationRepository;
import com.example.rentease_backend.repository.PropertyRepository;
import com.example.rentease_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inquiries")
@CrossOrigin(origins = "*")
public class InquiryController {

    private final InquiryRepository inquiryRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public InquiryController(InquiryRepository inquiryRepository,
                             PropertyRepository propertyRepository,
                             UserRepository userRepository,
                             NotificationRepository notificationRepository) {
        this.inquiryRepository = inquiryRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    private User getAuthenticatedUser(Principal principal) {
        if (principal == null) return null;
        return userRepository.findByEmail(principal.getName());
    }

    // POST /api/inquiries
    @PostMapping
    public ResponseEntity<?> submitInquiry(@RequestBody SubmitInquiryRequest req, Principal principal) {
        User tenant = getAuthenticatedUser(principal);
        if (tenant == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }

        Property property = propertyRepository.findById(req.propertyId()).orElse(null);
        if (property == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Property not found"));
        }

        Inquiry inquiry = new Inquiry();
        inquiry.setProperty(property);
        inquiry.setUser(tenant);
        inquiry.setMessage(req.message());
        inquiry.setVisitDate(req.visitDate());
        inquiry.setPhone(req.phone());
        inquiry.setTimestamp(LocalDateTime.now());

        Inquiry savedInquiry = inquiryRepository.save(inquiry);

        // Notify Property Owner
        User owner = property.getOwner();
        if (owner != null) {
            Notification notification = new Notification();
            notification.setUser(owner);
            notification.setType("inquiry");
            notification.setTitle("New Inquiry Received");
            notification.setDescription("Tenant " + tenant.getName() + " sent an inquiry on '" + property.getTitle() + "' (Visit: " + req.visitDate() + ")");
            notification.setTimestamp(LocalDateTime.now());
            notification.setRead(false);
            notificationRepository.save(notification);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedInquiry);
    }

    // GET /api/inquiries/owner
    @GetMapping("/owner")
    public ResponseEntity<?> getOwnerInquiries(Principal principal) {
        User owner = getAuthenticatedUser(principal);
        if (owner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        List<Inquiry> inquiries = inquiryRepository.findByPropertyOwnerIdOrderByTimestampDesc(owner.getId());
        return ResponseEntity.ok(inquiries);
    }

    // GET /api/inquiries/tenant
    @GetMapping("/tenant")
    public ResponseEntity<?> getTenantInquiries(Principal principal) {
        User tenant = getAuthenticatedUser(principal);
        if (tenant == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        List<Inquiry> inquiries = inquiryRepository.findByUserIdOrderByTimestampDesc(tenant.getId());
        return ResponseEntity.ok(inquiries);
    }

    // ─── RECORDS ─────────────────────────────────────────────────────────────
    public record SubmitInquiryRequest(Long propertyId, String message, String visitDate, String phone) {}
}
