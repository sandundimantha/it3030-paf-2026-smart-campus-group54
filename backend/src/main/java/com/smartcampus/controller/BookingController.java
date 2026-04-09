package com.smartcampus.controller;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.entity.Booking;
import com.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return new ResponseEntity<>(booking, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        
        String statusStr = statusUpdate.get("status");
        String adminId = statusUpdate.get("adminId");
        String reason = statusUpdate.get("rejectionReason");

        Booking.BookingStatus status = Booking.BookingStatus.valueOf(statusStr.toUpperCase());
        Booking updated = bookingService.updateBookingStatus(id, status, adminId, reason);
        
        return ResponseEntity.ok(updated);
    }
}
