package com.dental.model;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "appointments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {
        "patient_full_name",
        "patient_email",
        "patient_phone",
        "appointment_date",
        "appointment_time",
        "service_type"
    })
})
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_full_name", nullable = false)
    private String patientFullName;

    @Column(name = "patient_email")
    private String patientEmail;

    @Column(name = "patient_phone", nullable = false)
    private String patientPhone;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointmentTime;

    @Column(name = "service_type", nullable = false)
    private String serviceType;

    @Column(name = "clinic_area")
    private String clinicArea;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = AppointmentStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AppointmentStatus {
        PENDING, ACCEPTED, REJECTED, RESCHEDULED
    }
} 