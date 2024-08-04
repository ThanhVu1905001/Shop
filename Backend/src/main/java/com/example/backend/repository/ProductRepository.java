package com.example.backend.repository;

import com.example.backend.model.Product;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE (p.name LIKE %:keyword%) OR (p.code LIKE %:keyword%)")
    Page<Product> searchProductByKeyword(@Param("keyword") String search, Pageable pageable);

    Page<Product> findAll(Pageable pageable);

    @Query("SELECT p FROM Product p ORDER BY p.committed DESC ")
    List<Product> getTopSellingProduct();

    Optional<Product> findByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);

    boolean existsByCodeIgnoreCase(String code);

    Product findFirstByOrderByCreatedDateDesc();
}
