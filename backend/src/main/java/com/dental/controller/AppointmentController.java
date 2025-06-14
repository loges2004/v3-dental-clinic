package com.dental.controller;

import com.dental.model.Appointment;
import com.dental.model.User;
import com.dental.service.AppointmentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal User patient) {
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setAppointmentDate(LocalDate.parse(request.getDate()));
        appointment.setAppointmentTime(LocalTime.parse(request.getTime(), DateTimeFormatter.ofPattern("h:mma – h:mma")));
        appointment.setServiceType(request.getService());
        return ResponseEntity.ok(appointmentService.createAppointment(appointment));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam Appointment.AppointmentStatus status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, status, reason));
    }

    @GetMapping("/patient")
    public ResponseEntity<List<Appointment>> getPatientAppointments(
            @AuthenticationPrincipal User patient) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(patient));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDate(date));
    }

    @GetMapping("/patient/date/{date}")
    public ResponseEntity<List<Appointment>> getPatientAppointmentsByDate(
            @AuthenticationPrincipal User patient,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getPatientAppointmentsByDate(patient, date));
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