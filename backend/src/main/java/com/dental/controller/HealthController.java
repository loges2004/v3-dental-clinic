package com.dental.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = {"https://v3dentalclinic.com", "https://www.v3dentalclinic.com", "http://localhost:3000"}, allowCredentials = "true")
public class HealthController {

    @GetMapping
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok("Backend is running! Email diagnostic endpoints are now accessible.");
    }

    @GetMapping("/email-status")
    public ResponseEntity<?> emailStatus() {
        return ResponseEntity.ok("Email diagnostic endpoints are available. Try /api/diagnostic/appointments");
    }
}
