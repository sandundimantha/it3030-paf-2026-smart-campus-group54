package com.smartcampus.repository;

import com.smartcampus.entity.MaintenanceTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<MaintenanceTicket, Long> {
    List<MaintenanceTicket> findByReporterId(String reporterId);
    List<MaintenanceTicket> findByStatus(MaintenanceTicket.TicketStatus status);
}
