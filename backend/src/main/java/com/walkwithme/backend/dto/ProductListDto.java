package com.walkwithme.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
@Data
@Builder
public class ProductListDto {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private String image;
        private BrandDTO brand;
        private CategoryDTO parentCategory;
        private CategoryDTO childCategory;
        private DiscountDTO discount;
        private SellerBuyerDto seller;
        private List<ProductVariantDTO> variants;
        private List<ReviewDto> reviews;
}
