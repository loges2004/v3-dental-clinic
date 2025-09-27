#!/bin/bash

echo "🔄 Running database migration for email and status fixes..."

# Get database connection details from environment or use defaults
DB_HOST=${DB_HOST:-"v3dental-database-v3dentalclinic-d9e2.b.aivencloud.com"}
DB_PORT=${DB_PORT:-"21538"}
DB_NAME=${DB_NAME:-"defaultdb"}
DB_USER=${DB_USER:-"avnadmin"}
DB_PASSWORD=${DB_PASSWORD:-""}

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ DB_PASSWORD environment variable is required"
    exit 1
fi

echo "📊 Connecting to database: $DB_HOST:$DB_PORT/$DB_NAME"

# Run the migration script
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < src/main/resources/migration.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo "📧 Email column is now nullable"
    echo "🔄 RESCHEDULED status added to enum"
    echo "🧹 Empty email strings converted to NULL"
else
    echo "❌ Migration failed!"
    exit 1
fi
