import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Severity } from '../analysis-result.model';

@Component({
  selector: 'app-severity-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './severity-filter.component.html',
  styleUrls: ['./severity-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeverityFilterComponent {
  @Output() severitiesChanged = new EventEmitter<Severity[]>();
  
  severities: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  activeSeverities: WritableSignal<Set<Severity>> = signal(new Set(this.severities));

  toggleSeverity(severity: Severity): void {
    const active = this.activeSeverities();
    if (active.has(severity)) {
      active.delete(severity);
    } else {
      active.add(severity);
    }
    this.activeSeverities.set(new Set(active));
    this.severitiesChanged.emit(Array.from(active));
  }

  isActive(severity: Severity): boolean {
    return this.activeSeverities().has(severity);
  }
}
