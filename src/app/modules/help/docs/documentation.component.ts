import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';

interface DocSection {
  id: string;
  title: string;
  content: string; // Markdown content
}

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, RouterModule, MarkdownModule, EmptyStateComponent],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {
  sections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: `# Getting Started
Welcome to CodeScope! This guide will help you get started with our AI Code Analysis Platform.

## 1. Create your first project
To begin, navigate to the "Projects" section and click on "Create New Project". Give your project a meaningful name and a brief description.

## 2. Upload your code files
Once your project is created, you can upload your source code files. We support various programming languages. Simply drag and drop your files or select them from your local drive.

## 3. Run your first analysis
After uploading your files, initiate an analysis job. Our AI will then process your code for potential issues, security vulnerabilities, and provide suggestions for improvement.

## 4. Explore the Dashboard
The dashboard provides an overview of your projects and analysis results. You can quickly see the health of your codebase and access recent activities.
`
    },
    {
      id: 'project-workflow',
      title: 'Project Workflow',
      content: `# Project Workflow
Understanding the lifecycle of a project within CodeScope.

## Creating and Managing Projects
Projects are the core organizational units in CodeScope. Each project can contain multiple code repositories or individual files.

### Project Settings
You can access project-specific settings to configure analysis rules, notifications, and team access.

## Version Control Integration
CodeScope integrates with popular version control systems to streamline your development workflow.
`
    },
    {
      id: 'how-analysis-works',
      title: 'How Analysis Works',
      content: `# How Analysis Works
CodeScope leverages advanced AI algorithms to perform deep code analysis.

## Static Code Analysis
Our platform performs static analysis to identify potential bugs, code smells, and security vulnerabilities without executing the code.

## AI-Powered Insights
Beyond traditional static analysis, our AI provides contextual recommendations and explains complex issues in simple terms.

## Custom Rule Sets
Configure custom rule sets to tailor the analysis to your team's coding standards and project requirements.
`
    },
    {
      id: 'understanding-insights',
      title: 'Understanding Insights',
      content: `# Understanding Insights
Interpreting the results and recommendations from CodeScope's analysis.

## Error and Warning Classification
Learn how CodeScope classifies different types of issues, from critical errors to minor warnings.

## Code Quality Score
Each project receives a code quality score, reflecting the overall health and maintainability of your codebase.

## Actionable Recommendations
CodeScope provides clear, actionable recommendations to help you resolve identified issues efficiently.
`
    },
    {
      id: 'using-chat',
      title: 'Using Chat',
      content: `# Using Chat
Interact with our AI assistant for on-demand code explanations and assistance.

## Instant Code Explanations
Ask the AI to explain complex code snippets, algorithms, or design patterns.

## Debugging Assistance
Get suggestions and potential fixes for bugs by describing your problem to the AI.

## Code Refactoring Suggestions
Request the AI to suggest refactoring strategies to improve code readability and performance.
`
    },
    {
      id: 'downloading-reports',
      title: 'Downloading Reports',
      content: `# Downloading Reports
Generate and export comprehensive reports of your project analysis.

## CSV Export
Export detailed analysis results in CSV format for further processing and integration with other tools.

## PDF Export
Generate professional PDF reports for sharing with team members, stakeholders, or for compliance purposes.

## Customizable Reports
Filter reports by project, analysis status, and date range to get the specific data you need.
`
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      content: `# Troubleshooting
Common issues and their solutions.

## Connection Problems
Tips for resolving connectivity issues with the CodeScope platform.

## Analysis Failures
Guidance on diagnosing and fixing problems that lead to failed analysis jobs.

## Account and Login Issues
Steps to take if you encounter problems with your user account or login process.
`
    }
  ];

  selectedSection = signal<DocSection | null>(null);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private markdownService = inject(MarkdownService);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const sectionId = params.get('sectionId');
      if (sectionId) {
        this.selectSection(sectionId);
      } else {
        // Default to the first section if no ID is provided
        this.selectSection(this.sections[0].id);
      }
    });
  }

  selectSection(id: string): void {
    const section = this.sections.find(s => s.id === id);
    if (section) {
      this.selectedSection.set(section);
      this.router.navigate(['/help/docs', id], { replaceUrl: true });
    }
  }
}
