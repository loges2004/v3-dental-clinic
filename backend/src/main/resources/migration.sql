-- Database Migration Script for Email and Status Issues
-- This script fixes the patient_email column and adds RESCHEDULED status

-- First, check if the column exists and modify it
-- Fix patient_email column to allow NULL values
ALTER TABLE appointments MODIFY COLUMN patient_email VARCHAR(255) NULL;

-- Add RESCHEDULED status to the ENUM (this might fail if RESCHEDULED already exists)
-- We'll use a more robust approach
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'appointments' 
     AND COLUMN_NAME = 'status' 
     AND COLUMN_TYPE LIKE '%RESCHEDULED%') > 0,
    'SELECT "RESCHEDULED already exists in status enum" as message',
    'ALTER TABLE appointments MODIFY COLUMN status ENUM(''PENDING'', ''ACCEPTED'', ''REJECTED'', ''RESCHEDULED'') DEFAULT ''PENDING'''
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update any existing empty string emails to NULL
UPDATE appointments SET patient_email = NULL WHERE patient_email = '' OR patient_email IS NULL;

-- Verify the changes
SELECT 
    COLUMN_NAME, 
    IS_NULLABLE, 
    COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'appointments' 
AND COLUMN_NAME IN ('patient_email', 'status');
