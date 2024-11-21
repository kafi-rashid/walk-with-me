package com.walkwithme.backend.controller;

import com.walkwithme.backend.dto.LoginRequestDto;
import com.walkwithme.backend.dto.LoginResponseDto;
import com.walkwithme.backend.dto.UserDto;
import com.walkwithme.backend.service.impl.AuthServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/authenticate")
public class AuthController {
    @Autowired
    private AuthServiceImpl authService;
    @PostMapping("/register")
    public String register(@RequestBody  UserDto userDto)
    {
        return authService.register(userDto);
    }
    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody LoginRequestDto loginRequestDto)
    {
        return authService.login(loginRequestDto);
    }
}
