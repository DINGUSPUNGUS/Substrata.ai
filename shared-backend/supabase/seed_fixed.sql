-- Sample data for Substrata.AI Conservation Platform
-- PostgreSQL/Supabase compatible syntax

-- Insert sample organizations first
INSERT INTO organizations (name, description, type, website, email, phone) VALUES 
('Yellowstone Conservation Alliance', 'Protecting wildlife and ecosystems in the Greater Yellowstone region', 'npo', 'https://yellowstoneconservation.org', 'info@yellowstoneconservation.org', '+1-406-555-0123'),
('Pacific Marine Research Institute', 'Leading marine conservation research and education', 'research', 'https://pacificmarine.edu', 'research@pacificmarine.edu', '+1-503-555-0456');

-- Insert sample users with organization references
INSERT INTO users (organization_id, email, name, role, profile) 
SELECT 
  o.id,
  'sarah.johnson@yellowstoneconservation.org',
  'Dr. Sarah Johnson',
  'coordinator',
  '{"title": "Wildlife Biologist", "specialization": "Large Mammals"}'::jsonb
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance'
UNION ALL
SELECT 
  o.id,
  'mike.chen@yellowstoneconservation.org',
  'Mike Chen',
  'researcher',
  '{"title": "Field Researcher", "specialization": "Bird Migration"}'::jsonb
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance'
UNION ALL
SELECT 
  o.id,
  'alex.rivera@yellowstoneconservation.org',
  'Alex Rivera',
  'volunteer',
  '{"title": "Volunteer Coordinator", "experience": "5 years"}'::jsonb
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance';

-- Insert sample species
INSERT INTO species (scientific_name, common_name, taxonomy, conservation_status, description, habitat_preferences) VALUES 
('Canis lupus', 'Gray Wolf', '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Canidae", "genus": "Canis"}'::jsonb, 'Least Concern', 'Large carnivorous mammal', ARRAY['Forest', 'Tundra', 'Grassland']),
('Ursus arctos', 'Brown Bear', '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Ursidae", "genus": "Ursus"}'::jsonb, 'Least Concern', 'Large omnivorous mammal', ARRAY['Forest', 'Mountain', 'Coastal']),
('Aquila chrysaetos', 'Golden Eagle', '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Aves", "order": "Accipitriformes", "family": "Accipitridae", "genus": "Aquila"}'::jsonb, 'Least Concern', 'Large bird of prey', ARRAY['Mountain', 'Desert', 'Grassland']),
('Alces alces', 'Moose', '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Artiodactyla", "family": "Cervidae", "genus": "Alces"}'::jsonb, 'Least Concern', 'Largest member of deer family', ARRAY['Forest', 'Wetland', 'Boreal']);

-- Insert sample survey sites
INSERT INTO survey_sites (organization_id, name, description, location, habitat_type, area_hectares, elevation_meters, established_date, status) 
SELECT 
  o.id,
  'Lamar Valley Wildlife Corridor',
  'Primary wildlife observation area in Yellowstone',
  ST_GeogFromText('POINT(-110.1234 44.9876)'),
  'Grassland/Riparian',
  2500.0,
  2000,
  '2020-01-15'::date,
  'active'
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance'
UNION ALL
SELECT 
  o.id,
  'Hayden Valley Wetlands',
  'Important waterfowl and wildlife habitat',
  ST_GeogFromText('POINT(-110.4567 44.5678)'),
  'Wetland/Grassland',
  1800.0,
  2200,
  '2019-06-20'::date,
  'active'
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance'
UNION ALL
SELECT 
  o.id,
  'Tower Creek Research Station',
  'Long-term ecological monitoring site',
  ST_GeogFromText('POINT(-110.8901 44.8901)'),
  'Forest/Stream',
  500.0,
  1900,
  '2018-03-10'::date,
  'active'
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance';

-- Insert sample surveys with proper foreign key references
INSERT INTO surveys (organization_id, site_id, name, description, survey_type, date_start, date_end, status, weather_conditions, observers, methodology, notes) 
SELECT 
  o.id,
  s.id,
  'Winter Wolf Pack Survey 2024',
  'Annual wolf pack monitoring in Lamar Valley',
  'wildlife',
  '2024-12-01 08:00:00-07'::timestamp with time zone,
  '2024-12-01 16:00:00-07'::timestamp with time zone,
  'completed',
  '{"temperature": "-5C", "conditions": "Clear", "wind": "5 mph NW"}'::jsonb,
  ARRAY['Dr. Sarah Johnson', 'Mike Chen'],
  'Visual observation with spotting scopes and GPS tracking',
  'Observed 3 wolf packs totaling 18 individuals'
