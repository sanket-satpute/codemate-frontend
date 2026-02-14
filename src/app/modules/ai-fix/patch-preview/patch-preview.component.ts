import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatchResult } from '../models/patch-result.model';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // For confidence meter
import { MatButtonModule } from '@angular/material/button'; // For buttons

@Component({
  selector: 'app-patch-preview',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatButtonModule],
  templateUrl: './patch-preview.component.html',
  styleUrls: ['./patch-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatchPreviewComponent {
  @Input({ required: true }) patch!: PatchResult;
  @Output() applyFix = new EventEmitter<PatchResult>();
  @Output() backToIssues = new EventEmitter<void>();

  confidencePercentage: Signal<number> = computed(() => this.patch.confidence * 100);

  onApplyFixClick(): void {
    this.applyFix.emit(this.patch);
  }

  onBackToIssuesClick(): void {
    this.backToIssues.emit();
  }
}
