package com.smartcampus.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Interface for file storage operations.
 * Implemented by:
 * - {@link FileStorageService} (local disk storage)
 * - {@link com.smartcampus.service.impl.SupabaseStorageServiceImpl} (cloud storage)
 */
public interface FileStorageInterface {

    /**
     * Uploads a file to storage.
     * @param file The multipart file to upload.
     * @param path The destination path (e.g., "incidents/image1.jpg").
     * @return The public URL of the uploaded file.
     */
    String uploadFile(MultipartFile file, String path);

    /**
     * Deletes a file from storage.
     * @param path The path of the file to delete.
     */
    void deleteFile(String path);

    /**
     * Generates the public URL for an existing file.
     * @param path The file path.
     * @return The public URL string.
     */
    String getPublicUrl(String path);
}
