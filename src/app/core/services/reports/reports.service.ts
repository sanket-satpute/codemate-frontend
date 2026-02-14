import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { ReportSummary, ReportRequest } from '../../models/report.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/reports`;

  reports = signal<ReportSummary[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) { }

  getReports(filters: ReportRequest): Observable<ReportSummary[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<ReportSummary[]>(this.apiUrl, { params: { ...filters } }).pipe(
      tap(reports => this.reports.set(reports)),
      catchError(err => {
        this.error.set('Failed to fetch reports.');
        return [];
      }),
      tap(() => this.loading.set(false))
    );
  }

  exportCsv(filters: ReportRequest): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/csv`, { params: { ...filters }, responseType: 'blob' });
  }

  exportPdf(filters: ReportRequest): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/pdf`, { params: { ...filters }, responseType: 'blob' });
  }
}
