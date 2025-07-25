-- Conservation Platform Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users and authentication (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'field_researcher',
  avatar_url TEXT,
  organization TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conservation Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  budget DECIMAL(10,2),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conservation Sites
CREATE TABLE IF NOT EXISTS public.sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  name TEXT NOT NULL,
  description TEXT,
  site_type TEXT DEFAULT 'research',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  area_hectares DECIMAL(10,2),
  elevation_min INTEGER,
  elevation_max INTEGER,
  accessibility TEXT,
  safety_notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Survey Forms (dynamic form builder)
CREATE TABLE IF NOT EXISTS public.survey_forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  form_schema JSONB NOT NULL,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Survey Data Collection
CREATE TABLE IF NOT EXISTS public.surveys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID REFERENCES public.survey_forms(id),
  site_id UUID REFERENCES public.sites(id),
  surveyor_id UUID REFERENCES auth.users(id),
  survey_date DATE DEFAULT CURRENT_DATE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  gps_accuracy DECIMAL(5,2),
  survey_data JSONB NOT NULL,
  photos TEXT[],
  files TEXT[],
  weather_conditions TEXT,
  notes TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Species Observations
CREATE TABLE IF NOT EXISTS public.species_observations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  survey_id UUID REFERENCES public.surveys(id),
  species_name TEXT NOT NULL,
  scientific_name TEXT,
  count INTEGER DEFAULT 1,
  behavior TEXT,
  life_stage TEXT,
  conservation_status TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  photo_urls TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stakeholder CRM
CREATE TABLE IF NOT EXISTS public.stakeholders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'volunteer',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  organization TEXT,
  position TEXT,
  address TEXT,
  interests TEXT[],
  skills TEXT[],
  availability TEXT,
  contact_preferences JSONB DEFAULT '{}',
  notes TEXT,
  tags TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stakeholder Interactions
CREATE TABLE IF NOT EXISTS public.stakeholder_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  stakeholder_id UUID REFERENCES public.stakeholders(id),
  interaction_type TEXT NOT NULL DEFAULT 'email',
  subject TEXT,
  description TEXT,
  interaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  outcome TEXT,
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Campaigns
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template_id UUID,
  campaign_type TEXT DEFAULT 'newsletter',
  target_audience JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  send_date TIMESTAMP WITH TIME ZONE,
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Logging
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_surveys_site_id ON public.surveys(site_id);
CREATE INDEX IF NOT EXISTS idx_surveys_date ON public.surveys(survey_date);
CREATE INDEX IF NOT EXISTS idx_stakeholders_type ON public.stakeholders(type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "All authenticated users can view projects" ON public.projects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can view sites" ON public.sites
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create surveys" ON public.surveys
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = surveyor_id);

CREATE POLICY "Users can view surveys" ON public.surveys
  FOR SELECT TO authenticated USING (true);

-- Insert some sample data for testing
INSERT INTO public.projects (name, description, status) VALUES
  ('Yellowstone Conservation Initiative', 'Wildlife protection and habitat restoration in Yellowstone region', 'active'),
  ('Coastal Wetland Restoration', 'Restoration of coastal wetland ecosystems', 'active'),
  ('Urban Biodiversity Study', 'Study of biodiversity in urban environments', 'planning')
ON CONFLICT DO NOTHING;

INSERT INTO public.sites (project_id, name, description, site_type, latitude, longitude, area_hectares) 
SELECT 
  p.id,
  'Yellowstone Research Area',
  'Primary research and monitoring site in Yellowstone National Park',
  'research',
  44.428,
  -110.588,
  2500.0
FROM public.projects p WHERE p.name = 'Yellowstone Conservation Initiative'
ON CONFLICT DO NOTHING;

INSERT INTO public.survey_forms (name, description, form_schema, category) VALUES
  ('Wildlife Observation Form', 'Standard form for wildlife observations', 
   '{"fields": [{"type": "text", "name": "species", "label": "Species Name", "required": true}, {"type": "number", "name": "count", "label": "Individual Count"}, {"type": "textarea", "name": "behavior", "label": "Observed Behavior"}]}',
   'wildlife'),
  ('Habitat Assessment Form', 'Form for habitat quality assessment',
   '{"fields": [{"type": "select", "name": "habitat_type", "label": "Habitat Type", "options": ["Forest", "Grassland", "Wetland", "Desert"]}, {"type": "number", "name": "canopy_cover", "label": "Canopy Cover %"}, {"type": "textarea", "name": "notes", "label": "Additional Notes"}]}',
   'habitat')
ON CONFLICT DO NOTHING;
