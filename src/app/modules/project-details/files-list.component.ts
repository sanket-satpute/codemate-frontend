import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem } from './project-details.models';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component'; // Assuming path

@Component({
  selector: 'app-files-list',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent {
  @Input() files: FileItem[] = [];
}
