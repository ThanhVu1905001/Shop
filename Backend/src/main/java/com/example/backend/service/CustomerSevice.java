package com.example.backend.service;

import com.example.backend.dto.OrderDTO;
import com.example.backend.event.OrderCreatedEvent;
import com.example.backend.event.OrderDeletedEvent;
import com.example.backend.helper.ExcelHelper;
import com.example.backend.model.Customer;
import com.example.backend.playload.request.CustomerFilterRequest;
import com.example.backend.repository.CustomerRepository;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CustomerSevice {
    private final CustomerRepository customerRepository;
    private final OrderService orderService;

    @Autowired
    public CustomerSevice(CustomerRepository customerRepository, OrderService orderService){
        this.customerRepository = customerRepository;
        this.orderService = orderService;
    }

    public Customer getCustomerById(Long id){
        return customerRepository.findById(id).orElse(null);
    }

    public Customer addCustomer(Customer customer){
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Customer customer){
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id){
        customerRepository.deleteById(id);
    }

    public Page<Customer> searchCustomerByKeyword(CustomerFilterRequest filter, Pageable pageable){
        Sort sort = Sort.by(Sort.Direction.ASC, "name");
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        return customerRepository.searchCustomerByKeyWord(filter.getFilter(), pageable);
    }

    public boolean isPhoneNumberExists(String phone){
        return customerRepository.existsByPhoneIgnoreCase(phone);
    }

    public boolean isEmailExists(String email){
        return customerRepository.existsByEmailIgnoreCase(email);
    }

    public Page<Customer> getAllCustomer(Pageable pageable){
        Sort sort =  Sort.by(Sort.Direction.DESC, "createdDate");
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        return customerRepository.findAll(pageable);
    }

    public void save(MultipartFile file){
        try{
            List<Customer> customers = ExcelHelper.excelToCustomers(file.getInputStream());
            customerRepository.saveAll(customers);
        } catch (IOException e) {
            throw new RuntimeException("fail to store excel data: " + e.getMessage());
        }
    }

    public ByteArrayInputStream load(){
        try{
            List<Customer> customers = customerRepository.findAll();

            ByteArrayInputStream in = ExcelHelper.customersToExcel(customers);

            return in;
        }catch (Exception e){
            throw new RuntimeException("Failed to load customer data: " + e.getMessage());
        }
    }
    @EventListener
    public void handleOrderCreatedEvent(OrderCreatedEvent event) {
        Long orderId = event.getOrderId();
        OrderDTO orderDTO = orderService.getOrderDetailByOrderId(orderId);

        if (orderDTO != null) {
            Customer customer = getCustomerById(orderDTO.getCustomerId());

            if (customer != null) {
                double newSpending = customer.getTotalSpending() + orderDTO.getTotalAmount();
                customer.setTotalSpending(newSpending);

                int newTotalOrders = customer.getTotalOrders() + 1;
                customer.setTotalOrders(newTotalOrders);

                Instant newMostRecentOrder = orderDTO.getCreatedDate();
                customer.setMostRecentOrder(newMostRecentOrder);

                updateCustomer(customer);
            }
        }
    }
    @EventListener
    public void handleOrderDeletedEvent(OrderDeletedEvent event) {
        Long orderId = event.getOrderId();
        OrderDTO orderDTO = orderService.getOrderDetailByOrderId(orderId);

        if (orderDTO != null) {
            Customer customer = getCustomerById(orderDTO.getCustomerId());

            if (customer != null) {
                double totalSpending = customer.getTotalSpending() - orderDTO.getTotalAmount();
                customer.setTotalSpending(totalSpending);

                int totalOrders = customer.getTotalOrders() - 1;
                customer.setTotalOrders(totalOrders);

                updateCustomer(customer);
            }
        }
    }
}
