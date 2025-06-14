package com.dental.service;

import com.dental.model.Appointment;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendAppointmentConfirmation(Appointment appointment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(appointment.getPatientEmail());
        message.setSubject("Appointment Confirmation - V3 Dental Clinic");
        message.setText(String.format(
            "Dear %s,\n\n" +
            "Your appointment has been confirmed for:\n" +
            "Date: %s\n" +
            "Time: %s\n" +
            "Service: %s\n\n" +
            "Please arrive 10 minutes before your scheduled time.\n\n" +
            "Best regards,\nV3 Dental Clinic Team",
            appointment.getPatientFullName(),
            appointment.getAppointmentDate(),
            appointment.getAppointmentTime(),
            appointment.getServiceType()
        ));
        mailSender.send(message);
    }

    public void sendAppointmentRejection(Appointment appointment, String reason, List<LocalTime> availableSlots) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(appointment.getPatientEmail());
        message.setSubject("Appointment Update - V3 Dental Clinic");

        String slotsMessage = "";
        if (availableSlots != null && !availableSlots.isEmpty()) {
            String formattedSlots = availableSlots.stream()
                    .map(LocalTime::toString)
                    .collect(Collectors.joining(", "));
            slotsMessage = "\n\nAvailable Time Slots for " + appointment.getAppointmentDate() + ": " + formattedSlots + ".\n";
        } else {
            slotsMessage = "\n\nWe recommend checking our website for updated availability.\n";
        }

        message.setText(String.format(
            "Dear %s,\n\n" +
            "We regret to inform you that your appointment request for %s at %s has been declined.\n" +
            "Reason: %s%s\n" +
            "Please contact us to reschedule your appointment.\n\n" +
            "Best regards,\nV3 Dental Clinic Team",
            appointment.getPatientFullName(),
            appointment.getAppointmentDate(),
            appointment.getAppointmentTime(),
            reason,
            slotsMessage
        ));
        mailSender.send(message);
    }

    public void sendNewAppointmentNotification(Appointment appointment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("v3dentalclinic@gmail.com"); // Admin email
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
            appointment.getPatientFullName(),
            appointment.getPatientEmail(),
            appointment.getPatientPhone(),
            appointment.getAppointmentDate(),
            appointment.getAppointmentTime(),
            appointment.getServiceType(),
            appointment.getDescription()
        ));
        mailSender.send(message);
    }

    public void sendAppointmentRescheduled(Appointment appointment, LocalDate newDate, LocalTime newTime) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(appointment.getPatientEmail());
        message.setSubject("Appointment Rescheduled - V3 Dental Clinic");
        message.setText(String.format(
            "Dear %s,\n\n" +
            "Your appointment has been rescheduled to:\n" +
            "New Date: %s\n" +
            "New Time: %s\n\n" +
            "Please adjust your schedule accordingly.\n\n" +
            "Best regards,\nV3 Dental Clinic Team",
            appointment.getPatientFullName(),
            newDate,
            newTime
        ));
        mailSender.send(message);
    }
} 