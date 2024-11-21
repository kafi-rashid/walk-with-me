package com.walkwithme.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductDetailDTO {
    private ProductDTO product;
    private List<BrandDTO> brands;
    private List<CategoryDTO> parentCategories;
    private List<CategoryDTO> childCategories;
    private List<DiscountDTO> discounts;
    private List<ProductVariantDTO> variants;
}