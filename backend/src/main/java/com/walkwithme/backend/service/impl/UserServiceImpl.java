package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.dto.UserDto;
import com.walkwithme.backend.model.UserEntity;
import com.walkwithme.backend.model.UserStatus;
import com.walkwithme.backend.repository.UserRepository;
import com.walkwithme.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
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



    private UserDto convertToDto(UserEntity user) {
        return modelMapper.map(user, UserDto.class);
    }

    private UserEntity convertToEntity(UserDto userDto) {
        return modelMapper.map(userDto, UserEntity.class);
    }


}
