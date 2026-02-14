export interface PerformanceMetrics {
  cpu: number;
  memory: number;
  responseTime: number;
  timestamp: string;
}

export interface Bottleneck {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  filePath: string;
  suggestion: string;
}
