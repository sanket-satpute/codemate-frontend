import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from './models/issue.model';
import { PatchResult } from './models/patch-result.model';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class FixApplyService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getIssues(projectId: string): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.apiUrl}${ApiEndpoints.PROJECTS.ISSUES(projectId)}`);
  }

  generateFix(issueId: string): Observable<PatchResult> {
    return this.http.post<PatchResult>(`${this.apiUrl}${ApiEndpoints.AI_FIX.GENERATE}`, { issueId });
  }

  applyFix(patch: PatchResult, projectId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${ApiEndpoints.PROJECTS.APPLY_FIX(projectId)}`, patch);
  }
}
