export interface UploadFile {
  id: string;
  projectId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number; // Percentage from 0 to 100
}

export interface UploadProjectRequest {
  name: string;
  description?: string;
  visibility: 'private' | 'team' | 'public'; // Added visibility property
  userId?: string; // Made userId optional, as it might come from auth context
  files?: File[]; // This would be FileDocument[] from backend, but not directly sent from frontend
}

export interface UploadFileResponse {
  projectId: string;
  jobId: string;
  fileCount: number;
  status: string;
  fileUrls: string[];
}
