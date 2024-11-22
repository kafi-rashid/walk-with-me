package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.dto.UserDto;
import com.walkwithme.backend.model.Address;
import com.walkwithme.backend.model.Role;
import com.walkwithme.backend.model.UserEntity;
import com.walkwithme.backend.model.UserStatus;
import com.walkwithme.backend.repository.ReviewRepository;
import com.walkwithme.backend.repository.UserRepository;
import com.walkwithme.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Override
    public List<UserDto> findAllPendingUser() {
        return userRepository.findAllPendingUser(UserStatus.PENDING)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    //    @Override
//    public String approve(List<Long> userIds) {
//        try {
//            List<UserEntity> approvedUsers = userIds.stream()
//                    .map(userId -> userRepository.findById(userId)
//                            .orElseThrow(() -> new IllegalArgumentException("User ID " + userId + " not found")))
//                    .peek(user -> user.setStatus(UserStatus.APPROVED))
//                    .collect(Collectors.toList());
//
//            userRepository.saveAll(approvedUsers);
//            return "All users approved successfully.";
//        } catch (Exception e) {
//            return "Approval process failed: " + e.getMessage();
//        }
//    }

    @Override
    public List<UserDto> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto findById(Long id) {
        Optional<UserEntity> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            return convertToDto(userOptional.get());
        } else {
            throw new IllegalArgumentException("User ID " + id + " not found");
        }
    }

    @Override
    public UserDto update(Long id, UserDto userDto) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        modelMapper.map(userDto, user);

        if (userDto.getShippingAddress() != null) {
            System.out.println(userDto.getShippingAddress().getPostalCode()+"Prianka post");
            Address shippingAddress = modelMapper.map(userDto.getShippingAddress(), Address.class);
            user.setShippingAddress(shippingAddress);
        }

        if (userDto.getBillingAddress() != null) {
            System.out.println(userDto.getShippingAddress().getPostalCode()+"Prianka post");
            Address billingAddress = modelMapper.map(userDto.getBillingAddress(), Address.class);
            user.setBillingAddress(billingAddress);
        }

        if (userDto.getRoles() != null) {
            List<Role> roles = userDto.getRoles().stream()
                    .map(roleDto -> modelMapper.map(roleDto, Role.class))
                    .collect(Collectors.toList());
            user.setRoles(roles);
        }

        UserEntity updatedUser = userRepository.save(user);

        return modelMapper.map(updatedUser, UserDto.class);
    }

    @Override
    public String approve(List<Long> userIds) {
        List<UserEntity> approvedUsers = new ArrayList<>();
        StringBuilder errorMessages = new StringBuilder();

        for (Long userId : userIds) {
            try {
                UserEntity userEntity = userRepository.findById(userId)
                        .orElseThrow(() -> new IllegalArgumentException("User ID " + userId + " not found"));

                userEntity.setStatus(UserStatus.APPROVED);
                approvedUsers.add(userEntity);
            } catch (Exception e) {
                errorMessages.append("Failed to approve User ID ").append(userId).append(": ").append(e.getMessage()).append("\n");
            }
        }

        if (!approvedUsers.isEmpty()) {
            userRepository.saveAll(approvedUsers);
        }

        return errorMessages.length() > 0
                ? "Some approvals failed:\n" + errorMessages.toString()
                : "All users approved successfully.";
    }
    @Override
    public String reject(List<Long> userIds) {
        List<UserEntity> approvedUsers = new ArrayList<>();
        StringBuilder errorMessages = new StringBuilder();

        for (Long userId : userIds) {
            try {
                UserEntity userEntity = userRepository.findById(userId)
                        .orElseThrow(() -> new IllegalArgumentException("User ID " + userId + " not found"));

                userEntity.setStatus(UserStatus.REJECTED);
                approvedUsers.add(userEntity);
            } catch (Exception e) {
                errorMessages.append("Failed to reject User ID ").append(userId).append(": ").append(e.getMessage()).append("\n");
            }
        }

        if (!approvedUsers.isEmpty()) {
            userRepository.saveAll(approvedUsers);
        }

        return errorMessages.length() > 0
                ? "Some rejects failed:\n" + errorMessages.toString()
                : "All users rejects successfully.";
    }

    @Override
    public String deleteById(Long id) {
        try {
            userRepository.deleteById(id);
            return "User with ID " + id + " has been deleted successfully.";
        } catch (Exception e) {
            return "Failed to delete user with ID " + id + ": " + e.getMessage();
        }
    }

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

    public List<UserDto> getUsersByRole(String role) {
        return userRepository.findByRoleName(role.toLowerCase())
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
