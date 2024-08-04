package com.example.backend.repository;

import com.example.backend.model.User;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE (u.username LIKE %:keyword%) OR (u.email LIKE %:keyword%)")
    Page<User> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
