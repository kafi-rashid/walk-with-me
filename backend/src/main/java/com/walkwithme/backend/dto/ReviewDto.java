package com.walkwithme.backend.dto;

import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class ReviewDto {
    private Long id;
    private String comment;
    private Integer rating;
    private Long productId;
    private Long buyerId;
    private String reviewDate;
    private SellerBuyerDto buyer;
}