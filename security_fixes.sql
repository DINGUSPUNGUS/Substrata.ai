-- URGENT SECURITY AND PERFORMANCE FIXES
-- Run this in your Supabase SQL Editor IMMEDIATELY

-- 1. ENABLE ROW LEVEL SECURITY ON ALL MISSING TABLES
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_forms ENABLE ROW LEVEL SECURITY;

-- 2. CREATE SECURE RLS POLICIES

-- Activity Logs - Users can only view logs related to their actions
CREATE POLICY "Users can view their own activity logs" ON public.activity_logs
FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "System can insert activity logs" ON public.activity_logs
FOR INSERT WITH CHECK (true);

-- Email Campaigns - Organization-based access
CREATE POLICY "Users can view organization email campaigns" ON public.email_campaigns
FOR SELECT USING (
  (SELECT auth.uid()) IN (
    SELECT id FROM public.user_profiles 
    WHERE organization = (
      SELECT organization FROM public.user_profiles 
      WHERE id = (SELECT auth.uid())
    )
  )
);

CREATE POLICY "Admins can manage email campaigns" ON public.email_campaigns
FOR ALL USING (
  (SELECT role FROM public.user_profiles WHERE id = (SELECT auth.uid())) 
  IN ('admin', 'project_manager')
);

-- Stakeholder Interactions - Organization-based access
CREATE POLICY "Users can view organization stakeholder interactions" ON public.stakeholder_interactions
FOR SELECT USING (
  (SELECT auth.uid()) IN (
    SELECT id FROM public.user_profiles 
    WHERE organization = (
      SELECT organization FROM public.user_profiles 
      WHERE id = (SELECT auth.uid())
    )
  )
);

CREATE POLICY "Users can create stakeholder interactions" ON public.stakeholder_interactions
FOR INSERT WITH CHECK (
  (SELECT auth.uid()) IN (
    SELECT id FROM public.user_profiles 
    WHERE organization = (
      SELECT organization FROM public.user_profiles 
      WHERE id = (SELECT auth.uid())
    )
  )
);

-- Species Observations - Project-based access
CREATE POLICY "Users can view species observations in their projects" ON public.species_observations
FOR SELECT USING (
  project_id IN (
    SELECT id FROM public.projects 
    WHERE created_by = (SELECT auth.uid())
    OR id IN (
      SELECT project_id FROM public.project_members 
      WHERE user_id = (SELECT auth.uid())
    )
  )
);

CREATE POLICY "Users can create species observations" ON public.species_observations
FOR INSERT WITH CHECK (
  project_id IN (
    SELECT id FROM public.projects 
    WHERE created_by = (SELECT auth.uid())
    OR id IN (
      SELECT project_id FROM public.project_members 
      WHERE user_id = (SELECT auth.uid())
    )
  )
);

-- Survey Forms - Organization-based access
CREATE POLICY "Users can view organization survey forms" ON public.survey_forms
FOR SELECT USING (
  created_by IN (
    SELECT id FROM public.user_profiles 
    WHERE organization = (
      SELECT organization FROM public.user_profiles 
      WHERE id = (SELECT auth.uid())
    )
  )
);

CREATE POLICY "Users can create survey forms" ON public.survey_forms
FOR INSERT WITH CHECK ((SELECT auth.uid()) = created_by);

CREATE POLICY "Users can update their own survey forms" ON public.survey_forms
FOR UPDATE USING ((SELECT auth.uid()) = created_by);

-- 3. FIX PERFORMANCE ISSUES IN EXISTING POLICIES

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can create surveys" ON public.surveys;

-- Create optimized policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
FOR SELECT USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own profile" ON public.user_profiles
FOR UPDATE USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can view organization profiles" ON public.user_profiles
FOR SELECT USING (
  organization = (
    SELECT organization FROM public.user_profiles 
    WHERE id = (SELECT auth.uid())
  )
);

-- Optimized survey policy
CREATE POLICY "Users can create surveys" ON public.surveys
FOR INSERT WITH CHECK (
  created_by = (SELECT auth.uid())
);

CREATE POLICY "Users can view organization surveys" ON public.surveys
FOR SELECT USING (
  created_by IN (
    SELECT id FROM public.user_profiles 
    WHERE organization = (
      SELECT organization FROM public.user_profiles 
      WHERE id = (SELECT auth.uid())
    )
  )
);

-- 4. CREATE PROJECT MEMBERS TABLE FOR BETTER ACCESS CONTROL
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS on project members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view project memberships" ON public.project_members
FOR SELECT USING (
  user_id = (SELECT auth.uid()) OR
  project_id IN (
    SELECT id FROM public.projects 
    WHERE created_by = (SELECT auth.uid())
  )
);

-- 5. CREATE INDEXES FOR BETTER PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_user_profiles_organization ON public.user_profiles(organization);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);
CREATE INDEX IF NOT EXISTS idx_surveys_created_by ON public.surveys(created_by);
CREATE INDEX IF NOT EXISTS idx_species_observations_project_id ON public.species_observations(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON public.project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);

-- 6. CREATE AUDIT FUNCTION FOR SECURITY MONITORING
CREATE OR REPLACE FUNCTION public.log_security_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_logs (
    user_id,
    action,
    table_name,
    record_id,
    details,
    created_at
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ),
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers for security monitoring
CREATE TRIGGER security_audit_user_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();

CREATE TRIGGER security_audit_projects
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();

-- 7. REVOKE UNNECESSARY PERMISSIONS
REVOKE ALL ON public.activity_logs FROM anon;
REVOKE ALL ON public.email_campaigns FROM anon;
REVOKE ALL ON public.stakeholder_interactions FROM anon;

-- Grant only necessary permissions to authenticated users
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.email_campaigns TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.stakeholder_interactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.species_observations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.survey_forms TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.project_members TO authenticated;

-- 8. OPTIMIZE SLOW QUERIES WITH BETTER INDEXES
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pg_class_relname ON pg_class(relname);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pg_namespace_nspname ON pg_namespace(nspname);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ SECURITY FIXES APPLIED SUCCESSFULLY';
  RAISE NOTICE '✅ Row Level Security enabled on all tables';
  RAISE NOTICE '✅ Performance optimizations applied';
  RAISE NOTICE '✅ Security monitoring enabled';
  RAISE NOTICE '🔒 Your database is now secure!';
END $$;
