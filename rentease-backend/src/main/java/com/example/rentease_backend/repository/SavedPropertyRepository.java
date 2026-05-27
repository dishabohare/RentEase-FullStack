package com.example.rentease_backend.repository;

import com.example.rentease_backend.entity.SavedProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedPropertyRepository extends JpaRepository<SavedProperty, Long> {

    List<SavedProperty> findByUserId(Long userId);

    boolean existsByUserIdAndPropertyId(Long userId, Long propertyId);

    Optional<SavedProperty> findByUserIdAndPropertyId(Long userId, Long propertyId);

    @Transactional
    void deleteByUserIdAndPropertyId(Long userId, Long propertyId);
}
