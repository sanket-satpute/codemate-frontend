import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectFileNode } from '../models/project-file-node.model';
import { FileContentResponse } from '../models/file-content-response.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectFileService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getFileTree(projectId: string): Observable<ProjectFileNode[]> {
    return this.http.get<ProjectFileNode[]>(
      `${this.apiUrl}/projects/${projectId}/files/tree`
    );
  }

  getFileContent(
    projectId: string,
    filePath: string
  ): Observable<FileContentResponse> {
    return this.http.get<FileContentResponse>(
      `${this.apiUrl}/projects/${projectId}/files/content`,
      {
        params: { path: filePath },
      }
    );
  }
}