FROM organizations o, survey_sites s 
WHERE o.name = 'Yellowstone Conservation Alliance' AND s.name = 'Lamar Valley Wildlife Corridor'
UNION ALL
SELECT 
  o.id,
  s.id,
  'Spring Bird Migration Count',
  'Waterfowl migration monitoring',
  'wildlife',
  '2024-05-15 06:00:00-06'::timestamp with time zone,
  '2024-05-15 18:00:00-06'::timestamp with time zone,
  'completed',
  '{"temperature": "12C", "conditions": "Partly cloudy", "wind": "10 mph SW"}'::jsonb,
  ARRAY['Alex Rivera', 'Field Team Alpha'],
  'Point counts every 100m along transect',
  'Peak migration period, 42 species recorded'
FROM organizations o, survey_sites s 
WHERE o.name = 'Yellowstone Conservation Alliance' AND s.name = 'Hayden Valley Wetlands'
UNION ALL
SELECT 
  o.id,
  s.id,
  'Forest Biodiversity Assessment - December',
  'Monthly forest health monitoring',
  'biodiversity',
  '2024-12-10 09:00:00-07'::timestamp with time zone,
  NULL,
  'planned',
  NULL,
  ARRAY['Dr. Sarah Johnson'],
  'Standardized forest inventory protocol',
  'Focus on understory vegetation and small mammals'
FROM organizations o, survey_sites s 
WHERE o.name = 'Yellowstone Conservation Alliance' AND s.name = 'Tower Creek Research Station';

-- Insert sample donors with organization references
INSERT INTO donors (organization_id, name, type, email, phone, contact_person, tier, engagement_level, interests, first_donation_date, notes) 
SELECT 
  o.id,
  'Green Earth Foundation',
  'foundation',
  'contact@greenearth.org',
  '+1-555-123-4567',
  'Jennifer Martinez',
  'major',
  'high',
  ARRAY['Wildlife Protection', 'Forest Conservation'],
  '2022-03-15'::date,
  'Particularly interested in wolf conservation programs'
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance'
UNION ALL
SELECT 
  o.id,
  'Ocean Conservation Society',
  'foundation',
  'info@oceancons.org',
  '+1-555-987-6543',
  'Dr. Michael Chen',
  'major',
  'high',
  ARRAY['Marine Biology', 'Coastal Protection'],
  '2021-08-20'::date,
  'Monthly recurring donor, very responsive to updates'
FROM organizations o WHERE o.name = 'Pacific Marine Research Institute'
UNION ALL
SELECT 
  o.id,
  'Sarah & Robert Johnson',
  'individual',
  'sarahjohnson@email.com',
  '+1-555-456-7890',
  'Sarah Johnson',
  'regular',
  'medium',
  ARRAY['Bird Watching', 'Habitat Restoration'],
  '2020-11-10'::date,
  'Retired couple, donate annually in memory of their daughter'
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance'
UNION ALL
SELECT 
  o.id,
  'TechForGood Corporation',
  'corporation',
  'giving@techforgood.com',
  '+1-555-222-3333',
  'Amanda Foster',
  'major',
  'low',
  ARRAY['Technology in Conservation', 'Data Analytics'],
  '2023-01-05'::date,
  'CSR program, interested in tech-driven solutions'
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance';

-- Insert sample donations with donor references
INSERT INTO donations (donor_id, amount, donation_date, donation_type, purpose, acknowledgment_sent) 
SELECT 
  d.id,
  50000.00,
  '2024-11-15'::date,
  'one_time',
  'Wolf Conservation Program',
  true
FROM donors d WHERE d.name = 'Green Earth Foundation'
UNION ALL
SELECT 
  d.id,
  25000.00,
  '2024-12-01'::date,
  'recurring',
  'General Operations',
  true
FROM donors d WHERE d.name = 'Ocean Conservation Society'
UNION ALL
SELECT 
  d.id,
  5000.00,
  '2024-10-20'::date,
  'one_time',
  'Bird Research Initiative',
  true
FROM donors d WHERE d.name = 'Sarah & Robert Johnson'
UNION ALL
SELECT 
  d.id,
  15000.00,
  '2024-09-15'::date,
  'one_time',
  'Technology Infrastructure',
  false
FROM donors d WHERE d.name = 'TechForGood Corporation';

