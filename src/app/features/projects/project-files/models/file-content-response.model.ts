export interface FileContentResponse {
  path: string;
  content: string;
  language: string; // optional, fallback to extension detection
}
