import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSummary } from '../../../core/models/report.model';
import { ProjectStatusBadgeComponent } from '../../../shared/ui/project-status-badge/project-status-badge.component';

@Component({
  selector: 'app-report-table',
  standalone: true,
  imports: [CommonModule, ProjectStatusBadgeComponent],
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent {
  @Input() reports: ReportSummary[] = [];
  
  sortColumn = signal<keyof ReportSummary | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  sortBy(column: keyof ReportSummary): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }

    this.reports.sort((a, b) => {
      const aValue = a[column] || '';
      const bValue = b[column] || '';

      if (aValue < bValue) {
        return this.sortDirection() === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection() === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
