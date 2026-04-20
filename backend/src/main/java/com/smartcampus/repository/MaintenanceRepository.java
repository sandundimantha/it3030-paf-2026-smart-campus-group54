package com.smartcampus.repository;

import com.smartcampus.entity.MaintenanceTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<MaintenanceTicket, Long> {
    List<MaintenanceTicket> findByReporterIdOrderByCreatedAtDesc(Long reporterId);
    List<MaintenanceTicket> findByStatusOrderByCreatedAtDesc(MaintenanceTicket.TicketStatus status);
    
    @Query("SELECT t FROM MaintenanceTicket t ORDER BY t.createdAt DESC")
    List<MaintenanceTicket> findAllSorted();
}
