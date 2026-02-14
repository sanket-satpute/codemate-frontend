import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { HeatmapData, SecuritySummary, Vulnerability } from './security.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // Assuming environment.apiUrl is defined

  getSummary(projectId: string): Observable<SecuritySummary> {
    return this.http.get<SecuritySummary>(`${this.apiUrl}/security/${projectId}/summary`);
  }

  getVulnerabilities(projectId: string): Observable<Vulnerability[]> {
    return this.http.get<Vulnerability[]>(`${this.apiUrl}/security/${projectId}/vulnerabilities`);
  }

  getHeatmap(projectId: string): Observable<HeatmapData[]> {
    return this.http.get<HeatmapData[]>(`${this.apiUrl}/security/${projectId}/heatmap`);
  }
}
