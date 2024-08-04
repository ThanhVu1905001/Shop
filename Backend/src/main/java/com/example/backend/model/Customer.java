package com.example.backend.model;

import com.example.backend.repository.CustomerRepository;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "customer",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = "phone"),
            @UniqueConstraint(columnNames = "email")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private long id;

        @Column(name = "code")
        private String code;

        @Column(name = "name")
        private String name;

        @Column(name = "address")
        private String address;

        @Column(name = "phone")
        @NotBlank(message = "Phone cannot be blank")
        private String phone;

        @Column(name = "email")
        @NotBlank(message = "Email cannot be blank")
        @Email
        private String email;

        @Column(name = "description")
        private String description;

        @Column(name = "total_spending")
        private double totalSpending = 0L;

        @Column(name = "total_orders")
        private int totalOrders = 0;

        @Column(name = "most_recent_order")
        private Instant mostRecentOrder;
//        public void generateCode(CustomerRepository customerRepository) {
//                Customer lastCustomer = customerRepository.findTopByCustomerByCreatedDateDesc();
//                if (lastCustomer != null) {
//                        String lastCustomerCode = lastCustomer.getCode();
//                        // Extract the numeric part of the code
//                        String numericPart = lastCustomerCode.substring(3);
//                        try {
//                                long numericValue = Long.parseLong(numericPart);
//                                this.code = "ORD" + String.format("%07d", numericValue + 1);
//                        } catch (NumberFormatException e) {
//                                // Handle parsing exception if necessary
//                                e.printStackTrace();
//                        }
//                } else {
//                        // No existing orders, start with 1
//                        this.code = "ORD0000001";
//                }
//        }
}
