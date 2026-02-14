import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state'; // Import EmptyStateComponent

@Component({
  selector: 'app-code-viewer',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent], // Add CommonModule and EmptyStateComponent here
  templateUrl: './code-viewer.html',
  styleUrl: './code-viewer.css',
})
export class CodeViewerComponent {
  @Input() fileContent = '';
}
