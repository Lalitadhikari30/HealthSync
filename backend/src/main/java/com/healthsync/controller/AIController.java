package com.healthsync.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;
import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Value("${ai.service.api-key:}")
    private String apiKey;

    @PostMapping("/diagnose")
    public ResponseEntity<?> preliminaryDiagnosis(@RequestBody Map<String, Object> symptoms) {
        // Mock AI diagnosis - replace with actual AI service integration
        List<String> symptomList = (List<String>) symptoms.get("symptoms");
        
        String diagnosis = generateMockDiagnosis(symptomList);
        List<String> recommendations = generateMockRecommendations(symptomList);
        
        return ResponseEntity.ok(Map.of(
            "diagnosis", diagnosis,
            "recommendations", recommendations,
            "severity", "moderate",
            "disclaimer", "This is a preliminary diagnosis. Please consult a qualified healthcare professional."
        ));
    }

    @PostMapping("/chatbot")
    public ResponseEntity<?> chatbot(@RequestBody Map<String, String> message) {
        String userMessage = message.get("message");
        
        // Mock chatbot response - replace with actual AI service
        String botResponse = generateMockChatbotResponse(userMessage);
        
        return ResponseEntity.ok(Map.of(
            "response", botResponse,
            "timestamp", System.currentTimeMillis()
        ));
    }

    private String generateMockDiagnosis(List<String> symptoms) {
        if (symptoms.contains("fever") && symptoms.contains("cough")) {
            return "Based on your symptoms, you may be experiencing a respiratory infection. Common causes include the common cold or flu.";
        } else if (symptoms.contains("headache")) {
            return "Headaches can be caused by various factors including stress, dehydration, or lack of sleep.";
        } else if (symptoms.contains("nausea")) {
            return "Nausea can be related to digestive issues, food sensitivity, or other medical conditions.";
        }
        return "Based on your symptoms, a general medical consultation is recommended for proper diagnosis.";
    }

    private List<String> generateMockRecommendations(List<String> symptoms) {
        List<String> recommendations = Arrays.asList(
            "Get adequate rest and sleep",
            "Stay hydrated by drinking plenty of water",
            "Monitor your symptoms and seek medical attention if they worsen",
            "Avoid strenuous activities until you feel better",
            "Consider over-the-counter medications after consulting with a pharmacist"
        );
        
        if (symptoms.contains("fever")) {
            recommendations.add("Use fever-reducing medication as directed");
        }
        if (symptoms.contains("cough")) {
            recommendations.add("Try warm fluids and honey to soothe your throat");
        }
        
        return recommendations;
    }

    private String generateMockChatbotResponse(String message) {
        String lowerMessage = message.toLowerCase();
        
        if (lowerMessage.contains("appointment")) {
            return "You can book an appointment through our dashboard. Navigate to the Appointments section and select your preferred doctor and time slot.";
        } else if (lowerMessage.contains("medicine") || lowerMessage.contains("prescription")) {
            return "For prescription-related queries, please consult with your doctor. You can view your active prescriptions in the Medical Records section.";
        } else if (lowerMessage.contains("doctor")) {
            return "You can find doctors by specialization in our Doctors section. Each doctor's profile shows their qualifications and availability.";
        } else if (lowerMessage.contains("emergency")) {
            return "For medical emergencies, please call emergency services immediately or visit the nearest emergency room.";
        } else {
            return "I'm here to help you with HealthSync platform questions. You can ask me about appointments, doctors, prescriptions, or general health information.";
        }
    }
}
