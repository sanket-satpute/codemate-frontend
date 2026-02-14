import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectFile } from '../../../modules/project-files/project-files.models'; // Corrected import path
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state'; // Import EmptyStateComponent

interface TreeNode {
  name: string;
  isFolder?: boolean;
  isFile?: boolean;
  children?: TreeNode[];
  file?: ProjectFile; // Reference to the actual ProjectFile if this node is a file
  path?: string; // For tracking full path if needed
}

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  templateUrl: './file-explorer.html',
  styleUrls: ['./file-explorer.scss'],
})
export class FileExplorerComponent {
  @Input({ required: true }) files: ProjectFile[] = [];
  @Input() selectedFile: ProjectFile | null = null;
  @Output() fileSelected = new EventEmitter<ProjectFile>();

  expandedFolders = signal<Set<string>>(new Set());

  onFileClick(file: ProjectFile): void {
    this.fileSelected.emit(file);
  }

  toggleFolder(folderPath: string): void {
    const current = this.expandedFolders();
    if (current.has(folderPath)) {
      current.delete(folderPath);
    } else {
      current.add(folderPath);
    }
    this.expandedFolders.set(new Set(current));
  }

  get fileTree(): TreeNode[] {
    const tree: Record<string, TreeNode> = {};

    this.files.forEach(file => {
      const parts = file.filePath.split('/');
      let currentLevel: Record<string, TreeNode> = tree;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const currentPath = parts.slice(0, i + 1).join('/');

        if (i === parts.length - 1) {
          // It's a file
          currentLevel[part] = { name: part, isFile: true, file: file, path: currentPath };
        } else {
          // It's a folder
          if (!currentLevel[part]) {
            currentLevel[part] = { name: part, isFolder: true, children: [], path: currentPath };
          }
          currentLevel = currentLevel[part].children!.reduce((acc, child) => {
            acc[child.name] = child;
            return acc;
          }, {} as Record<string, TreeNode>);
        }
      }
    });
    return this.objectToSortedArray(tree);
  }

  private objectToSortedArray(obj: Record<string, TreeNode>): TreeNode[] {
    return Object.keys(obj).sort((a, b) => {
      const aIsFolder = obj[a].isFolder;
      const bIsFolder = obj[b].isFolder;
      if (aIsFolder && !bIsFolder) return -1; // Folders first
      if (!aIsFolder && bIsFolder) return 1;
      return a.localeCompare(b); // Then alphabetically
    }).map(key => {
      const item = obj[key];
      if (item.isFolder) {
        // Recursively sort children if it's a folder
        return { ...item, children: item.children ? this.objectToSortedArray(item.children!.reduce((acc, child) => {
          acc[child.name] = child;
          return acc;
        }, {} as Record<string, TreeNode>)) : [] };
      }
      return { ...item };
    });
  }
}
