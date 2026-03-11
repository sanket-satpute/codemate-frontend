export type JobType = 'PROJECT_ANALYSIS' | 'AI_REVIEW' | 'ARCHITECTURE_SCAN' | 'BUG_SCAN' | 'CHAT_TURN';
export type JobStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface AnalysisRequest {
  projectId: string;
  filePaths?: string[];
  analysisType?: 'full' | 'incremental';
}

export interface CreateJobRequest {
  jobType: JobType;
}

/**
 * Matches backend AnalysisJobResponseDTO exactly.
 */
export interface AnalysisResult {
  id?: number;
  jobId: string;
  projectId: string;
  jobType: JobType;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  result?: string;
  model?: string;
}

/** Legacy — kept for compatibility with other modules */
export interface AnalysisFinding {
  file: string;
  lineNumber: number;
  severity: 'info' | 'warning' | 'error';
  message: string;
  suggestion: string;
}
