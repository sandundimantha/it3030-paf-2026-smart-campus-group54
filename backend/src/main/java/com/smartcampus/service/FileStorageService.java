package com.smartcampus.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads/incidents/";

    public FileStorageService() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!");
        }
    }

    public String saveFile(MultipartFile file) {
        try {
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".")).toLowerCase();
            }

            // MIME-type validation — only image/* content types are accepted
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Invalid file type. Only images are allowed.");
            }

            // Generate a unique filename (prevents path traversal attacks)
            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), filePath);

            // Return relative path served from /api/public/uploads/
            return "/api/public/uploads/incidents/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public List<String> saveFiles(List<MultipartFile> files) {
        List<String> fileUrls = new ArrayList<>();
        if (files != null) {
            // Strictly limit to 3 images per incident (Module C requirement)
            int fileLimit = Math.min(files.size(), 3);
            for (int i = 0; i < fileLimit; i++) {
                if (!files.get(i).isEmpty()) {
                    fileUrls.add(saveFile(files.get(i)));
                }
            }
        }
        return fileUrls;
    }
}
