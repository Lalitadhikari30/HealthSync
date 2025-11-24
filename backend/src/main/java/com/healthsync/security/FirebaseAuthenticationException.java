// src/main/java/com/healthsync/security/FirebaseAuthenticationException.java
package com.healthsync.security;

import org.springframework.security.core.AuthenticationException;

public class FirebaseAuthenticationException extends AuthenticationException {
    public FirebaseAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }

    public FirebaseAuthenticationException(String message) {
        super(message);
    }
}