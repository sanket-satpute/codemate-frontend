import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suggestion, RefactorPreview } from './suggestions.model';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getSuggestions(projectId: string): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(`${this.apiUrl}${ApiEndpoints.ANALYSIS.SUGGESTIONS(projectId)}`);
  }

  getRefactorPreview(projectId: string, suggestionId: string): Observable<RefactorPreview> {
    return this.http.post<RefactorPreview>(
      `${this.apiUrl}${ApiEndpoints.ANALYSIS.REFACTOR_PREVIEW(projectId)}`,
      { suggestionId }
    );
  }
}
