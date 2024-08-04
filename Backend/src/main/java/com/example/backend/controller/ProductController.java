package com.example.backend.controller;

import com.example.backend.dto.ProductUpdateDTO;
import com.example.backend.exception.ProductException;
import com.example.backend.model.Product;
import com.example.backend.playload.request.ProductFilterRequest;
import com.example.backend.service.ProductService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/products")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN') or hasRole('WAREHOUSESTAFF')" )
    public ResponseEntity<String> addProduct(@RequestBody Product product) {
        try {
            if (productService.isCodeProductExists(product.getCode())) {
                throw new ProductException("Product code already exists");
            }
            product.setAvailable(product.getOnHand());
            productService.addProduct(product);
            return new ResponseEntity<>("Product added successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to add Product: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WAREHOUSESTAFF')" )
    public ResponseEntity<String> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            product.setId(id);
            Product curProduct = productService.findProductById(id);
            if (curProduct == null) {
                throw new ProductException("Product with ID " + id + " not found.");
            }else if (productService.isCodeProductExistsOtherThanId(product.getCode(), id)) {
                throw new ProductException("Product code already exists");
            }
            else{
                if(product.getImage() == null){
                    product.setImage(curProduct.getImage());
                }
                product.setAvailable(product.getOnHand());
                productService.updateProduct(product);
                return ResponseEntity.status(HttpStatus.OK).body("Product updated successfully.");
            }
        } catch (ProductException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WAREHOUSESTAFF')" )
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        try {
            if (productService.findProductById(id) == null) {
                throw new ProductException("Product with ID " + id + " not found.");
            }
            productService.deleteProduct(id);;
            return ResponseEntity.status(HttpStatus.OK).body("Product deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.findProductById(id);
            if(product == null){
                return new ResponseEntity<>("No product found with ID: " + id, HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.status(HttpStatus.OK).body(product);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error when getting product: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllProducts(@RequestParam(defaultValue = "0") int page ) {
        try {
            Pageable pageable = PageRequest.of(page, 5);
            Page<Product> products = productService.getAllProduct(pageable);
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (ProductException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error when getting products: " + e.getMessage());
        }
    }


    @GetMapping()
    public ResponseEntity<?> searchProductsByName(ProductFilterRequest filter) {
        try {
            System.out.println(filter);
            Pageable pageable = PageRequest.of(filter.getPage() - 1, filter.getPageSize());
            Page<Product> productPage = productService.searchProductsByKeyword(filter.getKeyword(), pageable);
            HttpHeaders headers = new HttpHeaders();
            return new ResponseEntity<>(productPage, headers, HttpStatus.OK);
        } catch (ProductException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to retrieve products: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateQuantities")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ROLE_WAREHOUSESTAFF')")
    public ResponseEntity<String> updateProductQuantities(@RequestBody List<ProductUpdateDTO> productsToUpdate) {
        try {
            for (ProductUpdateDTO productUpdate : productsToUpdate) {
                Long productId = productUpdate.getId();
                int quantity = productUpdate.getQuantity();

                Product product = productService.findProductById(productId);

                if (product == null) {
                    throw new ProductException("Product with ID " + productId + " not found.");
                }

                int newQuantity = product.getOnHand() + quantity;
                product.setOnHand(newQuantity);
                product.setAvailable(newQuantity);

                productService.updateProduct(product);
            }

            return ResponseEntity.status(HttpStatus.OK).body("Product quantities updated successfully.");
        } catch (ProductException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
