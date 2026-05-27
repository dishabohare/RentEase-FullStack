package com.example.rentease_backend.repository;

import com.example.rentease_backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.sender.id = :u1 AND m.receiver.id = :u2) OR (m.sender.id = :u2 AND m.receiver.id = :u1) ORDER BY m.timestamp ASC")
    List<Message> findChatHistory(@Param("u1") Long u1, @Param("u2") Long u2);

    List<Message> findBySenderIdOrReceiverIdOrderByTimestampDesc(Long senderId, Long receiverId);

    long countByReceiverIdAndSenderIdAndIsReadFalse(Long receiverId, Long senderId);

    @Transactional
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.receiver.id = :receiverId AND m.sender.id = :senderId AND m.isRead = false")
    void markAsRead(@Param("receiverId") Long receiverId, @Param("senderId") Long senderId);
}
