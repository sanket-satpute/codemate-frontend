import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectFileService } from './services/project-file';
import { ProjectFileNode } from './models/project-file-node.model';
import { FileContentResponse } from './models/file-content-response.model';
import { FileTreeComponent } from './components/file-tree/file-tree';
import { FileViewerComponent } from './components/file-viewer/file-viewer';

@Component({
  selector: 'app-project-files',
  standalone: true,
  imports: [CommonModule, FileTreeComponent, FileViewerComponent],
  templateUrl: './project-files.html',
  styleUrl: './project-files.css',
  providers: [ProjectFileService],
})
export class ProjectFilesComponent implements OnInit {
  projectId: string | null = null;

  fileTree = signal<ProjectFileNode[]>([]);
  selectedFileContent = signal<FileContentResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private projectFileService = inject(ProjectFileService);

  constructor() {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    if (this.projectId) {
      this.fetchFileTree(this.projectId);
    }
  }

  fetchFileTree(projectId: string): void {
    this.loading.set(true);
    this.projectFileService.getFileTree(projectId).subscribe({
      next: (tree: ProjectFileNode[]) => {
        this.fileTree.set(tree);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set('Failed to fetch file tree.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  onFileSelected(filePath: string): void {
    if (!this.projectId) return;

    this.loading.set(true);
    this.selectedFileContent.set(null);
    this.projectFileService.getFileContent(this.projectId, filePath).subscribe({
      next: (content: FileContentResponse) => {
        this.selectedFileContent.set(content);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set('Failed to fetch file content.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
