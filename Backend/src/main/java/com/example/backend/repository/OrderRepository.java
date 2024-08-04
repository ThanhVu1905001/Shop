package com.example.backend.repository;

import com.example.backend.model.Order;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    Page<Order> findAll(Pageable pageable);
    List<Order> findByCustomerId(Long id);
    Order findTopByOrderByCreatedDateDesc();

}
