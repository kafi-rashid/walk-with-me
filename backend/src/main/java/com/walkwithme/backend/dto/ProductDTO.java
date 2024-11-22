package com.walkwithme.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String image;
    private Long brandId;
    private Long parentCategoryId;
    private Long childCategoryId;
    private Long discountId;
    private Long selleId;
    private List<ProductVariantDTO> variants;
    private List<ReviewDto> reviewDtos;
}
