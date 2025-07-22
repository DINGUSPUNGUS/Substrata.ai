# Vercel Project Configuration Verification Guide

## Your Actual Project IDs (from .vercel/project.json):
- **Project ID**: `prj_DCpw3vw1hMjtWINxa24rOhXTUETD`
- **Organization ID**: `team_81F8nZMv4Mx34I9rC2KRMTI3`

## GitHub Repository Secrets Required:

Please verify these secrets are set correctly in your GitHub repository:

### 1. VERCEL_TOKEN
- **Description**: Your Vercel authentication token
- **How to get**: Go to Vercel Dashboard → Settings → Tokens → Create new token
- **Format**: Starts with `token_` followed by alphanumeric characters

### 2. VERCEL_ORG_ID  
- **Required Value**: `team_81F8nZMv4Mx34I9rC2KRMTI3`
- **Description**: Your Vercel team/organization ID

### 3. VERCEL_PROJECT_ID
- **Required Value**: `prj_DCpw3vw1hMjtWINxa24rOhXTUETD`  
- **Description**: Your specific Vercel project ID

## To Update GitHub Secrets:

1. Go to your GitHub repository: https://github.com/DINGUSPUNGUS/Substrata.ai
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Update or create these three secrets with the exact values above
4. Make sure there are no extra spaces or characters

## Troubleshooting:

If deployment still fails after updating secrets:
- Double-check that the secret names are exactly: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Ensure the VERCEL_TOKEN has proper permissions for your project
- Verify the token hasn't expired

## Workflow Improvements Made:

- ✅ Added explicit `vercel link` step to ensure proper project linking
- ✅ Added environment variables to each deployment step
- ✅ Updated to use checkout@v4 for better performance
- ✅ Removed incorrect working-directory specifications
