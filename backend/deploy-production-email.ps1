# ========================================
# Production Email Deployment Script
# ========================================
# This script will deploy the updated email configuration to production

Write-Host "🚀 Starting Production Email Deployment..." -ForegroundColor Green

# Step 1: Clean and build the application
Write-Host "`n📦 Step 1: Cleaning and building application..." -ForegroundColor Yellow
cd backend
./mvnw clean package -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix the errors above." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Step 2: Check current environment variables
Write-Host "`n🔍 Step 2: Checking environment variables..." -ForegroundColor Yellow

Write-Host "Current environment variables:" -ForegroundColor Cyan
Write-Host "BREVO_USERNAME: $env:BREVO_USERNAME" -ForegroundColor White
Write-Host "BREVO_SMTP_KEY: $env:BREVO_SMTP_KEY" -ForegroundColor White
Write-Host "DB_PASSWORD: $env:DB_PASSWORD" -ForegroundColor White

# Step 3: Verify configuration
Write-Host "`n⚙️ Step 3: Verifying configuration..." -ForegroundColor Yellow

if (-not $env:BREVO_USERNAME) {
    Write-Host "❌ BREVO_USERNAME not set! Please set it first:" -ForegroundColor Red
    Write-Host "`$env:BREVO_USERNAME = 'your-brevo-username'" -ForegroundColor Yellow
    exit 1
}

if (-not $env:BREVO_SMTP_KEY) {
    Write-Host "❌ BREVO_SMTP_KEY not set! Please set it first:" -ForegroundColor Red
    Write-Host "`$env:BREVO_SMTP_KEY = 'your-brevo-smtp-key'" -ForegroundColor Yellow
    exit 1
}

if (-not $env:DB_PASSWORD) {
    Write-Host "❌ DB_PASSWORD not set! Please set it first:" -ForegroundColor Red
    Write-Host "`$env:DB_PASSWORD = 'your-database-password'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ All environment variables are set!" -ForegroundColor Green

# Step 4: Start the application
Write-Host "`n🚀 Step 4: Starting application..." -ForegroundColor Yellow
Write-Host "Starting backend on port 8001..." -ForegroundColor Cyan

# Start the application in background
Start-Process -FilePath "java" -ArgumentList "-jar", "target/dental-backend-0.0.1-SNAPSHOT.jar" -WindowStyle Hidden

# Wait for application to start
Write-Host "Waiting for application to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Step 5: Test the configuration
Write-Host "`n🧪 Step 5: Testing email configuration..." -ForegroundColor Yellow

Write-Host "Testing production diagnostic endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8001/api/production-diagnostic/config" -Method GET
    Write-Host "Configuration Status:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Failed to get configuration: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting email service..." -ForegroundColor Cyan
try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:8001/simple/test-email-service?email=test@example.com&type=confirmation" -Method POST
    Write-Host "Email Test Result:" -ForegroundColor Green
    $testResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Failed to test email: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 6: Production deployment instructions
Write-Host "`n📋 Step 6: Production Deployment Instructions" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan

Write-Host "`n1. Update Render Environment Variables:" -ForegroundColor Green
Write-Host "   - Go to your Render dashboard" -ForegroundColor White
Write-Host "   - Navigate to your backend service" -ForegroundColor White
Write-Host "   - Go to Environment tab" -ForegroundColor White
Write-Host "   - Add/Update these variables:" -ForegroundColor White
Write-Host "     • BREVO_USERNAME = your-brevo-username" -ForegroundColor Yellow
Write-Host "     • BREVO_SMTP_KEY = your-brevo-smtp-key" -ForegroundColor Yellow
Write-Host "     • DB_PASSWORD = your-database-password" -ForegroundColor Yellow
Write-Host "     • Remove any old variables: MAIL_PASSWORD, SENDGRID_API_KEY" -ForegroundColor Red

Write-Host "`n2. Deploy to Render:" -ForegroundColor Green
Write-Host "   - Push your code to GitHub" -ForegroundColor White
Write-Host "   - Render will automatically deploy" -ForegroundColor White
Write-Host "   - Check deployment logs for any errors" -ForegroundColor White

Write-Host "`n3. Verify Domain in Brevo:" -ForegroundColor Green
Write-Host "   - Login to app.brevo.com" -ForegroundColor White
Write-Host "   - Go to Settings → Senders & IP → Senders" -ForegroundColor White
Write-Host "   - Add domain: v3dentalclinic.com" -ForegroundColor White
Write-Host "   - Add DNS records as instructed" -ForegroundColor White
Write-Host "   - Wait for verification (24-48 hours)" -ForegroundColor White

Write-Host "`n4. Test Production:" -ForegroundColor Green
Write-Host "   - Test: https://v3dentalclinic.com/api/production-diagnostic/config" -ForegroundColor White
Write-Host "   - Test: https://v3dentalclinic.com/simple/test-email-service?email=test@example.com&type=confirmation" -ForegroundColor White

Write-Host "`n✅ Production deployment script completed!" -ForegroundColor Green
Write-Host "`n📧 Your emails will now be sent from: noreply@v3dentalclinic.com" -ForegroundColor Cyan
Write-Host "📧 With sender name: V3 Dental Clinic" -ForegroundColor Cyan
Write-Host "📧 Through Brevo's servers for better deliverability" -ForegroundColor Cyan

Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
