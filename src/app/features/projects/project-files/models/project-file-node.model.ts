export interface ProjectFileNode {
  name: string;
  type: 'file' | 'folder';
  children?: ProjectFileNode[];
  path: string;
  extension?: string;
}
