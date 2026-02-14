import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProjectHealthScore {
  name: string;
  score: string;
  icon: string;
  colorClass: string;
  tooltip: string;
}

interface QuickStat {
  label: string;
  value: string | number;
}

interface Issue {
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

interface FileNode {
  name: string;
  children?: FileNode[];
}

interface RecentJob {
  time: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  projectId: string = 'example-proj-123'; // Placeholder for actual project ID
  projectName: string = 'CodeMate AI Monorepo';
  projectDescription: string = 'Comprehensive analysis for our core AI application backend and frontend services.';
  projectTags: string[] = ['Angular', 'Spring Boot', 'Java', 'TypeScript', 'Node.js', 'PostgreSQL'];
  projectMetadata = {
    createdDate: '2025-10-01',
    lastUpdated: '2025-11-30',
    totalFiles: 1245,
    projectSize: '550 MB'
  };

  projectHealthScores: ProjectHealthScore[] = [
    { name: 'Code Quality', score: 'A+', icon: 'fas fa-star', colorClass: 'good', tooltip: 'Excellent code quality, highly maintainable.' },
    { name: 'Security Score', score: '88%', icon: 'fas fa-shield-alt', colorClass: 'good', tooltip: 'Strong security posture, minor vulnerabilities.' },
    { name: 'Performance Score', score: '75%', icon: 'fas fa-tachometer-alt', colorClass: 'average', tooltip: 'Good performance, some areas for optimization.' },
    { name: 'Maintainability', score: '8.2/10', icon: 'fas fa-code-branch', colorClass: 'good', tooltip: 'Well-structured codebase, easy to maintain.' },
  ];

  quickStats: QuickStat[] = [
    { label: 'Total Files Scanned', value: 980 },
    { label: 'Total Errors', value: 12 },
    { label: 'Total Warnings', value: 45 },
    { label: 'Total Critical Issues', value: 3 },
    { label: 'Lines of Code', value: '150k+' },
    { label: 'Tech Stack Detected', value: '6' },
  ];

  majorIssues = {
    lastScanDate: '2025-11-30 14:30 PM',
    criticalIssuesCount: 3,
    highIssues: 5,
    mediumIssues: 10,
    lowIssues: 20,
    topCriticalProblems: [
      'Unpatched dependency: `lodash@<4.17.21` in package.json',
      'Hardcoded API key in `src/app/core/auth.service.ts`',
      'SQL Injection vulnerability in `UserService.java`'
    ]
  };

  fileStructurePreview: FileNode[] = [
    { name: 'src', children: [
      { name: 'app', children: [
        { name: 'components', children: [
          { name: 'dashboard' },
          { name: 'layout' },
          { name: 'shared' }
        ]},
        { name: 'core', children: [
          { name: 'services' },
          { name: 'guards' }
        ]},
        { name: 'features', children: [
          { name: 'auth' },
          { name: 'projects' }
        ]},
        { name: 'main.ts' },
        { name: 'app.module.ts' },
      ]},
      { name: 'assets', children: [
        { name: 'images' },
        { name: 'icons' }
      ]},
      { name: 'environments' },
      { name: 'styles' },
      { name: 'config.json' },
      { name: 'package.json' },
      { name: 'README.md' }
    ]},
  ];

  recentActivities: RecentJob[] = [
    { time: '2 hours ago', description: 'Analysis started for `Backend API`', icon: 'fas fa-play' },
    { time: 'Yesterday', description: 'New code patterns generated for `Auth Module`', icon: 'fas fa-code' },
    { time: '2 days ago', description: '3 critical errors found in `Frontend Service`', icon: 'fas fa-bug' },
    { time: '1 week ago', description: 'Version updated to `1.2.0`', icon: 'fas fa-code-branch' },
    { time: '1 week ago', description: 'Uploaded 15 new files to `Analytics Service`', icon: 'fas fa-upload' },
  ];

  constructor() { }

  ngOnInit(): void {
    // You might fetch project details here based on a route parameter (e.g., project ID)
  }

  // Action methods
  editProject(): void { console.log('Edit Project'); }
  deleteProject(): void { console.log('Delete Project'); }
  reRunAnalysis(): void { console.log('Re-run Analysis'); }
  downloadReport(): void { console.log('Download Report'); }
  viewFullAnalysis(): void { console.log('View Full Analysis'); }
  openFullFileExplorer(): void { console.log('Open Full File Explorer'); }
  uploadMoreFiles(): void { console.log('Upload More Files'); }
  runDeepAnalysis(): void { console.log('Run Deep Analysis'); }
  openDebugView(): void { console.log('Open Debug View'); }

  toggleFileExplorerNode(node: FileNode, event: Event): void {
    // Simple toggle logic for visual effect in HTML
    // In a real app, you might have a more complex state management for this
    // For now, we'll just prevent default to not trigger any links if any
    event.stopPropagation();
    console.log(`Toggling node: ${node.name}`);
  }
}
