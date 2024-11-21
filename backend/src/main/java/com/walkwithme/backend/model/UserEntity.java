package com.walkwithme.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    private String phoneNumber;
    @Column(nullable = false)
    private Boolean isActive = true;
    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private UserStatus status = UserStatus.PENDING;
    @OneToOne(cascade=CascadeType.ALL)
    @JoinColumn(name = "shipping_address_id", nullable = true)
    private Address shippingAddress;
    @OneToOne(cascade=CascadeType.ALL)
    @JoinColumn(name = "billing_address_id", nullable = true)
    private Address billingAddress;
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles = new ArrayList<>();
    @Column(nullable = true)
    private String createdBy;

    @Column(nullable = true)
    private LocalDateTime createdDateTime;

    @Column(nullable = true)
    private String modifiedBy;

    @Column(nullable = true)
    private LocalDateTime modifiedDateTime;
}

