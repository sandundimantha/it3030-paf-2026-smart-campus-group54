package com.smartcampus.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Abstraction for file storage operations.
 * The primary implementation is {@link com.smartcampus.service.impl.SupabaseStorageServiceImpl}
 * which stores files in Supabase Storage buckets.
 */
public interface FileStorageService {

    /**
     * Uploads a file to storage.
     * @param file The multipart file to upload.
     * @param path The destination path within the bucket (e.g., "incidents/image1.jpg").
     * @return The public URL of the uploaded file.
     */
    String uploadFile(MultipartFile file, String path);

    /**
     * Deletes a file from storage.
     * @param path The path of the file within the bucket.
     */
    void deleteFile(String path);

    /**
     * Generates the public URL for an existing file.
     * @param path The path of the file within the bucket.
     * @return The public URL string.
     */
    String getPublicUrl(String path);
}
