import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { HeatmapData, SecuritySummary, Vulnerability } from './security.model';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // Assuming environment.apiUrl is defined

  getSummary(projectId: string): Observable<SecuritySummary> {
    return this.http.get<SecuritySummary>(`${this.apiUrl}${ApiEndpoints.SECURITY.SUMMARY(projectId)}`);
  }

  getVulnerabilities(projectId: string): Observable<Vulnerability[]> {
    return this.http.get<Vulnerability[]>(`${this.apiUrl}${ApiEndpoints.SECURITY.VULNERABILITIES(projectId)}`);
  }

  getHeatmap(projectId: string): Observable<HeatmapData[]> {
    return this.http.get<HeatmapData[]>(`${this.apiUrl}${ApiEndpoints.SECURITY.HEATMAP(projectId)}`);
  }
}
