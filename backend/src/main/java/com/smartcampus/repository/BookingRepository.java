package com.smartcampus.repository;

import com.smartcampus.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
           "AND b.status != 'REJECTED' AND b.status != 'CANCELLED' " +
           "AND (:newStart < b.endTime AND :newEnd > b.startTime)")
    List<Booking> findOverlappingBookings(
            @Param("resourceId") Long resourceId,
            @Param("newStart") LocalDateTime newStart,
            @Param("newEnd") LocalDateTime newEnd
    );
}
