package com.walkwithme.backend.repository;

import com.walkwithme.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByParentId(Long id);

    List<Category> findByParentIdIsNull();

}
