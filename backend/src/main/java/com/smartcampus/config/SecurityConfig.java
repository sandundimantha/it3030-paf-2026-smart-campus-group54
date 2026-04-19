package com.smartcampus.config;

// import com.smartcampus.security.CustomOAuth2UserService;  // KEPT — OAuth2 code preserved for demonstration
import com.smartcampus.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // ── OAUTH2 bean kept (commented out from chain, preserved for demonstration) ──
    // private final CustomOAuth2UserService customOAuth2UserService;

    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints — no auth required
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()           // login, register, logout
                .requestMatchers("/actuator/health/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/facilities/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/facilities/search").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/resources/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/resources/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/resources/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/resources/**").permitAll()
                // Admin-only endpoints
                .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/users/*/role").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/facilities").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/facilities/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/facilities/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/facilities/*/status").hasRole("ADMIN")
                .requestMatchers("/api/bookings/*/status").hasRole("ADMIN")
                // All other requests require authentication
                .anyRequest().authenticated()
            )

            // ── FORM-BASED LOGIN (active) ────────────────────────────────────────
            .formLogin(form -> form
                .loginProcessingUrl("/api/auth/login")     // Frontend POSTs credentials here
                .defaultSuccessUrl("/api/auth/me", false)  // Returns user info on success
                .failureUrl("/api/auth/login?error=true")
                .permitAll()
            )

            // ── LOGOUT ─────────────────────────────────────────────────────────────
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessUrl("http://localhost:5173/login")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );

            // ── OAUTH2 LOGIN (commented out — preserved for demonstration) ────────
            // .oauth2Login(oauth2 -> oauth2
            //     .userInfoEndpoint(userInfo -> userInfo
            //         .userService(customOAuth2UserService)
            //     )
            //     .defaultSuccessUrl("http://localhost:5173/profile", true)
            //     .failureUrl("http://localhost:5173/login?error=true")
            // )

        return http.build();
    }

    // ── BCrypt Password Encoder ───────────────────────────────────────────────
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ── DaoAuthenticationProvider — wires our UserDetailsService + encoder ───
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // ── AuthenticationManager — exposes the manager for use in AuthController ─
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ── CORS Configuration ────────────────────────────────────────────────────
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://localhost:5175",
                "http://localhost:5176"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
