import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoverageSummary, CoverageFile, GeneratedTestCase } from './test-coverage.model';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class TestCoverageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCoverageSummary(projectId: string): Observable<CoverageSummary> {
    return this.http.get<CoverageSummary>(`${this.apiUrl}${ApiEndpoints.COVERAGE.SUMMARY(projectId)}`);
  }

  getCoverageFiles(projectId: string): Observable<CoverageFile[]> {
    return this.http.get<CoverageFile[]>(`${this.apiUrl}${ApiEndpoints.COVERAGE.FILES(projectId)}`);
  }

  generateTestCases(projectId: string, filePath: string): Observable<GeneratedTestCase> {
    return this.http.post<GeneratedTestCase>(
      `${this.apiUrl}${ApiEndpoints.COVERAGE.GENERATE_TESTS(projectId)}`,
      { filePath }
    );
  }
}
