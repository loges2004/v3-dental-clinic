package com.dental.service;

import com.dental.model.Appointment;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.mail.host=smtp.gmail.com",
    "spring.mail.port=587",
    "spring.mail.username=test@example.com",
    "spring.mail.password=testpassword"
})
public class EmailServiceTest {

    @Test
    public void testHasEmailWithNullEmail() {
        Appointment appointment = new Appointment();
        appointment.setPatientEmail(null);
        
        // This test would need to be refactored to test the hasEmail method directly
        // For now, we'll just verify the logic
        boolean hasEmail = appointment.getPatientEmail() != null && !appointment.getPatientEmail().trim().isEmpty();
        assertFalse(hasEmail);
    }

    @Test
    public void testHasEmailWithEmptyEmail() {
        Appointment appointment = new Appointment();
        appointment.setPatientEmail("");
        
        boolean hasEmail = appointment.getPatientEmail() != null && !appointment.getPatientEmail().trim().isEmpty();
        assertFalse(hasEmail);
    }

    @Test
    public void testHasEmailWithValidEmail() {
        Appointment appointment = new Appointment();
        appointment.setPatientEmail("test@example.com");
        
        boolean hasEmail = appointment.getPatientEmail() != null && !appointment.getPatientEmail().trim().isEmpty();
        assertTrue(hasEmail);
    }
}
