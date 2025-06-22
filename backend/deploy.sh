#!/bin/bash

echo "🚀 Starting Dental Clinic Deployment..."

# Build backend
echo "📦 Building Backend..."
cd backend
mvn clean package -DskipTests

# Deploy backend to Railway
echo "🚂 Deploying Backend to Railway..."
railway up

# Get Railway URL
RAILWAY_URL=$(railway status --json | jq -r '.url')
echo "✅ Backend deployed at: $RAILWAY_URL"

# Update frontend environment
echo "⚙️ Updating Frontend Environment..."
cd ../frontend
echo "REACT_APP_BACKEND_URL=$RAILWAY_URL" > .env.production

# Build frontend
echo "📦 Building Frontend..."
npm run build

# Deploy frontend to Vercel
echo "⚡ Deploying Frontend to Vercel..."
vercel --prod

echo "🎉 Deployment Complete!"
echo "Frontend: https://your-app.vercel.app"
echo "Backend: $RAILWAY_URL" 