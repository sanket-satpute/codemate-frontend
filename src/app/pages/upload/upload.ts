// path: src/app/pages/upload/upload.ts
import { Component, Signal, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../core/services/upload.service';
import { Router, RouterModule } from '@angular/router'; // Added RouterModule
import { FormsModule } from '@angular/forms'; // Added FormsModule
import { JobStatus } from '../../core/models/job.model'; // Use JobStatus
import { JobService } from '../../core/services/job/job.service'; // Import JobService
import { JobProgressCardComponent } from '../../shared/ui/job-progress-card/job-progress-card.component'; // Import JobProgressCardComponent


@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    JobProgressCardComponent // Add JobProgressCardComponent
  ],
  templateUrl: './upload.html',
  styleUrls: ['./upload.css']
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadProgress = 0;
  isUploading = false;
  uploadSuccess = false;
  errorMessage = '';
  projectName = ''; // Added projectName
  projectDescription = ''; // Added projectDescription
  jobStatus: WritableSignal<JobStatus | null> = signal(null);

  constructor(
    private uploadService: UploadService,
    private router: Router,
    private jobService: JobService
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadProgress = 0;
      this.errorMessage = '';
      this.uploadSuccess = false;
      this.jobStatus.set(null);
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.uploadProgress = 0;
      this.errorMessage = '';
      this.uploadSuccess = false;
      this.jobStatus.set(null);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to proceed.';
      return;
    }

    this.isUploading = true;
    this.isUploading = true;
    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (event: number | JobStatus) => {
        if (typeof event === 'number') {
          this.uploadProgress = event;
        } else {
          this.jobStatus.set(event);
          this.jobService.subscribeToJob(event.jobId).subscribe({
            next: (status) => {
              this.jobStatus.set(status);
              if (status.state === 'COMPLETED' || status.state === 'FAILED' || status.state === 'CANCELLED') {
                this.isUploading = false;
              }
            },
            error: (err) => {
              console.error('Job subscription failed', err);
              this.isUploading = false;
            }
          });
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Upload failed. Please try again.';
        this.isUploading = false;
        this.uploadSuccess = false;
        console.error('Upload initiation error:', error);
      },
    });
  }

  retryUpload() {
    this.uploadProgress = 0;
    this.isUploading = false;
    this.uploadSuccess = false;
    this.errorMessage = '';
    this.jobStatus.set(null);
  }
}
