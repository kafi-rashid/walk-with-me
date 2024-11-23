//package com.walkwithme.backend.prepopulateddata;
//
//import com.walkwithme.backend.dto.RoleDto;
//import com.walkwithme.backend.dto.UserDto;
//import com.walkwithme.backend.model.Role;
//import com.walkwithme.backend.model.UserEntity;
//import com.walkwithme.backend.model.UserStatus;
//import com.walkwithme.backend.repository.RoleRepository;
//import com.walkwithme.backend.repository.UserRepository;
//import com.walkwithme.backend.service.UserService;
//import com.walkwithme.backend.service.impl.AuthServiceImpl;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.util.ArrayList;
//import java.util.Arrays;
//
//@Component
//public class DataLoader implements CommandLineRunner {
//    @Autowired
//    private  UserService userService;
//    @Autowired
//    private  UserRepository userRepository;
//    @Autowired
//    private  AuthServiceImpl authService;
//    @Autowired
//    private  RoleRepository roleRepository;
//
////    public DataLoader(UserService userService, AuthServiceImpl authService) {
////        this.userService = userService;
////        this.authService = authService;
////    }
//
//    @Override
//    public void run(String... args) {
//        Role adminRole = roleRepository.save(new Role(null, "ROLE_ADMIN")); // ID is auto-generated
//        Role sellerRole = roleRepository.save(new Role(null, "ROLE_SELLER"));
//        Role buyerRole = roleRepository.save(new Role(null, "ROLE_BUYER"));
//
//        UserDto admin = new UserDto();
//        admin.setEmail("admin");
//        admin.setPassword("admin"); // Encrypt the password in a real application
//        admin.setFirstName("Admin");
//        admin.setLastName("User");
//        admin.setStatus(UserStatus.APPROVED);
//        admin.setPhoneNumber("1234567890");
//        admin.setRoles(Arrays.asList(new RoleDto(adminRole.getId(), adminRole.getName())));
//
//        UserDto seller = new UserDto();
//        seller.setEmail("seller");
//        seller.setPassword("seller"); // Encrypt the password in a real application
//        seller.setFirstName("Seller");
//        seller.setLastName("User");
//        seller.setPhoneNumber("1234567890");
//        seller.setStatus(UserStatus.APPROVED);
//        seller.setRoles(Arrays.asList(new RoleDto(sellerRole.getId(), sellerRole.getName())));
//
//        UserDto buyer = new UserDto();
//        buyer.setEmail("buyer");
//        buyer.setPassword("buyer"); // Encrypt the password in a real application
//        buyer.setFirstName("Buyer");
//        buyer.setLastName("User");
//        buyer.setPhoneNumber("1234567890");
//        buyer.setStatus(UserStatus.APPROVED);
//        buyer.setRoles(Arrays.asList(new RoleDto(buyerRole.getId(), buyerRole.getName())));
//
//        authService.register(admin);
//        authService.register(seller);
//        authService.register(buyer);
//    }
//}