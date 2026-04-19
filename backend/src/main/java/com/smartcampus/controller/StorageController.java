package com.smartcampus.controller;

import com.smartcampus.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/storage")
public class StorageController {

    private final FileStorageService storageService;

    public StorageController(FileStorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {
        
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String path = folder + "/" + fileName;
        
        String url = storageService.uploadFile(file, path);
        
        return ResponseEntity.ok(Map.of(
            "url", url,
            "path", path
        ));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteFile(@RequestParam("path") String path) {
        storageService.deleteFile(path);
        return ResponseEntity.noContent().build();
    }
}
