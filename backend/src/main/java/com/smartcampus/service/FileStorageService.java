package com.smartcampus.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

/**
 * Standard interface for file storage operations.
 * Implemented by local storage and cloud storage (Supabase).
 */
public interface FileStorageService {

    /**
     * Uploads a single file and returns its public URL.
     * @param file The file to upload.
     * @param path The destination path.
     * @return The public URL.
     */
    String uploadFile(MultipartFile file, String path);

    /**
     * Multi-upload helper.
     * @param files List of files to upload.
     * @return List of public URLs.
     */
    default List<String> uploadFiles(List<MultipartFile> files) {
        List<String> urls = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                String path = "incidents/" + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                urls.add(uploadFile(file, path));
            }
        }
        return urls;
    }

    /**
     * Deletes a file at the specified path.
     */
    void deleteFile(String path);

    /**
     * Returns the public URL for a file at the specified path.
     */
    String getPublicUrl(String path);
}
