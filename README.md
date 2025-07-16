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

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

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
