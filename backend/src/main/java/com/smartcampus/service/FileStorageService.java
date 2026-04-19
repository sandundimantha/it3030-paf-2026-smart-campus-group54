package com.smartcampus.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    /**
     * Stores a file and returns its public URL or unique file name.
     */
    String uploadFile(MultipartFile file, String path);

    /**
     * Deletes a file at the specified path.
     */
    void deleteFile(String path);

    /**
     * Returns the public URL for a file at the specified path.
     */
    String getPublicUrl(String path);

    /**
     * Legacy support for local storage implementation (if needed).
     * @deprecated Use uploadFile with a path instead.
     */
    @Deprecated
    default String storeFile(MultipartFile file) {
        return uploadFile(file, file.getOriginalFilename());
    }
}
