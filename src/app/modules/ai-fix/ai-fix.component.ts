import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FixApplyService } from './fix-apply.service';
import { Issue } from './models/issue.model';
import { PatchResult } from './models/patch-result.model';
import { IssueListComponent } from './issue-list/issue-list.component';
import { PatchPreviewComponent } from './patch-preview/patch-preview.component';
import { LoaderComponent } from '../../shared/ui/loader/loader.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-ai-fix',
  standalone: true,
  imports: [
    CommonModule,
    IssueListComponent,
    PatchPreviewComponent,
    LoaderComponent,
    EmptyStateComponent
  ],
  templateUrl: './ai-fix.component.html',
  styleUrls: ['./ai-fix.component.scss']
})
export class AiFixComponent implements OnInit {
  issues: WritableSignal<Issue[]> = signal([]);
  selectedIssue: WritableSignal<Issue | null> = signal(null);
  patch: WritableSignal<PatchResult | null> = signal(null);
  loading = signal(false);

  projectId!: string;

  constructor(
    private route: ActivatedRoute,
    private fixApplyService: FixApplyService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    this.loadIssues();
  }

  loadIssues(): void {
    this.loading.set(true);
    this.fixApplyService.getIssues(this.projectId).subscribe({
      next: (issues) => {
        this.issues.set(issues);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load issues', err);
        this.loading.set(false);
      }
    });
  }

  onGenerateFix(issue: Issue): void {
    this.selectedIssue.set(issue);
    this.loading.set(true);
    this.fixApplyService.generateFix(issue.id).subscribe({
      next: (patchResult) => {
        this.patch.set(patchResult);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to generate fix', err);
        this.loading.set(false);
      }
    });
  }

  onApplyFix(patchResult: PatchResult): void {
    this.loading.set(true);
    this.fixApplyService.applyFix(patchResult, this.projectId).subscribe({
      next: () => {
        alert('Fix applied successfully!'); // TODO: Replace with ToastService
        this.resetState();
      },
      error: (err) => {
        console.error('Failed to apply fix', err);
        alert('Failed to apply fix.'); // TODO: Replace with ToastService
        this.loading.set(false);
      }
    });
  }

  onBackToIssues(): void {
    this.resetState();
  }

  private resetState(): void {
    this.selectedIssue.set(null);
    this.patch.set(null);
    this.loading.set(false);
    this.loadIssues(); // Refresh issues after an action
  }
}
