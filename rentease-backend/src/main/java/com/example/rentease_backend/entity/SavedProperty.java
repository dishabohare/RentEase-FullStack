package com.example.rentease_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "saved_properties", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "property_id"})
})
public class SavedProperty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;

    public SavedProperty() {}

    public SavedProperty(User user, Property property) {
        this.user = user;
        this.property = property;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }
}
