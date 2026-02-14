import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, FileItem, Job, AnalysisResult } from './project-details.models';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsService {
  private readonly apiUrl = '/api'; // Adjust if your API base URL is different

  constructor(private http: HttpClient) { }

  getProject(projectId: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${projectId}`);
  }

  getFiles(projectId: string): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(`${this.apiUrl}/projects/${projectId}/files`);
  }

  getJobs(projectId: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/analysis/jobs/project/${projectId}`);
  }

  getAnalysisResult(jobId: string): Observable<AnalysisResult> {
    return this.http.get<AnalysisResult>(`${this.apiUrl}/analysis/results/${jobId}`);
  }

  runAnalysis(projectId: string): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/analysis/jobs/${projectId}/run`, {});
  }
}
