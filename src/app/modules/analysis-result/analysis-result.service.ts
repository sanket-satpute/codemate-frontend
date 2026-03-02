import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalysisResult } from './analysis-result.model';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AnalysisResultService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAnalysisResult(jobId: string): Observable<AnalysisResult> {
    return this.http.get<AnalysisResult>(`${this.apiUrl}${ApiEndpoints.ANALYSIS.RESULT(jobId)}`);
  }

  getFileContent(projectId: string, filePath: string): Observable<{ content: string }> {
    return this.http.get<{ content: string }>(`${this.apiUrl}${ApiEndpoints.PROJECTS.FILE_CONTENT(projectId)}`, {
      params: { path: filePath }
    });
  }
}
