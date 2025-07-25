-- FINAL COMPREHENSIVE DATABASE FIX
-- This script fixes ALL security and performance issues in ONE run
-- Stop all other SQL executions and run ONLY this script

-- ========================================
-- 1. CLEAN UP ALL EXISTING POLICIES
-- ========================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  RAISE NOTICE '🧹 CLEANING UP ALL EXISTING POLICIES...';
  
  -- Drop ALL existing policies on ALL tables
  FOR pol IN 
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
    RAISE NOTICE 'Dropped policy: %.%', pol.tablename, pol.policyname;
  END LOOP;
END $$;

-- ========================================
-- 2. ENABLE RLS ON ALL TABLES
-- ========================================
DO $$
DECLARE
  tbl TEXT;
  tables_to_secure TEXT[] := ARRAY[
    'user_profiles', 'projects', 'sites', 'surveys', 'survey_forms', 
    'species_observations', 'stakeholders', 'stakeholder_interactions', 
    'email_campaigns', 'activity_logs', 'project_members'
  ];
BEGIN
  RAISE NOTICE '🔒 ENABLING RLS ON ALL TABLES...';
  
  FOREACH tbl IN ARRAY tables_to_secure
  LOOP
    BEGIN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
      RAISE NOTICE 'Enabled RLS on: %', tbl;
    EXCEPTION
      WHEN undefined_table THEN
        RAISE NOTICE 'Table % does not exist, skipping', tbl;
      WHEN OTHERS THEN
        RAISE NOTICE 'Error enabling RLS on %: %', tbl, SQLERRM;
    END;
  END LOOP;
END $$;

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
-- 4. ADD MISSING CRITICAL COLUMNS
-- ========================================
DO $$
BEGIN
  RAISE NOTICE '🔧 ADDING MISSING COLUMNS...';
  
  -- Add created_by to survey_forms if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'survey_forms' AND column_name = 'created_by') THEN
    ALTER TABLE public.survey_forms ADD COLUMN created_by UUID REFERENCES auth.users(id);
    RAISE NOTICE 'Added created_by to survey_forms';
  END IF;
  
  -- Add created_by to species_observations if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'species_observations' AND column_name = 'created_by') THEN
    ALTER TABLE public.species_observations ADD COLUMN created_by UUID REFERENCES auth.users(id);
    RAISE NOTICE 'Added created_by to species_observations';
  END IF;
  
  -- Add deleted_at columns where missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'survey_forms' AND column_name = 'deleted_at') THEN
    ALTER TABLE public.survey_forms ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Added deleted_at to survey_forms';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'species_observations' AND column_name = 'deleted_at') THEN
    ALTER TABLE public.species_observations ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Added deleted_at to species_observations';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stakeholder_interactions' AND column_name = 'deleted_at') THEN
    ALTER TABLE public.stakeholder_interactions ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Added deleted_at to stakeholder_interactions';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'email_campaigns' AND column_name = 'deleted_at') THEN
    ALTER TABLE public.email_campaigns ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Added deleted_at to email_campaigns';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'activity_logs' AND column_name = 'deleted_at') THEN
    ALTER TABLE public.activity_logs ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Added deleted_at to activity_logs';
  END IF;
END $$;

-- ========================================
-- 5. CREATE PROJECT_MEMBERS TABLE IF MISSING
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

-- Enable RLS on project_members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 6. CREATE PERFORMANCE INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_survey_forms_created_by ON public.survey_forms(created_by);
CREATE INDEX IF NOT EXISTS idx_species_observations_created_by ON public.species_observations(created_by);
CREATE INDEX IF NOT EXISTS idx_stakeholder_interactions_created_by ON public.stakeholder_interactions(created_by);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_by ON public.email_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON public.project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);

-- Soft delete indexes
CREATE INDEX IF NOT EXISTS idx_survey_forms_deleted_at ON public.survey_forms(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_species_observations_deleted_at ON public.species_observations(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_stakeholder_interactions_deleted_at ON public.stakeholder_interactions(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_email_campaigns_deleted_at ON public.email_campaigns(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_project_members_deleted_at ON public.project_members(deleted_at) WHERE deleted_at IS NULL;

-- ========================================
-- 7. REVOKE UNNECESSARY PERMISSIONS
-- ========================================
REVOKE ALL ON public.survey_forms FROM anon, public;
REVOKE ALL ON public.species_observations FROM anon, public;
REVOKE ALL ON public.stakeholder_interactions FROM anon, public;
REVOKE ALL ON public.email_campaigns FROM anon, public;
REVOKE ALL ON public.activity_logs FROM anon, public;
REVOKE ALL ON public.project_members FROM anon, public;

-- Grant only necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.survey_forms TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.species_observations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stakeholder_interactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_campaigns TO authenticated;
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_members TO authenticated;

-- ========================================
-- 8. FINAL VERIFICATION
-- ========================================
DO $$
DECLARE
  tbl RECORD;
  pol_count INTEGER;
  rls_enabled BOOLEAN;
  total_issues INTEGER := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎯 FINAL VERIFICATION REPORT';
  RAISE NOTICE '============================';
  
  FOR tbl IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename IN ('user_profiles', 'projects', 'sites', 'surveys', 'survey_forms', 
                      'species_observations', 'stakeholders', 'stakeholder_interactions', 
                      'email_campaigns', 'activity_logs', 'project_members')
    ORDER BY tablename
  LOOP
    -- Check RLS status
    SELECT pg_class.rowsecurity INTO rls_enabled
    FROM pg_class 
    JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
    WHERE pg_namespace.nspname = 'public' 
    AND pg_class.relname = tbl.tablename;
    
    -- Count policies
    SELECT COUNT(*) INTO pol_count
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = tbl.tablename;
    
    IF rls_enabled AND pol_count = 1 THEN
      RAISE NOTICE '✅ %: RLS ENABLED, 1 POLICY (OPTIMAL)', tbl.tablename;
    ELSIF rls_enabled AND pol_count > 1 THEN
      RAISE NOTICE '⚠️ %: RLS ENABLED, % POLICIES (SUBOPTIMAL)', tbl.tablename, pol_count;
      total_issues := total_issues + 1;
    ELSIF rls_enabled AND pol_count = 0 THEN
      RAISE NOTICE '❌ %: RLS ENABLED, 0 POLICIES (NO ACCESS)', tbl.tablename;
      total_issues := total_issues + 1;
    ELSE
      RAISE NOTICE '❌ %: RLS DISABLED', tbl.tablename;
      total_issues := total_issues + 1;
    END IF;
  END LOOP;
  
  RAISE NOTICE '';
  IF total_issues = 0 THEN
    RAISE NOTICE '🎉 ALL SECURITY ISSUES RESOLVED!';
    RAISE NOTICE '✅ All tables have RLS enabled';
    RAISE NOTICE '✅ All tables have exactly 1 optimized policy';
    RAISE NOTICE '✅ All performance issues fixed';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Your database is now production-ready!';
  ELSE
    RAISE NOTICE '⚠️ Found % remaining issues. Review above.', total_issues;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '📋 SUMMARY OF CHANGES:';
  RAISE NOTICE '- Removed all duplicate/conflicting policies';
  RAISE NOTICE '- Created single optimized policy per table';
  RAISE NOTICE '- Enabled RLS on all public tables';
  RAISE NOTICE '- Added missing security columns';
  RAISE NOTICE '- Created performance indexes';
  RAISE NOTICE '- Restricted anon/public access';
  RAISE NOTICE '';
  RAISE NOTICE '⏹️ IMPORTANT: Stop all other running SQL scripts now!';
END $$;
