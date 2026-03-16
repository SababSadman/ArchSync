-- Clean up redundant columns that were added by mistake
-- These are causing 'NOT NULL' constraint errors because the frontend uses the correct schema names.

ALTER TABLE public.files DROP COLUMN IF EXISTS file_size;
ALTER TABLE public.files DROP COLUMN IF EXISTS file_type;

-- Final verification of RLS to ensure everything is smooth
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
