-- Insert admin user with password: V3@08062025
INSERT INTO users (id, email, password, full_name, role, created_at, updated_at) 
VALUES (1, 'v3dentalclinic@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOs', 'Admin User', 'ADMIN', '2025-06-13 20:09:36', '2025-06-13 20:09:36')
ON DUPLICATE KEY UPDATE email = email;

INSERT INTO users (email, password, full_name, role) 
VALUES ('admin@dental.com', '$2a$10$rDkPvvAFV6GgJkKq8WU1UOQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ', 'Admin User', 'ADMIN')
ON DUPLICATE KEY UPDATE email = email; 