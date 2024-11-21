package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.config.CustomUserDetailsService;
import com.walkwithme.backend.dto.LoginRequestDto;
import com.walkwithme.backend.dto.LoginResponseDto;
import com.walkwithme.backend.dto.UserDto;
import com.walkwithme.backend.model.Role;
import com.walkwithme.backend.model.UserEntity;
import com.walkwithme.backend.model.UserStatus;
import com.walkwithme.backend.repository.RoleRepository;
import com.walkwithme.backend.repository.UserRepository;
import com.walkwithme.backend.service.AuthService;
import com.walkwithme.backend.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private  JwtTokenUtil jwtUtil;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    public String register(UserDto userDto) {
        try {
            UserEntity user = modelMapper.map(userDto, UserEntity.class);
            if (user.getRoles().stream().anyMatch(role -> "seller".equalsIgnoreCase(role.getName()))) {
                user.setStatus(UserStatus.PENDING);
            } else {
                user.setStatus(UserStatus.APPROVED);
            }
            user.setIsActive(true);
            String hashedPassword = passwordEncoder.encode(userDto.getPassword());
            user.setPassword(hashedPassword);
            user.setCreatedBy(user.getEmail());
            user.setCreatedDateTime(LocalDateTime.now());

            List<Role> roles = userDto.getRoles().stream()
                    .map(roleDto -> {
                        String roleName = roleDto.getName().toLowerCase();
                        return roleRepository.findAll().stream()
                                .filter(existingRole -> existingRole.getName().toLowerCase().equals(roleName))
                                .findFirst()
                                .orElseGet(() -> {
                                    Role newRole = new Role();
                                    newRole.setName(roleName);
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
        try {
            if(loginRequestDto.getEmail()==null || loginRequestDto.getPassword()==null) {
                throw new BadCredentialsException("Null email or password");
            }

            UserEntity user = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
            if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
            String refreshToken = jwtUtil.generateToken(userDetails);
           List<String>roles =  mapRoles(user.getRoles());
            return new LoginResponseDto(
                    user.getId(),
                    refreshToken,
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    roles
            );
//            return new LoginResponseDto();

        } catch (RuntimeException e) {
            throw new RuntimeException("Login failed: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred: " + e.getMessage());
        }
    }

    private List<String> mapRoles(List<Role> roles) {
        return roles.stream().map(role ->  (role.getName())).collect(Collectors.toList());
    }


//
//
//    private UserDto convertToDto(UserEntity user) {
//        return modelMapper.map(user, UserDto.class);
//    }
//
//    private UserEntity convertToEntity(UserDto userDto) {
//        return modelMapper.map(userDto, UserEntity.class);
//    }

}
