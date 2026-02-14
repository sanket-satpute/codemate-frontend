export interface Suggestion {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface RefactorPreview {
  originalCode: string;
  refactoredCode: string;
  explanation: string;
}
