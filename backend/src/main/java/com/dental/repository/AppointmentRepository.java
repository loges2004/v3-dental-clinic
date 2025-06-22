package com.dental.repository;

import com.dental.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientEmail(String email);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByPatientEmailAndAppointmentDate(String email, LocalDate date);

    boolean existsByPatientFullNameAndPatientEmailAndPatientPhoneAndAppointmentDateAndAppointmentTimeAndServiceType(
        String patientFullName,
        String patientEmail,
        String patientPhone,
        LocalDate appointmentDate,
        LocalTime appointmentTime,
        String serviceType
    );
} 