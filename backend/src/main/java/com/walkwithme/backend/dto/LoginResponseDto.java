package com.walkwithme.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private Long userId;
    private String refreshToken;
    private String firstName;
    private String lastName;
    private String email;
    private List<String> roles;
//    private String lastName;
//    public LoginResponseDto(String refreshToken) {
//        this.refreshToken = refreshToken;
//    }
//    public LoginResponseDto(String firstName, String lastName, String email) {
//        this.firstName = firstName;
//        this.lastName = lastName;
//        this.email = email;
//    }
}