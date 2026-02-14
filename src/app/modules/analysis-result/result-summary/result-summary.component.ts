import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisSummary } from '../analysis-result.model';

@Component({
  selector: 'app-result-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-summary.component.html',
  styleUrls: ['./result-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultSummaryComponent {
  @Input({ required: true }) summary!: AnalysisSummary;
}
