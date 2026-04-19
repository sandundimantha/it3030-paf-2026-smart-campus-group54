package com.smartcampus.controller;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.entity.Booking;
import com.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.smartcampus.dto.StatusUpdateRequest;
import org.springframework.security.core.Authentication;

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

    @GetMapping("/user")
    public ResponseEntity<List<Booking>> getUserBookings(Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : "testuser@student.com";
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id, Authentication authentication) {
        String userId = authentication.getName();
        Booking cancelledBooking = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(cancelledBooking);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id, 
            @Valid @RequestBody StatusUpdateRequest request, 
            Authentication authentication) {
        
        String adminId = authentication.getName();
        Booking updatedBooking = bookingService.updateBookingStatus(id, request.getStatus(), request.getRejectionReason(), adminId);
        return ResponseEntity.ok(updatedBooking);
    }
}
