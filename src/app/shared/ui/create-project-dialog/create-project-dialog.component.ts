import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  ElementRef,
  HostListener,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProjectService } from '../../../core/services/project/project.service';
import { ToastService } from '../../../core/services/toast';
import { Router } from '@angular/router';

interface SelectedFile {
  file: File;
  name: string;
  size: number;
  extension: string;
  icon: string;
}

@Component({
  selector: 'app-create-project-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.scss'],
})
export class CreateProjectDialogComponent implements OnDestroy {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  private projectService = inject(ProjectService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  projectName = '';
  projectDescription = '';
  submitting = signal(false);
  nameError = signal('');
  filesError = signal('');
  isDragging = signal(false);
  uploadProgress = signal(0);

  selectedFiles = signal<SelectedFile[]>([]);

  totalFileSize = computed(() => {
    return this.selectedFiles().reduce((sum, f) => sum + f.size, 0);
  });

  readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
  readonly MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50 MB total
  readonly MAX_FILES = 50;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-overlay')) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.close();
  }

  close(): void {
    if (this.submitting()) return;
    this.resetForm();
    this.closed.emit();
  }

  // ─── File handling ──────────────────────────────────────────────────────
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    if (event.dataTransfer?.files) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
      input.value = ''; // reset so same file can be re-selected
    }
  }

  private addFiles(newFiles: File[]): void {
    this.filesError.set('');
    const current = this.selectedFiles();

    if (current.length + newFiles.length > this.MAX_FILES) {
      this.filesError.set(`Maximum ${this.MAX_FILES} files allowed`);
      return;
    }

    const toAdd: SelectedFile[] = [];
    for (const file of newFiles) {
      // Skip duplicates by name
      if (current.some(f => f.name === file.name) || toAdd.some(f => f.name === file.name)) {
        continue;
      }
      if (file.size > this.MAX_FILE_SIZE) {
        this.filesError.set(`"${file.name}" exceeds 10 MB limit`);
        continue;
      }
      toAdd.push({
        file,
        name: file.name,
        size: file.size,
        extension: this.getExtension(file.name),
        icon: this.getFileIcon(this.getExtension(file.name)),
      });
    }

    const updated = [...current, ...toAdd];
    const total = updated.reduce((s, f) => s + f.size, 0);
    if (total > this.MAX_TOTAL_SIZE) {
      this.filesError.set('Total file size exceeds 50 MB limit');
      return;
    }

    this.selectedFiles.set(updated);
  }

  removeFile(index: number): void {
    const files = [...this.selectedFiles()];
    files.splice(index, 1);
    this.selectedFiles.set(files);
    this.filesError.set('');
  }

  clearFiles(): void {
    this.selectedFiles.set([]);
    this.filesError.set('');
  }

  // ─── Submit ─────────────────────────────────────────────────────────────
  onSubmit(): void {
    // Validate name
    const name = this.projectName.trim();
    if (!name) {
      this.nameError.set('Project name is required');
      return;
    }
    if (name.length < 3) {
      this.nameError.set('Name must be at least 3 characters');
      return;
    }
    this.nameError.set('');

    // Validate files
    const files = this.selectedFiles();
    if (files.length === 0) {
      this.filesError.set('At least one file is required');
      return;
    }
    this.filesError.set('');

    this.submitting.set(true);
    this.uploadProgress.set(0);

    // Simulate progress while upload is in progress
    const progressInterval = setInterval(() => {
      const current = this.uploadProgress();
      if (current < 90) {
        this.uploadProgress.set(current + Math.random() * 15);
      }
    }, 500);

    const rawFiles = files.map(f => f.file);

    this.projectService
      .createProjectWithFiles(name, this.projectDescription.trim(), rawFiles)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (project) => {
          clearInterval(progressInterval);
          this.uploadProgress.set(100);

          setTimeout(() => {
            this.submitting.set(false);
            this.toastService.showSuccess(
              `Project "${project.name}" created with ${project.totalFiles} file(s)!`,
              'Project Created'
            );
            this.close();
            this.router.navigate(['/projects']);
          }, 400);
        },
        error: (err) => {
          clearInterval(progressInterval);
          this.submitting.set(false);
          this.uploadProgress.set(0);
          this.toastService.showError(
            err?.message || 'Failed to create project. Please try again.',
            'Error'
          );
        },
      });
  }

  // ─── Helpers ────────────────────────────────────────────────────────────
  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  private getExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  getFileIcon(ext: string): string {
    const icons: Record<string, string> = {
      java: 'fab fa-java',
      py: 'fab fa-python',
      js: 'fab fa-js-square',
      ts: 'fas fa-code',
      html: 'fab fa-html5',
      css: 'fab fa-css3-alt',
      json: 'fas fa-brackets-curly',
      xml: 'fas fa-file-code',
      zip: 'fas fa-file-archive',
      md: 'fas fa-file-alt',
      txt: 'fas fa-file-alt',
      yml: 'fas fa-cog',
      yaml: 'fas fa-cog',
    };
    return icons[ext] || 'fas fa-file';
  }

  private resetForm(): void {
    this.projectName = '';
    this.projectDescription = '';
    this.nameError.set('');
    this.filesError.set('');
    this.selectedFiles.set([]);
    this.submitting.set(false);
    this.uploadProgress.set(0);
    this.isDragging.set(false);
  }
}
