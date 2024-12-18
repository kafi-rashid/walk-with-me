package com.walkwithme.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SellerBuyerDto {
    private Long id;
    private String firstName;
    private String lastName;
}
