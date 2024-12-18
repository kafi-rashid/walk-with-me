package com.walkwithme.backend.service;

import com.walkwithme.backend.dto.UserDto;
import com.walkwithme.backend.model.UserEntity;

import java.util.List;

public interface UserService {
    List<UserDto> findAllPendingUser();
    List<UserDto> findAll();
    UserDto findById(Long id);
    UserDto update(Long id, UserDto userDto);
    String approve (List <Long>userIds);
    String reject (List <Long>userIds);
    String deleteById (Long id);
    List<UserDto> getUsersByRole(String role);

}
