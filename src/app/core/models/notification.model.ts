export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date | string;
  read: boolean;
  /** Optional: notification category (System, Security, Code Analysis, etc.) */
  type?: string;
  /** Optional: longer description for detail view */
  fullDescription?: string;
  /** Optional: tags / labels attached by the backend */
  badges?: string[];
  /** Optional: associated project name */
  relatedProject?: string;
  /** Optional: associated analysis type */
  relatedAnalysisType?: string;
}
