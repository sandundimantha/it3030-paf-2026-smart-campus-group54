package com.smartcampus.controller;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.entity.Booking;
import com.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import com.smartcampus.dto.StatusUpdateRequest;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final com.smartcampus.repository.AppUserRepository appUserRepository;

    @Autowired
    public BookingController(BookingService bookingService, com.smartcampus.repository.AppUserRepository appUserRepository) {
        this.bookingService = bookingService;
        this.appUserRepository = appUserRepository;
    }

    private Long getAuthenticatedUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return null;
        return appUserRepository.findByEmail(auth.getName())
               .map(com.smartcampus.entity.AppUser::getId)
               .orElse(null);
    }

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
        Long userId = getAuthenticatedUserId(authentication);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id, Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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
