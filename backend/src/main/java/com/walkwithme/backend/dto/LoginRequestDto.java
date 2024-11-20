package com.walkwithme.backend.dto;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class LoginRequestDto {
    private String email;
    private String password;
}