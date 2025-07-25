# PowerShell script to clean exposed secrets from git history
# Run this after rotating your Supabase key

Write-Host "🚨 SECURITY: Cleaning exposed JWT from git history..." -ForegroundColor Red

# Check if git-filter-repo is available
$filterRepo = Get-Command git-filter-repo -ErrorAction SilentlyContinue
if (-not $filterRepo) {
    Write-Host "❌ git-filter-repo not found. Installing..." -ForegroundColor Yellow
    pip install git-filter-repo
}

# Create a temporary file with the replacement text
$tempFile = New-TemporaryFile
$exposedKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5dnVsb25uYXNobXVreGVkb3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNzk1NDIsImV4cCI6MjA2ODg1NTU0Mn0.BIOt9KiMwIrm4sExH01z3BVJIkMyL-GaBsLSIzoUNB4"
"$exposedKey==>***SECURITY_KEY_REMOVED***" | Out-File -FilePath $tempFile.FullName -Encoding UTF8

Write-Host "⚠️  WARNING: This will rewrite git history!" -ForegroundColor Yellow
Write-Host "⚠️  Make sure you have rotated your Supabase key first!" -ForegroundColor Yellow
$confirm = Read-Host "Type 'YES' to proceed with cleaning git history"

if ($confirm -eq "YES") {
    try {
        # Remove the exposed key from git history
        git filter-repo --replace-text $tempFile.FullName --force
        
        Write-Host "✅ Git history cleaned successfully!" -ForegroundColor Green
        Write-Host "🔄 Now force pushing to GitHub..." -ForegroundColor Yellow
        
        # Force push to update remote repository
        git push --force-with-lease origin main
        
        Write-Host "✅ GitHub repository updated!" -ForegroundColor Green
        Write-Host "🔒 Your exposed JWT has been removed from git history" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Error cleaning git history: $_" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Operation cancelled. Please rotate your Supabase key first!" -ForegroundColor Red
}

# Clean up temporary file
Remove-Item $tempFile.FullName -Force

Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify your new Supabase key is working" -ForegroundColor White
Write-Host "2. Update Vercel environment variables" -ForegroundColor White
Write-Host "3. Run security_fixes.sql in Supabase" -ForegroundColor White
Write-Host "4. Mark GitGuardian incident as resolved" -ForegroundColor White
