package com.walkwithme.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Setter
@Getter
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;
    @Column(nullable = false)
    private Integer rating;
    @OneToOne(cascade = CascadeType.PERSIST)
    private UserEntity buyer;
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(nullable = true)
    private LocalDateTime reviewDate;
}
