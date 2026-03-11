import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { Project, ProjectDetails, UpdateProjectRequest, CreateProjectRequest } from '../../models/project.model';
import { ApiEndpoints } from '../../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseService {
  private readonly apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  projects = signal<Project[]>([]);

  constructor() {
    super();
  }

  /**
   * Fetches all projects for the current user.
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}${ApiEndpoints.PROJECTS.BASE}`)
      .pipe(
        tap(projects => this.projects.set(projects)),
        catchError(this.handleError)
      );
  }

  /**
   * Fetches a specific project by its ID.
   */
  getProjectById(id: string): Observable<ProjectDetails> {
    return this.http.get<ProjectDetails>(`${this.apiUrl}${ApiEndpoints.PROJECTS.BY_ID(id)}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Creates a new project (name + description only, no files).
   */
  createProject(project: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}${ApiEndpoints.PROJECTS.BASE}`, project)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Creates a project with files uploaded to Cloudinary.
   * Uses multipart/form-data: name (required), description (optional), files[] (required).
   */
  createProjectWithFiles(name: string, description: string, files: File[]): Observable<Project> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description || '');
    files.forEach(file => formData.append('files', file));

    return this.http.post<Project>(
      `${this.apiUrl}${ApiEndpoints.PROJECTS.BASE}/create-with-files`,
      formData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing project.
   */
  updateProject(id: string, project: UpdateProjectRequest): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}${ApiEndpoints.PROJECTS.BY_ID(id)}`, project)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Deletes a project by its ID.
   */
  deleteProject(id: string): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}${ApiEndpoints.PROJECTS.BY_ID(id)}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /** Alias for getProjectById */
  getProjectDetail(projectId: string): Observable<ProjectDetails> {
    return this.getProjectById(projectId);
  }

  /**
   * Triggers an analysis for a project.
   * Backend requires { jobType: 'PROJECT_ANALYSIS' } in the body.
   */
  runAnalysis(projectId: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}${ApiEndpoints.PROJECTS.START_ANALYSIS(projectId)}`, { jobType: 'PROJECT_ANALYSIS' })
      .pipe(
        catchError(this.handleError)
      );
  }

  // ─── File Management ───────────────────────────────────────────────

  /**
   * Adds files to an existing project.
   */
  addFilesToProject(projectId: string, files: File[]): Observable<Project> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return this.http.post<Project>(
      `${this.apiUrl}${ApiEndpoints.PROJECTS.FILES(projectId)}`,
      formData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Replaces a specific file in a project.
   */
  replaceFileInProject(projectId: string, fileId: string, file: File): Observable<Project> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<Project>(
      `${this.apiUrl}${ApiEndpoints.PROJECTS.FILE_BY_ID(projectId, fileId)}`,
      formData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a specific file from a project.
   */
  deleteFileFromProject(projectId: string, fileId: string): Observable<Project> {
    return this.http.delete<Project>(
      `${this.apiUrl}${ApiEndpoints.PROJECTS.FILE_BY_ID(projectId, fileId)}`
    ).pipe(
      catchError(this.handleError)
    );
  }
}
