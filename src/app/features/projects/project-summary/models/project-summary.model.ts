export interface ProjectSummary {
  projectId: string;
  name: string;
  description: string;
  uploadDate: string;
  lastAnalyzed: string;
  riskScore: number;
  codeQuality: number;
  issuesFound: number;
  strengths: string[];
}
