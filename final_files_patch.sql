-- Final Patch: Add the missing 'phase' column to the files table
-- This is required for grouping files by project phase.

DO $$ 
BEGIN 
    -- Check if 'phase' column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='files' AND column_name='phase') THEN
        ALTER TABLE public.files ADD COLUMN phase project_phase NOT NULL DEFAULT 'schematic';
    END IF;
END $$;

-- Verify RLS policies one last time to ensure they match our naming
DROP POLICY IF EXISTS "Members can view files" ON public.files;
CREATE POLICY "Members can view files"
ON public.files FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = files.project_id
        AND user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Members can upload files" ON public.files;
CREATE POLICY "Members can upload files"
ON public.files FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = files.project_id
        AND user_id = auth.uid()
    )
);
