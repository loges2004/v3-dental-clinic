package com.dental.controller;

import com.dental.model.Appointment;
import com.dental.service.AppointmentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest request) {
        try {
            // Validate required fields
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Phone number is required");
            }
            if (request.getDate() == null || request.getDate().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Date is required");
            }
            if (request.getTime() == null || request.getTime().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Time is required");
            }
            if (request.getService() == null || request.getService().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Service is required");
            }
            if (request.getClinicArea() == null || request.getClinicArea().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Clinic area is required");
            }

            Appointment appointment = new Appointment();
            
            appointment.setPatientFullName(request.getName().trim());
            appointment.setPatientEmail(request.getEmail() != null ? request.getEmail().trim() : "");
            appointment.setPatientPhone(request.getPhone().trim());
            
            try {
                appointment.setAppointmentDate(parseDate(request.getDate().trim()));
            } catch (DateTimeParseException e) {
                return ResponseEntity.badRequest().body("Invalid date format. Please use YYYY-MM-DD, DD/MM/YYYY, or MM/DD/YYYY");
            }

            // Manual parsing of time to handle AM/PM robustly
            String timeString = request.getTime().trim();

            LocalTime parsedTime;

            try {
                if (timeString.contains("AM") || timeString.contains("PM")) {
                    parsedTime = LocalTime.parse(timeString, DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH));
                } else {
                    // Fallback for 24-hour format if somehow still sent
                    parsedTime = LocalTime.parse(timeString, DateTimeFormatter.ofPattern("HH:mm"));
                }
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid time format. Please use HH:MM or HH:MM AM/PM");
            }

            appointment.setAppointmentTime(parsedTime);
            appointment.setServiceType(request.getService().trim());
            appointment.setClinicArea(request.getClinicArea().trim());
            appointment.setStatus(Appointment.AppointmentStatus.PENDING);
            
            Appointment savedAppointment = appointmentService.createAppointment(appointment);
            
            return ResponseEntity.ok(savedAppointment);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    private LocalDate parseDate(String dateString) {
        // Define a list of supported date formats
        List<DateTimeFormatter> formatters = Arrays.asList(
                DateTimeFormatter.ISO_LOCAL_DATE, // YYYY-MM-DD
                DateTimeFormatter.ofPattern("dd/MM/yyyy"),
                DateTimeFormatter.ofPattern("MM/dd/yyyy"),
                DateTimeFormatter.ofPattern("dd-MM-yyyy"),
                DateTimeFormatter.ofPattern("MM-dd-yyyy")
        );

        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalDate.parse(dateString, formatter);
            } catch (DateTimeParseException e) {
                // Continue to next format
            }
        }
        // If no format matches, throw an exception
        throw new DateTimeParseException("Unable to parse date: " + dateString, dateString, 0);
    }

    @PostMapping("/admin-add")
    public ResponseEntity<Appointment> createAppointmentByAdmin(@RequestBody Appointment appointment) {
        // Since the admin is adding it, we can consider it as accepted.
        appointment.setStatus(Appointment.AppointmentStatus.ACCEPTED);
        return ResponseEntity.ok(appointmentService.createAppointment(appointment));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(
                id,
                request.getStatus(),
                request.getReason(),
                request.getNewDate(),
                request.getNewTime()
        ));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDate(date));
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }
}

@Data
class AppointmentRequest {
    private String name;
    private String email;
    private String phone;
    private String service;
    private String time;
    private String date;
    private String clinicArea;
}

@Data
class StatusUpdateRequest {
    private Appointment.AppointmentStatus status;
    private String reason;
    private LocalDate newDate;
    private LocalTime newTime;
} 