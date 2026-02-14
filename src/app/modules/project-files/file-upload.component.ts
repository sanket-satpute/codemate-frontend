import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectFilesService } from './project-files.service';
import { ToastService } from '../../core/services/toast'; // Corrected import path

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() projectId!: string;
  @Output() filesUploaded = new EventEmitter<void>();

  uploading = signal(false);
  progress = signal(0);
  error = signal<string | null>(null);

  constructor(
    private projectFilesService: ProjectFilesService,
    private toastService: ToastService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFiles(Array.from(input.files));
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.uploadFiles(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private uploadFiles(files: File[]): void {
    if (!this.projectId) {
      this.error.set('Project ID is missing.');
      return;
    }

    this.uploading.set(true);
    this.error.set(null);
    this.progress.set(0);

    // Simulate progress for now, actual progress can be implemented with HttpClient's reportProgress
    let uploadedCount = 0;
    const totalFiles = files.length;

    files.forEach(file => {
      this.projectFilesService.uploadFile(this.projectId, file).subscribe({
        next: (response) => {
          uploadedCount++;
          this.progress.set(Math.round((uploadedCount / totalFiles) * 100));
          this.toastService.showSuccess(`File '${response.fileName}' uploaded successfully.`);
          if (uploadedCount === totalFiles) {
            this.uploading.set(false);
            this.filesUploaded.emit(); // Notify parent component
          }
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.error.set(`Failed to upload file '${file.name}'.`);
          this.uploading.set(false);
          this.toastService.showError(`Failed to upload file '${file.name}'.`);
        }
      });
    });
  }
}
