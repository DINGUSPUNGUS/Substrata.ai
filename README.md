# Substrata.ai Conservation Platform

An advanced conservation automation platform for data collection, stakeholder management, and impact reporting.

## Features

- 📊 **Real-time Dashboard** - Conservation metrics and KPIs
- 🗺️ **Interactive Heat Maps** - Threat level visualization
- 📋 **Project Management** - Complete project lifecycle management
- 🌱 **Field Surveys** - Digital data collection tools
- 👥 **Stakeholder Management** - Donors, volunteers, and teams
- 📈 **Automated Reporting** - Impact assessments and compliance

## Quick Start

1. Clone this repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended) - Zero Configuration

The platform is pre-configured for Vercel and works immediately without any environment variables!

**Quick Deploy:**
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project" → Import `DINGUSPUNGUS/Substrata.ai`
3. Click "Deploy" - That's it! 🚀

**Command Line Deploy:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Environment Variables (Optional Enhancement)

The platform works perfectly without any environment variables. These are optional for enhanced features:

**To add in Vercel Dashboard (Settings → Environment Variables):**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key  
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token
```

**How to get these (optional):**
- **Supabase**: [supabase.com](https://supabase.com) → Create project → Copy URL & API key
- **Mapbox**: [mapbox.com](https://mapbox.com) → Get access token

**Note:** The conservation platform includes sample data and works fully without external services.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Database**: Supabase with PostGIS
- **Maps**: Mapbox GL
- **Charts**: Recharts
- **Deployment**: Vercel

## Project Structure

```
├── components/          # Reusable UI components
├── pages/              # Next.js pages and routing
├── styles/             # Global styles and Tailwind config
├── shared-backend/     # Database schema and utilities
└── tools/              # Automation and utility scripts
```

## Contributing

This platform is designed to be applied to any conservation project worldwide. Contributions are welcome!

## License

MIT License - Feel free to use for conservation efforts globally.
