package com.walkwithme.backend.controller;

import com.walkwithme.backend.dto.LoginRequestDto;
import com.walkwithme.backend.dto.LoginResponseDto;
import com.walkwithme.backend.dto.UserDto;
import com.walkwithme.backend.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authenticate")
public class UserController {
    @Autowired
    private UserServiceImpl userService;
    @PostMapping("/register")
    public String register(@RequestBody  UserDto userDto)
    {
        return userService.register(userDto);
    }
    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody LoginRequestDto loginRequestDto)
    {
        return userService.login(loginRequestDto);
    }
    @GetMapping("/users")
    public List<UserDto> getAllSeller()
    {
        return userService.findAllByRoleName("Seller");
    }
}
