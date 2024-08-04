package com.example.backend.controller;

import com.example.backend.dto.UserDTO;
import com.example.backend.exception.UserException;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.playload.request.SignupRequest;
import com.example.backend.playload.request.UserFilterRequest;
import com.example.backend.playload.response.MessageResponse;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    PasswordEncoder encoder;

    @PostMapping("/signup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
            encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(Role.ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin" -> {
                        Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                    }
                    case "customerService" -> {
                        Role customerServiceRole = roleRepository.findByName(Role.ERole.ROLE_CUSTOMERSERVICE)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(customerServiceRole);
                    }
                    case "seller" -> {
                        Role salerRole = roleRepository.findByName(Role.ERole.ROLE_SELLER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(salerRole);
                    }
                    case "warehouseStaff" -> {
                        Role warehouseStaffRole = roleRepository.findByName(Role.ERole.ROLE_WAREHOUSESTAFF)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(warehouseStaffRole);
                    }
                    default -> {
                        Role userRole = roleRepository.findByName(Role.ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                    }
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
    @GetMapping("{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        try {
            Optional<UserDTO> optionalUser = userService.getUserDtoById(userId);

            return optionalUser.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to get user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping()
    public ResponseEntity<?> searchUsersByKeyword(@Valid UserFilterRequest filter) {
        try {
            Pageable pageable = PageRequest.of(filter.getPage() - 1, filter.getPageSize());
            Page<UserDTO> userPage = userService.searchUsersByKeyword(filter.getKeyword(), pageable);
            HttpHeaders headers = new HttpHeaders();
            return new ResponseEntity<>(userPage, headers, HttpStatus.OK);
        } catch (UserException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to retrieve users: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody UserDTO userDto) {
        try {
            User updatedUser = userService.updateUser(userId, userDto);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
