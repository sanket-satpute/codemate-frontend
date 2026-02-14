import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { ReportSummary, ReportRequest } from '../../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {
  private readonly apiUrl = `${environment.apiUrl}/reports`;
  private http = inject(HttpClient);

  constructor() {
    super();
  }

  /**
   * Requests the generation of a new report.
   * @param request The report generation request details.
   * @returns An observable of the report summary.
   */
  generateReport(request: ReportRequest): Observable<ReportSummary> {
    return this.http.post<ReportSummary>(this.apiUrl, request, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Fetches a list of all generated reports for a project.
   * @param projectId The ID of the project.
   * @returns An observable array of report summaries.
   */
  getReports(projectId: string): Observable<ReportSummary[]> {
    return this.http.get<ReportSummary[]>(`${this.apiUrl}/project/${projectId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Fetches a specific report summary by its ID.
   * @param reportId The ID of the report.
   * @returns An observable of the report summary.
   */
  getReportById(reportId: string): Observable<ReportSummary> {
    return this.http.get<ReportSummary>(`${this.apiUrl}/${reportId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Downloads a report.
   * @param reportId The ID of the report to download.
   * @returns An observable of the blob data.
   */
  downloadReport(reportId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${reportId}/download`, {
      headers: this.getHeaders(),
      responseType: 'blob' // Important for file downloads
    })
      .pipe(
        catchError(this.handleError)
      );
  }
}
