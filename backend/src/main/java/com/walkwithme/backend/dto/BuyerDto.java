package com.walkwithme.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BuyerDto {
    private Long buyerId;
    private String fristName;
    private String lastName;
}
