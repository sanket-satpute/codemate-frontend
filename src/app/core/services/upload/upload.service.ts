import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { UploadFileResponse } from '../../models/upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService extends BaseService {
  private readonly apiUrl = `${environment.apiUrl}/upload`;
  private http = inject(HttpClient);

  constructor() {
    super();
    super();
  }

  /**
   * Uploads a file or a ZIP archive to a specific project.
   * @param projectId The ID of the project to upload to.
   * @param file The file to upload.
   * @returns An observable that emits upload progress and the final response.
   */
  uploadFile(projectId: string, file: File): Observable<number | UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const req = new HttpRequest('POST', `${this.apiUrl}/${projectId}`, formData, {
      reportProgress: true,
      headers: this.getHeaders().delete('Content-Type') // Let browser set Content-Type for FormData
    });

    const progress = new Subject<number | UploadFileResponse>();

    this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file, progress)),
      catchError(error => {
        progress.error(this.handleError(error));
        return this.handleError(error);
      })
    ).subscribe();

    return progress.asObservable();
  }

  /**
   * Processes HTTP events during file upload to determine progress or completion.
   * @param event The HTTP event.
   * @param file The file being uploaded.
   * @param progress The subject to emit progress or response.
   * @returns The event message.
   */
  private getEventMessage(event: HttpEvent<unknown>, file: File, progress: Subject<number | UploadFileResponse>): unknown {
    let percentDone: number;
    let eventBody: UploadFileResponse;

    switch (event.type) {
      case HttpEventType.UploadProgress:
        percentDone = Math.round(100 * (event.loaded || 0) / (event.total || 1));
        progress.next(percentDone);
        return percentDone;
      case HttpEventType.Response:
        eventBody = event.body as UploadFileResponse;
        progress.next(eventBody);
        progress.complete();
        return eventBody;
      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }
}
