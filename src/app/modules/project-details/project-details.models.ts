export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  totalFiles: number;
  jobs?: Job[]; // Add jobs property
}

export enum JobStatus {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Job {
  id: string; // Changed from jobId to id
  projectId: string;
  status: JobStatus;
  startedAt: string;
  completedAt: string | null;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedDate: string;
}

export interface AnalysisResult {
  summary: string;
  issues: Issue[];
  suggestions: Suggestion[];
  fileInsights: FileInsight[];
}

export interface Issue {
  filePath: string;
  line: number;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Suggestion {
  filePath: string;
  line: number;
  description: string;
  category: 'PERFORMANCE' | 'SECURITY' | 'STYLE' | 'BEST_PRACTICE';
}

export interface FileInsight {
  filePath: string;
  complexity: number;
  maintainability: number;
  summary: string;
}
