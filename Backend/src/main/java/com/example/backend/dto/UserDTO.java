package com.example.backend.dto;

import com.example.backend.model.Role;
import java.util.Set;
import lombok.Data;

@Data
public class UserDTO {

    private Long id;
    private String username;
    private String email;
    private Set<Role.ERole> roles;

    public UserDTO(Long id, String username, String email, Set<Role.ERole> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }

    public UserDTO(){}
}
