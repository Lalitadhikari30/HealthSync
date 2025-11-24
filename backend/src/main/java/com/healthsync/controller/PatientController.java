package com.healthsync.controller;

import com.healthsync.entity.Patient;
import com.healthsync.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/v1/patients")
public class PatientController {

    private final PatientService patientService;

    @Autowired
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) throws ExecutionException, InterruptedException {
        Patient createdPatient = patientService.save(patient);
        return ResponseEntity.ok(createdPatient);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable String id) throws ExecutionException, InterruptedException {
        Optional<Patient> patient = patientService.findById(id);
        return patient.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() throws ExecutionException, InterruptedException {
        List<Patient> patients = patientService.findAll();
        return ResponseEntity.ok(patients);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable String id,
            @RequestBody Patient patient
    ) throws ExecutionException, InterruptedException {
        Patient updatedPatient = patientService.update(id, patient);
        return ResponseEntity.ok(updatedPatient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) throws ExecutionException, InterruptedException {
        patientService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}