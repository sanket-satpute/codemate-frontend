import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core'; // Added Output and EventEmitter
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
  @Output() edit = new EventEmitter<string>(); // Event emitter for edit action
  @Output() delete = new EventEmitter<string>(); // Event emitter for delete action

  // Helper to format date
  get formattedDate(): string {
    return this.project.createdAt ? new Date(this.project.createdAt).toLocaleDateString() : 'N/A';
  }

  editProject(projectId: string) {
    this.edit.emit(projectId);
  }

  deleteProject(projectId: string) {
    this.delete.emit(projectId);
  }
}
