# ========================================
# Environment Variables Setup Script
# ========================================

Write-Host "🔧 Setting up environment variables for V3 Dental Clinic..." -ForegroundColor Green

# Check if variables are already set
Write-Host "`n📋 Current environment variables:" -ForegroundColor Yellow
Write-Host "BREVO_USERNAME: $env:BREVO_USERNAME" -ForegroundColor White
Write-Host "BREVO_SMTP_KEY: $env:BREVO_SMTP_KEY" -ForegroundColor White
Write-Host "DB_PASSWORD: $env:DB_PASSWORD" -ForegroundColor White

Write-Host "`n🔑 Setting up environment variables..." -ForegroundColor Yellow

# Set BREVO_USERNAME
if (-not $env:BREVO_USERNAME) {
    $brevoUsername = Read-Host "Enter your Brevo username (email): "
    $env:BREVO_USERNAME = $brevoUsername
    Write-Host "✅ BREVO_USERNAME set to: $env:BREVO_USERNAME" -ForegroundColor Green
} else {
    Write-Host "✅ BREVO_USERNAME already set: $env:BREVO_USERNAME" -ForegroundColor Green
}

# Set BREVO_SMTP_KEY
if (-not $env:BREVO_SMTP_KEY) {
    $brevoSmtpKey = Read-Host "Enter your Brevo SMTP key: "
    $env:BREVO_SMTP_KEY = $brevoSmtpKey
    Write-Host "✅ BREVO_SMTP_KEY set" -ForegroundColor Green
} else {
    Write-Host "✅ BREVO_SMTP_KEY already set" -ForegroundColor Green
}

# Set DB_PASSWORD
if (-not $env:DB_PASSWORD) {
    $dbPassword = Read-Host "Enter your database password: "
    $env:DB_PASSWORD = $dbPassword
    Write-Host "✅ DB_PASSWORD set" -ForegroundColor Green
} else {
    Write-Host "✅ DB_PASSWORD already set" -ForegroundColor Green
}

Write-Host "`n📋 Final environment variables:" -ForegroundColor Yellow
Write-Host "BREVO_USERNAME: $env:BREVO_USERNAME" -ForegroundColor White
Write-Host "BREVO_SMTP_KEY: $env:BREVO_SMTP_KEY" -ForegroundColor White
Write-Host "DB_PASSWORD: $env:DB_PASSWORD" -ForegroundColor White

Write-Host "`n🚀 Starting backend with new environment variables..." -ForegroundColor Green
Write-Host "Starting backend on port 8001..." -ForegroundColor Cyan

# Start the backend
cd backend
./mvnw spring-boot:run
