package com.smartcampus.service;

import com.smartcampus.entity.MaintenanceImage;
import com.smartcampus.entity.MaintenanceTicket;
import com.smartcampus.repository.MaintenanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public MaintenanceTicket createTicket(MaintenanceTicket ticket, List<MultipartFile> images) {
        ticket.setStatus(MaintenanceTicket.TicketStatus.PENDING);
        
        if (images != null && !images.isEmpty()) {
            List<MaintenanceImage> maintenanceImages = images.stream()
                    .filter(file -> !file.isEmpty())
                    .limit(3) // Cap at 3 images as per requirement
                    .map(file -> {
                        String fileName = fileStorageService.storeFile(file);
                        return MaintenanceImage.builder()
                                .imageUrl(fileName)
                                .ticket(ticket)
                                .build();
                    })
                    .collect(Collectors.toList());
            ticket.setImages(maintenanceImages);
        }

        return maintenanceRepository.save(ticket);
    }

    public List<MaintenanceTicket> getAllTickets() {
        return maintenanceRepository.findAll();
    }

    public MaintenanceTicket getTicketById(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    @Transactional
    public MaintenanceTicket updateStatus(Long id, MaintenanceTicket.TicketStatus status) {
        MaintenanceTicket ticket = getTicketById(id);
        ticket.setStatus(status);
        
        if (status == MaintenanceTicket.TicketStatus.RESOLVED) {
            ticket.setResolvedAt(java.time.LocalDateTime.now());
        }
        
        return maintenanceRepository.save(ticket);
    }

    @Transactional
    public MaintenanceTicket assignTechnician(Long id, String technicianId) {
        MaintenanceTicket ticket = getTicketById(id);
        ticket.setTechnicianId(technicianId);
        ticket.setStatus(MaintenanceTicket.TicketStatus.IN_PROGRESS);
        return maintenanceRepository.save(ticket);
    }
}
