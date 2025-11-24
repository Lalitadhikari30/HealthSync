package com.healthsync.controller;

import com.healthsync.entity.Patient;
import com.healthsync.entity.Doctor;
import com.healthsync.service.PatientService;
import com.healthsync.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final PatientService patientService;
    private final DoctorService doctorService;

    public AuthController(PatientService patientService, DoctorService doctorService) {
        this.patientService = patientService;
        this.doctorService = doctorService;
    }

    @PostMapping("/register/patient")
    public ResponseEntity<?> registerPatient(@RequestBody Patient patient) {
        if (patientService.existsByEmail(patient.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        
        Patient savedPatient = patientService.save(patient);
        return ResponseEntity.ok(Map.of(
            "message", "Patient registered successfully",
            "patientId", savedPatient.getId()
        ));
    }

    @PostMapping("/register/doctor")
    public ResponseEntity<?> registerDoctor(@RequestBody Doctor doctor) {
        if (doctorService.existsByEmail(doctor.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        
        Doctor savedDoctor = doctorService.save(doctor);
        return ResponseEntity.ok(Map.of(
            "message", "Doctor registered successfully",
            "doctorId", savedDoctor.getId()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String firebaseUid = loginRequest.get("firebaseUid");
        String role = loginRequest.get("role");

        if ("PATIENT".equalsIgnoreCase(role)) {
            Optional<Patient> patient = patientService.findByFirebaseUid(firebaseUid);
            if (patient.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "userId", patient.get().getId(),
                    "role", "PATIENT"
                ));
            }
        } else if ("DOCTOR".equalsIgnoreCase(role)) {
            Optional<Doctor> doctor = doctorService.findByFirebaseUid(firebaseUid);
            if (doctor.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "userId", doctor.get().getId(),
                    "role", "DOCTOR"
                ));
            }
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
    }

    @GetMapping("/user/{firebaseUid}")
    public ResponseEntity<?> getUserByFirebaseUid(@PathVariable String firebaseUid) {
        Optional<Patient> patient = patientService.findByFirebaseUid(firebaseUid);
        if (patient.isPresent()) {
            return ResponseEntity.ok(Map.of(
                "user", patient.get(),
                "role", "PATIENT"
            ));
        }

        Optional<Doctor> doctor = doctorService.findByFirebaseUid(firebaseUid);
        if (doctor.isPresent()) {
            return ResponseEntity.ok(Map.of(
                "user", doctor.get(),
                "role", "DOCTOR"
            ));
        }

        return ResponseEntity.notFound().build();
    }
}
