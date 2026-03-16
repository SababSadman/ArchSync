import { ProjectPhase } from "./project";

export interface FileRecord {
  id: string;
  name: string;
  storage_path: string;
  mime_type: string;        // was file_type
  size_bytes: number;       // was file_size
  project_id: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  phase: string;
  versions?: FileVersion[];
  uploader?: {
    full_name: string;
    avatar_url: string;
  };
}

export interface FileVersion {
  id: string;
  file_id: string;
  storage_path: string;
  version_number: number;
  size_bytes: number;       // was file_size
  uploaded_by: string;
  created_at: string;
}

export interface UploadState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}
