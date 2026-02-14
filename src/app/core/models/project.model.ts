import { ProjectFile } from '../../modules/project-files/project-files.models';

export interface Project {
  id: string;
  name: string;
  description?: string; // Added optional description property
  createdAt: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress?: number; // Added for UI representation
  // Add other properties as needed from the backend response
}

export interface ProjectListResponse {
    projects: Project[];
}

export interface ProjectDetails extends Project {
  // Add detailed properties from the backend response
  description: string;
  files: ProjectFile[]; // Replace 'any' with a proper file interface later
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}
export type { ProjectFile };
