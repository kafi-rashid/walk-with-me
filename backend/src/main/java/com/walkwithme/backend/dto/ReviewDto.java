package com.walkwithme.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewDto {
    private Long id;
    private String comment;
    private Integer rating;
    private Long productId;
    private String productName;
    private Long buyerId;
    private String buyerFistName;
    private String buyerLastName;
    private LocalDateTime reviewDate;
    private SellerBuyerDto buyer;
}