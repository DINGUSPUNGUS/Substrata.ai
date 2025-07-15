-- Substrata.AI Conservation Platform Database Schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Organizations table
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  type text CHECK (type IN ('npo', 'research', 'government', 'corporate')),
  website text,
  email text,
  phone text,
  address jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text CHECK (role IN ('admin', 'coordinator', 'researcher', 'volunteer', 'viewer')),
  profile jsonb,
  last_active timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Survey sites table
CREATE TABLE survey_sites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  name text NOT NULL,
  description text,
  location geography(POINT, 4326) NOT NULL,
  habitat_type text,
  area_hectares numeric,
  elevation_meters integer,
  access_notes text,
  established_date date,
  status text CHECK (status IN ('active', 'inactive', 'seasonal')),
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Species table
CREATE TABLE species (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  scientific_name text UNIQUE NOT NULL,
  common_name text,
  taxonomy jsonb, -- kingdom, phylum, class, order, family, genus
  conservation_status text, -- IUCN status
  description text,
  habitat_preferences text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Surveys table (enhanced)
CREATE TABLE surveys (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  site_id uuid REFERENCES survey_sites(id) NOT NULL,
  name text NOT NULL,
  description text,
  survey_type text CHECK (survey_type IN ('wildlife', 'vegetation', 'water_quality', 'habitat_assessment', 'biodiversity')),
  date_start timestamp with time zone NOT NULL,
  date_end timestamp with time zone,
  status text CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'planned',
  weather_conditions jsonb,
  observers text[], -- Array of observer names
  methodology text,
  equipment_used text[],
  notes text,
  quality_score integer CHECK (quality_score >= 1 AND quality_score <= 5),
  created_by uuid REFERENCES users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Observations table
CREATE TABLE observations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id uuid REFERENCES surveys(id) NOT NULL,
  species_id uuid REFERENCES species(id),
  location geography(POINT, 4326),
  observation_time timestamp with time zone NOT NULL,
  count_individuals integer,
  count_type text CHECK (count_type IN ('exact', 'estimate', 'minimum')),
  life_stage text, -- adult, juvenile, larva, etc.
  behavior text,
  habitat_description text,
  confidence_level integer CHECK (confidence_level >= 1 AND confidence_level <= 5),
  photos text[], -- Array of photo URLs
  audio_recordings text[], -- Array of audio file URLs
  notes text,
  observer_name text,
  verified boolean DEFAULT false,
  verified_by uuid REFERENCES users(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Donors table
CREATE TABLE donors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  name text NOT NULL,
  type text CHECK (type IN ('individual', 'foundation', 'corporation', 'government')),
  email text,
  phone text,
  address jsonb,
  contact_person text,
  tier text CHECK (tier IN ('supporter', 'regular', 'major', 'legacy')),
  engagement_level text CHECK (engagement_level IN ('low', 'medium', 'high')),
  interests text[], -- Conservation focus areas
  communication_preferences jsonb,
  notes text,
  first_donation_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Donations table
CREATE TABLE donations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id uuid REFERENCES donors(id) NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  donation_date date NOT NULL,
  donation_type text CHECK (donation_type IN ('one_time', 'recurring', 'pledge')),
  purpose text, -- Specific project or general fund
  payment_method text,
  tax_deductible boolean DEFAULT true,
  acknowledgment_sent boolean DEFAULT false,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  name text NOT NULL,
  description text,
  objectives text[],
  status text CHECK (status IN ('planning', 'active', 'completed', 'on_hold', 'cancelled')),
  start_date date,
  end_date date,
  budget_total numeric(12,2),
  budget_spent numeric(12,2) DEFAULT 0,
  funding_sources jsonb,
  team_members uuid[], -- Array of user IDs
  location geography(POINT, 4326),
  tags text[],
  priority text CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_by uuid REFERENCES users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Grants table
CREATE TABLE grants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  project_id uuid REFERENCES projects(id),
  funder_name text NOT NULL,
  grant_title text NOT NULL,
  amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text CHECK (status IN ('applied', 'awarded', 'rejected', 'completed')),
  application_date date,
  award_date date,
  start_date date,
  end_date date,
  reporting_requirements jsonb,
  compliance_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Reports table
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  title text NOT NULL,
  type text CHECK (type IN ('impact', 'compliance', 'scientific', 'financial', 'donor_update')),
  status text CHECK (status IN ('draft', 'in_review', 'published', 'archived')),
  content jsonb, -- Structured report content
  file_url text, -- URL to generated PDF/document
  period_start date,
  period_end date,
  stakeholders text[], -- Target audience
  author_id uuid REFERENCES users(id),
  reviewed_by uuid REFERENCES users(id),
  published_date timestamp with time zone,
  download_count integer DEFAULT 0,
  tags text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Volunteers table
CREATE TABLE volunteers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  skills text[],
  availability jsonb, -- Days/times available
  experience_level text CHECK (experience_level IN ('beginner', 'intermediate', 'experienced', 'expert')),
  training_completed text[],
  emergency_contact jsonb,
  background_check_status text,
  notes text,
  status text CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'pending',
  joined_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Volunteer activities/assignments table
CREATE TABLE volunteer_activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id uuid REFERENCES volunteers(id) NOT NULL,
  project_id uuid REFERENCES projects(id),
  survey_id uuid REFERENCES surveys(id),
  activity_type text NOT NULL,
  scheduled_date timestamp with time zone,
  duration_hours numeric(4,2),
  location geography(POINT, 4326),
  status text CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  feedback text,
  hours_logged numeric(4,2),
  supervisor_id uuid REFERENCES users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Conservation metrics table
CREATE TABLE conservation_metrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  project_id uuid REFERENCES projects(id),
  metric_type text NOT NULL, -- 'species_count', 'habitat_restored', 'pollution_reduced', etc.
  value numeric NOT NULL,
  unit text NOT NULL,
  measurement_date date NOT NULL,
  location geography(POINT, 4326),
  methodology text,
  confidence_level integer CHECK (confidence_level >= 1 AND confidence_level <= 5),
  baseline_value numeric,
  target_value numeric,
  notes text,
  measured_by uuid REFERENCES users(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Automated tasks/reminders table
CREATE TABLE automated_tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  title text NOT NULL,
  description text,
  task_type text CHECK (task_type IN ('survey_reminder', 'report_deadline', 'grant_deadline', 'donor_followup', 'volunteer_checkin')),
  trigger_condition jsonb, -- When to execute
  action_config jsonb, -- What to do (email, notification, etc.)
  status text CHECK (status IN ('active', 'paused', 'completed')) DEFAULT 'active',
  last_executed timestamp with time zone,
  next_execution timestamp with time zone,
  execution_count integer DEFAULT 0,
  created_by uuid REFERENCES users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_surveys_organization_id ON surveys(organization_id);
CREATE INDEX idx_surveys_site_id ON surveys(site_id);
CREATE INDEX idx_surveys_date_start ON surveys(date_start);
CREATE INDEX idx_observations_survey_id ON observations(survey_id);
CREATE INDEX idx_observations_species_id ON observations(species_id);
CREATE INDEX idx_observations_location ON observations USING GIST(location);
CREATE INDEX idx_survey_sites_location ON survey_sites USING GIST(location);
CREATE INDEX idx_donors_organization_id ON donors(organization_id);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_grants_organization_id ON grants(organization_id);
CREATE INDEX idx_reports_organization_id ON reports(organization_id);
CREATE INDEX idx_volunteers_organization_id ON volunteers(organization_id);

-- Set up Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE conservation_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_tasks ENABLE ROW LEVEL SECURITY;