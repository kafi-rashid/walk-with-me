package com.walkwithme.backend.repository;
import com.walkwithme.backend.model.Brand;
import jakarta.persistence.Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface BrandRepository extends JpaRepository<Brand, Long> {
}