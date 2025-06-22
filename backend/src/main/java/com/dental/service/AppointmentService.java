package com.dental.service;

import com.dental.model.Appointment;
import com.dental.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    @Transactional
    public Appointment createAppointment(Appointment appointment) {
        // boolean isDuplicate = appointmentRepository.existsByPatientFullNameAndPatientEmailAndPatientPhoneAndAppointmentDateAndAppointmentTimeAndServiceType(
        //     appointment.getPatientFullName(),
        //     appointment.getPatientEmail(),
        //     appointment.getPatientPhone(),
        //     appointment.getAppointmentDate(),
        //     appointment.getAppointmentTime(),
        //     appointment.getServiceType()
        // );

        // if (isDuplicate) {
        //     throw new IllegalStateException("This exact appointment already exists.");
        // }

        Appointment savedAppointment = appointmentRepository.save(appointment);

        if (savedAppointment.getStatus() == Appointment.AppointmentStatus.PENDING) {
            // Send email to admin for new pending appointment
            emailService.sendNewAppointmentNotification(savedAppointment);
        } else if (savedAppointment.getStatus() == Appointment.AppointmentStatus.ACCEPTED) {
            // Send confirmation email to patient for admin-created appointment
            emailService.sendAppointmentConfirmation(savedAppointment);
        }

        return savedAppointment;
    }

    @Transactional
    public Appointment updateAppointmentStatus(Long appointmentId, Appointment.AppointmentStatus status, String reason, LocalDate newDate, LocalTime newTime) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);

        if (status == Appointment.AppointmentStatus.ACCEPTED) {
            emailService.sendAppointmentConfirmation(appointment);
        } else if (status == Appointment.AppointmentStatus.REJECTED) {
            appointment.setDescription(reason);
            List<LocalTime> availableSlots = getAvailableTimeSlots(appointment.getAppointmentDate());
            emailService.sendAppointmentRejection(appointment, reason, availableSlots);
        } else if (status == Appointment.AppointmentStatus.RESCHEDULED) {
            if (newDate != null) {
                appointment.setAppointmentDate(newDate);
            }
            if (newTime != null) {
                appointment.setAppointmentTime(newTime);
            }
            // Assuming you have a method for sending reschedule emails
            // emailService.sendAppointmentRescheduled(appointment, newDate, newTime);
            emailService.sendAppointmentRescheduled(appointment, newDate, newTime);
        }

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return updatedAppointment;
    }

    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<LocalTime> getAvailableTimeSlots(LocalDate date) {
        List<LocalTime> allPossibleSlots = generateAllPossibleTimeSlots();
        Set<LocalTime> bookedSlots = appointmentRepository.findByAppointmentDate(date).stream()
                .map(Appointment::getAppointmentTime)
                .collect(Collectors.toSet());

        List<LocalTime> availableSlots = allPossibleSlots.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .collect(Collectors.toList());

        return availableSlots;
    }

    private List<LocalTime> generateAllPossibleTimeSlots() {
        List<LocalTime> slots = new ArrayList<>();
        LocalTime startTime = LocalTime.of(9, 0); // 9:00 AM
        LocalTime endTime = LocalTime.of(17, 0); // 5:00 PM
        int slotDurationMinutes = 30;

        LocalTime currentTime = startTime;
        while (currentTime.isBefore(endTime) || currentTime.equals(endTime)) {
            slots.add(currentTime);
            currentTime = currentTime.plusMinutes(slotDurationMinutes);
        }
        return slots;
    }

    // Removed patient-specific methods as User object is no longer directly linked to Appointment
    // public List<Appointment> getPatientAppointments(User patient) {
    //     return appointmentRepository.findByPatient(patient);
    // }

    // public List<Appointment> getPatientAppointmentsByDate(User patient, LocalDate date) {
    //     return appointmentRepository.findByPatientAndAppointmentDate(patient, date);
    // }

    @Transactional
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
} 