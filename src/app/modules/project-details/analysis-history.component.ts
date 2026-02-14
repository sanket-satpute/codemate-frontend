import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job, AnalysisResult } from './project-details.models';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-analysis-history',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  templateUrl: './analysis-history.component.html',
  styleUrls: ['./analysis-history.component.scss']
})
export class AnalysisHistoryComponent {
  @Input() jobs: Job[] = [];
  @Input() analysisResult: AnalysisResult | null = null;
  @Output() viewResult = new EventEmitter<string>();

  selectedTab: 'summary' | 'issues' | 'suggestions' | 'file-insights' = 'summary';

  selectTab(tab: 'summary' | 'issues' | 'suggestions' | 'file-insights'): void {
    this.selectedTab = tab;
  }
}
