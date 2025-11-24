package com.healthsync.service.impl;

import com.healthsync.entity.Patient;
import com.healthsync.repository.PatientRepository;
import com.healthsync.service.PatientService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public Patient save(Patient patient) {
        return patientRepository.save(patient);
    }

    @Override
    public Optional<Patient> findById(Long id) {
        return patientRepository.findById(id);
    }

    @Override
    public Optional<Patient> findByFirebaseUid(String firebaseUid) {
        return patientRepository.findByFirebaseUid(firebaseUid);
    }

    @Override
    public Optional<Patient> findByEmail(String email) {
        return patientRepository.findByEmail(email);
    }

    @Override
    public List<Patient> findAll() {
        return patientRepository.findAll();
    }

    @Override
    public Patient update(Long id, Patient patient) {
        patient.setId(id);
        return patientRepository.save(patient);
    }

    @Override
    public void deleteById(Long id) {
        patientRepository.deleteById(id);
    }

    @Override
    public List<Patient> searchPatients(String name, String bloodGroup, String gender) {
        if (name != null && !name.trim().isEmpty()) {
            return patientRepository.findByNameContaining(name);
        } else if (bloodGroup != null && !bloodGroup.trim().isEmpty()) {
            return patientRepository.findByBloodGroup(bloodGroup);
        } else if (gender != null && !gender.trim().isEmpty()) {
            return patientRepository.findByGender(gender);
        }
        return patientRepository.findAll();
    }

    @Override
    public boolean existsByEmail(String email) {
        return patientRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByFirebaseUid(String firebaseUid) {
        return patientRepository.existsByFirebaseUid(firebaseUid);
    }
}