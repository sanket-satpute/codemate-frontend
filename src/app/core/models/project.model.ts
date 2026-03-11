export type ProjectStatus = 'ACTIVE' | 'ARCHIVED';

export interface ProjectFileInfo {
  id: string;
  filename: string;
  fileSize: number;
  fileType: string;
  fileExtension: string;
  cloudinaryUrl?: string;
  uploadedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  status: ProjectStatus;
  lastAnalysisJobId?: string;

  // File stats from backend
  totalFiles: number;
  totalFileSize: number;
  fileTypeBreakdown?: Record<string, number>; // e.g. { "java": 5, "py": 3 }
  files?: ProjectFileInfo[];
}

export interface ProjectListResponse {
  projects: Project[];
}

export interface ProjectDetails extends Project {
  description: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  lastAnalysisJobId?: string;
}
