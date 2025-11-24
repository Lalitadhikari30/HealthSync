package com.healthsync.service;

import com.healthsync.entity.Patient;
import java.util.List;
import java.util.Optional;

public interface PatientService {
    Patient save(Patient patient);
    Optional<Patient> findById(Long id);
    Optional<Patient> findByFirebaseUid(String firebaseUid);
    Optional<Patient> findByEmail(String email);
    List<Patient> findAll();
    Patient update(Long id, Patient patient);
    void deleteById(Long id);
    List<Patient> searchPatients(String name, String bloodGroup, String gender);
    boolean existsByEmail(String email);
    boolean existsByFirebaseUid(String firebaseUid);
}

