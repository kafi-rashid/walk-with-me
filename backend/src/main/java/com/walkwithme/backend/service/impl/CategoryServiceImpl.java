package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.dto.CategoryDTO;
import com.walkwithme.backend.model.Category;
import com.walkwithme.backend.repository.CategoryRepository;
import com.walkwithme.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        try {
            Category category = new Category();
            category.setName(categoryDTO.getName());
            if (categoryDTO.getParentId() != null) {
                Category parent = categoryRepository.findById(categoryDTO.getParentId())
                        .orElseThrow(() -> new IllegalArgumentException("Parent category not found"));
                category.setParent(parent);
            }

            Category savedCategory = categoryRepository.save(category);
            return mapToDTO(savedCategory);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error creating category: " + e.getMessage());
        }
    }

    @Override
    public CategoryDTO getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        try {
            return categoryRepository.findAll().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new IllegalArgumentException("Error retrieving categories: " + e.getMessage());
        }
    }

    @Override
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));
            category.setName(categoryDTO.getName());
            if (categoryDTO.getParentId() != null) {
                Category parent = categoryRepository.findById(categoryDTO.getParentId())
                        .orElseThrow(() -> new IllegalArgumentException("Parent category not found"));
                category.setParent(parent);
            }

            Category updatedCategory = categoryRepository.save(category);
            return mapToDTO(updatedCategory);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error updating category: " + e.getMessage());
        }
    }

    @Override
    public void deleteCategory(Long id) {
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));
            categoryRepository.delete(category);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error deleting category: " + e.getMessage());
        }
    }

    private CategoryDTO mapToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .build();
    }
}
