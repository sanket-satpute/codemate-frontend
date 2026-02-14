export interface CoverageSummary {
  totalFiles: number;
  coveredFiles: number;
  coveragePercent: number;
  uncoveredFiles: number;
}

export interface CoverageFile {
  filePath: string;
  coveragePercent: number;
  missingTests: string[];
}

export interface GeneratedTestCase {
  filePath: string;
  testCode: string;
  suggestions: string[];
}
