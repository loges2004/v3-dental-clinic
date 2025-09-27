# PowerShell script to run database migration
Write-Host "🔄 Running database migration for email and status fixes..." -ForegroundColor Cyan

# Get database connection details from environment or use defaults
$DB_HOST = if ($env:DB_HOST) { $env:DB_HOST } else { "v3dental-database-v3dentalclinic-d9e2.b.aivencloud.com" }
$DB_PORT = if ($env:DB_PORT) { $env:DB_PORT } else { "21538" }
$DB_NAME = if ($env:DB_NAME) { $env:DB_NAME } else { "defaultdb" }
$DB_USER = if ($env:DB_USER) { $env:DB_USER } else { "avnadmin" }
$DB_PASSWORD = $env:DB_PASSWORD

if (-not $DB_PASSWORD) {
    Write-Host "❌ DB_PASSWORD environment variable is required" -ForegroundColor Red
    exit 1
}

Write-Host "📊 Connecting to database: $DB_HOST`:$DB_PORT/$DB_NAME" -ForegroundColor Yellow

# Run the migration script
$migrationFile = "src/main/resources/migration.sql"
if (Test-Path $migrationFile) {
    Write-Host "📄 Running migration script: $migrationFile" -ForegroundColor Green
    
    # Note: This requires MySQL client to be installed
    # You can also run this manually in your MySQL client
    Write-Host "⚠️  Please run the following SQL commands in your MySQL client:" -ForegroundColor Yellow
    Write-Host "   File: $migrationFile" -ForegroundColor White
    Get-Content $migrationFile | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    
    Write-Host "✅ Migration script ready!" -ForegroundColor Green
    Write-Host "📧 Email column will be made nullable" -ForegroundColor Cyan
    Write-Host "🔄 RESCHEDULED status will be added to enum" -ForegroundColor Cyan
    Write-Host "🧹 Empty email strings will be converted to NULL" -ForegroundColor Cyan
} else {
    Write-Host "❌ Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}
