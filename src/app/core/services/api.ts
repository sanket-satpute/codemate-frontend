import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectFile } from '../../modules/project-files/project-files.models';
import { JobStatus } from '../models/job.model';
import { ReportSummary } from '../models/report.model'; // Use ReportSummary

// Interfaces for backend models
export interface Project {
  id?: string;
  name: string;
  description?: string;
  files?: ProjectFile[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  jobs?: JobStatus[];
  reports?: ReportSummary[]; // Use ReportSummary
}

export interface User {
  email: string;
  password?: string; // Only for login, not stored
}

export interface LoginResponse {
  token: string;
  email: string;
}

export interface ChatMessage {
  id?: string;
  projectId: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  // Auth Endpoints
  login(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, user);
  }

  // Project Endpoints
  createProject(project: Project): Observable<{ projectId: string, status: string }> {
    return this.http.post<{ projectId: string, status: string }>(`${this.apiUrl}/projects`, project);
  }

  getProject(projectId: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${projectId}`);
  }

  listAllProjects(): Observable<{ count: number, projects: Project[] }> {
    return this.http.get<{ count: number, projects: Project[] }>(`${this.apiUrl}/projects`);
  }

  deleteProject(projectId: string): Observable<{ projectId: string, status: string }> {
    return this.http.delete<{ projectId: string, status: string }>(`${this.apiUrl}/projects/${projectId}`);
  }

}
