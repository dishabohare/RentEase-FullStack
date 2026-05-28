package com.example.rentease_backend.service;

import com.example.rentease_backend.entity.VisitRequest;
import com.example.rentease_backend.repository.VisitRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitRequestService {

    @Autowired
    private VisitRequestRepository repository;

    public VisitRequest createVisitRequest(VisitRequest request) {
        return repository.save(request);
    }

    public List<VisitRequest> getTenantVisits(Long tenantId) {
        return repository.findByTenantId(tenantId);
    }

    public List<VisitRequest> getOwnerVisits(Long ownerId) {
        return repository.findByOwnerId(ownerId);
    }

    public VisitRequest updateStatus(Long id, String status) {

        VisitRequest request = repository.findById(id).orElseThrow();

        request.setStatus(status);

        return repository.save(request);
    }
}