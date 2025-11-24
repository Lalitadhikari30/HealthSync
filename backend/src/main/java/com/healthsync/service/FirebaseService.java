package com.healthsync.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class FirebaseService {

    @Autowired
    private Firestore firestore;

    // Get all documents from a collection
    public List<QueryDocumentSnapshot> getAllDocuments(String collectionName) throws ExecutionException, InterruptedException {
        CollectionReference collection = firestore.collection(collectionName);
        ApiFuture<QuerySnapshot> future = collection.get();
        QuerySnapshot querySnapshot = future.get();
        return querySnapshot.getDocuments();
    }

    // Get document by ID
    public DocumentSnapshot getDocumentById(String collectionName, String documentId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(collectionName).document(documentId);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        return future.get();
    }

    // Create new document
    public DocumentReference createDocument(String collectionName, Map<String, Object> data) throws ExecutionException, InterruptedException {
        CollectionReference collection = firestore.collection(collectionName);
        ApiFuture<DocumentReference> future = collection.add(data);
        return future.get();
    }

    // Update document
    public void updateDocument(String collectionName, String documentId, Map<String, Object> data) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(collectionName).document(documentId);
        ApiFuture<WriteResult> future = docRef.update(data);
        future.get();
    }

    // Delete document
    public void deleteDocument(String collectionName, String documentId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(collectionName).document(documentId);
        ApiFuture<WriteResult> future = docRef.delete();
        future.get();
    }

    // Query documents by field
    public List<QueryDocumentSnapshot> queryDocuments(String collectionName, String field, Object value) throws ExecutionException, InterruptedException {
        CollectionReference collection = firestore.collection(collectionName);
        Query query = collection.whereEqualTo(field, value);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        return querySnapshot.getDocuments();
    }

    // Query documents with ordering
    public List<QueryDocumentSnapshot> queryDocumentsOrdered(String collectionName, String field, String orderBy) throws ExecutionException, InterruptedException {
        CollectionReference collection = firestore.collection(collectionName);
        Query query = collection.orderBy(orderBy);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        return querySnapshot.getDocuments();
    }

    // Check if collection exists
    public boolean collectionExists(String collectionName) throws ExecutionException, InterruptedException {
        CollectionReference collection = firestore.collection(collectionName);
        ApiFuture<QuerySnapshot> future = collection.limit(1).get();
        QuerySnapshot querySnapshot = future.get();
        return !querySnapshot.isEmpty();
    }
}
