package com.dental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Test endpoint is working!");
    }

    @GetMapping("/db-connection")
    public ResponseEntity<String> testDbConnection() {
        try {
            // Test database connection
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            
            // Test if tables exist
            try {
                jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
                return ResponseEntity.ok("Database connection successful! Tables are accessible.");
            } catch (Exception e) {
                return ResponseEntity.ok("Database connected but tables might not be created. Error: " + e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Database connection failed: " + e.getMessage() + "\n" +
                      "Please check if MySQL is running on port 3306 and the database 'dental_clinic' exists.");
        }
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> testAppointments() {
        try {
            // Check if appointments table exists
            try {
                List<Map<String, Object>> appointments = jdbcTemplate.queryForList(
                    "SELECT * FROM appointments ORDER BY appointment_date DESC"
                );
                
                if (appointments.isEmpty()) {
                    return ResponseEntity.ok("Appointments table exists but is empty.");
                }
                
                return ResponseEntity.ok(appointments);
            } catch (Exception e) {
                return ResponseEntity.ok("Appointments table might not exist. Error: " + e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error accessing appointments: " + e.getMessage());
        }
    }
} 