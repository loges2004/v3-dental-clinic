package com.dental;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@ComponentScan(basePackages = "com.dental")
@EntityScan("com.dental.model")
@EnableJpaRepositories("com.dental.repository")
public class DentalClinicApplication {

    public static void main(String[] args) {
        SpringApplication.run(DentalClinicApplication.class, args);
    }

    @Bean
    public CommandLineRunner passwordEncoderRunner() {
        return args -> {
            String rawPassword = "v3@08062025";
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String hashedPassword = encoder.encode(rawPassword);
            System.out.println("--------------------------------------------------");
            System.out.println("Generated Hashed Password:");
            System.out.println("Raw Password: " + rawPassword);
            System.out.println("Hashed Password: " + hashedPassword);
            System.out.println("--------------------------------------------------");
            // You can stop the application after getting the hash, or let it run
        };
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
} 