package com.walkwithme.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.walkwithme.backend.model.UserStatus;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto {
    private Long id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Boolean isActive;
    private UserStatus status;
    private AddressDto shippingAddress;
    private AddressDto billingAddress;
    private List<RoleDto> roles;
}
