import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DependencyNode, DependencyEdge, ImpactItem } from './dependencies.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DependenciesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDependencyGraph(projectId: string): Observable<{ nodes: DependencyNode[], edges: DependencyEdge[] }> {
    return this.http.get<{ nodes: DependencyNode[], edges: DependencyEdge[] }>(`${this.apiUrl}/dependencies/${projectId}/graph`);
  }

  getImpactAnalysis(projectId: string, nodeId: string): Observable<ImpactItem[]> {
    return this.http.get<ImpactItem[]>(`${this.apiUrl}/dependencies/${projectId}/impact/${nodeId}`);
  }
}
