package com.dental.service;

import com.dental.model.Appointment;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendAppointmentConfirmation(Appointment appointment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(appointment.getPatient().getEmail());
        message.setSubject("Appointment Confirmation - V3 Dental Clinic");
        message.setText(String.format(
            "Dear %s,\n\n" +
            "Your appointment has been confirmed for:\n" +
            "Date: %s\n" +
            "Time: %s\n" +
            "Service: %s\n\n" +
            "Please arrive 10 minutes before your scheduled time.\n\n" +
            "Best regards,\nV3 Dental Clinic Team",
            appointment.getPatient().getFullName(),
            appointment.getAppointmentDate(),
            appointment.getAppointmentTime(),
            appointment.getServiceType()
        ));
        mailSender.send(message);
    }

    public void sendAppointmentRejection(Appointment appointment, String reason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(appointment.getPatient().getEmail());
        message.setSubject("Appointment Update - V3 Dental Clinic");
        message.setText(String.format(
            "Dear %s,\n\n" +
            "We regret to inform you that your appointment request for %s at %s has been declined.\n" +
            "Reason: %s\n\n" +
            "Please contact us to reschedule your appointment.\n\n" +
            "Best regards,\nV3 Dental Clinic Team",
            appointment.getPatient().getFullName(),
            appointment.getAppointmentDate(),
            appointment.getAppointmentTime(),
            reason
        ));
        mailSender.send(message);
    }

    public void sendNewAppointmentNotification(Appointment appointment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("admin@dental.com"); // Admin email
        message.setSubject("New Appointment Request - V3 Dental Clinic");
        message.setText(String.format(
            "New appointment request received:\n\n" +
            "Patient: %s\n" +
            "Email: %s\n" +
            "Phone: %s\n" +
            "Date: %s\n" +
            "Time: %s\n" +
            "Service: %s\n" +
            "Description: %s\n\n" +
            "Please review and respond to this request.",
            appointment.getPatient().getFullName(),
            appointment.getPatient().getEmail(),
            appointment.getPatient().getPhone(),
            appointment.getAppointmentDate(),
            appointment.getAppointmentTime(),
            appointment.getServiceType(),
            appointment.getDescription()
        ));
        mailSender.send(message);
    }
} 