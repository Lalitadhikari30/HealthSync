package com.healthsync.service;

import com.healthsync.entity.Appointment;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentService {
    Appointment save(Appointment appointment);
    Optional<Appointment> findById(Long id);
    List<Appointment> findAll();
    Appointment update(Long id, Appointment appointment);
    void deleteById(Long id);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    Appointment updateStatus(Long id, Appointment.AppointmentStatus status);
    List<LocalDateTime> getAvailableSlots(Long doctorId, LocalDateTime start, LocalDateTime end);
}
