import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue } from '../models/issue.model';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueListComponent {
  @Input({ required: true }) issues!: Issue[];
  @Output() generateFix = new EventEmitter<Issue>();

  onGenerateFixClick(issue: Issue): void {
    this.generateFix.emit(issue);
  }

  getSeverityClass(severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): string {
    return `severity-${severity.toLowerCase()}`;
  }
}
