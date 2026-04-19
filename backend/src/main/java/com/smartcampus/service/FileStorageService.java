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

/**
 * Local disk-based file storage service for incident image uploads.
 * Implements the FileStorageInterface for storage abstraction compatibility.
 * For cloud storage, see {@link com.smartcampus.service.impl.SupabaseStorageServiceImpl}.
 */
@Service
public class FileStorageService implements FileStorageInterface {

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

    // ── FileStorageInterface implementation ──────────────────────────────────

    @Override
    public String uploadFile(MultipartFile file, String path) {
        return saveFile(file);
    }

    @Override
    public void deleteFile(String path) {
        try {
            Path filePath = fileStorageLocation.resolve(path).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file: " + path, e);
        }
    }

    @Override
    public String getPublicUrl(String path) {
        return "/api/public/uploads/" + path;
    }

    // ── Core local storage methods ────────────────────────────────────────────

    public String storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        try {
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence: " + originalFileName);
            }
            String fileExtension = extractSafeExtension(originalFileName);
            String fileName = UUID.randomUUID() + fileExtension;
            Path targetLocation = safeResolve(this.fileStorageLocation, fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName, ex);
        }
    }

    public String saveFile(MultipartFile file) {
        try {
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null) {
                fileExtension = extractSafeExtension(originalFileName);
            }
            // MIME-type validation — only image/* accepted
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
            // Limit to 3 files per incident (Module C requirement)
            int fileLimit = Math.min(files.size(), 3);
            for (int i = 0; i < fileLimit; i++) {
                if (!files.get(i).isEmpty()) {
                    fileUrls.add(saveFile(files.get(i)));
                }
            }
        }
        return fileUrls;
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private String extractSafeExtension(String originalFileName) {
        int lastDotIndex = originalFileName.lastIndexOf(".");
        if (lastDotIndex <= 0) return "";
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
