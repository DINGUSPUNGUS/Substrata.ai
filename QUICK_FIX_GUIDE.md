# URGENT FIX GUIDE - Substrata.ai Project Recovery

## Issue Identified
Your Node.js environment is not properly configured, which is causing both local development and deployment failures.

## IMMEDIATE FIXES NEEDED

### 1. Install Node.js (CRITICAL)
1. Go to https://nodejs.org/
2. Download and install the LTS version (recommended for production)
3. During installation, make sure "Add to PATH" is checked
4. Restart VS Code and your terminal after installation

### 2. Verify Installation
Open a new PowerShell terminal and run:
```powershell
node --version
npm --version
```
Both commands should return version numbers.

### 3. Install Dependencies
```powershell
cd "c:\Users\juden\.vscode\Substrata.ai"
npm install
```

### 4. Test Local Development
```powershell
npm run dev
```
This should start the server on http://localhost:3000

### 5. Test Build
```powershell
npm run build
```
This should complete without errors.

## Potential Additional Issues to Check

### Check for Missing Environment Variables
Create a `.env.local` file in the project root with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Dependency Version Conflicts
If you get dependency errors, try:
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

## Next Steps After Node.js Installation
1. Run the development server locally
2. Test all functionality
3. Run production build
4. Deploy to Vercel

## Quick Commands Reference
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run deploy` - Deploy to Vercel
