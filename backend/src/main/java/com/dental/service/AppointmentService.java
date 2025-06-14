package com.dental.service;

import com.dental.model.Appointment;
import com.dental.model.Notification;
import com.dental.model.User;
import com.dental.repository.AppointmentRepository;
import com.dental.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    @Transactional
    public Appointment createAppointment(Appointment appointment) {
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Create notification for admin
        Notification notification = new Notification();
        notification.setUser(appointment.getPatient());
        notification.setAppointment(savedAppointment);
        notification.setMessage("Your appointment request has been submitted and is pending approval.");
        notificationRepository.save(notification);

        // Send email to admin
        emailService.sendNewAppointmentNotification(savedAppointment);

        return savedAppointment;
    }

    @Transactional
    public Appointment updateAppointmentStatus(Long appointmentId, Appointment.AppointmentStatus status, String reason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        // Create notification for patient
        Notification notification = new Notification();
        notification.setUser(appointment.getPatient());
        notification.setAppointment(updatedAppointment);
        
        if (status == Appointment.AppointmentStatus.ACCEPTED) {
            notification.setMessage("Your appointment has been accepted.");
            emailService.sendAppointmentConfirmation(updatedAppointment);
        } else if (status == Appointment.AppointmentStatus.REJECTED) {
            notification.setMessage("Your appointment has been rejected. Reason: " + reason);
            emailService.sendAppointmentRejection(updatedAppointment, reason);
        }
        
        notificationRepository.save(notification);

        return updatedAppointment;
    }

    public List<Appointment> getPatientAppointments(User patient) {
        return appointmentRepository.findByPatient(patient);
    }

    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    public List<Appointment> getPatientAppointmentsByDate(User patient, LocalDate date) {
        return appointmentRepository.findByPatientAndAppointmentDate(patient, date);
    }
} 