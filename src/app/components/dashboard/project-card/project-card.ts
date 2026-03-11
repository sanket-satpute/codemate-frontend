import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../core/models/project.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() archive = new EventEmitter<string>();

  get formattedDate(): string {
    return this.project.createdAt ? new Date(this.project.createdAt).toLocaleDateString() : 'N/A';
  }

  get updatedAgo(): string {
    const date = this.project.updatedAt || this.project.createdAt;
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  get topFileTypes(): string[] {
    const breakdown = this.project.fileTypeBreakdown;
    if (!breakdown) return [];
    return Object.entries(breakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([ext, count]) => `${ext} (${count})`);
  }

  formatSize(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0) + ' ' + units[i];
  }

  editProject(projectId: string) {
    this.edit.emit(projectId);
  }

  deleteProject(projectId: string) {
    this.delete.emit(projectId);
  }

  archiveProject(projectId: string) {
    this.archive.emit(projectId);
  }
}
