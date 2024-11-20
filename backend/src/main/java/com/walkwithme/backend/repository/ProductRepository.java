package com.walkwithme.backend.repository;


import com.walkwithme.backend.model.Product;
import com.walkwithme.backend.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<ProductVariant> findVariantById(Long variantId);
}