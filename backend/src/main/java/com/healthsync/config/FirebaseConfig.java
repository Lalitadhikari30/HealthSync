package com.healthsync.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.credentials.location}")
    private String credentialsPath;

    @Value("${firebase.project-id}")
    private String projectId;

    @PostConstruct
    public void initialize() throws IOException {
        String path = credentialsPath.startsWith("classpath:")
                ? credentialsPath.substring("classpath:".length())
                : credentialsPath;
        InputStream serviceAccount = new ClassPathResource(path).getInputStream();
        
        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .setProjectId(projectId)
            .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }
}