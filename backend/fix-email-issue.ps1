# PowerShell script to fix email issue
Write-Host "🔧 Fixing Email Issue - Step by Step" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Step 1: Check if we're in the right directory
if (-not (Test-Path "src/main/resources/migration.sql")) {
    Write-Host "❌ Please run this script from the backend directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found migration script" -ForegroundColor Green

# Step 2: Show the migration commands
Write-Host "`n📋 Database Migration Commands:" -ForegroundColor Yellow
Write-Host "Run these SQL commands in your MySQL client:" -ForegroundColor White
Write-Host "----------------------------------------" -ForegroundColor Gray
Get-Content "src/main/resources/migration.sql" | ForEach-Object { 
    Write-Host "   $_" -ForegroundColor Gray 
}

# Step 3: Check environment variables
Write-Host "`n🔍 Checking Environment Variables:" -ForegroundColor Yellow
$envVars = @("DB_PASSWORD", "MAIL_PASSWORD")
foreach ($var in $envVars) {
    if ($env:$var) {
        Write-Host "✅ $var is set" -ForegroundColor Green
    } else {
        Write-Host "❌ $var is not set" -ForegroundColor Red
    }
}

# Step 4: Test endpoints
Write-Host "`n🧪 Test Endpoints:" -ForegroundColor Yellow
Write-Host "After running the migration, test these endpoints:" -ForegroundColor White
Write-Host "1. Check appointments: GET /api/diagnostic/appointments" -ForegroundColor Cyan
Write-Host "2. Test email: POST /api/diagnostic/test-email/1" -ForegroundColor Cyan
Write-Host "3. Test email service: POST /api/test/email?email=test@example.com&type=confirmation" -ForegroundColor Cyan

# Step 5: Expected results
Write-Host "`n📊 Expected Results After Fix:" -ForegroundColor Yellow
Write-Host "✅ Appointments with email addresses will send confirmation emails" -ForegroundColor Green
Write-Host "✅ Appointments without email addresses will be logged and skipped" -ForegroundColor Green
Write-Host "✅ Enhanced logging will show exactly what's happening" -ForegroundColor Green

Write-Host "`n🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Run the migration SQL commands in your MySQL client" -ForegroundColor White
Write-Host "2. Restart your backend application" -ForegroundColor White
Write-Host "3. Test the diagnostic endpoints" -ForegroundColor White
Write-Host "4. Try accepting an appointment with an email address" -ForegroundColor White

Write-Host "`n✨ Email functionality should now work correctly!" -ForegroundColor Green
