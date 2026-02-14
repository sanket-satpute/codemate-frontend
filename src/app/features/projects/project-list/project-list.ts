import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project/project.service';
import { Project } from '../../../core/models/project.model';
import { ProjectCardComponent } from '../../../components/dashboard/project-card/project-card';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProjectCardComponent, EmptyStateComponent],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.scss'],
})
export class ProjectListComponent implements OnInit {
  allProjects = signal<Project[]>([]);
  filteredProjects = computed(() => {
    const filter = this.searchTerm().toLowerCase();
    if (!filter) {
      return this.allProjects();
    }
    return this.allProjects().filter(
      (project) =>
        project.name.toLowerCase().includes(filter) ||
        project.description?.toLowerCase().includes(filter)
    );
  });
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  searchTerm = signal('');

  private projectService = inject(ProjectService);
  private router = inject(Router);

  constructor() {
    // No direct router access in template, use public method
  }

  ngOnInit(): void {
    this.fetchProjects();
  }

  /**
   * Fetches all projects for the authenticated user.
   */
  fetchProjects(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => { // Explicitly type response
        this.allProjects.set(projects);
        this.isLoading.set(false);
      },
      error: (err: unknown) => { // Explicitly type err
        this.errorMessage.set('Failed to fetch project list.');
        this.isLoading.set(false);
        console.error(err);
      },
    });
  }

  /**
   * Navigates to the project detail page.
   * @param projectId The ID of the project to view.
   */
  viewProjectDetail(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  /**
   * Handles search input changes.
   * @param event The input event.
   */
  onSearchChange(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  /**
   * Navigates to the upload page.
   */
  navigateToUpload(): void {
    this.router.navigate(['/upload']);
  }
}
