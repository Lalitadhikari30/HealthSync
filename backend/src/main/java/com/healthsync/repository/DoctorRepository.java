package com.healthsync.repository;

import com.healthsync.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    Optional<Doctor> findByFirebaseUid(String firebaseUid);
    
    Optional<Doctor> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    boolean existsByFirebaseUid(String firebaseUid);
    
    @Query("SELECT d FROM Doctor d WHERE d.specialization = :specialization")
    List<Doctor> findBySpecialization(@Param("specialization") String specialization);
    
    @Query("SELECT d FROM Doctor d WHERE d.name LIKE %:name%")
    List<Doctor> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT d FROM Doctor d WHERE d.availableDays LIKE %:day%")
    List<Doctor> findByAvailableDay(@Param("day") String day);
}
