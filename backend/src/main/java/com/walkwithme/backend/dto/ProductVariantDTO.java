package com.walkwithme.backend.dto;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductVariantDTO {
    private Long id;
    private String size;
    private Integer stockQuantity;
}
