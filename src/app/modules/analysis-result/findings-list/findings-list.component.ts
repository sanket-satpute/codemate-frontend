import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue, Severity } from '../analysis-result.model';

@Component({
  selector: 'app-findings-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './findings-list.component.html',
  styleUrls: ['./findings-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingsListComponent {
  @Input({ required: true }) issues!: Issue[];
  @Output() issueSelected = new EventEmitter<Issue>();

  groupedIssues: Signal<Map<Severity, Issue[]>> = computed(() => {
    const groups = new Map<Severity, Issue[]>();
    for (const issue of this.issues) {
      if (!groups.has(issue.severity)) {
        groups.set(issue.severity, []);
      }
      groups.get(issue.severity)!.push(issue);
    }
    return groups;
  });

  selectIssue(issue: Issue): void {
    this.issueSelected.emit(issue);
  }
}
