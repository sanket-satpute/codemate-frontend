import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProjectService } from '../../../core/services/project/project.service';
import { Project } from '../../../core/models/project.model';

export type PickerMode = 'analyze' | 'chat';

@Component({
  selector: 'app-project-picker-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-picker-dialog.component.html',
  styleUrls: ['./project-picker-dialog.component.scss'],
})
export class ProjectPickerDialogComponent implements OnChanges, OnDestroy {
  @Input() isOpen = false;
  /** Controls the CTA label & icon */
  @Input() mode: PickerMode = 'analyze';
  @Output() closed = new EventEmitter<void>();
  @Output() projectSelected = new EventEmitter<{ project: Project; mode: PickerMode }>();

  private projectService = inject(ProjectService);
  private destroy$ = new Subject<void>();

  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  searchTerm = '';
  loading = signal(true);
  error = signal<string | null>(null);

  // Labels driven by mode
  get title(): string {
    return this.mode === 'chat' ? 'Select Project for AI Chat' : 'Select Project to Analyze';
  }

  get ctaLabel(): string {
    return this.mode === 'chat' ? 'Open Chat' : 'Run Analysis';
  }

  get ctaIcon(): string {
    return this.mode === 'chat' ? 'fas fa-comments' : 'fas fa-play';
  }

  get headerIcon(): string {
    return this.mode === 'chat' ? 'fas fa-comments' : 'fas fa-robot';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.loadProjects();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-overlay')) {
      this.close();
    }
  }

  close(): void {
    this.searchTerm = '';
    this.closed.emit();
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProjects = term
      ? this.allProjects.filter(p => p.name.toLowerCase().includes(term))
      : [...this.allProjects];
  }

  selectProject(project: Project): void {
    this.projectSelected.emit({ project, mode: this.mode });
    this.close();
  }

  private loadProjects(): void {
    this.loading.set(true);
    this.error.set(null);

    this.projectService
      .getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          this.allProjects = projects;
          this.filteredProjects = [...projects];
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load projects.');
          this.loading.set(false);
        },
      });
  }
}
