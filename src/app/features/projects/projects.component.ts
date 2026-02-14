import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe'; // Added this line

// Interfaces
interface Project {
  id: string;
  name: string;
  type: 'Web' | 'Backend' | 'Android' | 'iOS' | 'ML';
  status: 'analyzed' | 'running' | 'pending' | 'archived';
  lastUpdated: Date;
  healthScore: number;
  language: string;
  description?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent, TruncatePipe], // Added TruncatePipe here
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  // Core data
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  loading = false;

  // Search & Filtering
  searchTerm = '';
  selectedFilter: 'all' | 'active' | 'archived' = 'all';
  sortBy: 'name' | 'updated' | 'health' | 'created' = 'updated';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Views
  viewMode: 'grid' | 'list' = 'grid';

  // Context Menu
  showMenu = false;
  selectedProject: Project | null = null;
  menuPosition = { x: 0, y: 0 };

  // Statistics (computed)
  get totalProjects() {
    return this.projects.length;
  }

  get activeProjects() {
    return this.projects.filter(p => p.status === 'running' || p.status === 'analyzed').length;
  }

  get archivedProjects() {
    return this.projects.filter(p => p.status === 'archived').length;
  }

  get completedProjects() {
    return this.projects.filter(p => p.status === 'analyzed').length;
  }

  get avgHealthScore() {
    if (this.projects.length === 0) return 0;
    const total = this.projects.reduce((sum, p) => sum + p.healthScore, 0);
    return Math.round(total / this.projects.length);
  }

  get totalLinesCode() {
    return '125.4k'; // Mock data
  }

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadProjects();
  }

  ngOnDestroy() {
    this.hideProjectMenu();
  }

  // Data Loading
  loadProjects() {
    this.loading = true;
    // Mock data - replace with actual service call
    setTimeout(() => {
      this.projects = [
        {
          id: '1',
          name: 'CodeMate AI Backend',
          description: 'Core API services for the CodeMate AI platform with advanced analysis capabilities',
          type: 'Backend',
          status: 'analyzed',
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          healthScore: 85,
          language: 'Python'
        },
        {
          id: '2',
          name: 'E-commerce Platform',
          description: 'Full-stack e-commerce solution with payment processing and inventory management',
          type: 'Web',
          status: 'running',
          lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          healthScore: 92,
          language: 'TypeScript'
        },
        {
          id: '3',
          name: 'Mobile Banking App',
          description: 'Secure mobile banking application with biometric authentication and real-time transfers',
          type: 'Android',
          status: 'pending',
          lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          healthScore: 78,
          language: 'Kotlin'
        },
        {
          id: '4',
          name: 'ML Recommendation Engine',
          description: 'Machine learning service for personalized content recommendations',
          type: 'Backend',
          status: 'archived',
          lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          healthScore: 67,
          language: 'Python'
        },
        {
          id: '5',
          name: 'Admin Dashboard',
          description: 'Internal administration panel with analytics and user management',
          type: 'Web',
          status: 'analyzed',
          lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          healthScore: 96,
          language: 'TypeScript'
        }
      ];
      this.filteredProjects = [...this.projects];
      this.applyFilters();
      this.loading = false;
    }, 800);
  }

  // Search & Filtering
  applyFilters() {
    let filtered = [...this.projects];

    // Text search
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(search) ||
        project.type.toLowerCase().includes(search) ||
        project.language.toLowerCase().includes(search) ||
        (project.description && project.description.toLowerCase().includes(search))
      );
    }

    // Status filter
    if (this.selectedFilter !== 'all') {
      if (this.selectedFilter === 'active') {
        filtered = filtered.filter(p => p.status === 'running' || p.status === 'analyzed');
      } else {
        filtered = filtered.filter(p => p.status === this.selectedFilter);
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'updated':
          comparison = a.lastUpdated.getTime() - b.lastUpdated.getTime();
          break;
        case 'health':
          comparison = a.healthScore - b.healthScore;
          break;
        case 'created':
          comparison = a.lastUpdated.getTime() - b.lastUpdated.getTime(); // Assuming created = last updated for demo
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredProjects = filtered;
  }

  setFilter(filter: 'all' | 'active' | 'archived') {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  // Project Actions
  createNewProject() {
    this.router.navigate(['/projects/new']);
  }

  viewProject(project: Project) {
    this.router.navigate(['/projects', project.id]);
  }

  runAnalysis(project: Project) {
    this.router.navigate(['/projects', project.id, 'analysis']);
  }

  // Context Menu
  showProjectMenu(event: MouseEvent, project: Project) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedProject = project;
    this.showMenu = true;
    this.menuPosition = {
      x: event.clientX,
      y: event.clientY
    };

    // Close menu when clicking elsewhere
    document.addEventListener('click', this.onDocumentClick.bind(this), { once: true });
  }

  hideProjectMenu() {
    this.showMenu = false;
    this.selectedProject = null;
  }

  onDocumentClick() {
    this.hideProjectMenu();
  }

  editProject(project: Project) {
    this.router.navigate(['/projects', project.id, 'edit']);
    this.hideProjectMenu();
  }

  duplicateProject(project: Project) {
    console.log('Duplicate project:', project.name);
    this.hideProjectMenu();
  }

  archiveProject(project: Project) {
    console.log('Archive project:', project.name);
    this.hideProjectMenu();
  }

  deleteProject(project: Project) {
    console.log('Delete project:', project.name);
    this.hideProjectMenu();
  }

  // Utility Methods
  getProjectIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'web': return 'fa-globe';
      case 'backend': return 'fa-server';
      case 'android': return 'fa-mobile-alt';
      case 'ios': return 'fa-mobile-alt';
      case 'ml': return 'fa-brain';
      default: return 'fa-project-diagram';
    }
  }

  getProjectColor(project: Project): string {
    const colors = [
      'var(--primary-600)',
      'var(--success)',
      'var(--warning)',
      'var(--error)',
      'var(--accent-500)'
    ];
    // Deterministic color based on project type
    const index = project.type.toLowerCase().charCodeAt(0) % colors.length;
    return colors[index];
  }

  getProjectTypeClass(type: string): string {
    return type.toLowerCase();
  }

  getHealthClass(score: number): string {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    return 'poor';
  }
}
