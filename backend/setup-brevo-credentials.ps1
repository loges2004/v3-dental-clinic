# PowerShell script to help set up Brevo credentials
Write-Host "=== Brevo Email Setup Guide ===" -ForegroundColor Green
Write-Host ""
Write-Host "To fix the email connection timeout, you need to:"
Write-Host ""
Write-Host "1. Go to your Brevo dashboard: https://app.brevo.com/"
Write-Host "2. Navigate to Settings > SMTP & API"
Write-Host "3. Copy your SMTP Key"
Write-Host "4. Update the start-with-env.ps1 file with your actual credentials"
Write-Host ""
Write-Host "Current Brevo credentials needed:"
Write-Host "- BREVO_USERNAME: v3dentalclinic@gmail.com (your Brevo login email)"
Write-Host "- BREVO_SMTP_KEY: [Your actual SMTP key from Brevo dashboard]"
Write-Host ""
Write-Host "After getting your credentials, run:"
Write-Host ".\start-with-env.ps1"
Write-Host ""
Write-Host "Or set them manually in PowerShell:"
Write-Host '$env:BREVO_USERNAME = "v3dentalclinic@gmail.com"'
Write-Host '$env:BREVO_SMTP_KEY = "your_actual_smtp_key"'
Write-Host '$env:DB_PASSWORD = "your_database_password"'
Write-Host ""
Write-Host "Then start the backend:"
Write-Host "java -jar target/dental-backend-0.0.1-SNAPSHOT.jar"
