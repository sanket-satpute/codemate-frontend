import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UploadProjectRequest } from '../models/upload.model';
import { Project } from '../models/project.model';
import { JobStatus, JobState } from '../models/job.model'; // Use JobStatus and JobState

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly apiUrl = `${environment.apiUrl}/upload`;
  private http = inject(HttpClient);

  // Removed redundant empty constructor

  /**
   * Uploads a single file for analysis.
   * @param file The file to upload.
   * @returns An Observable of the upload progress (number) or the JobStatusResponse.
   */
  uploadFile(file: File): Observable<number | JobStatus> { // Changed return type to JobStatus
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<JobStatus>(`${this.apiUrl}/file`, formData, { // Changed type parameter to JobStatus
      reportProgress: true,
      observe: 'events',
    }).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress: { // Added curly braces
            const progress = Math.round(100 * event.loaded / (event.total || 1));
            return progress;
          } // Added curly braces
          case HttpEventType.Response:
            return event.body as JobStatus; // Cast to JobStatus
          default:
            return 0; // Ignore other event types for progress
        }
      }),
      catchError((error) => {
        console.error('File upload failed:', error);
        // Return a failed JobStatus on error with required fields
        return of({
          jobId: 'error',
          state: 'FAILED' as JobState, // Explicitly cast to JobState
          message: 'Upload failed',
          updatedAt: new Date().toISOString()
        });
      })
    );
  }

  /**
   * Uploads a new project with metadata.
   * @param projectData The project data to upload.
   * @returns An Observable of the created Project.
   */
  uploadProject(projectData: UploadProjectRequest): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/project`, projectData);
  }
}
