# PowerShell script to set environment variables and start the backend
Write-Host "Setting up environment variables for Brevo email service..."

# Set Brevo environment variables
$env:BREVO_USERNAME = "v3dentalclinic@gmail.com"
$env:BREVO_SMTP_KEY = "your_brevo_smtp_key_here"  # Replace with your actual Brevo SMTP key
$env:DB_PASSWORD = "your_database_password_here"   # Replace with your actual database password

Write-Host "Environment variables set:"
Write-Host "BREVO_USERNAME: $env:BREVO_USERNAME"
Write-Host "BREVO_SMTP_KEY: $env:BREVO_SMTP_KEY"
Write-Host "DB_PASSWORD: $env:DB_PASSWORD"

Write-Host "Starting backend with environment variables..."
java -jar target/dental-backend-0.0.1-SNAPSHOT.jar
