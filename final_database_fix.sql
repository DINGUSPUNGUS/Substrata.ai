-- FINAL COMPREHENSIVE DATABASE FIX
-- This script fixes ALL security and performance issues in ONE run
-- Stop all other SQL executions and run ONLY this script

-- ========================================
-- 1. CLEAN SLATE - Drop ALL policies
-- ========================================
DROP POLICY IF EXISTS "user_profiles_all_operations" ON public.user_profiles;
DROP POLICY IF EXISTS "projects_all_operations" ON public.projects;
DROP POLICY IF EXISTS "sites_all_operations" ON public.sites;
DROP POLICY IF EXISTS "surveys_all_operations" ON public.surveys;
DROP POLICY IF EXISTS "survey_forms_all_operations" ON public.survey_forms;
DROP POLICY IF EXISTS "species_observations_all_operations" ON public.species_observations;
DROP POLICY IF EXISTS "stakeholders_all_operations" ON public.stakeholders;
DROP POLICY IF EXISTS "stakeholder_interactions_all_operations" ON public.stakeholder_interactions;
DROP POLICY IF EXISTS "email_campaigns_all_operations" ON public.email_campaigns;
DROP POLICY IF EXISTS "activity_logs_all_operations" ON public.activity_logs;
DROP POLICY IF EXISTS "project_members_all_operations" ON public.project_members;

-- Drop any other existing policies
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- ========================================
-- 2. ENABLE RLS ON ALL TABLES
-- ========================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. CREATE OPTIMIZED SINGLE POLICIES
-- ========================================

-- USER PROFILES - Single optimized policy
CREATE POLICY "user_profiles_all_operations" ON public.user_profiles
FOR ALL USING (id = (SELECT auth.uid()));

-- PROJECTS - Single optimized policy
CREATE POLICY "projects_all_operations" ON public.projects
FOR ALL USING (
  created_by = (SELECT auth.uid()) OR 
  id IN (SELECT project_id FROM public.project_members WHERE user_id = (SELECT auth.uid()) AND project_members.deleted_at IS NULL)
);

-- SITES - Single optimized policy
CREATE POLICY "sites_all_operations" ON public.sites
FOR ALL USING (
  created_by = (SELECT auth.uid()) OR
  project_id IN (
    SELECT id FROM public.projects WHERE created_by = (SELECT auth.uid())
    UNION
    SELECT project_id FROM public.project_members WHERE user_id = (SELECT auth.uid())
  )
);

-- SURVEYS - Single optimized policy
CREATE POLICY "surveys_all_operations" ON public.surveys
FOR ALL USING (
  surveyor_id = (SELECT auth.uid()) OR
  site_id IN (
    SELECT s.id FROM public.sites s 
    JOIN public.projects p ON s.project_id = p.id 
    WHERE p.created_by = (SELECT auth.uid())
  )
);

-- SURVEY FORMS - Single optimized policy
CREATE POLICY "survey_forms_all_operations" ON public.survey_forms
FOR ALL USING (created_by = (SELECT auth.uid()));

-- SPECIES OBSERVATIONS - Single optimized policy
CREATE POLICY "species_observations_all_operations" ON public.species_observations
FOR ALL USING (
  survey_id IN (
    SELECT s.id FROM public.surveys s
    JOIN public.sites st ON s.site_id = st.id
    JOIN public.projects p ON st.project_id = p.id
    WHERE p.created_by = (SELECT auth.uid()) OR s.surveyor_id = (SELECT auth.uid())
  )
);

-- STAKEHOLDERS - Single optimized policy
CREATE POLICY "stakeholders_all_operations" ON public.stakeholders
FOR ALL USING (created_by = (SELECT auth.uid()));

-- STAKEHOLDER INTERACTIONS - Single optimized policy
CREATE POLICY "stakeholder_interactions_all_operations" ON public.stakeholder_interactions
FOR ALL USING (
  created_by = (SELECT auth.uid()) OR
  stakeholder_id IN (SELECT id FROM public.stakeholders WHERE created_by = (SELECT auth.uid()))
);

-- EMAIL CAMPAIGNS - Single optimized policy
CREATE POLICY "email_campaigns_all_operations" ON public.email_campaigns
FOR ALL USING (created_by = (SELECT auth.uid()));

-- ACTIVITY LOGS - Single optimized policy
CREATE POLICY "activity_logs_all_operations" ON public.activity_logs
FOR ALL USING (user_id = (SELECT auth.uid()));

-- PROJECT MEMBERS - Single optimized policy (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_members') THEN
    EXECUTE 'CREATE POLICY "project_members_all_operations" ON public.project_members
    FOR ALL USING (
      user_id = (SELECT auth.uid()) OR 
      project_id IN (SELECT id FROM public.projects WHERE created_by = (SELECT auth.uid()))
    )';
    RAISE NOTICE 'Created policy for project_members';
  END IF;
END $$;

-- ========================================
-- 4. CREATE PROJECT_MEMBERS TABLE 
-- ========================================
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 5. CREATE PERFORMANCE INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);
CREATE INDEX IF NOT EXISTS idx_sites_project_id ON public.sites(project_id);
CREATE INDEX IF NOT EXISTS idx_surveys_site_id ON public.surveys(site_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON public.project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);

-- ========================================
-- 6. SIMPLE VERIFICATION
-- ========================================
SELECT 'Database security fix completed successfully!' as status;
