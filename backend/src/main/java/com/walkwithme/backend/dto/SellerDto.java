package com.walkwithme.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SellerDto {
    private Long sellerId;
    private String fristName;
    private String lastName;
}
