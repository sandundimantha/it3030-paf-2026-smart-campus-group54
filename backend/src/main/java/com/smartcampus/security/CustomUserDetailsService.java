package com.smartcampus.security;

import com.smartcampus.entity.AppUser;
import com.smartcampus.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Custom UserDetailsService for form-based (email/password) authentication.
 * Loads users from the app_users table using their email address.
 *
 * OAuth2 login is handled separately by CustomOAuth2UserService (kept for reference).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Login attempt with unknown email: {}", email);
                    return new UsernameNotFoundException("No user found with email: " + email);
                });

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new UsernameNotFoundException(
                "User '" + email + "' has no password set. Please use OAuth2 login or reset your password."
            );
        }

        String role = "ROLE_" + user.getRole().name(); // e.g., "ROLE_USER" or "ROLE_ADMIN"

        log.info("Authenticating user: {} with role: {}", email, role);

        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword()) // Already BCrypt encoded in DB
                .authorities(List.of(new SimpleGrantedAuthority(role)))
                .build();
    }
}
