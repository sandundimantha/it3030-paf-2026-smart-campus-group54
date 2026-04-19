package com.smartcampus.service;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.entity.Booking;
import com.smartcampus.entity.Resource;
import com.smartcampus.exception.BookingConflictException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    @Transactional
    public Booking createBooking(BookingRequest request) {
        // 1. Check if resource exists
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Resource not found with ID: " + request.getResourceId()));

        // 2. Status Validation: Check if resource is ACTIVE
        if (resource.getStatus() != Resource.ResourceStatus.ACTIVE) {
            throw new BookingConflictException(
                    "Resource is currently " + resource.getStatus() + " and cannot be booked.");
        }

        // 3. Logic Validation: Check for end time after start time
        if (request.getEndTime().isBefore(request.getStartTime())
                || request.getEndTime().isEqual(request.getStartTime())) {
            throw new BookingConflictException("End time must be after start time.");
        }

        // 4. Time Validation: Prevent booking in the past
        if (request.getStartTime().isBefore(LocalDateTime.now())) {
            throw new BookingConflictException("Cannot create a booking for a past date/time.");
        }

        // 5. Advanced Conflict Detection: Check for overlapping ranges
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                request.getResourceId(),
                request.getStartTime(),
                request.getEndTime());

        if (!overlapping.isEmpty()) {
            throw new BookingConflictException("Resource is already booked for the requested time range.");
        }

        // 5. Create PENDING booking
        Booking booking = Booking.builder()
                .resourceId(request.getResourceId())
                .userId(request.getUserId())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(Booking.BookingStatus.PENDING)
                .build();

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Transactional
    public Booking cancelBooking(Long id, String userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (!booking.getUserId().equals(userId)) {
            throw new BookingConflictException("You cannot cancel a booking that does not belong to you.");
        }

        if (booking.getStatus() != Booking.BookingStatus.PENDING && booking.getStatus() != Booking.BookingStatus.APPROVED) {
            throw new BookingConflictException("Only pending or approved bookings can be cancelled.");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBookingStatus(Long id, Booking.BookingStatus status, String rejectionReason, String adminId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BookingConflictException("Only pending bookings can be approved or rejected.");
        }

        booking.setStatus(status);
        if (status == Booking.BookingStatus.REJECTED) {
            booking.setRejectionReason(rejectionReason);
            notificationService.createNotification(booking.getUserId(), "Your booking for resource " + booking.getResourceId() + " was REJECTED. Reason: " + rejectionReason);
        } else if (status == Booking.BookingStatus.APPROVED) {
            notificationService.createNotification(booking.getUserId(), "Your booking for resource " + booking.getResourceId() + " was APPROVED.");
        }
        booking.setApprovedBy(adminId);

        return bookingRepository.save(booking);
    }
}
