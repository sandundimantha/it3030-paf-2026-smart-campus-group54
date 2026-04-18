package com.smartcampus.repository;

import com.smartcampus.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByReporterId(String reporterId);
    List<Incident> findByTechnicianId(String technicianId);
    List<Incident> findByStatus(Incident.IncidentStatus status);
}
