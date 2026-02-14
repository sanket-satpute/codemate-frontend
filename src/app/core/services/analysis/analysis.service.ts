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
  private readonly apiUrl = `${environment.apiUrl}/analysis`;
  private http = inject(HttpClient);

  constructor() {
    super();
  }

  /**
   * Requests a new code analysis for a project.
   * @param request The analysis request details.
   * @returns An observable of the initiated analysis result.
   */
  requestAnalysis(request: AnalysisRequest): Observable<AnalysisResult> {
    return this.http.post<AnalysisResult>(this.apiUrl, request, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Retrieves the analysis results for a specific project.
   * @param projectId The ID of the project.
   * @returns An observable array of analysis results.
   */
  getAnalysisResults(projectId: string): Observable<AnalysisResult[]> {
    return this.http.get<AnalysisResult[]>(`${this.apiUrl}/project/${projectId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Retrieves a specific analysis result by its ID.
   * @param analysisId The ID of the analysis result.
   * @returns An observable of the analysis result.
   */
  getAnalysisResultById(analysisId: string): Observable<AnalysisResult> {
    return this.http.get<AnalysisResult>(`${this.apiUrl}/${analysisId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }
}
