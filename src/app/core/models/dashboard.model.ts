export interface Dashboard {
  totalProjects: number;
  healthScore: number;
  totalIssues: number;
  activeScans: number;
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  totalFiles?: number;
  lastActive?: string;
  recentProjects?: ProjectSummary[];
  recentActivities?: Activity[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  type: string;
  status: string;
  healthScore: number;
  lastUpdated: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: (
    |
    "success"
    |
    "warning"
    |
    "error"
    |
    "info"
  );
  icon: string;
  status: string;
  timestamp: Date;
}

// Legacy interfaces for backward compatibility
export interface LegacyDashboard {
  totalProjects: number;
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  modelUsage: {
    huggingface: number;
    openai: number;
  };
}
