package com.walkwithme.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressDtoBuilder {
    private Long id;
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}

