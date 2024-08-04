package com.example.backend.model;

import com.example.backend.repository.OrderRepository;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<OrderDetail> orderDetails;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_order")
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "id_customer")
    @NotBlank(message = "Customer id cannot be blank")
    private Long customerId;

    @Column(name = "id_user")
    @NotBlank(message = "User id cannot be blank")
    private Long userId;

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Column(name = "notes")
    private String notes;

    @Column(name = "totalAmount")
    @NotBlank(message = "Total amount cannot be blank")
    private Double totalAmount;

    @Column(name = "create_date")
    @NotBlank(message = "Created date cannot be blank")
    private Instant createdDate;

    public void generateCode(OrderRepository orderRepository) {
        Order lastOrder = orderRepository.findTopByOrderByCreatedDateDesc();
        if (lastOrder != null) {
            String lastOrderCode = lastOrder.getCode();
            // Extract the numeric part of the code
            String numericPart = lastOrderCode.substring(3);
            try {
                long numericValue = Long.parseLong(numericPart);
                this.code = "ORD" + String.format("%07d", numericValue + 1);
            } catch (NumberFormatException e) {
                // Handle parsing exception if necessary
                e.printStackTrace();
            }
        } else {
            // No existing orders, start with 1
            this.code = "ORD0000001";
        }
    }
}
