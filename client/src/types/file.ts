import { ProjectPhase } from "./project";

export interface FileRecord {
  id: string;
  name: string;
  storage_path: string;
  file_type: string;
  file_size: number;
  project_id: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  phase?: ProjectPhase;
  versions?: FileVersion[];
}

export interface FileVersion {
  id: string;
  file_id: string;
  storage_path: string;
  version_number: number;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}

export interface UploadState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}
