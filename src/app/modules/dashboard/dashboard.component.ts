import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { Dashboard, Activity } from '../../core/models/dashboard.model';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private router = inject(Router);

  dashboardData = signal<Dashboard | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Default activities for demo when no real data
  defaultActivities: Activity[] = [
    {
      id: '1',
      title: 'Analysis Completed',
      description: 'Project "Mobile App" scanned successfully',
      type: 'success',
      icon: 'fa-check-circle',
      status: 'completed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      title: 'Security Alert',
      description: '3 new vulnerabilities detected in production',
      type: 'warning',
      icon: 'fa-exclamation-triangle',
      status: 'alert',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: '3',
      title: 'Project Created',
      description: 'New project "E-commerce API" added to workspace',
      type: 'info',
      icon: 'fa-plus-circle',
      status: 'completed',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    }
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      this.error.set('User not authenticated. Please log in.');
      this.loading.set(false);
      return;
    }

    this.dashboardService.getDashboardData(userId.toString()).subscribe({
      next: (data: Dashboard) => {
        this.dashboardData.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }

  retry(): void {
    this.loadDashboardData();
  }

  openProject(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  navigateToProjects(): void {
    this.router.navigate(['/projects']);
  }

  createProject(): void {
    this.router.navigate(['/projects/new']);
  }

  openProjectModal(): void {
    this.router.navigate(['/projects/new']);
  }

  viewReports(): void {
    this.router.navigate(['/reports']);
  }

  openSettings(): void {
    this.router.navigate(['/settings']);
  }

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

  getActivityIconClass(type: string): string {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'info';
    }
  }

  getActivityStatusClass(status: string): string {
    return status.toLowerCase();
  }

  private handleError(err: any): void {
    console.error('Dashboard data loading failed:', err);
    this.error.set(err.message || 'Failed to load dashboard data. Please refresh.');
    this.loading.set(false);
  }
}
