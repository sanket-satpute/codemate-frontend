import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../../../core/services/project/project.service';
import { ProjectSummary } from '../models/project-summary.model';
import { CommonModule } from '@angular/common';
import { SummaryCardComponent } from '../components/summary-card/summary-card';
import { RiskMeterComponent } from '../components/risk-meter/risk-meter';
import { QuickActionsComponent } from '../components/quick-actions/quick-actions';

@Component({
  selector: 'app-project-summary',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SummaryCardComponent,
    RiskMeterComponent,
    QuickActionsComponent,
  ],
  templateUrl: './project-summary.html',
  styleUrls: ['./project-summary.css'],
})
export class ProjectSummaryComponent implements OnInit {
  projectId = signal<string>('');
  projectSummary = signal<ProjectSummary | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('projectId');
    if (id) {
      this.projectId.set(id);
      this.fetchSummary();
    }
  }

  fetchSummary(): void {
    this.isLoading.set(true);
    this.projectService.getProjectSummary(this.projectId()).subscribe({
      next: summary => {
        this.projectSummary.set(summary);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load project summary.');
        this.isLoading.set(false);
      },
    });
  }
}
