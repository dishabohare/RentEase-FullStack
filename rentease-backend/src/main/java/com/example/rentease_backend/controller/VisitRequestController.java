package com.example.rentease_backend.controller;

import com.example.rentease_backend.entity.VisitRequest;
import com.example.rentease_backend.service.VisitRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
@CrossOrigin("*")
public class VisitRequestController {

    @Autowired
    private VisitRequestService service;

    @PostMapping
    public VisitRequest createVisit(@RequestBody VisitRequest request) {
        return service.createVisitRequest(request);
    }

    @GetMapping("/tenant/{tenantId}")
    public List<VisitRequest> getTenantVisits(@PathVariable Long tenantId) {
        return service.getTenantVisits(tenantId);
    }

    @GetMapping("/owner/{ownerId}")
    public List<VisitRequest> getOwnerVisits(@PathVariable Long ownerId) {
        return service.getOwnerVisits(ownerId);
    }

    @PutMapping("/{id}")
    public VisitRequest updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return service.updateStatus(id, status);
    }
}