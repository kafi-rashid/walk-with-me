package com.walkwithme.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class DiscountDTO {
    private Long id;
    private String name;
    private Double percentage;
    private LocalDate startDate;
    private LocalDate endDate;
}
