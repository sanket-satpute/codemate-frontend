import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalysisResult } from './analysis-result.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalysisResultService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAnalysisResult(jobId: string): Observable<AnalysisResult> {
    return this.http.get<AnalysisResult>(`${this.apiUrl}/analysis/${jobId}/result`);
  }

  getFileContent(projectId: string, filePath: string): Observable<{ content: string }> {
    return this.http.get<{ content: string }>(`${this.apiUrl}/projects/${projectId}/file-content`, {
      params: { path: filePath }
    });
  }
}
