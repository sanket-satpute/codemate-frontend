/**
 * Matches GET /api/dashboard response.
 * Backend aggregates these from the user's projects, jobs, and files.
 */
export interface Dashboard {
  totalProjects: number;
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  totalFiles?: number;
  lastActive?: string;
  modelUsage?: Record<string, number>;
}
