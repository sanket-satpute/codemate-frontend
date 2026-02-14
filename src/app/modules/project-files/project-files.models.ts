export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  size: number;
  type: string;
  uploadedDate: string;
  content?: string; // Optional for preview
  filePath: string;
}

export interface FileUploadResponse {
  message: string;
  fileId: string;
  fileName: string;
}
