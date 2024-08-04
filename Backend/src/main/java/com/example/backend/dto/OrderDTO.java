package com.example.backend.dto;

import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private String code;
    private Long customerId;
    private Long userId;
    private Double totalAmount;
    private Instant createdDate;
    private List<OrderDetailDTO> orderDetails;
    private String notes;
}
