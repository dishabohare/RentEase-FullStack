package com.example.rentease_backend.controller;

import com.example.rentease_backend.entity.Message;
import com.example.rentease_backend.entity.Notification;
import com.example.rentease_backend.entity.User;
import com.example.rentease_backend.repository.MessageRepository;
import com.example.rentease_backend.repository.NotificationRepository;
import com.example.rentease_backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public MessageController(
            MessageRepository messageRepository,
            UserRepository userRepository,
            NotificationRepository notificationRepository
    ) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    private User getAuthenticatedUser(Principal principal) {

    if (principal == null) {
        return userRepository.findById(1L).orElse(null);
    }

    return userRepository.findByEmail(principal.getName());

}
    // 1. GET /api/messages/conversations
    @GetMapping("/conversations")
    public ResponseEntity<?> getConversations(Principal principal) {

        User user = getAuthenticatedUser(principal);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
        }

        List<Message> allMessages =
                messageRepository.findBySenderIdOrReceiverIdOrderByTimestampDesc(
                        user.getId(),
                        user.getId()
                );

        List<ConversationSummary> summaries = new ArrayList<>();

        Set<Long> processedUsers = new HashSet<>();

        for (Message msg : allMessages) {

            User otherUser =
                    msg.getSender().getId().equals(user.getId())
                            ? msg.getReceiver()
                            : msg.getSender();

            if (!processedUsers.contains(otherUser.getId())) {

                processedUsers.add(otherUser.getId());

                long unreadCount =
                        messageRepository.countByReceiverIdAndSenderIdAndIsReadFalse(
                                user.getId(),
                                otherUser.getId()
                        );

                summaries.add(
                        new ConversationSummary(
                                otherUser.getId(),
                                otherUser.getName(),
                                otherUser.getEmail(),
                                otherUser.getAvatar(),
                                msg.getContent(),
                                msg.getTimestamp(),
                                unreadCount
                        )
                );
            }
        }

        return ResponseEntity.ok(summaries);
    }

    // 2. GET /api/messages/with/{otherUserId}
    @GetMapping("/with/{otherUserId}")
    public ResponseEntity<?> getMessagesWithUser(
            @PathVariable Long otherUserId,
            Principal principal
    ) {

        User user = getAuthenticatedUser(principal);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
        }

        // Mark incoming messages as read
        messageRepository.markAsRead(user.getId(), otherUserId);

        List<Message> chatHistory =
                messageRepository.findChatHistory(
                        user.getId(),
                        otherUserId
                );

        return ResponseEntity.ok(chatHistory);
    }

    // 3. POST /api/messages
    @PostMapping
    public ResponseEntity<?> sendMessage(
            @RequestBody SendMessageRequest req,
            Principal principal
    ) {

        User sender = getAuthenticatedUser(principal);

        if (sender == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
        }

        User receiver =
                userRepository.findById(req.receiverId()).orElse(null);

        if (receiver == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Receiver not found"));
        }

        Message message = new Message();

        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(req.content());
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);

        Message savedMessage = messageRepository.save(message);

        // CREATE NOTIFICATION
        Notification notification = new Notification();

        notification.setUser(receiver);
        notification.setType("message");
        notification.setTitle("New Message");

        notification.setDescription(
                sender.getName() +
                        " sent you a message: " +
                        (
                                req.content().length() > 50
                                        ? req.content().substring(0, 47) + "..."
                                        : req.content()
                        )
        );

        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);

        notificationRepository.save(notification);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedMessage);
    }

    // 4. PUT /api/messages/read/{otherUserId}
    @PutMapping("/read/{otherUserId}")
    public ResponseEntity<?> markMessagesRead(
            @PathVariable Long otherUserId,
            Principal principal
    ) {

        User user = getAuthenticatedUser(principal);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
        }

        messageRepository.markAsRead(
                user.getId(),
                otherUserId
        );

        return ResponseEntity.ok(
                Map.of("message", "Messages marked as read")
        );
    }

    // RECORDS

    public record SendMessageRequest(
            Long receiverId,
            String content
    ) {}

    public record ConversationSummary(
            Long otherUserId,
            String otherUserName,
            String otherUserEmail,
            String otherUserAvatar,
            String lastMessage,
            LocalDateTime timestamp,
            long unreadCount
    ) {}
}