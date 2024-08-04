package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_order")
    @NotBlank(message = "Order id cannot be blank")
    private Order order;

    @JoinColumn(name = "id_product")
    @NotBlank(message = "Product id cannot be blank")
    private Long productId;

    @Column(name = "quantity")
    @NotBlank(message = "Quantity cannot be blank")
    private Integer onHand;

    @Column(name = "price")
    @NotBlank(message = "Unit price cannot be blank")
    private Double price;


    public OrderDetail(Order order, Long productId, Integer onHand, Double price) {
    }
}
