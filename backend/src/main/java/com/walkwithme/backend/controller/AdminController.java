package com.walkwithme.backend.controller;

import com.walkwithme.backend.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserServiceImpl userService;

    @PutMapping("/approve-seller/{id}")
    public ResponseEntity<String> approveSeller(@PathVariable Long id) {
        return ResponseEntity.ok(userService.approveSeller(id));
    }

    @PutMapping("/reject-seller/{id}")
    public ResponseEntity<String> rejectSeller(@PathVariable Long id) {
        return ResponseEntity.ok(userService.rejectSeller(id));
    }

    @DeleteMapping("/delete-review/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deleteReview(id));
    }
}
