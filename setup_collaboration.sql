-- Create project_members table
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role project_role NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Policies for project_members
CREATE POLICY "Members can view project_members"
ON public.project_members FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_members.project_id
        AND (created_by = auth.uid() OR organization_id IN (
            SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
        ))
    )
    OR user_id = auth.uid()
);

CREATE POLICY "Project creators can manage members"
ON public.project_members FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_members.project_id
        AND (created_by = auth.uid() OR organization_id IN (
            SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid() AND role = 'owner'
        ))
    )
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_project_members_updated_at
BEFORE UPDATE ON public.project_members
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to automatically add creator as manager
CREATE OR REPLACE FUNCTION public.handle_new_project_member()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.project_members (project_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'lead');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_project_created
AFTER INSERT ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_project_member();

-- Add initial members for existing projects (creators)
INSERT INTO public.project_members (project_id, user_id, role)
SELECT id, created_by, 'lead'
FROM public.projects
ON CONFLICT (project_id, user_id) DO NOTHING;
