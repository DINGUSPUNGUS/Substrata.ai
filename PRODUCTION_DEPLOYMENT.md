# 🚀 Production Deployment Guide for substrata-ai.xyz

## ✅ GitHub Repository Updated
- All Phase 2 features committed and pushed
- Production-ready landing page at `/`
- Conservation platform at `/platform`
- Clean, professional interface without developer info

## 🔧 Vercel Environment Variables Setup

Add these environment variables in your Vercel Dashboard:

### 1. Go to Vercel Dashboard
- Navigate to: https://vercel.com/dashboard
- Select your `substrata-ai` project
- Go to **Settings** → **Environment Variables**

### 2. Add Required Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lyvulonnashmukxedovq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5dnVsb25uYXNobXVreGVkb3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNzk1NDIsImV4cCI6MjA2ODg1NTU0Mn0.BIOt9KiMwIrm4sExH01z3BVJIkMyL-GaBsLSIzoUNB4

# Mapbox (Optional - get production token from mapbox.com)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHh4eHh4eHgiLCJhIjoiY2x4eHh4eHh4In0.your-production-mapbox-token

# Production Settings
NODE_ENV=production
NEXT_PUBLIC_ENV=production
```

### 3. Deploy Instructions

1. **Automatic Deployment**: 
   - Vercel will automatically deploy when you push to GitHub
   - Check your Vercel dashboard for deployment status

2. **Manual Deployment**: 
   - In Vercel dashboard, click **"Redeploy"** if needed

3. **Database Setup**:
   - Go to your Supabase dashboard: https://supabase.com/dashboard
   - Open SQL Editor
   - Copy and paste the entire `database_setup.sql` file
   - Run the SQL to create all tables

## 🌐 Production URLs

- **Main Site**: https://substrata-ai.xyz
- **Platform**: https://substrata-ai.xyz/platform
- **Database Test**: https://substrata-ai.xyz/database-test

## 🔍 Features Ready for Production

✅ **Landing Page**: Professional, clean interface
✅ **Interactive GIS Mapping**: Real-time species tracking
✅ **Biodiversity Database**: Comprehensive data management
✅ **Stakeholder CRM**: Complete relationship management
✅ **Advanced Analytics**: Real-time conservation metrics
✅ **Survey Builder**: Dynamic form creation
✅ **Role-Based Access**: Enterprise security
✅ **Project Management**: Full lifecycle tracking
✅ **Email Automation**: Stakeholder engagement
✅ **Activity Logging**: Comprehensive audit trails

## 🎯 Next Steps After Deployment

1. **Test the live site** at substrata-ai.xyz
2. **Run database setup** in Supabase SQL Editor
3. **Verify all platform features** are working
4. **Add production Mapbox token** for enhanced mapping
5. **Configure domain settings** if needed

Your conservation platform is now ready for conservation organizations worldwide! 🌱
