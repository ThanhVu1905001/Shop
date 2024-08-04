package com.example.backend.service;

import com.example.backend.dto.OrderDTO;
import com.example.backend.dto.OrderDetailDTO;
import com.example.backend.event.OrderCreatedEvent;
import com.example.backend.event.OrderDeletedEvent;
import com.example.backend.model.Product;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import java.util.List;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    private final OrderService orderService;

    public ProductService(ProductRepository productRepository, OrderRepository orderRepository,
        OrderService orderService) {
        this.productRepository = productRepository;
        this.orderService = orderService;
    }

    public Page<Product> getAllProduct(Pageable pageable){
        Sort sort = Sort.by(Direction.DESC, "name");
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        return productRepository.findAll(pageable);
    }

    public Product addProduct(Product product){
        product.generateCode(productRepository);
        Product saveProduct = productRepository.save(product);
        return saveProduct;
    }

    public void updateProduct(Product product) {
        productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product findProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public List<Product> getTopSellingProducts() {
        return productRepository.getTopSellingProduct();
    }

    public boolean isCodeProductExists(String code) {
        return productRepository.existsByCodeIgnoreCase(code);
    }

    public boolean isCodeProductExistsOtherThanId(String code, Long productIdToExclude) {
        return productRepository.existsByCodeAndIdNot(code, productIdToExclude);
    }

    public Page<Product> searchProductsByKeyword(String keyword, Pageable pageable) {
        Sort sort = Sort.by(Sort.Direction.ASC, "name");
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        return productRepository.searchProductByKeyword(keyword, pageable);
    }

    private String generateCode() {
        long latestProductCount = productRepository.count();
        return "PRO" + String.format("%07d", latestProductCount + 1);
    }

    private void updateProductQuantityForCreateOrder(Long id, int quantity){
        Product product = productRepository.findById(id).orElse(null);
        int curOnHand = product.getOnHand();
        int curAvailable = product.getAvailable();
        int curCommitted = product.getCommitted();

        product.setOnHand(curOnHand - quantity);
        product.setAvailable(curAvailable - quantity);
        product.setCommitted(curCommitted + quantity);

        updateProduct(product);

    }

    private void updateProductQuantityForDeleteOrder(Long id, int quantity){
        Product product = productRepository.findById(id).orElse(null);
        int curOnHand = product.getOnHand();
        int curAvailable = product.getAvailable();
        int curCommitted = product.getCommitted();

        product.setOnHand(curOnHand + quantity);
        product.setAvailable(curAvailable + quantity);
        product.setCommitted(curCommitted - quantity);

        updateProduct(product);

    }

    @EventListener
    public void handleOrderCreatedEvent(OrderCreatedEvent event) {
        Long orderId = event.getOrderId();
        OrderDTO orderDTO = orderService.getOrderDetailByOrderId(orderId);

        System.out.println("Order Details:");

        if (orderDTO != null) {
            List<OrderDetailDTO> orderDetails = orderDTO.getOrderDetails();

            for (OrderDetailDTO orderDetailDTO : orderDetails) {
                updateProductQuantityForCreateOrder(orderDetailDTO.getProductId(), orderDetailDTO.getOnHand());
            }
        }
    }
    @EventListener
    public void handleOrderDeletedEvent(OrderDeletedEvent event) {
        Long orderId = event.getOrderId();
        OrderDTO orderDTO = orderService.getOrderDetailByOrderId(orderId);

        if (orderDTO != null) {
            List<OrderDetailDTO> orderDetails = orderDTO.getOrderDetails();

            for (OrderDetailDTO orderDetailDTO : orderDetails) {
                updateProductQuantityForDeleteOrder(orderDetailDTO.getProductId(), orderDetailDTO.getOnHand());
            }
        }
    }
}
