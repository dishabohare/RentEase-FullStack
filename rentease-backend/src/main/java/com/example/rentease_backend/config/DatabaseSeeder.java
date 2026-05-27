package com.example.rentease_backend.config;

import com.example.rentease_backend.entity.*;
import com.example.rentease_backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final MessageRepository messageRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          PropertyRepository propertyRepository,
                          PropertyImageRepository propertyImageRepository,
                          MessageRepository messageRepository,
                          NotificationRepository notificationRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.messageRepository = messageRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Database already has data. Skipping seeding.");
            return;
        }

        System.out.println("Seeding database with default users, properties, and initial data...");

        // 1. Create Users
        User owner = new User(
                "Rahul Sharma",
                "rahul@example.com",
                passwordEncoder.encode("password"),
                "OWNER"
        );
        owner.setPhone("+91 98765 43210");
        userRepository.save(owner);

        User tenant = new User(
                "Ananya Krishnan",
                "ananya@example.com",
                passwordEncoder.encode("password"),
                "TENANT"
        );
        tenant.setPhone("+91 99887 76655");
        userRepository.save(tenant);

        User admin = new User(
                "Admin System",
                "admin@example.com",
                passwordEncoder.encode("password"),
                "ADMIN"
        );
        admin.setPhone("+91 11223 34455");
        userRepository.save(admin);

        // 2. Create Properties with Multiple Images
        String[] propPics = {
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80"
        };

        String[] interiorPics = {
                "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
        };

        // Property 1
        Property p1 = new Property(
                "Sunny 2BHK Apartment in Koramangala",
                "A beautiful, well-ventilated 2BHK apartment in the heart of Koramangala. Close to major IT parks, restaurants, and shopping centers.",
                "Koramangala, 5th Block",
                "Bangalore",
                25000.0,
                "FLAT",
                2,
                1100.0,
                true,
                owner
        );
        p1.setVerified(true);
        propertyRepository.save(p1);
        propertyImageRepository.save(new PropertyImage(p1, propPics[0]));
        propertyImageRepository.save(new PropertyImage(p1, interiorPics[0]));
        propertyImageRepository.save(new PropertyImage(p1, interiorPics[1]));

        // Property 2
        Property p2 = new Property(
                "Spacious 3BHK Villa in Whitefield",
                "Luxurious 3BHK villa with a private garden and modern amenities. Perfect for families looking for a premium living experience in Whitefield.",
                "Whitefield, ITPL Road",
                "Bangalore",
                45000.0,
                "HOUSE",
                3,
                2200.0,
                true,
                owner
        );
        p2.setVerified(true);
        propertyRepository.save(p2);
        propertyImageRepository.save(new PropertyImage(p2, propPics[1]));
        propertyImageRepository.save(new PropertyImage(p2, interiorPics[1]));
        propertyImageRepository.save(new PropertyImage(p2, interiorPics[2]));

        // Property 3
        Property p3 = new Property(
                "Modern 1BHK Studio in Indiranagar",
                "Compact and stylish 1BHK studio perfect for working professionals. Located in vibrant Indiranagar with easy access to dining and shopping.",
                "Indiranagar, 12th Main",
                "Bangalore",
                18000.0,
                "FLAT",
                1,
                650.0,
                true,
                owner
        );
        p3.setVerified(true);
        propertyRepository.save(p3);
        propertyImageRepository.save(new PropertyImage(p3, propPics[2]));
        propertyImageRepository.save(new PropertyImage(p3, interiorPics[0]));

        // Property 4
        Property p4 = new Property(
                "Cozy PG Room near Vijay Nagar",
                "Affordable fully-furnished PG room with standard amenities, high-speed WiFi, security, and meal services included. Perfect for students.",
                "Vijay Nagar, Scheme 54",
                "Indore",
                8000.0,
                "PG",
                1,
                300.0,
                true,
                owner
        );
        propertyRepository.save(p4);
        propertyImageRepository.save(new PropertyImage(p4, propPics[3]));
        propertyImageRepository.save(new PropertyImage(p4, interiorPics[2]));

        // 3. Create Seed Messages (Tenant ↔ Owner)
        messageRepository.save(new Message(tenant, owner, "Hi Rahul, I am interested in the 2BHK in Koramangala. Is it still available?", LocalDateTime.now().minusMinutes(30), true));
        messageRepository.save(new Message(owner, tenant, "Yes, it is available! Would you like to schedule a visit?", LocalDateTime.now().minusMinutes(25), true));
        messageRepository.save(new Message(tenant, owner, "That would be great! Can I come tomorrow around 10 AM?", LocalDateTime.now().minusMinutes(20), true));
        messageRepository.save(new Message(owner, tenant, "Sure, you can visit the property tomorrow at 10 AM.", LocalDateTime.now().minusMinutes(15), false)); // one unread message!

        // 4. Create Seed Notifications
        notificationRepository.save(new Notification(tenant, "saved", "Property Saved", "You added 'Sunny 2BHK Apartment in Koramangala' to your wishlist.", LocalDateTime.now().minusHours(2), true));
        notificationRepository.save(new Notification(owner, "inquiry", "New Inquiry Received", "Ananya Krishnan sent an inquiry on your 2BHK Koramangala listing.", LocalDateTime.now().minusMinutes(29), false));
        notificationRepository.save(new Notification(tenant, "message", "New Message", "Rahul Sharma sent you a message about the property visit.", LocalDateTime.now().minusMinutes(14), false));

        System.out.println("Database seeding successfully completed.");
    }
}
