package com.healthsync.service.impl;

import com.healthsync.entity.Appointment;
import com.healthsync.repository.AppointmentRepository;
import com.healthsync.service.AppointmentService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public Appointment save(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    @Override
    public Optional<Appointment> findById(Long id) {
        return appointmentRepository.findById(id);
    }

    @Override
    public List<Appointment> findAll() {
        return appointmentRepository.findAll();
    }

    @Override
    public Appointment update(Long id, Appointment appointment) {
        appointment.setId(id);
        return appointmentRepository.save(appointment);
    }

    @Override
    public void deleteById(Long id) {
        appointmentRepository.deleteById(id);
    }

    @Override
    public List<Appointment> findByPatientId(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    @Override
    public List<Appointment> findByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Override
    public Appointment updateStatus(Long id, Appointment.AppointmentStatus status) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            appointment.setStatus(status);
            return appointmentRepository.save(appointment);
        }
        throw new RuntimeException("Appointment not found with id: " + id);
    }

    @Override
    public List<LocalDateTime> getAvailableSlots(Long doctorId, LocalDateTime start, LocalDateTime end) {
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorIdAndAppointmentDateTimeBetween(
                doctorId, start, end);
        
        List<LocalDateTime> availableSlots = new ArrayList<>();
        LocalDateTime current = start;
        
        while (current.isBefore(end)) {
            final LocalDateTime slotTime = current;
            boolean isBooked = existingAppointments.stream()
                    .anyMatch(apt -> apt.getAppointmentDateTime().truncatedTo(ChronoUnit.HOURS)
                            .equals(slotTime.truncatedTo(ChronoUnit.HOURS)));
            
            if (!isBooked) {
                availableSlots.add(current);
            }
            current = current.plusHours(1);
        }
        
        return availableSlots;
    }
}
