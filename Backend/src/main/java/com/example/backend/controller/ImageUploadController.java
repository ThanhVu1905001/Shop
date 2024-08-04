package com.example.backend.controller;

import com.example.backend.service.ImageService;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/image")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ImageUploadController {

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload-image")
    public ResponseEntity<String> handleImageUpload(@RequestParam("file") MultipartFile file) {
        try {
            // Gọi service để xử lý lưu trữ ảnh
            String imageUrl = imageService.uploadImageToCloudinary(file);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to upload image");
        }
    }
}
