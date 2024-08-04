package com.example.backend.service;

import com.example.backend.dto.UserDTO;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    public Set<Role> getRoleFromStringSet(Set<String> roleNames){
        Set<Role> roles = new HashSet<>();
        roleNames.forEach(roleName -> {
            Optional<Role> optionalRole = roleRepository.findByName(Role.ERole.valueOf(roleName));
            optionalRole.ifPresent(roles::add);
        });
        return roles;
    }
    public Optional<UserDTO> getUserDtoById(Long userId) {
        return userRepository.findById(userId)
            .map(user -> new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
            ));
    }
    public User updateUser(Long userId, UserDTO userDto) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUsername(userDto.getUsername());
            user.setEmail(userDto.getEmail());

            Set<String> roleNames = userDto.getRoles().stream()
                .map(Role.ERole::name)
                .collect(Collectors.toSet());

            Set<Role> newRoles = getRoleFromStringSet(roleNames);
            user.getRoles().clear();
            user.getRoles().addAll(newRoles);

            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found with id: " + userId);
        }
    }
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    public Page<UserDTO> searchUsersByKeyword(String keyword, Pageable pageable) {
        Sort sort = Sort.by(Sort.Direction.ASC, "username");
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        return userRepository.searchByKeyword(keyword, pageable)
            .map(user -> new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())));
    }
}
