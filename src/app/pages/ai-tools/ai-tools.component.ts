import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AiTool {
  name: string;
  description: string;
  icon: string;          // Font Awesome class
  category: string;
}

interface ToolCategory {
  id: string;
  name: string;
  icon: string;          // Font Awesome class
  accent: string;        // CSS color for the category
  toolCount?: number;
}

@Component({
  selector: 'app-ai-tools',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-tools.component.html',
  styleUrls: ['./ai-tools.component.scss']
})
export class AiToolsComponent {
  selectedCategory = 'refactoring';

  categories: ToolCategory[] = [
    { id: 'refactoring', name: 'Refactoring', icon: 'fas fa-code-branch', accent: '#6366f1' },
    { id: 'cleanup', name: 'Cleanup & Optimization', icon: 'fas fa-broom', accent: '#22c55e' },
    { id: 'understanding', name: 'Understanding', icon: 'fas fa-lightbulb', accent: '#f59e0b' },
    { id: 'documentation', name: 'Documentation', icon: 'fas fa-book', accent: '#06b6d4' },
    { id: 'testing', name: 'Testing', icon: 'fas fa-vial', accent: '#ec4899' },
    { id: 'performance', name: 'Performance', icon: 'fas fa-tachometer-alt', accent: '#f97316' },
    { id: 'architecture', name: 'Architecture', icon: 'fas fa-sitemap', accent: '#8b5cf6' },
    { id: 'file-level', name: 'File-Level Tools', icon: 'fas fa-file-code', accent: '#14b8a6' },
    { id: 'project-wide', name: 'Project-Wide Tools', icon: 'fas fa-project-diagram', accent: '#e11d48' },
  ];

