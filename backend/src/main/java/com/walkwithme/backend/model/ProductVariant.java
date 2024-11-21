package com.walkwithme.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = true)
    private String color;

    private String size;

    private Double price;

    private Integer stock;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "discount_id", nullable = true)
    private Discount discount;
}
