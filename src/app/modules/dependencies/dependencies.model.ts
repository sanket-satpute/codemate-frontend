export interface DependencyNode {
  id: string;
  name: string;
  type: string;
  riskScore: number;
}

export interface DependencyEdge {
  from: string;
  to: string;
}

export interface ImpactItem {
  file: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
