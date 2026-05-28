package com.example.rentease_backend.repository;

import com.example.rentease_backend.entity.VisitRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitRequestRepository extends JpaRepository<VisitRequest, Long> {

    List<VisitRequest> findByTenantId(Long tenantId);

    List<VisitRequest> findByOwnerId(Long ownerId);
}