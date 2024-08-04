package com.example.backend.repository;

import com.example.backend.model.Customer;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query("SELECT c FROM Customer c WHERE (c.name LIKE %:keyword%) OR (c.phone LIKE %:keyword%) OR (c.email LIKE %:keyword%) OR (c.code LIKE %:keyword%)")
    Page<Customer> searchCustomerByKeyWord(@Param("keyword") String keyword, Pageable pageable);

    boolean existsByPhoneIgnoreCase(String phone);

    boolean existsByEmailIgnoreCase(String email);

//    Customer findTopByCustomerByCreatedDateDesc();
}
