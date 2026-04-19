package com.smartcampus.dto;

import com.smartcampus.entity.AppUser;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleUpdateRequest {

    @NotNull(message = "Role must not be null")
    private AppUser.UserRole role;
}
