package com.smartcampus.dto;

import com.smartcampus.entity.Booking.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class StatusUpdateRequest {
    
    @NotNull(message = "Status cannot be null")
    private BookingStatus status;
    
    private String rejectionReason;

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
