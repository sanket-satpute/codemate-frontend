import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportFiltersComponent } from './report-filters/report-filters.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { ExportButtonsComponent } from './export-buttons/export-buttons.component';
import { ReportsService } from '../../core/services/reports/reports.service';
import { ReportRequest } from '../../core/models/report.model';
import { saveAs } from 'file-saver';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { LoaderComponent } from '../../shared/ui/loader/loader.component'; // Assuming this path for LoaderComponent

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    ReportFiltersComponent,
    ReportTableComponent,
    ExportButtonsComponent,
    EmptyStateComponent,
    LoaderComponent // Assuming LoaderComponent is standalone
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reportsService = inject(ReportsService);
  reports = this.reportsService.reports;
  
  private currentFilters: ReportRequest = {};

  ngOnInit(): void {
    this.fetchReports({});
  }

  fetchReports(filters: ReportRequest): void {
    this.currentFilters = filters;
    this.reportsService.getReports(filters).subscribe();
  }

  exportCsv(): void {
    this.reportsService.exportCsv(this.currentFilters).subscribe(blob => {
      saveAs(blob, `reports-${new Date().toISOString()}.csv`);
    });
  }

  exportPdf(): void {
    this.reportsService.exportPdf(this.currentFilters).subscribe(blob => {
      saveAs(blob, `reports-${new Date().toISOString()}.pdf`);
    });
  }
}
