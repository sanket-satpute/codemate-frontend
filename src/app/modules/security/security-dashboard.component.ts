import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SecurityService } from './security.service';
import { HeatmapData, SecuritySummary, Vulnerability } from './security.model';
import { VulnerabilityItemComponent } from './vulnerability-item/vulnerability-item.component';
import { VulnerabilityHeatmapComponent } from './vulnerability-heatmap/vulnerability-heatmap.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-security-dashboard',
  standalone: true,
  imports: [CommonModule, VulnerabilityItemComponent, VulnerabilityHeatmapComponent, HttpClientModule],
  templateUrl: './security-dashboard.component.html',
  styleUrls: ['./security-dashboard.component.scss']
})
export class SecurityDashboardComponent implements OnInit {
  private securityService = inject(SecurityService);
  private route = inject(ActivatedRoute);

  projectId = signal<string | null>(null);
  summary = signal<SecuritySummary | null>(null);
  vulnerabilities = signal<Vulnerability[]>([]);
  heatmap = signal<HeatmapData[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('projectId');
      if (id) {
        this.projectId.set(id);
        this.loadSecurityData(id);
      } else {
        this.error.set('Project ID not found in route.');
        this.loading.set(false);
      }
    });
  }

  loadSecurityData(projectId: string): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      summary: this.securityService.getSummary(projectId),
      vulnerabilities: this.securityService.getVulnerabilities(projectId),
      heatmap: this.securityService.getHeatmap(projectId)
    }).subscribe({
      next: (data) => {
        this.summary.set(data.summary);
        this.vulnerabilities.set(data.vulnerabilities);
        this.heatmap.set(data.heatmap);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load security data', err);
        this.error.set('Failed to load security data. Please try again later.');
        this.loading.set(false);
      }
    });
  }

  getSeverityPercentage(severity: 'HIGH' | 'MEDIUM' | 'LOW'): number {
    const total = this.summary()?.totalVulnerabilities || 0;
    if (total === 0) return 0;
    switch (severity) {
      case 'HIGH': return ((this.summary()?.high || 0) / total) * 100;
      case 'MEDIUM': return ((this.summary()?.medium || 0) / total) * 100;
      case 'LOW': return ((this.summary()?.low || 0) / total) * 100;
      default: return 0;
    }
  }

  getSeverityClass(severity: 'HIGH' | 'MEDIUM' | 'LOW'): string {
    switch (severity) {
      case 'HIGH': return 'severity-high';
      case 'MEDIUM': return 'severity-medium';
      case 'LOW': return 'severity-low';
      default: return '';
    }
  }

  getPieChartStrokeDasharray(severity: 'HIGH' | 'MEDIUM' | 'LOW'): string {
    const total = this.summary()?.totalVulnerabilities || 0;
    if (total === 0) return '0 100';

    let highPercentage = 0;
    let mediumPercentage = 0;
    let lowPercentage = 0;

    if (this.summary()) {
      highPercentage = (this.summary()!.high / total);
      mediumPercentage = (this.summary()!.medium / total);
      lowPercentage = (this.summary()!.low / total);
    }

    const circumference = 2 * Math.PI * 40; // 40 is the radius

    switch (severity) {
      case 'HIGH':
        return `${highPercentage * circumference} ${circumference}`;
      case 'MEDIUM':
        // Calculate offset for medium segment
        const highOffset = highPercentage * circumference;
        return `${mediumPercentage * circumference} ${circumference - highOffset} ${highOffset}`;
      case 'LOW':
        // Calculate offset for low segment
        const totalOffset = (highPercentage + mediumPercentage) * circumference;
        return `${lowPercentage * circumference} ${circumference - totalOffset} ${totalOffset}`;
      default:
        return '0 100';
    }
  }
}
