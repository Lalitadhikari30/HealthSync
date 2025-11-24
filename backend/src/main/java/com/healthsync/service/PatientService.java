package com.healthsync.service;

import com.healthsync.entity.Patient;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

public interface PatientService {
    Patient save(Patient patient) throws ExecutionException, InterruptedException;
    Optional<Patient> findById(String id) throws ExecutionException, InterruptedException;
    List<Patient> findAll() throws ExecutionException, InterruptedException;
    Patient update(String id, Patient patient) throws ExecutionException, InterruptedException;
    void deleteById(String id) throws ExecutionException, InterruptedException;
}

