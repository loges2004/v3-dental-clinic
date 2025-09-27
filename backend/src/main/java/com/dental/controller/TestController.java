package com.dental.controller;

import com.dental.model.Appointment;
import com.dental.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@CrossOrigin(origins = {"https://v3dentalclinic.com", "https://www.v3dentalclinic.com", "http://localhost:3000"}, allowCredentials = "true")
public class TestController {
    
    private final EmailService emailService;

    @PostMapping("/email")
    public ResponseEntity<?> testEmail(@RequestParam String email, @RequestParam String type) {
        try {
            // Create a test appointment
            Appointment testAppointment = new Appointment();
            testAppointment.setId(999L);
            testAppointment.setPatientFullName("Test Patient");
            testAppointment.setPatientEmail(email);
            testAppointment.setPatientPhone("1234567890");
            testAppointment.setServiceType("Test Service");
            testAppointment.setClinicArea("Test Clinic");
            testAppointment.setAppointmentDate(java.time.LocalDate.now().plusDays(1));
            testAppointment.setAppointmentTime(java.time.LocalTime.of(10, 0));
            testAppointment.setStatus(Appointment.AppointmentStatus.PENDING);

            switch (type.toLowerCase()) {
                case "confirmation":
                    emailService.sendAppointmentConfirmation(testAppointment);
                    break;
                case "rejection":
                    emailService.sendAppointmentRejection(testAppointment, "Test rejection reason", null);
                    break;
                case "reschedule":
                    emailService.sendAppointmentRescheduled(testAppointment, 
                        java.time.LocalDate.now().plusDays(2), 
                        java.time.LocalTime.of(11, 0));
                    break;
                default:
                    return ResponseEntity.badRequest().body("Invalid email type. Use: confirmation, rejection, or reschedule");
            }

            return ResponseEntity.ok("Test email sent successfully to: " + email);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending test email: " + e.getMessage());
        }
    }
}
