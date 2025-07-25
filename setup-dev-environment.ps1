# Substrata.ai Development Environment Setup Script
# This script will guide you through setting up your development environment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Substrata.ai Development Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Node.js is installed
Write-Host "Step 1: Checking Node.js installation..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>$null
    $npmVersion = npm --version 2>$null
    Write-Host "✓ Node.js is already installed!" -ForegroundColor Green
    Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Cyan
    Write-Host "  npm version: $npmVersion" -ForegroundColor Cyan
    $nodeInstalled = $true
} catch {
    Write-Host "✗ Node.js is not installed" -ForegroundColor Red
    $nodeInstalled = $false
}

if (-not $nodeInstalled) {
    Write-Host ""
    Write-Host "🚨 CRITICAL: Node.js must be installed first!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please follow these steps:" -ForegroundColor Yellow
    Write-Host "1. Open your web browser" -ForegroundColor White
    Write-Host "2. Go to: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "3. Click 'Download Node.js (LTS)' - the green button" -ForegroundColor White
    Write-Host "4. Run the downloaded installer" -ForegroundColor White
    Write-Host "5. During installation, make sure 'Add to PATH' is checked" -ForegroundColor White
    Write-Host "6. Restart VS Code after installation" -ForegroundColor White
    Write-Host "7. Open a new terminal and run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "After installing Node.js, run this command again:" -ForegroundColor Green
    Write-Host ".\setup-dev-environment.ps1" -ForegroundColor Cyan
    Write-Host ""
    
    # Open the Node.js website
    Write-Host "Opening Node.js download page..." -ForegroundColor Yellow
    Start-Process "https://nodejs.org/"
    
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host ""

# Step 2: Navigate to project directory
Write-Host "Step 2: Setting up project directory..." -ForegroundColor Yellow
$projectPath = "c:\Users\juden\.vscode\Substrata.ai"
Set-Location $projectPath
Write-Host "✓ Working directory: $(Get-Location)" -ForegroundColor Green

Write-Host ""

# Step 3: Clean previous installations
Write-Host "Step 3: Cleaning previous installations..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "  Removing old node_modules..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force "node_modules"
}

if (Test-Path "package-lock.json") {
    Write-Host "  Removing old package-lock.json..." -ForegroundColor Cyan
    Remove-Item -Force "package-lock.json"
}

if (Test-Path ".next") {
    Write-Host "  Removing old build cache..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force ".next"
}

Write-Host "✓ Cleanup completed" -ForegroundColor Green

Write-Host ""

# Step 4: Install dependencies
Write-Host "Step 4: Installing project dependencies..." -ForegroundColor Yellow
Write-Host "This may take 2-5 minutes depending on your internet connection..." -ForegroundColor Cyan
Write-Host ""

try {
    npm install
    Write-Host "✓ All dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    Write-Host "Error details above. Common solutions:" -ForegroundColor Yellow
    Write-Host "- Check your internet connection" -ForegroundColor White
    Write-Host "- Try running as administrator" -ForegroundColor White
    Write-Host "- Clear npm cache: npm cache clean --force" -ForegroundColor White
    exit 1
}

Write-Host ""

# Step 5: Create environment file
Write-Host "Step 5: Setting up environment variables..." -ForegroundColor Yellow

if (-not (Test-Path ".env.local")) {
    Write-Host "  Creating .env.local file..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env.local" -ErrorAction SilentlyContinue
    Write-Host "✓ Environment file created" -ForegroundColor Green
    Write-Host "  You can add your API keys to .env.local later" -ForegroundColor Gray
} else {
    Write-Host "✓ Environment file already exists" -ForegroundColor Green
}

Write-Host ""

# Step 6: Test build
Write-Host "Step 6: Testing production build..." -ForegroundColor Yellow

try {
    npm run build
    Write-Host "✓ Production build successful!" -ForegroundColor Green
} catch {
    Write-Host "⚠ Build issues detected, but continuing..." -ForegroundColor Yellow
    Write-Host "  You can fix build issues later" -ForegroundColor Gray
}

Write-Host ""

# Step 7: Start development server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 READY TO START DEVELOPMENT!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting your live development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Your website will be available at:" -ForegroundColor Cyan
Write-Host "📱 Local:    http://localhost:3000" -ForegroundColor Green
Write-Host "🌐 Network:  http://192.168.x.x:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "The server will automatically reload when you save files" -ForegroundColor Gray
Write-Host ""

# Start the development server
npm run dev
