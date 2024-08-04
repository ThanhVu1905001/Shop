package com.example.backend.repository;

import com.example.backend.model.Role;
import com.example.backend.model.Role.ERole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(Role.ERole name);

}
