# Substrata.ai Deployment & Local Development Troubleshooting

## 🚨 IMMEDIATE ACTION REQUIRED

### Primary Issue Identified
**Node.js is not installed or not in system PATH**

This is causing:
- Local development server failure (127.0.0.1 refused to connect)
- Build failures
- Deployment failures to Vercel

## 🔧 STEP-BY-STEP FIX

### 1. Install Node.js (CRITICAL FIRST STEP)
1. Go to https://nodejs.org/
2. Download the **LTS version** (currently recommended for production)
3. Run the installer with **default settings**
4. **IMPORTANT**: Make sure "Add to PATH" is checked during installation
5. **Restart VS Code** after installation
6. Open a **new PowerShell terminal**

### 2. Verify Installation
```powershell
node --version
npm --version
```
Both should return version numbers (e.g., v18.17.0 and 9.6.7)

### 3. Run the Recovery Script
```powershell
.\fix-project.ps1
```

### 4. Manual Recovery (if script fails)
```powershell
# Navigate to project
cd "c:\Users\juden\.vscode\Substrata.ai"

# Install dependencies
npm install

# Test build
npm run build

# Start development server
npm run dev
```

## 🔍 COMMON ISSUES & SOLUTIONS

### If npm install fails:
```powershell
# Clear npm cache
npm cache clean --force

# Remove old files
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Reinstall
npm install
```

### If build fails with "Module not found":
1. Check all import paths in your components
2. Ensure all referenced files exist
3. Check for typos in file names

### If Vercel deployment fails:
1. Ensure your GitHub repo is up to date
2. Check Vercel environment variables
3. Verify build passes locally first

### Environment Variables Setup:
1. Copy `.env.local.template` to `.env.local`
2. Fill in your actual API keys:
   - Supabase URL and Anon Key
   - Mapbox Token
   - Any other required variables

## 🚀 DEPLOYMENT CHECKLIST

After local development works:

1. ✅ Local development server runs (`npm run dev`)
2. ✅ Production build succeeds (`npm run build`)
3. ✅ All environment variables configured
4. ✅ Git repository is up to date
5. ✅ Vercel project is properly linked
6. ✅ Deploy to Vercel (`npm run deploy`)

## 🆘 IF STILL HAVING ISSUES

1. **Check Windows PATH**: Node.js should be in your system PATH
2. **Restart everything**: Close VS Code, restart terminal
3. **Check file permissions**: Ensure you can write to the project directory
4. **Antivirus software**: Some antivirus might block npm operations
5. **Network issues**: Corporate firewalls might block npm registry

## 📞 Quick Recovery Commands
```powershell
# Full clean and reinstall
Remove-Item -Recurse -Force node_modules, .next, package-lock.json -ErrorAction SilentlyContinue
npm install
npm run build
npm run dev
```

## 🔗 Useful Links
- Node.js Download: https://nodejs.org/
- npm Documentation: https://docs.npmjs.com/
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
