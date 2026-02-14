import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Placeholder data for metrics
  metrics = [
    { name: 'Total Projects', value: 12, icon: 'fas fa-layer-group' },
    { name: 'Analysis Completed', value: 34, icon: 'fas fa-check-circle' },
    { name: 'Pending Issues', value: 5, icon: 'fas fa-exclamation-triangle' },
    { name: 'AI Chat Messages', value: 120, icon: 'fas fa-comments' },
    { name: 'System Health', value: 'Good', icon: 'fas fa-heartbeat' },
  ];

  // Placeholder data for recent activity
  recentActivities = [
    { time: '2 hours ago', description: 'Project "Frontend Refactor" created.', icon: 'fas fa-plus-circle' },
    { time: 'Yesterday', description: 'Analysis completed for "Backend API".', icon: 'fas fa-chart-line' },
    { time: '3 days ago', description: 'Uploaded new files to "Mobile App v2".', icon: 'fas fa-upload' },
    { time: '1 week ago', description: 'AI Chat interaction for "Authentication Module".', icon: 'fas fa-comments' },
  ];

  // Placeholder data for projects
  projects = [
    { name: 'CodeMate AI Frontend', status: 'Active', lastAnalysis: '2025-11-28', healthScore: 85, recommendation: 'Good', id: 'proj001' },
    { name: 'CodeMate AI Backend', status: 'Active', lastAnalysis: '2025-11-25', healthScore: 70, recommendation: 'Refactor DB Queries', id: 'proj002' },
    { name: 'Internal Tools Suite', status: 'Inactive', lastAnalysis: '2025-10-15', healthScore: 60, recommendation: 'Update Dependencies', id: 'proj003' },
    { name: 'Landing Page Redesign', status: 'Active', lastAnalysis: '2025-11-30', healthScore: 92, recommendation: 'Excellent', id: 'proj004' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Placeholder methods for quick actions
  createNewProject(): void {
    console.log('Create New Project');
  }

  uploadProject(): void {
    console.log('Upload Project');
  }

  runAIAnalysis(): void {
    console.log('Run AI Analysis');
  }

  openAIChat(): void {
    console.log('Open AI Chat');
  }

  viewProject(projectId: string): void {
    console.log(`View Project: ${projectId}`);
  }

  analyzeProject(projectId: string): void {
    console.log(`Analyze Project: ${projectId}`);
  }

  chatProject(projectId: string): void {
    console.log(`Chat Project: ${projectId}`);
  }
}
