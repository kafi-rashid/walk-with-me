package com.walkwithme.backend.dto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemDTO {
    private Long id;
    private Long productId;
    private Long variantId;
    private Integer quantity;
    private Double price;
}
