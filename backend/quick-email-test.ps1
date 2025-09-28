# Quick Email Test Script
Write-Host "🔍 Quick Email Test" -ForegroundColor Green

# Check if backend is running
Write-Host "`n1. Checking if backend is running..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8001/api/production-diagnostic/config" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not running. Starting it..." -ForegroundColor Red
    
    # Set environment variables if not set
    if (-not $env:BREVO_USERNAME) {
        $env:BREVO_USERNAME = Read-Host "Enter your Brevo username (email)"
    }
    if (-not $env:BREVO_SMTP_KEY) {
        $env:BREVO_SMTP_KEY = Read-Host "Enter your Brevo SMTP key"
    }
    if (-not $env:DB_PASSWORD) {
        $env:DB_PASSWORD = Read-Host "Enter your database password"
    }
    
    # Start backend
    Write-Host "Starting backend..." -ForegroundColor Cyan
    Start-Process -FilePath "java" -ArgumentList "-jar", "target/dental-backend-0.0.1-SNAPSHOT.jar" -WindowStyle Hidden
    Start-Sleep -Seconds 30
}

# Test email service
Write-Host "`n2. Testing email service..." -ForegroundColor Yellow
$testEmail = Read-Host "Enter your email for testing"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8001/simple/test-email-service?email=$testEmail&type=confirmation" -Method POST
    Write-Host "✅ Email test successful: $response" -ForegroundColor Green
} catch {
    Write-Host "❌ Email test failed:" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
