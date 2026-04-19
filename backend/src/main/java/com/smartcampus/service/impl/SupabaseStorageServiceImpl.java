package com.smartcampus.service.impl;

import com.smartcampus.service.FileStorageInterface;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;

@Service("supabaseStorageService")
public class SupabaseStorageServiceImpl implements FileStorageInterface {

    private final WebClient webClient;
    private final String bucketName;
    private final String supabaseUrl;
    private final String serviceRoleKey;

    public SupabaseStorageServiceImpl(
            WebClient webClient,
            @Value("${supabase.storage.bucket}") String bucketName,
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.service-role-key}") String serviceRoleKey) {
        this.webClient = webClient;
        this.bucketName = bucketName;
        this.supabaseUrl = supabaseUrl;
        this.serviceRoleKey = serviceRoleKey;
    }

    @Override
    public String uploadFile(MultipartFile file, String path) {
        try {
            byte[] fileBytes = file.getBytes();
            
            webClient.post()
                    .uri("/object/{bucket}/{path}", bucketName, path)
                    .header("Authorization", "Bearer " + serviceRoleKey) // Use service role for bypass RLS
                    .contentType(MediaType.parseMediaType(file.getContentType()))
                    .bodyValue(fileBytes)
                    .retrieve()
                    .onStatus(status -> status.isError(), response -> 
                        response.bodyToMono(String.class)
                                .flatMap(error -> Mono.error(new RuntimeException("Upload failed: " + error)))
                    )
                    .toBodilessEntity()
                    .block();

            return getPublicUrl(path);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file bytes", e);
        }
    }

    @Override
    public void deleteFile(String path) {
        webClient.delete()
                .uri("/object/{bucket}/{path}", bucketName, path)
                .header("Authorization", "Bearer " + serviceRoleKey)
                .retrieve()
                .onStatus(status -> status.isError(), response -> 
                    response.bodyToMono(String.class)
                            .flatMap(error -> Mono.error(new RuntimeException("Delete failed: " + error)))
                )
                .toBodilessEntity()
                .block();
    }

    @Override
    public String getPublicUrl(String path) {
        return String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, bucketName, path);
    }
}
