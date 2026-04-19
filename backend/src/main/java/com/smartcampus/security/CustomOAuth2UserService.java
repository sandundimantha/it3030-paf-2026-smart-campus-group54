package com.smartcampus.security;

import com.smartcampus.entity.AppUser;
import com.smartcampus.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AppUserRepository appUserRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        log.info("OAuth2 login: email={}, name={}", email, name);

        AppUser appUser = appUserRepository.findByEmail(email)
                .orElseGet(() -> {
                    log.info("New user registering via Google: {}", email);
                    return AppUser.builder()
                            .email(email)
                            .name(name)
                            .pictureUrl(picture)
                            .role(AppUser.UserRole.USER)
                            .build();
                });

        appUser.setName(name);
        appUser.setPictureUrl(picture);
        appUserRepository.save(appUser);

        Set<GrantedAuthority> authorities = new HashSet<>(oauth2User.getAuthorities());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + appUser.getRole().name()));

        log.info("User {} authenticated with role: {}", email, appUser.getRole());
        return new DefaultOAuth2User(authorities, oauth2User.getAttributes(), "email");
    }
}
