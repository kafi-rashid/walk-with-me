package com.walkwithme.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false)
    private Double totalAmount;
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = true)
    private UserEntity seller;

    @ManyToOne
    @JoinColumn(name = "shipping_address_id", nullable = true)
    private Address shippingAddress;

    @ManyToOne
    @JoinColumn(name = "billing_address_id", nullable = true)
    private Address billingAddress;
    private LocalDateTime orderDate;
}