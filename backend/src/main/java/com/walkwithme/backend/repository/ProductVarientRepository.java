package com.walkwithme.backend.repository;

import com.walkwithme.backend.model.ProductVariant;
import com.walkwithme.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface ProductVarientRepository extends JpaRepository<ProductVariant, Long> {
}
