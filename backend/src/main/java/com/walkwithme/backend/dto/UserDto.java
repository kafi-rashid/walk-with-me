package com.walkwithme.backend.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Boolean isActive;
    private String status;
    private AddressDto shippingAddress;
    private AddressDto billingAddress;
    private List<RoleDto> roles;
}
