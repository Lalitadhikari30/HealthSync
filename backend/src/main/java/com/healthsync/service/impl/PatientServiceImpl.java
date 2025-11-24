package com.healthsync.service.impl;

import com.healthsync.entity.Patient;
import com.healthsync.repository.PatientRepository;
import com.healthsync.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Autowired
    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public Patient save(Patient patient) throws ExecutionException, InterruptedException {
        return patientRepository.save(patient);
    }

    @Override
    public Optional<Patient> findById(String id) throws ExecutionException, InterruptedException {
        return patientRepository.findById(id);
    }

    @Override
    public List<Patient> findAll() throws ExecutionException, InterruptedException {
        return patientRepository.findAll();
    }

    @Override
    public Patient update(String id, Patient patient) throws ExecutionException, InterruptedException {
        return patientRepository.update(id, patient);
    }

    @Override
    public void deleteById(String id) throws ExecutionException, InterruptedException {
        patientRepository.deleteById(id);
    }
}