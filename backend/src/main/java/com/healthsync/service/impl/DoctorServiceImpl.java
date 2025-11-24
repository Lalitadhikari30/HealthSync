package com.healthsync.service.impl;

import com.healthsync.entity.Doctor;
import com.healthsync.repository.DoctorRepository;
import com.healthsync.service.DoctorService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public Doctor save(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public Optional<Doctor> findById(Long id) {
        return doctorRepository.findById(id);
    }

    @Override
    public Optional<Doctor> findByFirebaseUid(String firebaseUid) {
        return doctorRepository.findByFirebaseUid(firebaseUid);
    }

    @Override
    public Optional<Doctor> findByEmail(String email) {
        return doctorRepository.findByEmail(email);
    }

    @Override
    public List<Doctor> findAll() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor update(Long id, Doctor doctor) {
        doctor.setId(id);
        return doctorRepository.save(doctor);
    }

    @Override
    public void deleteById(Long id) {
        doctorRepository.deleteById(id);
    }

    @Override
    public List<Doctor> findBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    @Override
    public List<Doctor> searchDoctors(String name, String specialization, String availableDay) {
        if (name != null && !name.trim().isEmpty()) {
            return doctorRepository.findByNameContaining(name);
        } else if (specialization != null && !specialization.trim().isEmpty()) {
            return doctorRepository.findBySpecialization(specialization);
        } else if (availableDay != null && !availableDay.trim().isEmpty()) {
            return doctorRepository.findByAvailableDay(availableDay);
        }
        return doctorRepository.findAll();
    }

    @Override
    public boolean existsByEmail(String email) {
        return doctorRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByFirebaseUid(String firebaseUid) {
        return doctorRepository.existsByFirebaseUid(firebaseUid);
    }
}
