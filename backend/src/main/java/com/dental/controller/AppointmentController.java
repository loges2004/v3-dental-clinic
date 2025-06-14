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
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        Appointment appointment = new Appointment();
        
        appointment.setPatientFullName(request.getName());
        appointment.setPatientEmail(request.getEmail());
        appointment.setPatientPhone(request.getPhone());
        
        appointment.setAppointmentDate(LocalDate.parse(request.getDate()));

        // Manual parsing of time to handle AM/PM robustly
        String timeString = request.getTime().trim();

        // --- START DEBUG LOGGING ---
        System.out.println("Received time string: '" + timeString + "'");
        System.out.println("Time string length: " + timeString.length());
        for (int i = 0; i < timeString.length(); i++) {
            System.out.println("Char at index " + i + ": '" + timeString.charAt(i) + "' (Unicode: " + (int) timeString.charAt(i) + ")");
        }
        // --- END DEBUG LOGGING ---

        LocalTime parsedTime;

        if (timeString.contains("AM") || timeString.contains("PM")) {
            parsedTime = LocalTime.parse(timeString, DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH));
        } else {
            // Fallback for 24-hour format if somehow still sent
            parsedTime = LocalTime.parse(timeString, DateTimeFormatter.ofPattern("HH:mm"));
        }

        appointment.setAppointmentTime(parsedTime);
        appointment.setServiceType(request.getService());
        appointment.setClinicArea(request.getClinicArea());
        
        return ResponseEntity.ok(appointmentService.createAppointment(appointment));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam Appointment.AppointmentStatus status,
            @RequestParam(required = false) String reason,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "HH:mm") LocalTime newTime) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, status, reason, newDate, newTime));
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