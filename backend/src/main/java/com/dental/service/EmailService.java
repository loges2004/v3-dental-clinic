package com.dental.service;

import com.dental.model.Appointment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;
    @Value("${spring.mail.from-address:noreply@v3dentalclinic.com}")
    private String fromEmailAddress;
    
    @Value("${spring.mail.from-name:V3 Dental Clinic}")
    private String fromName;

    private boolean hasEmail(Appointment appointment) {
        boolean present = appointment.getPatientEmail() != null && !appointment.getPatientEmail().trim().isEmpty();
        if (!present) {
            log.info("Skipping patient email send: no email on appointment id={}, name={}, email={}",
                appointment.getId(), appointment.getPatientFullName(), appointment.getPatientEmail());
        } else {
            log.info("Email found for appointment id={}, email={}", appointment.getId(), appointment.getPatientEmail());
        }
        return present;
    }

    public void sendAppointmentConfirmation(Appointment appointment) {
        log.info("Attempting to send confirmation email for appointment id={}, email={}", 
            appointment.getId(), appointment.getPatientEmail());
        if (!hasEmail(appointment)) return;

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromEmailAddress != null && !fromEmailAddress.isEmpty()) {
                String fullFromAddress = fromName != null && !fromName.isEmpty() 
                    ? fromName + " <" + fromEmailAddress + ">"
                    : fromEmailAddress;
                message.setFrom(fullFromAddress);
                message.setReplyTo(fromEmailAddress);
            }
            message.setTo(appointment.getPatientEmail());
            message.setSubject("Appointment Confirmation - V3 Dental Clinic");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String formattedTime = appointment.getAppointmentTime().format(timeFormatter);
            String formattedDate = appointment.getAppointmentDate().format(dateFormatter);

            String whatsappMessage = String.format(
                "*V3 Dental Clinic - Appointment Confirmed!* ✅\n\n" +
                "Hi *%s*,\n\n" +
                "Your appointment is all set! We're looking forward to seeing you. 😊\n\n" +
                "*Here are your appointment details:*\n\n" +
                "🦷 *Service:* %s\n" +
                "🗓️ *Date:* %s\n" +
                "⏰ *Time:* %s\n" +
                "📍 *Clinic:* %s\n\n" +
                "*Important Information:*\n" +
                "• Please arrive 10 minutes early to allow for check-in.\n" +
                "• If you need to reschedule, please contact us at least 24 hours in advance.\n\n" +
                "Thank you for choosing V3 Dental Clinic!\n" +
                "We're committed to giving you a bright and healthy smile. ✨",
                appointment.getPatientFullName(),
                appointment.getServiceType(),
                formattedDate,
                formattedTime,
                appointment.getClinicArea()
            );

            message.setText(whatsappMessage);
            mailSender.send(message);
            log.info("Sent confirmation email to {} for appointment id={}", appointment.getPatientEmail(), appointment.getId());
        } catch (Exception ex) {
            log.error("Failed to send appointment confirmation email: {}", ex.getMessage());
        }
    }

    public void sendAppointmentRejection(Appointment appointment, String reason, List<LocalTime> availableSlots) {
        log.info("Attempting to send rejection email for appointment id={}, email={}", 
            appointment.getId(), appointment.getPatientEmail());
        if (!hasEmail(appointment)) return;

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromEmailAddress != null && !fromEmailAddress.isEmpty()) {
                String fullFromAddress = fromName != null && !fromName.isEmpty() 
                    ? fromName + " <" + fromEmailAddress + ">"
                    : fromEmailAddress;
                message.setFrom(fullFromAddress);
                message.setReplyTo(fromEmailAddress);
            }
            message.setTo(appointment.getPatientEmail());
            message.setSubject("Appointment Update - V3 Dental Clinic");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String formattedTime = appointment.getAppointmentTime().format(timeFormatter);
            String formattedDate = appointment.getAppointmentDate().format(dateFormatter);
            String slotsMessage = "";
            if (availableSlots != null && !availableSlots.isEmpty()) {
                String formattedSlots = availableSlots.stream()
                        .map(slot -> slot.format(timeFormatter))
                        .collect(Collectors.joining(", "));
                slotsMessage = "\n\nAvailable Time Slots for " + formattedDate + ": " + formattedSlots + ".\n";
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
                formattedDate,
                formattedTime,
                reason,
                slotsMessage
            ));
            mailSender.send(message);
            log.info("Sent rejection email to {} for appointment id={}", appointment.getPatientEmail(), appointment.getId());
        } catch (Exception ex) {
            log.error("Failed to send appointment rejection email: {}", ex.getMessage());
        }
    }

    public void sendNewAppointmentNotification(Appointment appointment) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromEmailAddress != null && !fromEmailAddress.isEmpty()) {
                String fullFromAddress = fromName != null && !fromName.isEmpty() 
                    ? fromName + " <" + fromEmailAddress + ">"
                    : fromEmailAddress;
                message.setFrom(fullFromAddress);
                message.setReplyTo(fromEmailAddress);
            }
            message.setTo("v3dentalclinic@gmail.com"); // Admin email
            message.setSubject("New Appointment Request - V3 Dental Clinic");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String formattedTime = appointment.getAppointmentTime().format(timeFormatter);
            String formattedDate = appointment.getAppointmentDate().format(dateFormatter);
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
                formattedDate,
                formattedTime,
                appointment.getServiceType(),
                appointment.getDescription()
            ));
            mailSender.send(message);
            log.info("Sent admin new-appointment notification for appointment id={}", appointment.getId());
        } catch (Exception ex) {
            log.error("Failed to send new appointment notification email: {}", ex.getMessage());
        }
    }

    public void sendAppointmentRescheduled(Appointment appointment, LocalDate newDate, LocalTime newTime) {
        log.info("Attempting to send rescheduled email for appointment id={}, email={}", 
            appointment.getId(), appointment.getPatientEmail());
        if (!hasEmail(appointment)) return;

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromEmailAddress != null && !fromEmailAddress.isEmpty()) {
                String fullFromAddress = fromName != null && !fromName.isEmpty() 
                    ? fromName + " <" + fromEmailAddress + ">"
                    : fromEmailAddress;
                message.setFrom(fullFromAddress);
                message.setReplyTo(fromEmailAddress);
            }
            message.setTo(appointment.getPatientEmail());
            message.setSubject("Appointment Rescheduled - V3 Dental Clinic");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String formattedTime = newTime.format(timeFormatter);
            String formattedDate = newDate.format(dateFormatter);
            message.setText(String.format(
                "Dear %s,\n\n" +
                "Your appointment has been rescheduled to:\n" +
                "New Date: %s\n" +
                "New Time: %s\n\n" +
                "Please adjust your schedule accordingly.\n\n" +
                "Best regards,\nV3 Dental Clinic Team",
                appointment.getPatientFullName(),
                formattedDate,
                formattedTime
            ));
            mailSender.send(message);
            log.info("Sent rescheduled email to {} for appointment id={}", appointment.getPatientEmail(), appointment.getId());
        } catch (Exception ex) {
            log.error("Failed to send appointment rescheduled email: {}", ex.getMessage());
        }
    }

    public void sendTestEmail(String toEmail, String subject, String message) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            if (fromEmailAddress != null && !fromEmailAddress.isEmpty()) {
                String fullFromAddress = fromName != null && !fromName.isEmpty() 
                    ? fromName + " <" + fromEmailAddress + ">"
                    : fromEmailAddress;
                mailMessage.setFrom(fullFromAddress);
                mailMessage.setReplyTo(fromEmailAddress);
            }
            mailMessage.setTo(toEmail);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);
            mailSender.send(mailMessage);
            log.info("Test email sent successfully to: {}", toEmail);
        } catch (Exception ex) {
            log.error("Failed to send test email: {}", ex.getMessage());
            throw ex;
        }
    }

} 