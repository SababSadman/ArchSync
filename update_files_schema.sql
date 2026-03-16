-- Safely add the missing file_size column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='files' AND column_name='file_size') THEN
        ALTER TABLE public.files ADD COLUMN file_size BIGINT NOT NULL DEFAULT 0;
        -- Remove the default after adding so future inserts must provide it
        ALTER TABLE public.files ALTER COLUMN file_size DROP DEFAULT;
    END IF;
END $$;

-- Also ensure RLS is correctly set for the existing table just in case
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Re-apply policies to be certain they are correct
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
