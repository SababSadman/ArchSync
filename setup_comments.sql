-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    x_percent DECIMAL(5, 2), -- 0.00 to 100.00
    y_percent DECIMAL(5, 2), -- 0.00 to 100.00
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'needs_action')),
    is_client_visible BOOLEAN NOT NULL DEFAULT true,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create comment_mentions table
CREATE TABLE IF NOT EXISTS public.comment_mentions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_mentions ENABLE ROW LEVEL SECURITY;

-- Policies for comments
CREATE POLICY "Members can view comments"
ON public.comments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.files f
        JOIN public.project_members pm ON f.project_id = pm.project_id
        WHERE f.id = comments.file_id
        AND pm.user_id = auth.uid()
    )
);

CREATE POLICY "Members can insert comments"
ON public.comments FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.files f
        JOIN public.project_members pm ON f.project_id = pm.project_id
        WHERE f.id = file_id
        AND pm.user_id = auth.uid()
    )
);

CREATE POLICY "Owners can update their comments"
ON public.comments FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER set_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add comments to realtime publication
-- Note: Replace 'supabase_realtime' with your actual publication name if different
-- ALTER PUBLICATION supabase_realtime ADD TABLE comments;
