package com.walkwithme.backend.dto;
import com.walkwithme.backend.model.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderDTO {
    private Long id;
    private Long userId;
    private Long sellerId;
    private List<OrderItemDTO> items;
    private OrderStatus status;
    private Double totalAmount;
    private Long shippingAddressId;
    private Long billingAddressId;
}