  tools: AiTool[] = [
    // Refactoring
    { name: 'Refactor File', description: 'Restructure and improve the code within a single file.', icon: 'fas fa-edit', category: 'refactoring' },
    { name: 'Refactor Module', description: 'Apply refactoring changes across an entire code module.', icon: 'fas fa-file-alt', category: 'refactoring' },
    { name: 'Refactor Entire Project', description: 'Apply comprehensive refactoring across the entire codebase.', icon: 'fas fa-check-circle', category: 'refactoring' },
    { name: 'Extract Components/Functions', description: 'Identify and extract reusable code blocks into new components or functions.', icon: 'fas fa-layer-group', category: 'refactoring' },
    { name: 'Rename Safely', description: 'Perform intelligent renaming of variables, functions, and files.', icon: 'fas fa-i-cursor', category: 'refactoring' },

    // Cleanup & Optimization
    { name: 'Remove Unused Imports', description: 'Automatically detect and remove unused import statements.', icon: 'fas fa-minus-circle', category: 'cleanup' },
    { name: 'Remove Dead Code', description: 'Identify and eliminate unreachable or unused code sections.', icon: 'fas fa-trash-alt', category: 'cleanup' },
    { name: 'Fix Code Smells', description: 'Automatically identify and fix common code smells.', icon: 'fas fa-exclamation-triangle', category: 'cleanup' },
    { name: 'Auto Format', description: 'Automatically format your code to adhere to style guidelines.', icon: 'fas fa-align-left', category: 'cleanup' },
    { name: 'Improve Readability', description: 'Enhance code clarity and comprehension for better maintainability.', icon: 'fas fa-glasses', category: 'cleanup' },
    { name: 'Enforce Naming Conventions', description: 'Standardize variable, function, and class naming across the project.', icon: 'fas fa-spell-check', category: 'cleanup' },

    // Understanding
    { name: 'Explain File', description: "Get a high-level explanation of a specific file's purpose and functionality.", icon: 'fas fa-comment-alt', category: 'understanding' },
    { name: 'Explain Directory', description: 'Understand the purpose and contents of a specific directory.', icon: 'fas fa-folder-open', category: 'understanding' },
    { name: 'Explain Project', description: "Generate an overview and summary of the entire project's codebase.", icon: 'fas fa-globe', category: 'understanding' },
    { name: 'Dependency Graph', description: 'Visualize project dependencies and relationships.', icon: 'fas fa-link', category: 'understanding' },
    { name: 'Summarize Project', description: 'Generate a concise summary of the entire codebase and its purpose.', icon: 'fas fa-compress-alt', category: 'understanding' },
    { name: 'Explain Complex Function', description: 'Get a detailed explanation of a specific complex function or method.', icon: 'fas fa-puzzle-piece', category: 'understanding' },

    // Documentation
    { name: 'Generate Documentation', description: 'Automatically create comprehensive documentation for your codebase.', icon: 'fas fa-file-signature', category: 'documentation' },
    { name: 'Generate API Docs', description: 'Automate the creation of API reference documentation.', icon: 'fas fa-file-invoice', category: 'documentation' },
    { name: 'Generate Docstrings', description: 'Create intelligent docstrings for functions and classes.', icon: 'fas fa-quote-left', category: 'documentation' },
    { name: 'Add Comments', description: 'Automatically add clarifying comments to complex code sections.', icon: 'fas fa-comment-dots', category: 'documentation' },
    { name: 'Generate README', description: 'Create a comprehensive README file for your project.', icon: 'fas fa-readme', category: 'documentation' },

    // Testing
    { name: 'Generate Unit Tests', description: 'Automatically generate comprehensive unit tests for your code.', icon: 'fas fa-flask', category: 'testing' },
    { name: 'Generate Integration Tests', description: 'Create tests to verify interactions between different system components.', icon: 'fas fa-network-wired', category: 'testing' },
    { name: 'Improve Tests', description: 'Enhance existing tests for better coverage and reliability.', icon: 'fas fa-chart-line', category: 'testing' },
    { name: 'Missing Test Detection', description: 'Identify code paths lacking adequate test coverage.', icon: 'fas fa-search-minus', category: 'testing' },
    { name: 'Mock Dependency Generator', description: 'Create mock objects for external dependencies in tests.', icon: 'fas fa-cubes', category: 'testing' },

    // Performance
    { name: 'Find Bottlenecks', description: 'Identify performance bottlenecks in your code.', icon: 'fas fa-hourglass-half', category: 'performance' },
    { name: 'Memory Optimization', description: 'Analyze and optimize memory usage in your application.', icon: 'fas fa-memory', category: 'performance' },
    { name: 'Algorithm Improvements', description: 'Suggest and implement more efficient algorithms for key operations.', icon: 'fas fa-bolt', category: 'performance' },
    { name: 'Query Optimization', description: 'Optimize database queries for faster data retrieval.', icon: 'fas fa-database', category: 'performance' },
    { name: 'Render Optimization', description: 'Improve UI rendering performance for smoother user experiences.', icon: 'fas fa-tv', category: 'performance' },

    // Architecture
    { name: 'Modularization Suggestions', description: 'Suggest ways to modularize the codebase for better organization.', icon: 'fas fa-th-large', category: 'architecture' },
    { name: 'Coupling Detection', description: 'Identify tightly coupled components in your codebase.', icon: 'fas fa-unlink', category: 'architecture' },
    { name: 'SOLID Review', description: 'Analyze code against SOLID principles for better design.', icon: 'fas fa-shield-alt', category: 'architecture' },
    { name: 'Folder Structure Optimization', description: 'Suggest and apply optimal folder structures for your project.', icon: 'fas fa-folder-plus', category: 'architecture' },

    // File-Level Tools
    { name: 'Fix File', description: 'Automatically fix issues and errors within a selected file.', icon: 'fas fa-wrench', category: 'file-level' },
    { name: 'Debug File', description: 'Provide targeted debugging assistance for a specific file.', icon: 'fas fa-bug', category: 'file-level' },
    { name: 'Explain Errors', description: 'Provide detailed explanations and solutions for code errors.', icon: 'fas fa-exclamation-circle', category: 'file-level' },
    { name: 'Add Docs', description: 'Generate documentation for code elements within a file.', icon: 'fas fa-file-medical', category: 'file-level' },

    // Project-Wide Tools
    { name: 'Full Project Audit', description: 'Perform a comprehensive audit of the entire project codebase.', icon: 'fas fa-clipboard-check', category: 'project-wide' },
    { name: 'Full Issue Scan', description: 'Scan the entire project for potential issues and vulnerabilities.', icon: 'fas fa-radar', category: 'project-wide' },
  ];

  get filteredTools(): AiTool[] {
    return this.tools.filter(t => t.category === this.selectedCategory);
  }

  get selectedCategoryData(): ToolCategory | undefined {
    return this.categories.find(c => c.id === this.selectedCategory);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
  }

  getToolCountForCategory(categoryId: string): number {
    return this.tools.filter(t => t.category === categoryId).length;
  }

  runTool(tool: AiTool): void {
    console.log('Running tool:', tool.name);
    // TODO: integrate with backend AI service
  }
}
