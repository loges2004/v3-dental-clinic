-- This file is intentionally left empty after denormalizing user data from appointments.

-- Insert default admin user
INSERT INTO users (email, password, role, full_name)
VALUES (
    'v3dentalclinic@gmail.com',
    '$2a$10$3TAZqOxBX.IPEa5ZNeayQu3TDYihsRUiZd8CzjbvlTIf21JhvLnWG',  -- Updated hashed password
    'ADMIN',
    'Admin User'
);