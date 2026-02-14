export interface ReportSummary {
  id: string;
  projectName: string;
  analysisJobName: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED' | 'PENDING';
  createdAt: string;
  completedAt?: string;
  score: number;
  metrics: {
    errors: number;
    warnings: number;
    score: number;
  };
}

export interface ReportRequest {
  projectId?: string;
  status?: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED' | 'PENDING';
  from?: string;
  to?: string;
}
