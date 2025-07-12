#!/bin/bash

echo "🚀 Deploying Dental Clinic Backend with CORS fixes..."

# Build the project
echo "📦 Building project..."
./mvnw clean package -DskipTests

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 CORS configuration updated for:"
    echo "   - https://v3dentalclinic.com"
    echo "   - https://www.v3dentalclinic.com"
    echo "   - http://localhost:3000"
    echo ""
    echo "📋 Changes made:"
    echo "   ✅ Added specific CORS origin for Vercel domain"
    echo "   ✅ Added @CrossOrigin annotations to controllers"
    echo "   ✅ Added global CORS configuration"
    echo "   ✅ Fixed manifest.json icon references"
    echo ""
    echo "🔄 Please redeploy your backend to Render with these changes"
    echo "💡 The CORS errors should be resolved after redeployment"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi 