package com.smartcampus.service;

import com.smartcampus.dto.ResourceRequest;
import com.smartcampus.entity.Resource;
import java.util.List;

public interface ResourceService {
    Resource createResource(ResourceRequest request);
    List<Resource> getAllResources(String type, String location, String status, Integer minCapacity, Integer maxCapacity);
    Resource getResourceById(Long id);
    Resource updateResource(Long id, ResourceRequest request);
    void deleteResource(Long id);
}
