package com.example.backend.service;

import com.example.backend.dto.OrderDTO;
import com.example.backend.dto.OrderDetailDTO;
import com.example.backend.event.OrderCreatedEvent;
import com.example.backend.event.OrderDeletedEvent;
import com.example.backend.exception.OrderException;
import com.example.backend.model.Order;
import com.example.backend.model.OrderDetail;
import com.example.backend.playload.request.OrderFilterRequest;
import com.example.backend.repository.OrderDetailRepository;
import com.example.backend.repository.OrderRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @PersistenceContext
    private EntityManager entityManager;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

    public OrderService(EntityManager entityManager, OrderRepository orderRepository,
        OrderDetailRepository orderDetailRepository,
        ApplicationEventPublisher applicationEventPublisher) {
        this.entityManager = entityManager;
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "createDate")));
        return orders.map(this::mapOrderToOrderDTO);
    }

    public OrderDTO getOrderDetailByOrderId(Long orderId) {
        return orderRepository.findById(orderId)
            .map(this::mapOrderToOrderDTO)
            .orElse(null);
    }

    public Order createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setCustomerId(orderDTO.getCustomerId());
        order.setUserId(orderDTO.getUserId());
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setCreatedDate(orderDTO.getCreatedDate());
        order.setNotes(orderDTO.getNotes());

        List<OrderDetail> orderDetails = orderDTO.getOrderDetails().stream()
            .map(detailDTO -> new OrderDetail(order, detailDTO.getProductId(), detailDTO.getOnHand(), detailDTO.getPrice()))
            .collect(Collectors.toList());

        order.setOrderDetails(orderDetails);
        order.generateCode(orderRepository);

        Order savedOrder = orderRepository.save(order);
        orderDetailRepository.saveAll(orderDetails);
        applicationEventPublisher.publishEvent(new OrderCreatedEvent(this, savedOrder.getId()));

        return savedOrder;
    }

    private OrderDTO mapOrderToOrderDTO(Order order) {
        List<OrderDetailDTO> orderDetailDTOs = order.getOrderDetails().stream()
            .map(this::mapOrderDetailToOrderDetailDTO)
            .collect(Collectors.toList());

        return new OrderDTO(order.getCode(), order.getCustomerId(), order.getUserId(),
            order.getTotalAmount(), order.getCreatedDate(), orderDetailDTOs, order.getNotes());
    }

    private OrderDetailDTO mapOrderDetailToOrderDetailDTO(OrderDetail orderDetail) {
        return new OrderDetailDTO(orderDetail.getProductId(), orderDetail.getOnHand(), orderDetail.getPrice());
    }

    public void deleteOrder(Long orderId){
        try {
            Optional<Order> existingOrderOptional = orderRepository.findById(orderId);
            if (existingOrderOptional.isEmpty()) {
                throw new OrderException("Order not found with id " + orderId);
            }

            applicationEventPublisher.publishEvent(new OrderDeletedEvent(this, existingOrderOptional.get().getId()));

            Order existingOrder = existingOrderOptional.get();
            List<OrderDetail> orderDetails = existingOrder.getOrderDetails();

            orderDetailRepository.deleteAll(orderDetails);

            orderRepository.delete(existingOrder);

        } catch (DataIntegrityViolationException e) {
            System.out.println("DataIntegrityViolationException occurred: " + e.getMessage());
        } catch (OrderException e) {
            System.out.println("OrderException occurred: " + e.getMessage());
        }
    }

    public Page<Order> searchOrders(OrderFilterRequest filter, Pageable pageable){
        String searchPattern = "%" + filter.getFilter() + "%";

        String sql = "SELECT o.* FROM orders o " +
            "LEFT JOIN customers c ON o.id_customer = c.id " +
            "LEFT JOIN users u ON o.id_user = u.id " +
            "WHERE (c.name LIKE :searchPattern OR u.username LIKE :searchPattern OR o.code LIKE :searchPattern)";

        if(filter.getCreatedDate() != null){
            sql += " AND o.created_date = :createdDate";
        }

        if(filter.getSortAmountAscending() != null){
            sql += " ORDER BY o.total_amount " + (filter.getSortAmountAscending() ? "ASC" : "DESC");
        }

        Query query = entityManager.createNativeQuery(sql, Order.class);
        query.setParameter("searchPattern", searchPattern);

        if (filter.getCreatedDate() != null) {
            query.setParameter("createdDate", filter.getCreatedDate());
        }

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Order> orders = query.getResultList();

        Query countQuery = entityManager.createNativeQuery("SELECT count(*) FROM (" + sql + ") as result", Long.class);
        countQuery.setParameter("searchPattern", searchPattern);
        if (filter.getCreatedDate() != null) {
            countQuery.setParameter("createdDate", filter.getCreatedDate());
        }
        long total = (long) countQuery.getSingleResult();

        return new PageImpl<>(orders, pageable,total);
    }

    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
}
