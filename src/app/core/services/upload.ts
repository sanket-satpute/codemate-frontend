import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FileUploadResponse {
  projectId: string;
  jobId: string;
  fileCount: number;
  status: string;
  fileUrls: string[];
}

@Injectable({
  providedIn: 'root',
})
export class Upload {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  // Removed redundant empty constructor

  uploadFile(file: File): Observable<HttpEvent<FileUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<FileUploadResponse>(`${this.apiUrl}/upload/file`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
