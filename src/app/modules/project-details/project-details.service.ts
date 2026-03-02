import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, FileItem, Job, AnalysisResult } from './project-details.models';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProject(projectId: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}${ApiEndpoints.PROJECTS.BY_ID(projectId)}`);
  }

  getFiles(projectId: string): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(`${this.apiUrl}${ApiEndpoints.PROJECTS.FILES(projectId)}`);
  }

  getJobs(projectId: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}${ApiEndpoints.ANALYSIS.PROJECT_JOBS(projectId)}`);
  }

  getAnalysisResult(jobId: string): Observable<AnalysisResult> {
    return this.http.get<AnalysisResult>(`${this.apiUrl}${ApiEndpoints.ANALYSIS.RESULT(jobId)}`);
  }

  runAnalysis(projectId: string): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}${ApiEndpoints.ANALYSIS.RUN_PROJECT(projectId)}`, {});
  }
}
