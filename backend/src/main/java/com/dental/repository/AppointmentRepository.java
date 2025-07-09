package com.dental.repository;

import com.dental.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientEmail(String email);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByPatientEmailAndAppointmentDate(String email, LocalDate date);
    List<Appointment> findByStatus(Appointment.AppointmentStatus status);
    List<Appointment> findByAppointmentDateBetween(LocalDate startDate, LocalDate endDate);

    boolean existsByPatientFullNameAndPatientEmailAndPatientPhoneAndAppointmentDateAndAppointmentTimeAndServiceType(
        String patientFullName,
        String patientEmail,
        String patientPhone,
        LocalDate appointmentDate,
        LocalTime appointmentTime,
        String serviceType
    );

    @Query("SELECT a.appointmentTime, COUNT(a) FROM Appointment a WHERE a.appointmentDate = :date AND a.status = 'ACCEPTED' GROUP BY a.appointmentTime")
    List<Object[]> countAcceptedAppointmentsByTime(@Param("date") LocalDate date);

    @Query("SELECT a.appointmentTime, COUNT(a) FROM Appointment a WHERE a.appointmentDate = :date AND a.clinicArea = :clinicArea AND a.status = 'ACCEPTED' GROUP BY a.appointmentTime")
    List<Object[]> countAcceptedAppointmentsByTimeAndClinicArea(@Param("date") LocalDate date, @Param("clinicArea") String clinicArea);
} 