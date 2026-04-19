package com.smartcampus.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    /**
     * Uploads a file to Supabase Storage.
     * @param file The file to upload.
     * @param path The path within the bucket (e.g., "incidents/image1.jpg").
     * @return The public URL of the uploaded file.
     */
    String uploadFile(MultipartFile file, String path);

    /**
     * Deletes a file from Supabase Storage.
     * @param path The path within the bucket.
     */
    void deleteFile(String path);

    /**
     * Generates the public URL for a file.
     * @param path The path within the bucket.
     * @return The public URL.
     */
    String getPublicUrl(String path);
}
