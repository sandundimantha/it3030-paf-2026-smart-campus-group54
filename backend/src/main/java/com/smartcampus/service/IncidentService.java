package com.smartcampus.service;

import com.smartcampus.entity.Incident;
import com.smartcampus.entity.IncidentImage;
import com.smartcampus.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public Incident createIncident(Incident incident, List<MultipartFile> images) {
        incident.setStatus(Incident.IncidentStatus.OPEN);
        
        if (images != null && !images.isEmpty()) {
            List<IncidentImage> incidentImages = images.stream()
                    .map(file -> {
                        String fileName = fileStorageService.storeFile(file);
                        return IncidentImage.builder()
                                .imageUrl(fileName)
                                .incident(incident)
                                .build();
                    })
                    .collect(Collectors.toList());
            incident.setImages(incidentImages);
        }

        return incidentRepository.save(incident);
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));
    }

    public List<Incident> getIncidentsByReporter(String reporterId) {
        return incidentRepository.findByReporterId(reporterId);
    }

    @Transactional
    public Incident updateStatus(Long id, Incident.IncidentStatus status) {
        Incident incident = getIncidentById(id);
        incident.setStatus(status);
        return incidentRepository.save(incident);
    }

    @Transactional
    public Incident assignTechnician(Long id, String technicianId) {
        Incident incident = getIncidentById(id);
        incident.setTechnicianId(technicianId);
        incident.setStatus(Incident.IncidentStatus.IN_PROGRESS);
        return incidentRepository.save(incident);
    }
}
