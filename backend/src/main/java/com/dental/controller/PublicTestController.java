package com.dental.controller;

import com.dental.model.Appointment;
import com.dental.repository.AppointmentRepository;
import com.dental.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/public")
@CrossOrigin(origins = {"https://v3dentalclinic.com", "https://www.v3dentalclinic.com", "http://localhost:3000"}, allowCredentials = "true")
@RequiredArgsConstructor
public class PublicTestController {
    
    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("Public test endpoint working! Backend is running.");
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAppointmentsWithEmailInfo() {
        try {
            List<Appointment> appointments = appointmentRepository.findAll();
            
            Map<String, Object> result = new HashMap<>();
            result.put("totalAppointments", appointments.size());
            
            long appointmentsWithEmail = appointments.stream()
                .filter(apt -> apt.getPatientEmail() != null && !apt.getPatientEmail().trim().isEmpty())
                .count();
            
            result.put("appointmentsWithEmail", appointmentsWithEmail);
            result.put("appointmentsWithoutEmail", appointments.size() - appointmentsWithEmail);
            
            // Get sample appointments with email
            List<Map<String, Object>> sampleAppointments = appointments.stream()
                .filter(apt -> apt.getPatientEmail() != null && !apt.getPatientEmail().trim().isEmpty())
                .limit(5)
                .map(apt -> {
                    Map<String, Object> aptInfo = new HashMap<>();
                    aptInfo.put("id", apt.getId());
                    aptInfo.put("name", apt.getPatientFullName());
                    aptInfo.put("email", apt.getPatientEmail());
                    aptInfo.put("phone", apt.getPatientPhone());
                    aptInfo.put("status", apt.getStatus());
                    aptInfo.put("date", apt.getAppointmentDate());
                    aptInfo.put("time", apt.getAppointmentTime());
                    return aptInfo;
                })
                .toList();
            
            result.put("sampleAppointmentsWithEmail", sampleAppointments);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/test-email/{appointmentId}")
    public ResponseEntity<?> testEmailForAppointment(@PathVariable Long appointmentId) {
        try {
            Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            Map<String, Object> result = new HashMap<>();
            result.put("appointmentId", appointment.getId());
            result.put("patientName", appointment.getPatientFullName());
            result.put("patientEmail", appointment.getPatientEmail());
            result.put("hasEmail", appointment.getPatientEmail() != null && !appointment.getPatientEmail().trim().isEmpty());
            
            if (appointment.getPatientEmail() != null && !appointment.getPatientEmail().trim().isEmpty()) {
                try {
                    emailService.sendAppointmentConfirmation(appointment);
                    result.put("emailSent", true);
                    result.put("message", "Test confirmation email sent successfully");
                } catch (Exception e) {
                    result.put("emailSent", false);
                    result.put("error", e.getMessage());
                }
            } else {
                result.put("emailSent", false);
                result.put("message", "No email address available for this appointment");
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/test-email-service")
    public ResponseEntity<?> testEmailService(@RequestParam String email, @RequestParam String type) {
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

