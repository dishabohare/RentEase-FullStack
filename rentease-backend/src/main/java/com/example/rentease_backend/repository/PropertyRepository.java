package com.example.rentease_backend.repository;

import com.example.rentease_backend.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    // city ke basis pe
    List<Property> findByCity(String city);

    // max rent ke andar
    List<Property> findByRentLessThanEqual(Double rent);

    // type + city
    List<Property> findByCityAndPropertyType(String city, String propertyType);

    // owner id
    List<Property> findByOwnerId(Long ownerId);
}
