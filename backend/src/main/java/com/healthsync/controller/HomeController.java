package com.healthsync.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class HomeController {

    @GetMapping
    public Map<String, String> home() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "HealthSync Java Backend is running!");
        response.put("status", "active");
        response.put("version", "1.0.0");
        response.put("frontend", "React TypeScript");
        response.put("backend", "Spring Boot Java");
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("application", "HealthSync Backend");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return response;
    }
}
