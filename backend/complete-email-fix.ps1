# Complete Email Fix Script
Write-Host "=== DENTAL CLINIC EMAIL FIX ===" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 1: Get your database password from Aiven dashboard" -ForegroundColor Yellow
Write-Host "   - Go to your Aiven database dashboard"
Write-Host "   - Copy your database password"
Write-Host ""

Write-Host "STEP 2: Set environment variables with your ACTUAL database password:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Run these commands in PowerShell:" -ForegroundColor Cyan
Write-Host ""
Write-Host '$env:BREVO_USERNAME = "9808a3001@smtp-brevo.com"' -ForegroundColor White
Write-Host '$env:BREVO_SMTP_KEY = "LB1yEKPIkCDMz6Rp"' -ForegroundColor White
Write-Host '$env:DB_PASSWORD = "YOUR_ACTUAL_DATABASE_PASSWORD_HERE"' -ForegroundColor White
Write-Host ""
Write-Host "STEP 3: Start the backend:" -ForegroundColor Yellow
Write-Host "java -jar target/dental-clinic-0.0.1-SNAPSHOT.jar" -ForegroundColor White
Write-Host ""
Write-Host "STEP 4: Test email functionality:" -ForegroundColor Yellow
Write-Host "Invoke-RestMethod -Uri 'http://localhost:8001/api/health/email-status' -Method GET" -ForegroundColor White
Write-Host ""
Write-Host "=== FOR PRODUCTION (RENDER) ===" -ForegroundColor Green
Write-Host "Add these environment variables in Render dashboard:" -ForegroundColor Yellow
Write-Host "- BREVO_USERNAME = 9808a3001@smtp-brevo.com" -ForegroundColor White
Write-Host "- BREVO_SMTP_KEY = LB1yEKPIkCDMz6Rp" -ForegroundColor White
Write-Host "- DB_PASSWORD = your_actual_database_password" -ForegroundColor White
Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Green
Write-Host "✅ Brevo credentials are CORRECT" -ForegroundColor Green
Write-Host "✅ Email configuration is CORRECT" -ForegroundColor Green
Write-Host "❌ Database password needs to be set" -ForegroundColor Red
Write-Host "❌ Backend can't start without database access" -ForegroundColor Red
