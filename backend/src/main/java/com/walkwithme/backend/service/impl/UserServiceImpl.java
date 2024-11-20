package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.dto.LoginRequestDto;
import com.walkwithme.backend.dto.LoginResponseDto;
import com.walkwithme.backend.dto.UserDto;
import com.walkwithme.backend.model.Role;
import com.walkwithme.backend.model.UserEntity;
import com.walkwithme.backend.repository.RoleRepository;
import com.walkwithme.backend.repository.UserRepository;
import com.walkwithme.backend.service.UserService;
import com.walkwithme.backend.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private RoleRepository roleRepository;

    private final JwtTokenUtil jwtUtil;

    public String register(UserDto userDto) {
        try {
            UserEntity user = modelMapper.map(userDto, UserEntity.class);
            String hashedPassword = passwordEncoder.encode(userDto.getPassword());
            user.setPassword(hashedPassword);

            List<Role> roles = userDto.getRoles().stream()
                    .map(roleDto -> {
                        return roleRepository.findByName(roleDto.getName())
                                .orElseGet(() -> {
                                    Role newRole = new Role();
                                    newRole.setName(roleDto.getName());
                                    return roleRepository.save(newRole);
                                });
                    })
                    .collect(Collectors.toList());

            user.setRoles(roles);
            userRepository.save(user);
            return "User registered successfully";
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("User with this email already exists"+e);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred");
        }
    }



    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        UserEntity user = userRepository.findByEmail(loginRequestDto.getEmail()).orElse(null);
        Authentication result = null;
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        try {
            result = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException(e.getMessage());
        }

        final String refreshToken = jwtUtil.generateRefreshToken(loginRequestDto.getEmail());
        return new LoginResponseDto(
                refreshToken,
                user.getId(),
                user.getFirstName(),
                user.getLastName()
        );
    }
    public List<UserDto> findAllByRoleName(String roleName) {
        return userRepository.findAllByRoleName(roleName)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


    private UserDto convertToDto(UserEntity user) {
        return modelMapper.map(user, UserDto.class);
    }

    private UserEntity convertToEntity(UserDto userDto) {
        return modelMapper.map(userDto, UserEntity.class);
    }

}
