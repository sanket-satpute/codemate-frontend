import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectFileNode } from '../../models/project-file-node.model';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-tree.html',
  styleUrl: './file-tree.css',
})
export class FileTreeComponent {
  @Input() fileTree: ProjectFileNode[] = [];
  @Output() fileSelected = new EventEmitter<string>();

  expandedFolders = signal<Set<string>>(new Set());
  selectedFilePath = signal<string | null>(null);

  toggleFolder(node: ProjectFileNode): void {
    if (node.type === 'folder') {
      const expanded = this.expandedFolders();
      if (expanded.has(node.path)) {
        expanded.delete(node.path);
      } else {
        expanded.add(node.path);
      }
      this.expandedFolders.set(new Set(expanded));
    }
  }

  onFileClick(node: ProjectFileNode): void {
    if (node.type === 'file') {
      this.fileSelected.emit(node.path);
      this.selectedFilePath.set(node.path);
    }
  }

  onChildFileSelected(filePath: string): void {
    this.fileSelected.emit(filePath);
  }

  isExpanded(node: ProjectFileNode): boolean {
    return this.expandedFolders().has(node.path);
  }

  isSelected(node: ProjectFileNode): boolean {
    return this.selectedFilePath() === node.path;
  }
}
