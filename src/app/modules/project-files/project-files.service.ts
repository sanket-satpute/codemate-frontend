import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectFile, FileUploadResponse } from './project-files.models';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ProjectFilesService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadFile(projectId: string, file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileUploadResponse>(`${this.apiUrl}${ApiEndpoints.PROJECT_FILES.UPLOAD(projectId)}`, formData);
  }

  getProjectFiles(projectId: string): Observable<ProjectFile[]> {
    return this.http.get<ProjectFile[]>(`${this.apiUrl}${ApiEndpoints.PROJECT_FILES.LIST(projectId)}`);
  }

  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${ApiEndpoints.PROJECT_FILES.DELETE(fileId)}`);
  }

  getFileContent(fileId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}${ApiEndpoints.PROJECT_FILES.CONTENT(fileId)}`, { responseType: 'text' });
  }
}
