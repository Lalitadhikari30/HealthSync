package com.healthsync.controller;

import com.healthsync.entity.Patient;
import com.healthsync.service.FirebaseService;
import com.healthsync.service.PatientService;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.DocumentReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.*;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;
    private final FirebaseService firebaseService;

    public PatientController(PatientService patientService, FirebaseService firebaseService) {
        this.patientService = patientService;
        this.firebaseService = firebaseService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPatient(@Valid @RequestBody Patient patient) {
        try {
            // Convert Patient to Map for Firebase
            Map<String, Object> patientData = new HashMap<>();
            patientData.put("name", patient.getName());
            patientData.put("email", patient.getEmail());
            patientData.put("phone", patient.getPhone());
            patientData.put("address", patient.getAddress());
            patientData.put("bloodGroup", patient.getBloodGroup());
            patientData.put("gender", patient.getGender());
            patientData.put("dateOfBirth", patient.getDateOfBirth());
            patientData.put("emergencyContact", patient.getEmergencyContact());
            patientData.put("createdAt", new Date());
            patientData.put("updatedAt", new Date());

            // Save to Firebase
            DocumentReference docRef = firebaseService.createDocument("patients", patientData);
            
            // Add document ID to the data
            Map<String, Object> response = new HashMap<>(patientData);
            response.put("id", docRef.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/firebase")
    public ResponseEntity<List<Map<String, Object>>> getAllPatientsFromFirebase() {
        try {
            List<QueryDocumentSnapshot> documents = firebaseService.getAllDocuments("patients");
            List<Map<String, Object>> patients = new ArrayList<>();
            
            for (QueryDocumentSnapshot doc : documents) {
                Map<String, Object> patientData = doc.getData();
                patientData.put("id", doc.getId());
                patients.add(patientData);
            }
            
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/firebase/{firebaseUid}")
    public ResponseEntity<Map<String, Object>> getPatientByFirebaseUid(@PathVariable String firebaseUid) {
        try {
            List<QueryDocumentSnapshot> documents = firebaseService.queryDocuments("patients", "firebaseUid", firebaseUid);
            
            if (documents.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> patientData = documents.get(0).getData();
            patientData.put("id", documents.get(0).getId());
            
            return ResponseEntity.ok(patientData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        Optional<Patient> patient = patientService.findById(id);
        return patient.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientService.findAll();
        return ResponseEntity.ok(patients);
    }

    @PutMapping("/firebase/{id}")
    public ResponseEntity<Map<String, Object>> updateFirebasePatient(
            @PathVariable String id,
            @Valid @RequestBody Patient patient
    ) {
        try {
            Map<String, Object> patientData = new HashMap<>();
            patientData.put("name", patient.getName());
            patientData.put("email", patient.getEmail());
            patientData.put("phone", patient.getPhone());
            patientData.put("address", patient.getAddress());
            patientData.put("bloodGroup", patient.getBloodGroup());
            patientData.put("gender", patient.getGender());
            patientData.put("dateOfBirth", patient.getDateOfBirth());
            patientData.put("emergencyContact", patient.getEmergencyContact());
            patientData.put("updatedAt", new Date());

            firebaseService.updateDocument("patients", id, patientData);
            
            patientData.put("id", id);
            return ResponseEntity.ok(patientData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/firebase/{id}")
    public ResponseEntity<Void> deleteFirebasePatient(@PathVariable String id) {
        try {
            firebaseService.deleteDocument("patients", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody Patient patient
    ) {
        Patient updatedPatient = patientService.update(id, patient);
        return ResponseEntity.ok(updatedPatient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Patient>> searchPatients(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String gender
    ) {
        List<Patient> patients = patientService.searchPatients(name, bloodGroup, gender);
        return ResponseEntity.ok(patients);
    }
}