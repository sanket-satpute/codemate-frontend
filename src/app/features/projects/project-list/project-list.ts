import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project/project.service';
import { Project, ProjectStatus } from '../../../core/models/project.model';
import { ProjectCardComponent } from '../../../components/dashboard/project-card/project-card';
import { CreateProjectDialogComponent } from '../../../shared/ui/create-project-dialog/create-project-dialog.component';
import { ToastService } from '../../../core/services/toast';

type FilterOption = 'all' | 'ACTIVE' | 'ARCHIVED';
type SortOption = 'name' | 'created' | 'updated';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProjectCardComponent,
    CreateProjectDialogComponent,
  ],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.scss'],
})
export class ProjectListComponent implements OnInit {
  allProjects = signal<Project[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  searchTerm = signal('');

  // Filter, Sort, View
  selectedFilter = signal<FilterOption>('all');
  sortBy = signal<SortOption>('updated');
  sortOrder = signal<'asc' | 'desc'>('desc');
  viewMode = signal<'grid' | 'list'>('grid');

  // Computed stats
  totalProjects = computed(() => this.allProjects().length);
  activeProjects = computed(() => this.allProjects().filter(p => p.status === 'ACTIVE').length);
  archivedProjects = computed(() => this.allProjects().filter(p => p.status === 'ARCHIVED').length);

  // Computed filtered + sorted projects
  filteredProjects = computed(() => {
    let projects = [...this.allProjects()];

    // Text search
    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      projects = projects.filter(
        p => p.name.toLowerCase().includes(search) ||
             p.description?.toLowerCase().includes(search)
      );
    }

    // Status filter
    const filter = this.selectedFilter();
    if (filter !== 'all') {
      projects = projects.filter(p => p.status === filter);
    }

    // Sort
    const sort = this.sortBy();
    const order = this.sortOrder();
    projects.sort((a, b) => {
      let cmp = 0;
      switch (sort) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'created':
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updated':
          cmp = new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime();
          break;
      }
      return order === 'asc' ? cmp : -cmp;
    });

    return projects;
  });

  // Create dialog
  showCreateDialog = signal(false);

  // Delete confirmation
  showDeleteConfirm = signal(false);
  deletingProjectId = signal<string | null>(null);
  deletingProjectName = signal('');
  deleting = signal(false);

  // Skeleton placeholder array
  skeletonCards = Array(6);

  private projectService = inject(ProjectService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.allProjects.set(projects);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        this.errorMessage.set('Failed to fetch project list.');
        this.isLoading.set(false);
        console.error(err);
      },
    });
  }

  // ─── Search & Filter ────────────────────────────────────────────────
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  setFilter(filter: FilterOption): void {
    this.selectedFilter.set(filter);
  }

  setSortBy(sort: SortOption): void {
    this.sortBy.set(sort);
  }

  toggleSortOrder(): void {
    this.sortOrder.update(o => o === 'asc' ? 'desc' : 'asc');
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  navigateToUpload(): void {
    this.router.navigate(['/upload']);
  }

  // ─── Create project ─────────────────────────────────────────────────
  openCreateDialog(): void {
    this.showCreateDialog.set(true);
  }

  onCreateDialogClosed(): void {
    this.showCreateDialog.set(false);
    this.fetchProjects();
  }

  // ─── Edit project ───────────────────────────────────────────────────
  onEditProject(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  // ─── Archive / Unarchive ────────────────────────────────────────────
  onArchiveProject(projectId: string): void {
    const project = this.allProjects().find(p => p.id === projectId);
    if (!project) return;
    const newStatus: ProjectStatus = project.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
    const label = newStatus === 'ARCHIVED' ? 'archived' : 'restored';
    this.projectService.updateProject(projectId, { status: newStatus }).subscribe({
      next: (updated) => {
        this.allProjects.update(list =>
          list.map(p => p.id === projectId ? { ...p, status: newStatus } : p)
        );
        this.toastService.showSuccess(`Project ${label} successfully.`);
      },
      error: () => {
        this.toastService.showError(`Failed to ${label.slice(0, -1)} project.`);
      },
    });
  }

  // ─── Delete project ─────────────────────────────────────────────────
  onDeleteProject(projectId: string): void {
    const project = this.allProjects().find(p => p.id === projectId);
    this.deletingProjectId.set(projectId);
    this.deletingProjectName.set(project?.name ?? 'this project');
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deletingProjectId.set(null);
  }

  confirmDelete(): void {
    const id = this.deletingProjectId();
    if (!id) return;
    this.deleting.set(true);
    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.toastService.showSuccess('Project deleted successfully.');
        this.allProjects.update(list => list.filter(p => p.id !== id));
        this.showDeleteConfirm.set(false);
        this.deletingProjectId.set(null);
        this.deleting.set(false);
      },
      error: () => {
        this.toastService.showError('Failed to delete project. Please try again.');
        this.deleting.set(false);
      },
    });
  }

  // ─── Utility ────────────────────────────────────────────────────────
  formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  getRelativeTime(dateStr: string): string {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return this.formatDate(dateStr);
  }
}
