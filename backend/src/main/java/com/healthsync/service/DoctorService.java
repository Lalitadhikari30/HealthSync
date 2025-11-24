package com.healthsync.service;

import com.healthsync.entity.Doctor;
import java.util.List;
import java.util.Optional;

public interface DoctorService {
    Doctor save(Doctor doctor);
    Optional<Doctor> findById(Long id);
    Optional<Doctor> findByFirebaseUid(String firebaseUid);
    Optional<Doctor> findByEmail(String email);
    List<Doctor> findAll();
    Doctor update(Long id, Doctor doctor);
    void deleteById(Long id);
    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> searchDoctors(String name, String specialization, String availableDay);
    boolean existsByEmail(String email);
    boolean existsByFirebaseUid(String firebaseUid);
}
