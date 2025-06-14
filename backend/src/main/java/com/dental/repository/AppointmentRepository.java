package com.dental.repository;

import com.dental.model.Appointment;
import com.dental.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(User patient);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByPatientAndAppointmentDate(User patient, LocalDate date);
} 