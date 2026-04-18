package com.smartcampus.dto;

import com.smartcampus.entity.AppUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String email;
    private String name;
    private String pictureUrl;
    private AppUser.UserRole role;
    private LocalDateTime createdAt;

    public static UserProfileResponse from(AppUser user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .pictureUrl(user.getPictureUrl())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
