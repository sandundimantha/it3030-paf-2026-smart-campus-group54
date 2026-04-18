package com.smartcampus.service;

import com.smartcampus.dto.UserProfileResponse;
import com.smartcampus.entity.AppUser;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final AppUserRepository appUserRepository;

    /**
     * Function 4: Get my own profile (by OAuth2 email)
     */
    public UserProfileResponse getMyProfile(String email) {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserProfileResponse.from(user);
    }

    /**
     * Function 4: Admin - get all users
     */
    public List<UserProfileResponse> getAllUsers() {
        return appUserRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(UserProfileResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Function 4: Admin - update a user's role
     */
    @Transactional
    public UserProfileResponse updateUserRole(Long userId, AppUser.UserRole newRole) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        log.info("Updating role for user {} from {} to {}", user.getEmail(), user.getRole(), newRole);
        user.setRole(newRole);
        AppUser saved = appUserRepository.save(user);
        return UserProfileResponse.from(saved);
    }
}
