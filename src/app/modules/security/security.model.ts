export interface SecuritySummary {
  totalVulnerabilities: number;
  high: number;
  medium: number;
  low: number;
  lastScan: string;
}

export interface Vulnerability {
  id: string;
  file: string;
  cwe: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  line: number;
}

export interface HeatmapData {
  file: string;
  score: number; // 0–100 severity rating
}
