package com.smartcampus.service;

import com.smartcampus.dto.ResourceRequest;
import com.smartcampus.entity.Resource;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Autowired
    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Override
    public Resource createResource(ResourceRequest request) {
        Resource resource = new Resource();
        resource.setName(request.getName());
        resource.setType(request.getType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setAvailabilityWindows(request.getAvailabilityWindows());
        resource.setStatus(parseStatus(request.getStatus()));
        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getAllResources(String type, String location, String statusStr, Integer minCapacity, Integer maxCapacity) {
        Resource.ResourceStatus status = null;
        if (statusStr != null && !statusStr.trim().isEmpty()) {
            try {
                status = parseStatus(statusStr);
            } catch (Exception e) {}
        }
        return resourceRepository.findWithFilters(type, location, status, minCapacity, maxCapacity);
    }

    @Override
    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    @Override
    public Resource updateResource(Long id, ResourceRequest request) {
        Resource existing = getResourceById(id);
        existing.setName(request.getName());
        existing.setType(request.getType());
        existing.setCapacity(request.getCapacity());
        existing.setLocation(request.getLocation());
        existing.setAvailabilityWindows(request.getAvailabilityWindows());
        existing.setStatus(parseStatus(request.getStatus()));
        return resourceRepository.save(existing);
    }

    @Override
    public void deleteResource(Long id) {
        Resource existing = getResourceById(id);
        resourceRepository.delete(existing);
    }
    
    private Resource.ResourceStatus parseStatus(String status) {
        if (status == null) return Resource.ResourceStatus.ACTIVE;
        if (status.equalsIgnoreCase("Active") || status.equalsIgnoreCase("ACTIVE")) {
            return Resource.ResourceStatus.ACTIVE;
        }
        return Resource.ResourceStatus.OUT_OF_SERVICE;
    }
}
