package com.walkwithme.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private Double price;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String image;
    @Column(nullable = true)
    private int quantity;
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = true)
    private UserEntity seller;
    @Column(nullable = true)
    private String status;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = true)
    private Brand brand;
    @ManyToOne
    @JoinColumn(name = "parent_category_id", nullable = true)
    private Category parentCategory;
    @ManyToOne
    @JoinColumn(name = "sub_category_id", nullable = true)
    private Category subCategory;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;
    @ManyToOne
    @JoinColumn(name = "discount_id", nullable = true)
    private Discount discount;

    public void updateQuantity(int newQuantity) {
        this.quantity = newQuantity;
        this.status = (newQuantity > 0) ? "In Stock" : "Out of Stock";
    }
}
