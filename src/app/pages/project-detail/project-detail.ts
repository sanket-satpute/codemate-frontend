// path: src/app/pages/project-detail/project-detail.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../core/services/project/project.service';
import { ProjectDetails } from '../../core/models/project.model';
import { ProjectFile } from '../../modules/project-files/project-files.models'; // Corrected import path
import { FileExplorerComponent } from '../../components/project-detail/file-explorer/file-explorer';
import { CodeViewerComponent } from '../../components/project-detail/code-viewer/code-viewer';
import { ChatBoxComponent } from '../../components/project-detail/chat-box/chat-box';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state';
import { Observable, switchMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FileExplorerComponent, CodeViewerComponent, ChatBoxComponent, EmptyStateComponent],
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.scss']
})
export class ProjectDetailComponent implements OnInit {
  projectDetails$: Observable<ProjectDetails | null> = of(null);
  selectedFile: ProjectFile | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.projectDetails$ = this.route.paramMap.pipe(
      switchMap(params => {
        const projectId = params.get('id');
        if (projectId) {
          this.isLoading = true;
          this.errorMessage = '';
          return this.projectService.getProjectDetail(projectId).pipe(
            catchError(error => {
              this.errorMessage = 'Failed to load project details. Please try again.'; // Kept for now, to be refined later
              this.isLoading = false;
              console.error('Error fetching project details:', error);
              return of(null);
            })
          );
        }
        this.errorMessage = 'Project ID is missing.'; // Kept for now, to be refined later
        this.isLoading = false;
        return of(null);
      })
    );

    this.projectDetails$.subscribe(details => {
      if (details) {
        this.isLoading = false;
        // Optionally select the first file by default
        if (details.files && details.files.length > 0) {
          this.selectedFile = details.files[0];
        }
      } else if (!this.errorMessage) {
        this.errorMessage = 'Project not found or an unexpected error occurred.'; // Kept for now, to be refined later
      }
    });
  }

  onFileSelected(file: ProjectFile) {
    this.selectedFile = file;
  }
}
