import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { AnalysisRequest, AnalysisResult } from '../../models/analysis.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService extends BaseService {
  private readonly baseUrl = `${environment.apiUrl}/projects`;
  private http = inject(HttpClient);

  constructor() {
    super();
  }

  /**
   * Requests a new code analysis for a project.
   * Backend: POST /api/projects/{projectId}/analysis/start
   */
  requestAnalysis(request: AnalysisRequest): Observable<AnalysisResult> {
    return this.http.post<AnalysisResult>(
      `${this.baseUrl}/${request.projectId}/analysis/start`,
      request
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves the analysis results (jobs) for a specific project.
   * Backend: GET /api/projects/{projectId}/analysis/jobs
   */
  getAnalysisResults(projectId: string): Observable<AnalysisResult[]> {
    return this.http.get<AnalysisResult[]>(
      `${this.baseUrl}/${projectId}/analysis/jobs`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a specific analysis result by its job ID within a project.
   * Backend: GET /api/projects/{projectId}/analysis/jobs/{jobId}
   */
  getAnalysisResultById(projectId: string, jobId: string): Observable<AnalysisResult> {
    return this.http.get<AnalysisResult>(
      `${this.baseUrl}/${projectId}/analysis/jobs/${jobId}`
    ).pipe(
      catchError(this.handleError)
    );
  }
}
