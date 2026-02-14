export interface PatchResult {
  issueId: string;
  diff: string;         // full patch diff
  summary: string;      // explanation from the AI
  confidence: number;   // 0-1 float
}
