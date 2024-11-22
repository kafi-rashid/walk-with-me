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
    private Long buyerId;
    private LocalDateTime reviewDate;
    private SellerBuyerDto buyer;
}