export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Issue {
  id: string;
  severity: Severity;
  message: string;
  suggestion: string;
  line: number;
}

export interface FileWithIssues {
  path: string;
  issues: Issue[];
}

export interface AnalysisSummary {
  totalIssues: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface AnalysisResult {
  summary: AnalysisSummary;
  files: FileWithIssues[];
}
