package com.healthsync.controller;

import com.healthsync.entity.Appointment;
import com.healthsync.service.AppointmentService;
import com.healthsync.service.FirebaseService;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.DocumentReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final FirebaseService firebaseService;

    public AppointmentController(AppointmentService appointmentService, FirebaseService firebaseService) {
        this.appointmentService = appointmentService;
        this.firebaseService = firebaseService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createAppointment(@Valid @RequestBody Appointment appointment) {
        try {
            // Convert Appointment to Map for Firebase
            Map<String, Object> appointmentData = new HashMap<>();
            appointmentData.put("patientId", appointment.getPatient() != null ? appointment.getPatient().getId() : null);
            appointmentData.put("doctorId", appointment.getDoctor() != null ? appointment.getDoctor().getId() : null);
            appointmentData.put("appointmentDateTime", appointment.getAppointmentDateTime().toString());
            appointmentData.put("status", appointment.getStatus().toString());
            appointmentData.put("reason", appointment.getReason());
            appointmentData.put("notes", appointment.getNotes());
            appointmentData.put("symptoms", appointment.getSymptoms());
            appointmentData.put("createdAt", new Date());
            appointmentData.put("updatedAt", new Date());

            // Save to Firebase
            DocumentReference docRef = firebaseService.createDocument("appointments", appointmentData);
            
            // Add document ID to the data
            Map<String, Object> response = new HashMap<>(appointmentData);
            response.put("id", docRef.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/firebase")
    public ResponseEntity<List<Map<String, Object>>> getAllAppointmentsFromFirebase() {
        try {
            List<QueryDocumentSnapshot> documents = firebaseService.getAllDocuments("appointments");
            List<Map<String, Object>> appointments = new ArrayList<>();
            
            for (QueryDocumentSnapshot doc : documents) {
                Map<String, Object> appointmentData = doc.getData();
                appointmentData.put("id", doc.getId());
                appointments.add(appointmentData);
            }
            
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/firebase/patient/{patientId}")
    public ResponseEntity<List<Map<String, Object>>> getAppointmentsByPatientFromFirebase(@PathVariable String patientId) {
        try {
            List<QueryDocumentSnapshot> documents = firebaseService.queryDocuments("appointments", "patientId", patientId);
            List<Map<String, Object>> appointments = new ArrayList<>();
            
            for (QueryDocumentSnapshot doc : documents) {
                Map<String, Object> appointmentData = doc.getData();
                appointmentData.put("id", doc.getId());
                appointments.add(appointmentData);
            }
            
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/firebase/doctor/{doctorId}")
    public ResponseEntity<List<Map<String, Object>>> getAppointmentsByDoctorFromFirebase(@PathVariable String doctorId) {
        try {
            List<QueryDocumentSnapshot> documents = firebaseService.queryDocuments("appointments", "doctorId", doctorId);
            List<Map<String, Object>> appointments = new ArrayList<>();
            
            for (QueryDocumentSnapshot doc : documents) {
                Map<String, Object> appointmentData = doc.getData();
                appointmentData.put("id", doc.getId());
                appointments.add(appointmentData);
            }
            
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        Optional<Appointment> appointment = appointmentService.findById(id);
        return appointment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.findAll();
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/firebase/{id}")
    public ResponseEntity<Map<String, Object>> updateFirebaseAppointment(
            @PathVariable String id,
            @Valid @RequestBody Appointment appointment
    ) {
        try {
            Map<String, Object> appointmentData = new HashMap<>();
            appointmentData.put("patientId", appointment.getPatient() != null ? appointment.getPatient().getId() : null);
            appointmentData.put("doctorId", appointment.getDoctor() != null ? appointment.getDoctor().getId() : null);
            appointmentData.put("appointmentDateTime", appointment.getAppointmentDateTime().toString());
            appointmentData.put("status", appointment.getStatus().toString());
            appointmentData.put("reason", appointment.getReason());
            appointmentData.put("notes", appointment.getNotes());
            appointmentData.put("symptoms", appointment.getSymptoms());
            appointmentData.put("updatedAt", new Date());

            firebaseService.updateDocument("appointments", id, appointmentData);
            
            appointmentData.put("id", id);
            return ResponseEntity.ok(appointmentData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/firebase/{id}/status")
    public ResponseEntity<Map<String, Object>> updateFirebaseAppointmentStatus(
            @PathVariable String id,
            @RequestParam String status
    ) {
        try {
            Map<String, Object> updateData = new HashMap<>();
            updateData.put("status", status);
            updateData.put("updatedAt", new Date());

            firebaseService.updateDocument("appointments", id, updateData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", id);
            response.put("status", status);
            response.put("message", "Appointment status updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/firebase/{id}")
    public ResponseEntity<Void> deleteFirebaseAppointment(@PathVariable String id) {
        try {
            firebaseService.deleteDocument("appointments", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id,
            @Valid @RequestBody Appointment appointment
    ) {
        Appointment updatedAppointment = appointmentService.update(id, appointment);
        return ResponseEntity.ok(updatedAppointment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentService.findByPatientId(patientId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        List<Appointment> appointments = appointmentService.findByDoctorId(doctorId);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam Appointment.AppointmentStatus status
    ) {
        Appointment updatedAppointment = appointmentService.updateStatus(id, status);
        return ResponseEntity.ok(updatedAppointment);
    }

    @GetMapping("/availability")
    public ResponseEntity<List<LocalDateTime>> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end
    ) {
        List<LocalDateTime> availableSlots = appointmentService.getAvailableSlots(doctorId, start, end);
        return ResponseEntity.ok(availableSlots);
    }
}
