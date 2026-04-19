package com.smartcampus.controller;

import com.smartcampus.dto.ResourceRequest;
import com.smartcampus.entity.Resource;
import com.smartcampus.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    @Autowired
    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    public ResponseEntity<Resource> createResource(
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @Valid @RequestBody ResourceRequest request) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        Resource resource = resourceService.createResource(request);
        return new ResponseEntity<>(resource, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity) {
        return ResponseEntity.ok(resourceService.getAllResources(type, location, status, minCapacity, maxCapacity));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @PathVariable Long id, @Valid @RequestBody ResourceRequest request) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return ResponseEntity.ok(resourceService.updateResource(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @PathVariable Long id) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
