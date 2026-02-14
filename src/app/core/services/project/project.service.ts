import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { Project, ProjectDetails, UpdateProjectRequest, CreateProjectRequest } from '../../models/project.model';
import { ProjectSummary } from '../../../features/projects/project-summary/models/project-summary.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseService {
  private readonly apiUrl = `${environment.apiUrl}/projects`;
  private http = inject(HttpClient);

  projects = signal<Project[]>([]);

  constructor() {
    super();
  }

  /**
   * Fetches all projects for the current user.
   * @returns An observable array of projects.
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap(projects => this.projects.set(projects)),
        catchError(this.handleError)
      );
  }

  /**
   * Fetches a specific project by its ID.
   * @param id The ID of the project.
   * @returns An observable of the project details.
   */
  getProjectById(id: string): Observable<ProjectDetails> {
    return this.http.get<ProjectDetails>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Creates a new project.
   * @param project The project creation request.
   * @returns An observable of the newly created project.
   */
  createProject(project: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Updates an existing project.
   * @param id The ID of the project to update.
   * @param project The project update request.
   * @returns An observable of the updated project.
   */
  updateProject(id: string, project: UpdateProjectRequest): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Deletes a project by its ID.
   * @param id The ID of the project to delete.
   * @returns An observable of the deletion response.
   */
  deleteProject(id: string): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Alias for getProjectById to match some usages
  getProjectDetail(projectId: string): Observable<ProjectDetails> {
    return this.getProjectById(projectId);
  }

  /**
   * Triggers an analysis for a project.
   * @param projectId The ID of the project.
   * @returns An observable of the analysis job.
   */
  runAnalysis(projectId: string): Observable<{ message: string; jobId: string }> {
    return this.http.post<{ message: string; jobId: string }>(`${this.apiUrl}/${projectId}/analysis/run`, {}, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Fetches a summary for a project.
   * @param projectId The ID of the project.
   * @returns An observable of the project summary.
   */
  getProjectSummary(projectId: string): Observable<ProjectSummary> {
    // Assuming ProjectSummary type is imported, but it's not in the file. Need to add import.

    // Since not imported, let's assume it's not defined, but for now, add placeholder.
    // Actually, from top-level, it was import { ProjectSummary } from '../../features/projects/project-summary/models/project-summary.model';
    // But to add, I need to import.

    // For now, I'll use any.
    return this.http.get<any>(`${this.apiUrl}/${projectId}/summary`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }
}
