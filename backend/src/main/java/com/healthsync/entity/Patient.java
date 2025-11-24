package com.healthsync.entity;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class Patient {
    @DocumentId
    private String id;
    private String name;
    private String email;
    private String phone;
    private String address;
}