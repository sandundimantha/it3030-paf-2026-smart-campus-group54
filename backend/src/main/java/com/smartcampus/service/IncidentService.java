package com.smartcampus.service;

import com.smartcampus.entity.Incident;
import com.smartcampus.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    @Transactional
    public Incident createIncident(String title, String description, String location, String userId, List<MultipartFile> images) {
        
        Incident incident = Incident.builder()
                .title(title)
                .description(description)
                .location(location)
                .reportedBy(userId)
                .status(Incident.IncidentStatus.OPEN)
                .build();

        if (images != null && !images.isEmpty()) {
            List<String> fileUrls = fileStorageService.saveFiles(images);
            if (fileUrls.size() > 0) incident.setImageUrl1(fileUrls.get(0));
            if (fileUrls.size() > 1) incident.setImageUrl2(fileUrls.get(1));
            if (fileUrls.size() > 2) incident.setImageUrl3(fileUrls.get(2));
        }

        return incidentRepository.save(incident);
    }

    @Transactional
    public Incident updateIncidentStatus(Long id, Incident.IncidentStatus status) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        
        incident.setStatus(status);
        incidentRepository.save(incident);
        
        notificationService.createNotification(
            incident.getReportedBy(),
            "Your incident ticket #" + id + " has been updated to status: " + status
        );
        
        return incident;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public List<Incident> getUserIncidents(String userId) {
        return incidentRepository.findByReportedBy(userId);
    }
}
