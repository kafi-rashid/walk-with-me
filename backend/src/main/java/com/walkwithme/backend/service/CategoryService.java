package com.walkwithme.backend.service;

import com.walkwithme.backend.dto.CategoryDTO;
import com.walkwithme.backend.model.Category;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public interface CategoryService {
    CategoryDTO createCategory(CategoryDTO category);

    CategoryDTO getCategoryById(Long id);

    List<CategoryDTO> getAllCategories();

    CategoryDTO updateCategory(Long id, CategoryDTO category);

    void deleteCategory(Long id);

    List<CategoryDTO> getCategoriesByParentId(Long id);

    public List<CategoryDTO> getCategoriesWithoutParent();

}
