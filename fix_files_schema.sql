-- DANGER: This script drops the files and file_versions tables.
-- Only run this if they are empty or you don't mind losing the metadata records.
-- (The actual files in Storage will NOT be deleted).

DROP TABLE IF EXISTS public.file_versions;
DROP TABLE IF EXISTS public.files;

-- Recreate files table with correct columns
CREATE TABLE public.files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    phase project_phase NOT NULL DEFAULT 'schematic',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Recreate file_versions table
CREATE TABLE public.file_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Re-enable RLS
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_versions ENABLE ROW LEVEL SECURITY;

-- Re-apply Policies
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

CREATE POLICY "Members can view file versions"
ON public.file_versions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.files f
        JOIN public.project_members pm ON f.project_id = pm.project_id
        WHERE f.id = file_versions.file_id
        AND pm.user_id = auth.uid()
    )
);

-- Re-apply Trigger
DROP TRIGGER IF EXISTS set_files_updated_at ON public.files;
CREATE TRIGGER set_files_updated_at
BEFORE UPDATE ON public.files
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
