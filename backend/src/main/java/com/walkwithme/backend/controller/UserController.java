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
    @GetMapping("/")
    public List<UserDto> findAllUser()
    {
        return userService.findAll();
    }
    @GetMapping("/pending")
    public List<UserDto> findAllPendingUser()
    {
        return userService.findAllPendingUser();
    }
    @DeleteMapping("/{id}")
    public String deleById(@PathVariable Long id)
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
}
