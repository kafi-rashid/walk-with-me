package com.walkwithme.backend.controller;

import com.walkwithme.backend.dto.UserDto;
import com.walkwithme.backend.service.UserService;
import com.walkwithme.backend.service.impl.AuthServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping
    public List<UserDto> findAllUser()
    {
        return userService.findAll();
    }
    @GetMapping("/pending")
    public List<UserDto> findAllPendingUser()
    {
        return userService.findAllPendingUser();
    }

    @GetMapping("/{id}")
    public UserDto findById(@PathVariable Long id)
    {
        return userService.findById(id);
    }
    @PutMapping("/{id}")
    public UserDto update(@PathVariable Long id, @RequestBody  UserDto userDto)
    {
        return userService.update(id, userDto);
    }

    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable Long id)
    {
        return userService.deleteById(id);
    }
    @PostMapping("/approve")
    public  String approve(@RequestBody List<Long>userIds)
    {
        return userService.approve(userIds);
    }
    @PostMapping("/reject")
    public  String reject(@RequestBody List<Long>userIds)
    {
        return userService.reject(userIds);
    }

    @GetMapping("/role/{role}")
    public List<UserDto> getUsersByRole(@PathVariable String role) {
        return userService.getUsersByRole(role);
    }
}
