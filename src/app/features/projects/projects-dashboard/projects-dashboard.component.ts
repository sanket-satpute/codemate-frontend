import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStatusBadgeComponent } from '../../../shared/ui/project-status-badge/project-status-badge.component';
import { ProjectService } from '../../../core/services/project/project.service';
import { Project } from '../../../core/models/project.model';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-projects-dashboard',
  standalone: true,
  imports: [CommonModule, ProjectStatusBadgeComponent],
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss']
})
export class ProjectsDashboardComponent implements OnInit {
  projects = signal<Project[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects.set(projects);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load projects. Please try again later.');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  viewAnalysis(projectId: string): void {
    this.router.navigate(['/projects', projectId, 'details']);
  }

  openChat(projectId: string): void {
    this.router.navigate(['/projects', projectId, 'chat']);
  }

  rerunAnalysis(projectId: string): void {
    this.projectService.runAnalysis(projectId).subscribe({
      next: () => {
        this.toastService.showSuccess('Analysis started successfully.');
        this.loadProjects(); // Refresh the project list
      },
      error: (err) => {
        this.toastService.showError('Failed to start analysis.');
        console.error(err);
      }
    });
  }

  deleteProject(projectId: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.toastService.showSuccess('Project deleted successfully.');
          this.loadProjects(); // Refresh the project list
        },
        error: (err) => {
          this.toastService.showError('Failed to delete project.');
          console.error(err);
        }
      });
    }
  }

  getProjectStatus(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Not Started';
      case 'RUNNING':
        return 'Processing';
      case 'COMPLETED':
        return 'Completed';
      case 'FAILED':
        return 'Failed';
      default:
        return 'Unknown';
    }
  }
}
