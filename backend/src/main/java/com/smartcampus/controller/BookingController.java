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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;

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
    public ResponseEntity<List<Booking>> getUserBookings(@AuthenticationPrincipal OAuth2User principal) {
        String userId = principal != null ? principal.getAttribute("email") : "testuser@student.com";
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id, @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal != null ? principal.getAttribute("email") : "testuser@student.com";
        Booking cancelledBooking = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(cancelledBooking);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id, 
            @Valid @RequestBody StatusUpdateRequest request, 
            @AuthenticationPrincipal OAuth2User principal) {
        
        String adminId = principal != null ? principal.getAttribute("email") : "admin@smartcampus.com";
        Booking updatedBooking = bookingService.updateBookingStatus(id, request.getStatus(), request.getRejectionReason(), adminId);
        return ResponseEntity.ok(updatedBooking);
    }
}
