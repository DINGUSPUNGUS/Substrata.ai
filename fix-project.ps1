# Project Recovery Script for Substrata.ai
# Run this script step by step after installing Node.js

Write-Host "=== Substrata.ai Project Recovery Script ===" -ForegroundColor Green
Write-Host ""

# Step 1: Verify Node.js installation
Write-Host "Step 1: Verifying Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found! Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Cyan
    exit 1
}

Write-Host ""

# Step 2: Navigate to project directory
Write-Host "Step 2: Navigating to project directory..." -ForegroundColor Yellow
Set-Location "c:\Users\juden\.vscode\Substrata.ai"
Write-Host "✓ Current directory: $(Get-Location)" -ForegroundColor Green

Write-Host ""

# Step 3: Clean install dependencies
Write-Host "Step 3: Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Cyan

try {
    npm install
    Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install dependencies. Trying clean install..." -ForegroundColor Yellow
    
    # Remove node_modules and package-lock.json if they exist
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
        Write-Host "Removed old node_modules" -ForegroundColor Yellow
    }
    
    if (Test-Path "package-lock.json") {
        Remove-Item -Force "package-lock.json"
        Write-Host "Removed old package-lock.json" -ForegroundColor Yellow
    }
    
    npm install
    Write-Host "✓ Clean install completed!" -ForegroundColor Green
}

Write-Host ""

# Step 4: Test build
Write-Host "Step 4: Testing production build..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✓ Build successful!" -ForegroundColor Green
} catch {
    Write-Host "✗ Build failed. Check errors above." -ForegroundColor Red
    Write-Host "Common fixes:" -ForegroundColor Yellow
    Write-Host "1. Check for missing environment variables" -ForegroundColor Cyan
    Write-Host "2. Verify all imports are correct" -ForegroundColor Cyan
    Write-Host "3. Check for syntax errors in components" -ForegroundColor Cyan
}

Write-Host ""

# Step 5: Test development server
Write-Host "Step 5: Testing development server..." -ForegroundColor Yellow
Write-Host "Starting development server (Ctrl+C to stop)..." -ForegroundColor Cyan
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host ""

# This will start the dev server
npm run dev
