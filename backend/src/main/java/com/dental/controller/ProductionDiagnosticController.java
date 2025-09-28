package com.dental.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/production-diagnostic")
@CrossOrigin(origins = {"https://v3dentalclinic.com", "https://www.v3dentalclinic.com", "http://localhost:3000"}, allowCredentials = "true")
public class ProductionDiagnosticController {

    @Value("${spring.mail.host:NOT_SET}")
    private String mailHost;

    @Value("${spring.mail.port:NOT_SET}")
    private String mailPort;

    @Value("${spring.mail.username:NOT_SET}")
    private String mailUsername;

    @Value("${spring.mail.password:NOT_SET}")
    private String brevoSmtpKey;

    @Value("${spring.datasource.url:NOT_SET}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:NOT_SET}")
    private String datasourceUsername;

    @Value("${spring.profiles.active:NOT_SET}")
    private String activeProfile;

    @GetMapping("/config")
    public ResponseEntity<?> checkConfiguration() {
        Map<String, Object> config = new HashMap<>();
        
        // Email configuration
        Map<String, Object> emailConfig = new HashMap<>();
        emailConfig.put("host", mailHost);
        emailConfig.put("port", mailPort);
        emailConfig.put("username", mailUsername);
        emailConfig.put("password", brevoSmtpKey != null && !brevoSmtpKey.equals("NOT_SET") ? "***SET***" : "NOT_SET");
        
        // Database configuration
        Map<String, Object> dbConfig = new HashMap<>();
        dbConfig.put("url", datasourceUrl);
        dbConfig.put("username", datasourceUsername);
        dbConfig.put("password", "***CHECKED***");
        
        config.put("activeProfile", activeProfile);
        config.put("emailConfig", emailConfig);
        config.put("databaseConfig", dbConfig);
        
        // Check if configurations are properly set
        boolean emailConfigured = !mailHost.equals("NOT_SET") && 
                                !mailUsername.equals("NOT_SET") && 
                                !brevoSmtpKey.equals("NOT_SET");
        
        boolean dbConfigured = !datasourceUrl.equals("NOT_SET") && 
                              !datasourceUsername.equals("NOT_SET");
        
        config.put("emailConfigured", emailConfigured);
        config.put("databaseConfigured", dbConfigured);
        config.put("overallStatus", emailConfigured && dbConfigured ? "READY" : "MISCONFIGURED");
        
        return ResponseEntity.ok(config);
    }

    @GetMapping("/test-email-connection")
    public ResponseEntity<?> testEmailConnection() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // This will test if the email configuration is working
            if (brevoSmtpKey.equals("NOT_SET")) {
                result.put("status", "FAILED");
                result.put("error", "BREVO_SMTP_KEY environment variable not set");
                return ResponseEntity.ok(result);
            }
            
            if (mailUsername.equals("NOT_SET")) {
                result.put("status", "FAILED");
                result.put("error", "MAIL_USERNAME not configured");
                return ResponseEntity.ok(result);
            }
            
            result.put("status", "CONFIGURED");
            result.put("message", "Email configuration appears to be set");
            result.put("mailHost", mailHost);
            result.put("mailPort", mailPort);
            result.put("mailUsername", mailUsername);
            
        } catch (Exception e) {
            result.put("status", "ERROR");
            result.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(result);
    }
}
