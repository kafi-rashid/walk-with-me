package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.config.CustomUserDetailsService;
import com.walkwithme.backend.dto.LoginRequestDto;
import com.walkwithme.backend.dto.LoginResponseDto;
import com.walkwithme.backend.dto.UserDto;
import com.walkwithme.backend.model.Role;
import com.walkwithme.backend.model.UserEntity;
import com.walkwithme.backend.model.UserStatus;
import com.walkwithme.backend.repository.ReviewRepository;
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
import org.springframework.security.authentication.CachingUserDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ReviewRepository reviewRepository;


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
        try {
            if(loginRequestDto.getEmail()==null || loginRequestDto.getPassword()==null) {
                throw new BadCredentialsException("Invalid email or password");
            }

            UserEntity user = userRepository.findByEmail(loginRequestDto.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
//
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


        } catch (RuntimeException e) {
            throw new RuntimeException("Login failed: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred: " + e.getMessage());
        }
    }

    private List<String> mapRoles(List<Role> roles) {
        return roles.stream().map(role ->  (role.getName())).collect(Collectors.toList());
    }

    public List<UserDto> findAllByRoleName(String roleName) {
        return userRepository.findAllByRoleName(roleName)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    //Approve seller by admin

    public String approveSeller(Long sellerId) {
        UserEntity seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (!seller.getRoles().stream().anyMatch(role -> role.getName().equalsIgnoreCase("Seller"))) {
            throw new RuntimeException("User is not a seller");
        }

        seller.setStatus(UserStatus.APPROVED);
        userRepository.save(seller);
        return "Seller approved successfully";
    }

    //Reject Seller by admin

    public String rejectSeller(Long sellerId) {
        UserEntity seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (!seller.getRoles().stream().anyMatch(role -> role.getName().equalsIgnoreCase("Seller"))) {
            throw new RuntimeException("User is not a seller");
        }

        seller.setStatus(UserStatus.REJECTED);
        userRepository.save(seller);
        return "Seller rejected successfully";
    }

    public String deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new RuntimeException("Review not found");
        }
        reviewRepository.deleteById(reviewId);
        return "Review deleted successfully";
    }




    private UserDto convertToDto(UserEntity user) {
        return modelMapper.map(user, UserDto.class);
    }

    private UserEntity convertToEntity(UserDto userDto) {
        return modelMapper.map(userDto, UserEntity.class);
    }

}
