-- Sample data for Substrata.AI Conservation Platform

-- Insert sample organizations
INSERT INTO organizations (id, name, description, type, website, email, phone) VALUES 
(uuid_generate_v4(), 'Yellowstone Conservation Alliance', 'Protecting wildlife and ecosystems in the Greater Yellowstone region', 'npo', 'https://yellowstoneconservation.org', 'info@yellowstoneconservation.org', '+1-406-555-0123'),
(uuid_generate_v4(), 'Pacific Marine Research Institute', 'Leading marine conservation research and education', 'research', 'https://pacificmarine.edu', 'research@pacificmarine.edu', '+1-503-555-0456');

-- Insert sample users (will need to adjust IDs based on actual organization IDs)
INSERT INTO users (id, email, name, role, profile) VALUES 
(uuid_generate_v4(), 'sarah.johnson@yellowstoneconservation.org', 'Dr. Sarah Johnson', 'coordinator', '{"title": "Wildlife Biologist", "specialization": "Large Mammals"}'),
(uuid_generate_v4(), 'mike.chen@yellowstoneconservation.org', 'Mike Chen', 'researcher', '{"title": "Field Researcher", "specialization": "Bird Migration"}'),
(uuid_generate_v4(), 'alex.rivera@yellowstoneconservation.org', 'Alex Rivera', 'volunteer', '{"title": "Volunteer Coordinator", "experience": "5 years"}');

-- Insert sample species
INSERT INTO species (id, scientific_name, common_name, taxonomy, conservation_status, description, habitat_preferences) VALUES 
(uuid_generate_v4(), 'Canis lupus', 'Gray Wolf', '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Canidae", "genus": "Canis"}', 'Least Concern', 'Large carnivorous mammal', ARRAY['Forest', 'Tundra', 'Grassland']),
(uuid_generate_v4(), 'Ursus arctos', 'Brown Bear', '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Ursidae", "genus": "Ursus"}', 'Least Concern', 'Large omnivorous mammal', ARRAY['Forest', 'Mountain', 'Coastal']),
(uuid_generate_v4(), 'Aquila chrysaetos', 'Golden Eagle', '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Aves", "order": "Accipitriformes", "family": "Accipitridae", "genus": "Aquila"}', 'Least Concern', 'Large bird of prey', ARRAY['Mountain', 'Desert', 'Grassland']),
(uuid_generate_v4(), 'Alces alces', 'Moose', '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Artiodactyla", "family": "Cervidae", "genus": "Alces"}', 'Least Concern', 'Largest member of deer family', ARRAY['Forest', 'Wetland', 'Boreal']);

-- Insert sample survey sites
INSERT INTO survey_sites (id, name, description, location, habitat_type, area_hectares, elevation_meters, established_date, status) VALUES 
(uuid_generate_v4(), 'Lamar Valley Wildlife Corridor', 'Primary wildlife observation area in Yellowstone', ST_GeogFromText('POINT(-110.1234 44.9876)'), 'Grassland/Riparian', 2500.0, 2000, '2020-01-15', 'active'),
(uuid_generate_v4(), 'Hayden Valley Wetlands', 'Important waterfowl and wildlife habitat', ST_GeogFromText('POINT(-110.4567 44.5678)'), 'Wetland/Grassland', 1800.0, 2200, '2019-06-20', 'active'),
(uuid_generate_v4(), 'Tower Creek Research Station', 'Long-term ecological monitoring site', ST_GeogFromText('POINT(-110.8901 44.8901)'), 'Forest/Stream', 500.0, 1900, '2018-03-10', 'active');

-- Insert sample surveys (use actual site IDs from above)
INSERT INTO surveys (id, name, description, survey_type, date_start, date_end, status, weather_conditions, observers, methodology, notes) VALUES 
(uuid_generate_v4(), 'Winter Wolf Pack Survey 2024', 'Annual wolf pack monitoring in Lamar Valley', 'wildlife', '2024-12-01 08:00:00-07', '2024-12-01 16:00:00-07', 'completed', '{"temperature": "-5C", "conditions": "Clear", "wind": "5 mph NW"}', ARRAY['Dr. Sarah Johnson', 'Mike Chen'], 'Visual observation with spotting scopes and GPS tracking', 'Observed 3 wolf packs totaling 18 individuals'),
(uuid_generate_v4(), 'Spring Bird Migration Count', 'Waterfowl migration monitoring', 'wildlife', '2024-05-15 06:00:00-06', '2024-05-15 18:00:00-06', 'completed', '{"temperature": "12C", "conditions": "Partly cloudy", "wind": "10 mph SW"}', ARRAY['Alex Rivera', 'Field Team Alpha'], 'Point counts every 100m along transect', 'Peak migration period, 42 species recorded'),
(uuid_generate_v4(), 'Forest Biodiversity Assessment - December', 'Monthly forest health monitoring', 'biodiversity', '2024-12-10 09:00:00-07', NULL, 'planned', NULL, ARRAY['Dr. Sarah Johnson'], 'Standardized forest inventory protocol', 'Focus on understory vegetation and small mammals');

