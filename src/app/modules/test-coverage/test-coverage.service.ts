import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoverageSummary, CoverageFile, GeneratedTestCase } from './test-coverage.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestCoverageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCoverageSummary(projectId: string): Observable<CoverageSummary> {
    return this.http.get<CoverageSummary>(`${this.apiUrl}/coverage/${projectId}/summary`);
  }

  getCoverageFiles(projectId: string): Observable<CoverageFile[]> {
    return this.http.get<CoverageFile[]>(`${this.apiUrl}/coverage/${projectId}/files`);
  }

  generateTestCases(projectId: string, filePath: string): Observable<GeneratedTestCase> {
    return this.http.post<GeneratedTestCase>(
      `${this.apiUrl}/coverage/${projectId}/generate-tests`,
      { filePath }
    );
  }
}
