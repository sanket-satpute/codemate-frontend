import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, forkJoin, takeUntil, catchError, of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { ProjectService } from '../../../core/services/project/project.service';
import { NotificationsService } from '../../../core/services/notifications/notifications.service';
import { ToastService } from '../../../core/services/toast';
import { Project } from '../../../core/models/project.model';
import { Notification } from '../../../core/models/notification.model';
import { CreateProjectDialogComponent } from '../../../shared/ui/create-project-dialog/create-project-dialog.component';
import { ProjectPickerDialogComponent, PickerMode } from '../../../shared/ui/project-picker-dialog/project-picker-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CreateProjectDialogComponent, ProjectPickerDialogComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private projectService = inject(ProjectService);
  private notificationsService = inject(NotificationsService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  userName = 'User';
  loading = signal(true);

  // Dialog state
  showCreateProjectDialog = signal(false);
  showProjectPickerDialog = signal(false);
  pickerMode = signal<PickerMode>('analyze');

  // Real data fed from backend
  metrics = signal<{ name: string; value: number | string; icon: string }[]>([]);
  projects = signal<Project[]>([]);
  recentActivities = signal<{ time: string; description: string; icon: string }[]>([]);
  aiInsights = signal<{ label: string; percentage: number }[]>([]);

  // Notifications from the shared service (real WebSocket + HTTP)
  notifications = this.notificationsService.notifications;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userName = user.name || user.email || 'User';
    }
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Data Loading ────────────────────────────────────────────────────────
  private loadDashboardData(): void {
    this.loading.set(true);

    forkJoin({
      dashboard: this.dashboardService.getDashboardData().pipe(catchError(() => of(null))),
      projects: this.projectService.getProjects().pipe(catchError(() => of([] as Project[]))),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ dashboard, projects }) => {
          // ── Metrics (from /api/dashboard) ──
          if (dashboard) {
            this.metrics.set([
              { name: 'Total Projects', value: dashboard.totalProjects ?? 0, icon: 'fas fa-layer-group' },
              { name: 'Analysis Completed', value: dashboard.successfulJobs ?? 0, icon: 'fas fa-check-circle' },
              { name: 'Failed Jobs', value: dashboard.failedJobs ?? 0, icon: 'fas fa-exclamation-triangle' },
              { name: 'Total Files', value: dashboard.totalFiles ?? 0, icon: 'fas fa-file-code' },
              {
                name: 'System Health',
                value: this.calculateHealth(dashboard.successfulJobs, dashboard.totalJobs),
                icon: 'fas fa-heartbeat'
              },
            ]);
            this.buildAIInsights(dashboard);
          }

          // ── Projects (from /api/projects) ──
          this.projects.set(projects ?? []);

          // ── Recent activity (derived from project list) ──
          this.buildRecentActivities(projects ?? []);

          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });

    // Notifications fetched independently (also receives WebSocket push)
    this.notificationsService
      .getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────
  private calculateHealth(successful: number | undefined, total: number | undefined): string {
    if (!total || total === 0) return 'N/A';
    const ratio = (successful ?? 0) / total;
    if (ratio >= 0.8) return 'Good';
    if (ratio >= 0.5) return 'Average';
    return 'Poor';
  }

  private buildRecentActivities(projects: Project[]): void {
    const activities = projects
      .filter(p => p.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(p => ({
        time: this.timeAgo(new Date(p.createdAt)),
        description: `Project "${p.name}" — ${this.friendlyStatus(p.status)}`,
        icon: this.statusIcon(p.status),
      }));
    this.recentActivities.set(activities);
  }

  private buildAIInsights(dashboard: any): void {
    const insights: { label: string; percentage: number }[] = [];

    if (dashboard.totalJobs > 0) {
      const rate = Math.round(((dashboard.successfulJobs ?? 0) / dashboard.totalJobs) * 100);
      insights.push({ label: 'Analysis Success Rate', percentage: rate });
    }

    if (dashboard.totalProjects > 0 && dashboard.totalFiles > 0) {
      const avg = Math.round(dashboard.totalFiles / dashboard.totalProjects);
      insights.push({ label: `Avg Files / Project (${avg})`, percentage: Math.min(100, Math.round((avg / 50) * 100)) });
    }

    if (dashboard.modelUsage) {
      const total = Object.values(dashboard.modelUsage as Record<string, number>).reduce((s, v) => s + v, 0);
      if (total > 0) {
        for (const [model, count] of Object.entries(dashboard.modelUsage as Record<string, number>)) {
          insights.push({ label: `${model} usage`, percentage: Math.round((count / total) * 100) });
        }
      }
    }

    this.aiInsights.set(
      insights.length ? insights : [{ label: 'Run your first analysis to see insights', percentage: 0 }]
    );
  }

  private timeAgo(date: Date): string {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  friendlyStatus(status?: string): string {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'ARCHIVED': return 'Archived';
      case 'COMPLETED': return 'Completed';
      case 'RUNNING': return 'Running';
      case 'FAILED': return 'Failed';
      case 'PENDING': return 'Pending';
      default: return 'Created';
    }
  }

  private statusIcon(status?: string): string {
    switch (status) {
      case 'ACTIVE': return 'fas fa-check-circle';
      case 'ARCHIVED': return 'fas fa-archive';
      case 'COMPLETED': return 'fas fa-check-circle';
      case 'RUNNING': return 'fas fa-spinner fa-spin';
      case 'FAILED': return 'fas fa-times-circle';
      default: return 'fas fa-plus-circle';
    }
  }

  statusClass(status?: string): string {
    switch (status) {
      case 'ACTIVE': return 'good';
      case 'ARCHIVED': return 'pending';
      case 'COMPLETED': return 'good';
      case 'RUNNING': return 'running';
      case 'FAILED': return 'poor';
      default: return 'pending';
    }
  }

  // ─── Quick Actions ───────────────────────────────────────────────────────
  createNewProject(): void {
    this.showCreateProjectDialog.set(true);
  }

  onCreateProjectDialogClosed(): void {
    this.showCreateProjectDialog.set(false);
    // Refresh dashboard data after dialog closes (project may have been created)
    this.loadDashboardData();
  }

  runAIAnalysis(): void {
    this.pickerMode.set('analyze');
    this.showProjectPickerDialog.set(true);
  }

  openAIChat(): void {
    this.pickerMode.set('chat');
    this.showProjectPickerDialog.set(true);
  }

  onProjectPickerClosed(): void {
    this.showProjectPickerDialog.set(false);
  }

  onProjectPicked(event: { project: Project; mode: PickerMode }): void {
    this.showProjectPickerDialog.set(false);

    if (event.mode === 'chat') {
      this.router.navigate(['/project-workspace', event.project.id, 'ai-chat']);
    } else {
      this.router.navigate(['/project-workspace', event.project.id, 'code-analysis']);
    }
  }

  // ─── Project Actions ─────────────────────────────────────────────────────
  viewProject(projectId: string): void {
    this.router.navigate(['/project-workspace', projectId, 'overview']);
  }

  analyzeProject(projectId: string): void {
    this.router.navigate(['/project-workspace', projectId, 'code-analysis']);
  }

  chatProject(projectId: string): void {
    this.router.navigate(['/project-workspace', projectId, 'ai-chat']);
  }

  viewAllNotifications(): void {
    this.router.navigate(['/notifications']);
  }
}
