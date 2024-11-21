package com.walkwithme.backend.service;

import com.walkwithme.backend.dto.UserDto;

import java.util.List;

public interface UserService {
    List<UserDto> findAllPendingUser();
    List<UserDto> findAll();
    String approve (List <Long>userIds);
    String reject (List <Long>userIds);
}