-- Insert sample donors
INSERT INTO donors (id, name, type, email, phone, contact_person, tier, engagement_level, interests, first_donation_date, notes) VALUES 
(uuid_generate_v4(), 'Green Earth Foundation', 'foundation', 'contact@greenearth.org', '+1-555-123-4567', 'Jennifer Martinez', 'major', 'high', ARRAY['Wildlife Protection', 'Forest Conservation'], '2022-03-15', 'Particularly interested in wolf conservation programs'),
(uuid_generate_v4(), 'Ocean Conservation Society', 'foundation', 'info@oceancons.org', '+1-555-987-6543', 'Dr. Michael Chen', 'major', 'high', ARRAY['Marine Biology', 'Coastal Protection'], '2021-08-20', 'Monthly recurring donor, very responsive to updates'),
(uuid_generate_v4(), 'Sarah & Robert Johnson', 'individual', 'sarahjohnson@email.com', '+1-555-456-7890', 'Sarah Johnson', 'regular', 'medium', ARRAY['Bird Watching', 'Habitat Restoration'], '2020-11-10', 'Retired couple, donate annually in memory of their daughter'),
(uuid_generate_v4(), 'TechForGood Corporation', 'corporation', 'giving@techforgood.com', '+1-555-222-3333', 'Amanda Foster', 'major', 'low', ARRAY['Technology in Conservation', 'Data Analytics'], '2023-01-05', 'CSR program, interested in tech-driven solutions');

-- Insert sample donations (use actual donor IDs)
INSERT INTO donations (amount, donation_date, donation_type, purpose, acknowledgment_sent) VALUES 
(50000.00, '2024-11-15', 'one_time', 'Wolf Conservation Program', true),
(25000.00, '2024-12-01', 'recurring', 'General Operations', true),
(5000.00, '2024-10-20', 'one_time', 'Bird Research Initiative', true),
(15000.00, '2024-09-15', 'one_time', 'Technology Infrastructure', false);

-- Insert sample projects
INSERT INTO projects (id, name, description, objectives, status, start_date, end_date, budget_total, team_members, priority) VALUES 
(uuid_generate_v4(), 'Yellowstone Wolf Recovery Monitoring', 'Long-term monitoring of wolf pack dynamics and ecosystem impacts', ARRAY['Track wolf pack population trends', 'Monitor prey species interactions', 'Assess ecosystem restoration'], 'active', '2024-01-01', '2026-12-31', 250000.00, ARRAY[], 'high'),
(uuid_generate_v4(), 'Migratory Bird Habitat Restoration', 'Restore critical stopover habitat for migratory bird species', ARRAY['Plant native vegetation', 'Remove invasive species', 'Create water features'], 'active', '2024-03-01', '2025-08-31', 125000.00, ARRAY[], 'medium'),
(uuid_generate_v4(), 'Community Education Outreach', 'Educational programs for local schools and communities', ARRAY['Develop curriculum materials', 'Train volunteer educators', 'Reach 1000 students annually'], 'planning', '2025-01-01', '2025-12-31', 75000.00, ARRAY[], 'medium');

-- Insert sample volunteers
INSERT INTO volunteers (id, name, email, phone, skills, experience_level, training_completed, status, joined_date) VALUES 
(uuid_generate_v4(), 'Emma Thompson', 'emma.thompson@email.com', '+1-555-111-2222', ARRAY['Wildlife Photography', 'GPS Navigation', 'First Aid'], 'intermediate', ARRAY['Wildlife Safety Training', 'Data Collection Protocol'], 'active', '2024-03-15'),
(uuid_generate_v4(), 'James Wilson', 'james.wilson@email.com', '+1-555-333-4444', ARRAY['Bird Identification', 'Data Entry', 'Public Speaking'], 'experienced', ARRAY['Bird Banding Certification', 'Leadership Training'], 'active', '2023-08-20'),
(uuid_generate_v4(), 'Maria Rodriguez', 'maria.rodriguez@email.com', '+1-555-555-6666', ARRAY['Trail Maintenance', 'Group Leadership', 'Environmental Education'], 'expert', ARRAY['Wilderness First Aid', 'Environmental Education Certification'], 'active', '2022-05-10');

-- Insert sample conservation metrics
INSERT INTO conservation_metrics (metric_type, value, unit, measurement_date, methodology, confidence_level, baseline_value, target_value, notes) VALUES 
('wolf_pack_count', 8, 'packs', '2024-12-01', 'Visual observation and GPS collar data', 4, 5, 10, 'Steady increase from reintroduction baseline'),
('species_diversity_index', 3.2, 'shannon_index', '2024-11-30', 'Standardized biodiversity survey protocol', 5, 2.8, 3.5, 'Approaching target diversity levels'),
('habitat_restored', 150, 'hectares', '2024-10-31', 'GIS mapping of restoration areas', 5, 0, 500, 'On track to meet 3-year restoration goal'),
('volunteer_hours', 2840, 'hours', '2024-11-30', 'Volunteer time tracking system', 5, 1200, 4000, 'Exceeding participation targets');

-- Insert sample automated tasks
INSERT INTO automated_tasks (title, description, task_type, trigger_condition, action_config, status, next_execution) VALUES 
('Monthly Survey Reminder', 'Remind field teams of upcoming monthly surveys', 'survey_reminder', '{"frequency": "monthly", "day": 1}', '{"email_template": "survey_reminder", "recipients": ["field_team"]}', 'active', '2025-01-01 09:00:00-07'),
('Grant Report Deadline Alert', 'Alert when grant reports are due within 2 weeks', 'report_deadline', '{"days_before": 14}', '{"email_template": "deadline_alert", "recipients": ["admin", "project_manager"]}', 'active', '2024-12-20 09:00:00-07'),
('Donor Thank You Follow-up', 'Send thank you messages to new donors', 'donor_followup', '{"trigger": "new_donation", "delay_days": 3}', '{"email_template": "donor_thanks", "personalized": true}', 'active', NULL);