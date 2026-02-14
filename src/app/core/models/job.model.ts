export type JobState = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface JobStatus {
  jobId: string;
  state: JobState;
  progress?: number;
  message?: string;
  updatedAt: string;
  resultId?: string;
  projectId?: string; 
}
