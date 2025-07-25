-- DELETED_AT COLUMN DIAGNOSTIC SCRIPT
-- Run this in Supabase SQL Editor to diagnose column issues
-- This will help identify why deleted_at columns are missing or causing errors

-- ========================================
-- 1. CURRENT SCHEMA ANALYSIS
-- ========================================
DO $$
DECLARE
  table_record RECORD;
  column_record RECORD;
  table_exists BOOLEAN;
  column_exists BOOLEAN;
  error_details TEXT;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔍 DELETED_AT COLUMN DIAGNOSTIC REPORT';
  RAISE NOTICE '=====================================';
  RAISE NOTICE 'Checking for deleted_at column issues in your Supabase database...';
  RAISE NOTICE '';
  
  -- Check each critical table
  FOR table_record IN
    SELECT unnest(ARRAY['user_profiles', 'projects', 'surveys', 'project_members', 
                        'survey_forms', 'species_observations', 'stakeholder_interactions', 
                        'email_campaigns', 'activity_logs']) AS tablename
  LOOP
    -- Check if table exists
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = table_record.tablename
    ) INTO table_exists;
    
    IF table_exists THEN
      RAISE NOTICE '📋 Table: % ✅ EXISTS', table_record.tablename;
      
      -- Check if deleted_at column exists
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = table_record.tablename 
        AND column_name = 'deleted_at'
      ) INTO column_exists;
      
      IF column_exists THEN
        RAISE NOTICE '  └─ deleted_at column: ✅ EXISTS';
        
        -- Get column details
        SELECT data_type, is_nullable, column_default 
        INTO column_record
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = table_record.tablename 
        AND column_name = 'deleted_at';
        
        RAISE NOTICE '     Type: %, Nullable: %, Default: %', 
          column_record.data_type, column_record.is_nullable, COALESCE(column_record.column_default, 'NULL');
      ELSE
        RAISE NOTICE '  └─ deleted_at column: ❌ MISSING';
        
        -- Try to add the column and capture any errors
        BEGIN
          EXECUTE format('ALTER TABLE public.%I ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE', table_record.tablename);
          RAISE NOTICE '     🔧 FIXED: Successfully added deleted_at column';
        EXCEPTION
          WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS error_details = MESSAGE_TEXT;
            RAISE NOTICE '     ⚠️ ERROR adding deleted_at: %', error_details;
        END;
      END IF;
      
      -- List all columns in the table for context
      RAISE NOTICE '  └─ All columns in %:', table_record.tablename;
      FOR column_record IN
        SELECT column_name, data_type
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = table_record.tablename
        ORDER BY ordinal_position
      LOOP
        RAISE NOTICE '     - % (%)', column_record.column_name, column_record.data_type;
      END LOOP;
      
    ELSE
      RAISE NOTICE '📋 Table: % ❌ DOES NOT EXIST', table_record.tablename;
    END IF;
    
    RAISE NOTICE '';
  END LOOP;
  
  -- ========================================
  -- 2. PERMISSION CHECK
  -- ========================================
  RAISE NOTICE '🔐 PERMISSION ANALYSIS:';
  RAISE NOTICE '';
  
  -- Check current user permissions
  RAISE NOTICE 'Current user: %', current_user;
  RAISE NOTICE 'Current role: %', current_role;
  
  -- Check table permissions
  FOR table_record IN
    SELECT tablename
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename
  LOOP
    -- Check if user can alter table
    BEGIN
      EXECUTE format('SELECT 1 FROM %I LIMIT 0', table_record.tablename);
      RAISE NOTICE '✅ Can access table: %', table_record.tablename;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE '❌ Cannot access table: % - %', table_record.tablename, SQLERRM;
    END;
  END LOOP;
  
  -- ========================================
  -- 3. SUGGESTED SOLUTIONS
  -- ========================================
  RAISE NOTICE '';
  RAISE NOTICE '💡 SUGGESTED SOLUTIONS:';
  RAISE NOTICE '';
  RAISE NOTICE '1. If tables are missing:';
  RAISE NOTICE '   - Run the full migration script to create all required tables';
  RAISE NOTICE '   - Check if you are connected to the correct database';
  RAISE NOTICE '';
  RAISE NOTICE '2. If columns are missing but tables exist:';
  RAISE NOTICE '   - Run individual ALTER TABLE commands for each missing column';
  RAISE NOTICE '   - Check for permission issues with your database user';
  RAISE NOTICE '';
  RAISE NOTICE '3. If permission errors occur:';
  RAISE NOTICE '   - Ensure you are using a database user with ALTER TABLE privileges';
  RAISE NOTICE '   - Contact your database administrator if using managed Supabase';
  RAISE NOTICE '';
  RAISE NOTICE '4. Manual fix commands (run individually):';
  
  FOR table_record IN
    SELECT unnest(ARRAY['user_profiles', 'projects', 'surveys', 'project_members', 
                        'survey_forms', 'species_observations', 'stakeholder_interactions', 
                        'email_campaigns']) AS tablename
  LOOP
    RAISE NOTICE '   ALTER TABLE public.% ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;', table_record.tablename;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '🎯 NEXT STEPS:';
  RAISE NOTICE '1. Fix any missing tables or columns identified above';
  RAISE NOTICE '2. Run the main migration script again';
  RAISE NOTICE '3. Verify all tables have proper RLS policies';
  RAISE NOTICE '4. Test your application to ensure everything works';
  
END $$;

-- ========================================
-- 4. QUICK FIX ATTEMPT
-- ========================================
-- This section will attempt to add all missing deleted_at columns
DO $$
DECLARE
  table_name TEXT;
  table_list TEXT[] := ARRAY['user_profiles', 'projects', 'surveys', 'project_members', 
                             'survey_forms', 'species_observations', 'stakeholder_interactions', 
                             'email_campaigns'];
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔧 ATTEMPTING AUTOMATIC FIX FOR DELETED_AT COLUMNS';
  RAISE NOTICE '================================================';
  
  FOREACH table_name IN ARRAY table_list
  LOOP
    -- Check if table exists and column is missing
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = table_name) THEN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = table_name AND column_name = 'deleted_at') THEN
        BEGIN
          EXECUTE format('ALTER TABLE public.%I ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE', table_name);
          RAISE NOTICE '✅ SUCCESS: Added deleted_at to %', table_name;
        EXCEPTION
          WHEN OTHERS THEN
            RAISE NOTICE '❌ FAILED: Could not add deleted_at to % - %', table_name, SQLERRM;
        END;
      ELSE
        RAISE NOTICE 'ℹ️ SKIP: deleted_at already exists in %', table_name;
      END IF;
    ELSE
      RAISE NOTICE '⚠️ SKIP: Table % does not exist', table_name;
    END IF;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '✨ Automatic fix attempt completed!';
  RAISE NOTICE 'Review the results above and run your main migration script if all looks good.';
END $$;
