# ========================================
# Email Debug Test Script
# ========================================
# This script will help you debug why patient emails aren't being sent

Write-Host "🔍 Email Debug Test Script" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Step 1: Check environment variables
Write-Host "`n📋 Step 1: Checking Environment Variables" -ForegroundColor Yellow
Write-Host "BREVO_USERNAME: $env:BREVO_USERNAME" -ForegroundColor White
Write-Host "BREVO_SMTP_KEY: $env:BREVO_SMTP_KEY" -ForegroundColor White
Write-Host "DB_PASSWORD: $env:DB_PASSWORD" -ForegroundColor White

if (-not $env:BREVO_USERNAME -or -not $env:BREVO_SMTP_KEY) {
    Write-Host "❌ Missing environment variables! Please set them first:" -ForegroundColor Red
    Write-Host "`$env:BREVO_USERNAME = 'your-brevo-email'" -ForegroundColor Yellow
    Write-Host "`$env:BREVO_SMTP_KEY = 'your-brevo-smtp-key'" -ForegroundColor Yellow
    exit 1
}

# Step 2: Start backend
Write-Host "`n🚀 Step 2: Starting Backend" -ForegroundColor Yellow
Write-Host "Starting backend on port 8001..." -ForegroundColor Cyan

# Start backend in background
$backendProcess = Start-Process -FilePath "java" -ArgumentList "-jar", "target/dental-backend-0.0.1-SNAPSHOT.jar" -WindowStyle Hidden -PassThru

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Step 3: Test email configuration
Write-Host "`n🧪 Step 3: Testing Email Configuration" -ForegroundColor Yellow

Write-Host "Testing production diagnostic endpoint..." -ForegroundColor Cyan
try {
    $configResponse = Invoke-RestMethod -Uri "http://localhost:8001/api/production-diagnostic/config" -Method GET
    Write-Host "✅ Configuration loaded successfully:" -ForegroundColor Green
    $configResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Failed to get configuration: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Test email service directly
Write-Host "`n📧 Step 4: Testing Email Service" -ForegroundColor Yellow

$testEmail = Read-Host "Enter your email address for testing"

Write-Host "`nTesting confirmation email..." -ForegroundColor Cyan
try {
    $confirmationResponse = Invoke-RestMethod -Uri "http://localhost:8001/simple/test-email-service?email=$testEmail&type=confirmation" -Method POST
    Write-Host "✅ Confirmation email test: $confirmationResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ Confirmation email failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting rejection email..." -ForegroundColor Cyan
try {
    $rejectionResponse = Invoke-RestMethod -Uri "http://localhost:8001/simple/test-email-service?email=$testEmail&type=rejection" -Method POST
    Write-Host "✅ Rejection email test: $rejectionResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ Rejection email failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting reschedule email..." -ForegroundColor Cyan
try {
    $rescheduleResponse = Invoke-RestMethod -Uri "http://localhost:8001/simple/test-email-service?email=$testEmail&type=reschedule" -Method POST
    Write-Host "✅ Reschedule email test: $rescheduleResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ Reschedule email failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 5: Test with real appointment data
Write-Host "`n🔍 Step 5: Testing with Real Appointment Data" -ForegroundColor Yellow

Write-Host "Getting appointments from database..." -ForegroundColor Cyan
try {
    $appointmentsResponse = Invoke-RestMethod -Uri "http://localhost:8001/api/diagnostic/appointments" -Method GET
    Write-Host "Found $($appointmentsResponse.Count) appointments" -ForegroundColor Green
    
    # Find an appointment with email
    $appointmentWithEmail = $appointmentsResponse | Where-Object { $_.patientEmail -and $_.patientEmail -ne "" } | Select-Object -First 1
    
    if ($appointmentWithEmail) {
        Write-Host "Testing with appointment ID: $($appointmentWithEmail.id), Email: $($appointmentWithEmail.patientEmail)" -ForegroundColor Green
        
        # Test confirmation for this appointment
        try {
            $realConfirmationResponse = Invoke-RestMethod -Uri "http://localhost:8001/api/diagnostic/test-email/$($appointmentWithEmail.id)?type=confirmation" -Method POST
            Write-Host "✅ Real appointment confirmation test: $realConfirmationResponse" -ForegroundColor Green
        } catch {
            Write-Host "❌ Real appointment confirmation failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️ No appointments with email found in database" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to get appointments: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 6: Check logs
Write-Host "`n📋 Step 6: Checking Backend Logs" -ForegroundColor Yellow
Write-Host "Look for these log messages in your backend console:" -ForegroundColor Cyan
Write-Host "- 'Attempting to send confirmation email for appointment id=...'" -ForegroundColor White
Write-Host "- 'Email found for appointment id=...'" -ForegroundColor White
Write-Host "- 'Sent confirmation email to ... for appointment id=...'" -ForegroundColor White
Write-Host "- 'Failed to send appointment confirmation email: ...'" -ForegroundColor Red

# Step 7: Summary
Write-Host "`n📊 Step 7: Summary" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow

Write-Host "`n✅ What should work:" -ForegroundColor Green
Write-Host "1. New appointment emails → v3dentalclinic@gmail.com" -ForegroundColor White
Write-Host "2. Confirmation emails → Patient email (if provided)" -ForegroundColor White
Write-Host "3. Rejection emails → Patient email (if provided)" -ForegroundColor White
Write-Host "4. Reschedule emails → Patient email (if provided)" -ForegroundColor White

Write-Host "`n🔍 Common issues:" -ForegroundColor Yellow
Write-Host "1. Patient email is null or empty" -ForegroundColor White
Write-Host "2. Environment variables not set" -ForegroundColor White
Write-Host "3. Brevo SMTP connection failed" -ForegroundColor White
Write-Host "4. Email going to spam folder" -ForegroundColor White

Write-Host "`n📧 Check your email inbox (including spam folder) for test emails!" -ForegroundColor Cyan

# Cleanup
Write-Host "`n🧹 Cleaning up..." -ForegroundColor Yellow
if ($backendProcess) {
    Stop-Process -Id $backendProcess.Id -Force
    Write-Host "Backend process stopped" -ForegroundColor Green
}

Write-Host "`n✅ Email debug test completed!" -ForegroundColor Green
Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
