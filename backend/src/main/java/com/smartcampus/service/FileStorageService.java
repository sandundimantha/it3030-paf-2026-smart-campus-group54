package com.smartcampus.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final Path incidentUploadPath;

    public FileStorageService(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.incidentUploadPath = this.fileStorageLocation.resolve("incidents").normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
            Files.createDirectories(this.incidentUploadPath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = "";

        try {
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            fileExtension = extractSafeExtension(originalFileName);

            String fileName = UUID.randomUUID() + fileExtension;
            Path targetLocation = safeResolve(this.fileStorageLocation, fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public String saveFile(MultipartFile file) {
        try {
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null) {
                fileExtension = extractSafeExtension(originalFileName);
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Invalid file type. Only images are allowed.");
            }

            String fileName = UUID.randomUUID() + fileExtension;
            Path filePath = safeResolve(incidentUploadPath, fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/api/public/uploads/incidents/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public List<String> saveFiles(List<MultipartFile> files) {
        List<String> fileUrls = new ArrayList<>();
        if (files != null) {
            int fileLimit = Math.min(files.size(), 3);
            for (int i = 0; i < fileLimit; i++) {
                if (!files.get(i).isEmpty()) {
                    fileUrls.add(saveFile(files.get(i)));
                }
            }
        }
        return fileUrls;
    }

    private String extractSafeExtension(String originalFileName) {
        int lastDotIndex = originalFileName.lastIndexOf(".");
        if (lastDotIndex <= 0) {
            return "";
        }

        String extension = originalFileName.substring(lastDotIndex).toLowerCase();
        if (!extension.matches("\\.[a-z0-9]{1,10}")) {
            throw new RuntimeException("Invalid file extension.");
        }
        return extension;
    }

    private Path safeResolve(Path basePath, String fileName) {
        Path resolved = basePath.resolve(fileName).normalize();
        if (!resolved.startsWith(basePath)) {
            throw new RuntimeException("Invalid file path.");
        }
        return resolved;
    }
}
