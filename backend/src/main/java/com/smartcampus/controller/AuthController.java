package com.smartcampus.controller;

import com.smartcampus.entity.AppUser;
import com.smartcampus.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;
import java.util.Optional;

/**
 * Handles form-based auth: register, login, current user info.
 *
 * NOTE: OAuth2 login endpoints are preserved in SecurityConfig (commented out).
 * If OAuth2 is re-enabled, this controller works alongside it.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    /**
     * POST /api/auth/register
     * Registers a new user with email and password.
     * Body: { "email": "...", "name": "...", "password": "..." }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String name = body.get("name");
        String rawPassword = body.get("password");

        if (email == null || rawPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        if (appUserRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "An account with this email already exists"));
        }

        AppUser newUser = AppUser.builder()
                .email(email)
                .name(name != null ? name : email.split("@")[0]) // Default name from email prefix
                .password(passwordEncoder.encode(rawPassword))   // BCrypt encode before saving
                .role(AppUser.UserRole.USER)
                .build();

        appUserRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Registration successful. Please log in.", "email", email));
    }

    /**
     * POST /api/auth/login
     * Spring Security's formLogin intercepts this automatically.
     * This endpoint is just a fallback for direct API calls (e.g., from React with Axios).
     * Body: { "username": "email@...", "password": "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest request, HttpServletResponse response) {
        String email = body.get("username"); // Spring Security uses 'username' field
        String password = body.get("password");

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            // Fetch full user profile to return
            Optional<AppUser> user = appUserRepository.findByEmail(email);
            if (user.isPresent()) {
                AppUser u = user.get();
                return ResponseEntity.ok(Map.of(
                        "id", u.getId(),
                        "email", u.getEmail(),
                        "name", u.getName() != null ? u.getName() : "",
                        "role", u.getRole().name(),
                        "message", "Login successful"
                ));
            }
            return ResponseEntity.ok(Map.of("message", "Login successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        }
    }

    /**
     * GET /api/auth/me
     * Returns the currently authenticated user's profile.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        String email = authentication.getName();
        return appUserRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "name", user.getName() != null ? user.getName() : "",
                        "role", user.getRole().name(),
                        "pictureUrl", user.getPictureUrl() != null ? user.getPictureUrl() : ""
                )))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User profile not found")));
    }
}
