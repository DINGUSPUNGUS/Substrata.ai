# Quick Vercel Deployment Test Script
# Run this to test your credentials locally before GitHub Actions

Write-Host "Testing Vercel Deployment Credentials..." -ForegroundColor Green

# Set environment variables for local testing
$env:VERCEL_ORG_ID = "team_81F8nZMv4Mx34I9rC2KRMTI3"
$env:VERCEL_PROJECT_ID = "prj_BnfNZj87vY89neD5e6zBKfhA9ILg"

Write-Host "Environment variables set:" -ForegroundColor Yellow
Write-Host "VERCEL_ORG_ID: $env:VERCEL_ORG_ID" -ForegroundColor Cyan
Write-Host "VERCEL_PROJECT_ID: $env:VERCEL_PROJECT_ID" -ForegroundColor Cyan

# Test Vercel CLI authentication
Write-Host "`nTesting Vercel CLI authentication..." -ForegroundColor Green
vercel whoami --token BA5bI5qDysrjmRJNT6BhyU9z

Write-Host "`nTesting project link..." -ForegroundColor Green
vercel link --yes --token BA5bI5qDysrjmRJNT6BhyU9z

Write-Host "`nCredential test complete!" -ForegroundColor Green
Write-Host "If no errors appeared above, your GitHub secrets should work correctly." -ForegroundColor Yellow
