// src/main/java/com/healthsync/security/FirebaseAuthenticationFilter.java
package com.healthsync.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import org.springframework.security.authentication.ProviderManager;

public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    private static final String HEADER_AUTHORIZATION = "Authorization";
    private static final String TOKEN_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain)
            throws ServletException, IOException {
        
        String header = request.getHeader(HEADER_AUTHORIZATION);
        
        if (header == null || !header.startsWith(TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.replace(TOKEN_PREFIX, "").trim();
        try {
            FirebaseAuthenticationToken authentication = new FirebaseAuthenticationToken(null, token);
            Authentication auth = getAuthenticationManager().authenticate(authentication);
            SecurityContextHolder.getContext().setAuthentication(auth);
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
            response.setContentType("application/json");
        }
    }

    private org.springframework.security.authentication.AuthenticationManager getAuthenticationManager() {
        return new ProviderManager(
                Collections.singletonList(new FirebaseAuthenticationProvider())
        );
    }
}