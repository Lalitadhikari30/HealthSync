package com.healthsync.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.healthsync.entity.Patient;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
public class PatientRepository {
    private static final String COLLECTION_NAME = "patients";
    
    private Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    public Patient save(Patient patient) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getFirestore().collection(COLLECTION_NAME).document();
        patient.setId(docRef.getId());
        ApiFuture<WriteResult> result = docRef.set(patient);
        result.get();
        return patient;
    }

    public Optional<Patient> findById(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getFirestore().collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            return Optional.of(document.toObject(Patient.class));
        }
        return Optional.empty();
    }

    public List<Patient> findAll() throws ExecutionException, InterruptedException {
        List<Patient> patients = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = getFirestore().collection(COLLECTION_NAME).get();
        for (DocumentSnapshot document : future.get().getDocuments()) {
            patients.add(document.toObject(Patient.class));
        }
        return patients;
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> writeResult = getFirestore().collection(COLLECTION_NAME).document(id).delete();
        writeResult.get();
    }

    public Patient update(String id, Patient patient) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> writeResult = getFirestore().collection(COLLECTION_NAME).document(id).set(patient);
        writeResult.get();
        patient.setId(id);
        return patient;
    }
}