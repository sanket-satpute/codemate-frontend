export interface AnalysisRequest {
  projectId: string;
  filePaths?: string[]; // Optional: specific files to analyze
  analysisType?: 'full' | 'incremental'; // Optional: type of analysis
}

export interface AnalysisResult {
  id: string;
  projectId: string;
  timestamp: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  summary: string;
  findings: AnalysisFinding[];
  rawOutput: unknown; // Raw output from the AI model
}

export interface AnalysisFinding {
  file: string;
  lineNumber: number;
  severity: 'info' | 'warning' | 'error';
  message: string;
  suggestion: string;
}
