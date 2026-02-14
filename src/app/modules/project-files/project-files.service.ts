import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectFile, FileUploadResponse } from './project-files.models';

@Injectable({
  providedIn: 'root'
})
export class ProjectFilesService {
  private readonly apiUrl = '/api/files';

  constructor(private http: HttpClient) { }

  uploadFile(projectId: string, file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileUploadResponse>(`${this.apiUrl}/upload?projectId=${projectId}`, formData);
  }

  getProjectFiles(projectId: string): Observable<ProjectFile[]> {
    return this.http.get<ProjectFile[]>(`${this.apiUrl}/project/${projectId}`);
  }

  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${fileId}`);
  }

  getFileContent(fileId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/${fileId}/content`, { responseType: 'text' });
  }
}
