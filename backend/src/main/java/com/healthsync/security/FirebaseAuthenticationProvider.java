// src/main/java/com/healthsync/security/FirebaseAuthenticationProvider.java
package com.healthsync.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class FirebaseAuthenticationProvider implements AuthenticationProvider {

    @Override
    public boolean supports(Class<?> authentication) {
        return (FirebaseAuthenticationToken.class.isAssignableFrom(authentication));
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (!supports(authentication.getClass())) {
            return null;
        }

        FirebaseAuthenticationToken authenticationToken = (FirebaseAuthenticationToken) authentication;
        String token = authenticationToken.getCredentials().toString();

        try {
            FirebaseToken firebaseToken = FirebaseAuth.getInstance().verifyIdToken(token, true);
            
            // Here you can extract user roles/authorities from the token if needed
            List<GrantedAuthority> authorities = new ArrayList<>();
            // Example: authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            
            return new FirebaseAuthenticationToken(firebaseToken.getUid(), token, authorities);
        } catch (FirebaseAuthException e) {
            throw new FirebaseAuthenticationException("Firebase ID Token verification failed", e);
        }
    }
}