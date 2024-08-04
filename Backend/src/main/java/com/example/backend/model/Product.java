package com.example.backend.model;

import com.example.backend.repository.ProductRepository;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", unique = true, nullable = false)
    @NotBlank(message = "productCode cannot be blank")
    private String code;

    @Column(name = "name", nullable = false)
    @NotBlank(message = "nameProduct cannot be blank")
    private String name;

    @Column(name = "price", nullable = false)
    @NotBlank(message = "price cannot be blank")
    private BigDecimal price;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "on_hand", nullable = false)
    @NotBlank(message = "inventory cannot be blank")
    private int onHand;

    @Column(name = "traded")
    private int traded;

    @Column(name = "image")
    private String image;

    @Column(name = "available")
    private int available;

    @Column(name = "committed")
    private int committed;

    @Column(name = "create_date")
    private Instant createdDate;

    @Column(name = "update_date")
    private Instant updatedDate;

    public void generateCode(ProductRepository productRepository) {
        Product lastProduct = productRepository.findFirstByOrderByCreatedDateDesc();
        if (lastProduct != null) {
            String lastProductCode = lastProduct.getCode();
            // Extract the numeric part of the code
            String numericPart = lastProductCode.substring(3);
            try {
                long numericValue = Long.parseLong(numericPart);
                this.code = "PROD" + String.format("%07d", numericValue + 1);
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        } else {
            this.code = "PROD0000001";
        }
    }
}
