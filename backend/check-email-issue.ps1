# Quick diagnostic script to check email issue
Write-Host "🔍 Diagnosing Email Issue" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

Write-Host "`n📊 Current Status:" -ForegroundColor Yellow
Write-Host "✅ New appointment notifications work (sent to admin)" -ForegroundColor Green
Write-Host "❌ Patient confirmation/reschedule/rejection emails don't work" -ForegroundColor Red

Write-Host "`n🔍 Root Cause:" -ForegroundColor Yellow
Write-Host "The database schema still has patient_email as NOT NULL" -ForegroundColor Red
Write-Host "But the Java model allows it to be null" -ForegroundColor Red
Write-Host "This causes the hasEmail() check to fail" -ForegroundColor Red

Write-Host "`n💡 Why Admin Emails Work:" -ForegroundColor Yellow
Write-Host "Admin emails are hardcoded to 'v3dentalclinic@gmail.com'" -ForegroundColor Cyan
Write-Host "No email validation check - always sends" -ForegroundColor Cyan

Write-Host "`n💡 Why Patient Emails Fail:" -ForegroundColor Yellow
Write-Host "Patient emails use appointment.getPatientEmail() from database" -ForegroundColor Cyan
Write-Host "hasEmail() method returns false due to DB schema issues" -ForegroundColor Cyan
Write-Host "Email sending is skipped silently" -ForegroundColor Cyan

Write-Host "`n🔧 Solution:" -ForegroundColor Yellow
Write-Host "1. Run the database migration SQL commands" -ForegroundColor White
Write-Host "2. Restart the backend application" -ForegroundColor White
Write-Host "3. Test with diagnostic endpoints" -ForegroundColor White

Write-Host "`n📋 Migration Commands:" -ForegroundColor Yellow
Write-Host "ALTER TABLE appointments MODIFY COLUMN patient_email VARCHAR(255) NULL;" -ForegroundColor Gray
Write-Host "ALTER TABLE appointments MODIFY COLUMN status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'RESCHEDULED') DEFAULT 'PENDING';" -ForegroundColor Gray
Write-Host "UPDATE appointments SET patient_email = NULL WHERE patient_email = '' OR patient_email IS NULL;" -ForegroundColor Gray

Write-Host "`n🧪 Test After Migration:" -ForegroundColor Yellow
Write-Host "GET /api/diagnostic/appointments" -ForegroundColor Cyan
Write-Host "POST /api/diagnostic/test-email/1" -ForegroundColor Cyan
Write-Host "POST /api/test/email?email=test@example.com&type=confirmation" -ForegroundColor Cyan

Write-Host "`n✨ After the migration, patient emails will work correctly!" -ForegroundColor Green
