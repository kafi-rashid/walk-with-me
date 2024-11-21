package com.walkwithme.backend.service;

import com.walkwithme.backend.dto.LoginRequestDto;
import com.walkwithme.backend.dto.LoginResponseDto;
import com.walkwithme.backend.dto.UserDto;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface AuthService {

    String register(UserDto userDto);

    LoginResponseDto login(LoginRequestDto loginRequestDto);


}
