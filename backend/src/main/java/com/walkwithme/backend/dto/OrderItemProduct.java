package com.walkwithme.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemProduct {
    private Long productId;
    private String productName;
}
