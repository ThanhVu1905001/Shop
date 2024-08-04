package com.example.backend.controller;

import com.example.backend.exception.CustomerException;
import com.example.backend.helper.ExcelHelper;
import com.example.backend.model.Customer;
import com.example.backend.playload.request.CustomerFilterRequest;
import com.example.backend.playload.response.MessageResponse;
import com.example.backend.service.CustomerSevice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/customers")
@CrossOrigin()
public class CustomerController {
    @Autowired
    private final CustomerSevice customerSevice;

    public CustomerController(CustomerSevice customerSevice) {
        this.customerSevice = customerSevice;
    }

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMERSERVICE') or hasRole('SELLER')")
    public ResponseEntity<String> addCustomer(@RequestBody Customer customer){
        try {
            if (customerSevice.isEmailExists(customer.getEmail())|| customerSevice.isPhoneNumberExists(
                customer.getPhone())){
                throw new CustomerException("Phone number or email already exists");
            }
            customerSevice.addCustomer(customer);
            return new ResponseEntity<>("Customer added successfully", HttpStatus.CREATED);
        }
        catch (Exception e){
            return new ResponseEntity<>("Failed to add customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMERSERVICE') or hasRole('SELLER')")
    public  ResponseEntity<String> updateCustomer(@PathVariable Long id, @RequestBody Customer customer){
        try{
            customer.setId(id);
            customerSevice.updateCustomer(customer);
            return new ResponseEntity<>("Customer updated successfully", HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("Failed to add customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMERSERVICE') or hasRole('SELLER')")
    public  ResponseEntity<String> deleteCustomer(@PathVariable Long id){
        try{
            customerSevice.deleteCustomer(id);
            return new ResponseEntity<>("Customer deleted successfully", HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("Failed to delete customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable Long id){
        try{
            Customer customer = customerSevice.getCustomerById(id);
            return new ResponseEntity<>(customer, HttpStatus.OK);
        }
        catch (CustomerException ex){
            return new ResponseEntity<>("No customer found with ID: " + id, HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>("Failed to retrieve customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping()
    public ResponseEntity<?> searchCustomersByKeyword(CustomerFilterRequest filter, @RequestParam(defaultValue = "0") int page){
        try{
            Pageable pageable = PageRequest.of(page, 5);
            Page<Customer> customers = customerSevice.searchCustomerByKeyword(filter, pageable);
            return new ResponseEntity<>(customers,HttpStatus.OK);
        }
        catch (CustomerException ex){
            return new ResponseEntity<>("No customer founded", HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>("Failed to retrieve customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllCustomer(@RequestParam(defaultValue = "0") int page){
        try{
            Pageable pageable = PageRequest.of(page, 5);
            Page<Customer> customers = customerSevice.getAllCustomer(pageable);
            return new ResponseEntity<>(customers, HttpStatus.OK);
        }
        catch (CustomerException ex){
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>("Failed to retrieve customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<MessageResponse> uploadFile(@RequestParam("file") MultipartFile file){
        String message = "";
        if(ExcelHelper.hasExcelFormat(file)){
            try{
                customerSevice.save(file);
                message = "Uploaded the file successfully: " + file.getOriginalFilename();
                return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse(message));
            } catch (Exception e){
                message = "Could not upload the file: " + file.getOriginalFilename() + "!" + e;
                return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new MessageResponse(message));
            }
        }

        message = "Please upload an excel file!";
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(message));
    }

    @GetMapping("/dowload")
    public  ResponseEntity<InputStreamResource> getfile(){
        String fileName = "customers.xlsx";
        InputStreamResource file = new InputStreamResource(customerSevice.load());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
            .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
            .body(file);
    }
}
