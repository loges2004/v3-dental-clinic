# Final Email Test Script
Write-Host "🚀 Final Email Test - V3 Dental Clinic" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Wait for backend to start
Write-Host "`n⏳ Waiting for backend to start (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Test 1: Check if backend is running
Write-Host "`n1️⃣ Testing backend connection..." -ForegroundColor Yellow
try {
    $configResponse = Invoke-RestMethod -Uri "http://localhost:8001/api/production-diagnostic/config" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend is running!" -ForegroundColor Green
    Write-Host "Email Host: $($configResponse.emailConfig.host)" -ForegroundColor Cyan
    Write-Host "Email Username: $($configResponse.emailConfig.username)" -ForegroundColor Cyan
    Write-Host "Email Password: $($configResponse.emailConfig.password)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend is not running. Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please start the backend manually:" -ForegroundColor Yellow
    Write-Host "cd backend && java -jar target/dental-backend-0.0.1-SNAPSHOT.jar" -ForegroundColor White
    exit 1
}

# Test 2: Test email service
Write-Host "`n2️⃣ Testing email service..." -ForegroundColor Yellow
$testEmail = Read-Host "Enter your email address for testing"

Write-Host "`nTesting confirmation email..." -ForegroundColor Cyan
try {
    $confirmationResponse = Invoke-RestMethod -Uri "http://localhost:8001/simple/test-email-service?email=$testEmail&type=confirmation" -Method POST -TimeoutSec 30
    Write-Host "✅ Confirmation email test: $confirmationResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ Confirmation email failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

Write-Host "`nTesting rejection email..." -ForegroundColor Cyan
try {
    $rejectionResponse = Invoke-RestMethod -Uri "http://localhost:8001/simple/test-email-service?email=$testEmail&type=rejection" -Method POST -TimeoutSec 30
    Write-Host "✅ Rejection email test: $rejectionResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ Rejection email failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting reschedule email..." -ForegroundColor Cyan
try {
    $rescheduleResponse = Invoke-RestMethod -Uri "http://localhost:8001/simple/test-email-service?email=$testEmail&type=reschedule" -Method POST -TimeoutSec 30
    Write-Host "✅ Reschedule email test: $rescheduleResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ Reschedule email failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Check backend logs
Write-Host "`n3️⃣ Check backend console for these log messages:" -ForegroundColor Yellow
Write-Host "✅ Look for: 'Attempting to send confirmation email for appointment id=...'" -ForegroundColor Green
Write-Host "✅ Look for: 'Email found for appointment id=...'" -ForegroundColor Green
Write-Host "✅ Look for: 'Sent confirmation email to ... for appointment id=...'" -ForegroundColor Green
Write-Host "❌ Look for: 'Failed to send appointment confirmation email: ...'" -ForegroundColor Red

# Test 4: Check your email
Write-Host "`n4️⃣ Check your email inbox (including spam folder)!" -ForegroundColor Yellow
Write-Host "You should receive 3 test emails:" -ForegroundColor White
Write-Host "- Confirmation email" -ForegroundColor White
Write-Host "- Rejection email" -ForegroundColor White
Write-Host "- Reschedule email" -ForegroundColor White

Write-Host "`n📧 All emails should be from: V3 Dental Clinic <noreply@v3dentalclinic.com>" -ForegroundColor Cyan

Write-Host "`n✅ Email test completed!" -ForegroundColor Green
Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
