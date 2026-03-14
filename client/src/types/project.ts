export type ProjectStatus = 'draft' | 'active' | 'on_hold' | 'completed';
export type ProjectPhase = 'schematic' | 'design_dev' | 'construction_docs' | 'closeout';
export type ProjectType = 'residential' | 'commercial' | 'interior' | 'mixed-use';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  phase: ProjectPhase;
  cover_image_url: string | null;
  created_by: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  deadline: string | null;
  project_type: ProjectType;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  phase: ProjectPhase;
  deadline?: string;
  project_type: ProjectType;
  status?: ProjectStatus;
}