-- Insert sample projects with organization references
INSERT INTO projects (organization_id, name, description, objectives, status, start_date, end_date, budget_total, team_members, priority) 
SELECT 
  o.id,
  'Yellowstone Wolf Recovery Monitoring',
  'Long-term monitoring of wolf pack dynamics and ecosystem impacts',
  ARRAY['Track wolf pack population trends', 'Monitor prey species interactions', 'Assess ecosystem restoration'],
  'active',
  '2024-01-01'::date,
  '2026-12-31'::date,
  250000.00,
  ARRAY[]::text[],
  'high'
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance'
UNION ALL
SELECT 
  o.id,
  'Migratory Bird Habitat Restoration',
  'Restore critical stopover habitat for migratory bird species',
  ARRAY['Plant native vegetation', 'Remove invasive species', 'Create water features'],
  'active',
  '2024-03-01'::date,
  '2025-08-31'::date,
  125000.00,
  ARRAY[]::text[],
  'medium'
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance'
UNION ALL
SELECT 
  o.id,
  'Community Education Outreach',
  'Educational programs for local schools and communities',
  ARRAY['Develop curriculum materials', 'Train volunteer educators', 'Reach 1000 students annually'],
  'planning',
  '2025-01-01'::date,
  '2025-12-31'::date,
  75000.00,
  ARRAY[]::text[],
  'medium'
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance';

-- Insert sample volunteers with organization references
INSERT INTO volunteers (organization_id, name, email, phone, skills, experience_level, training_completed, status, joined_date) 
SELECT 
  o.id,
  'Emma Thompson',
  'emma.thompson@email.com',
  '+1-555-111-2222',
  ARRAY['Wildlife Photography', 'GPS Navigation', 'First Aid'],
  'intermediate',
  ARRAY['Wildlife Safety Training', 'Data Collection Protocol'],
  'active',
  '2024-03-15'::date
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance'
UNION ALL
SELECT 
  o.id,
  'James Wilson',
  'james.wilson@email.com',
  '+1-555-333-4444',
  ARRAY['Bird Identification', 'Data Entry', 'Public Speaking'],
  'experienced',
  ARRAY['Bird Banding Certification', 'Leadership Training'],
  'active',
  '2023-08-20'::date
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance'
UNION ALL
SELECT 
  o.id,
  'Maria Rodriguez',
  'maria.rodriguez@email.com',
  '+1-555-555-6666',
  ARRAY['Trail Maintenance', 'Group Leadership', 'Environmental Education'],
  'expert',
  ARRAY['Wilderness First Aid', 'Environmental Education Certification'],
  'active',
  '2022-05-10'::date
FROM organizations o WHERE o.name = 'Yellowstone Conservation Alliance';

-- Insert sample conservation metrics
INSERT INTO conservation_metrics (metric_type, value, unit, measurement_date, methodology, confidence_level, baseline_value, target_value, notes) VALUES 
('wolf_pack_count', 8, 'packs', '2024-12-01'::date, 'Visual observation and GPS collar data', 4, 5, 10, 'Steady increase from reintroduction baseline'),
('species_diversity_index', 3.2, 'shannon_index', '2024-11-30'::date, 'Standardized biodiversity survey protocol', 5, 2.8, 3.5, 'Approaching target diversity levels'),
('habitat_restored', 150, 'hectares', '2024-10-31'::date, 'GIS mapping of restoration areas', 5, 0, 500, 'On track to meet 3-year restoration goal'),
('volunteer_hours', 2840, 'hours', '2024-11-30'::date, 'Volunteer time tracking system', 5, 1200, 4000, 'Exceeding participation targets');

-- Insert sample automated tasks
INSERT INTO automated_tasks (title, description, task_type, trigger_condition, action_config, status, next_execution) VALUES 
('Monthly Survey Reminder', 'Remind field teams of upcoming monthly surveys', 'survey_reminder', '{"frequency": "monthly", "day": 1}'::jsonb, '{"email_template": "survey_reminder", "recipients": ["field_team"]}'::jsonb, 'active', '2025-01-01 09:00:00-07'::timestamp with time zone),
('Grant Report Deadline Alert', 'Alert when grant reports are due within 2 weeks', 'report_deadline', '{"days_before": 14}'::jsonb, '{"email_template": "deadline_alert", "recipients": ["admin", "project_manager"]}'::jsonb, 'active', '2024-12-20 09:00:00-07'::timestamp with time zone),
('Donor Thank You Follow-up', 'Send thank you messages to new donors', 'donor_followup', '{"trigger": "new_donation", "delay_days": 3}'::jsonb, '{"email_template": "donor_thanks", "personalized": true}'::jsonb, 'active', NULL);
