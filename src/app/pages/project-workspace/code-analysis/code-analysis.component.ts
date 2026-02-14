import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

// --- Interfaces for Code Analysis Data ---

interface Issue {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info' | 'Warning' | 'Best Practice';
  title: string;
  description: string;
  whyMatters: string;
  fixSuggestion: string;
  impact: 'performance' | 'security' | 'maintainability' | 'reliability';
  codePatch?: {
    before: string;
    after: string;
  };
  lineNumber: number;
}

interface FileNode {
  name: string;
  path: string;
  issueCount?: number;
  children?: FileNode[];
  isExpanded?: boolean;
}

interface CodeLine {
  lineNumber: number;
  content: string;
  hasIssue: boolean;
  issueIds?: string[];
}

interface DetailedAnalysisMetrics {
  cyclomaticComplexity: number;
  codeDuplicationPercentage: number;
  coupling: number;
  cohesion: number;
  lintScore: string;
  securityWarnings: number;
}

@Component({
  selector: 'app-code-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './code-analysis.component.html',
  styleUrl: './code-analysis.component.scss'
})
export class CodeAnalysisComponent implements OnInit {
  // (A) Top Header Data
  projectName: string = 'CodeMate AI Monorepo';
  lastScanDate: string = '2025-12-01 10:30 AM';
  totalIssues: number = 245;

  // (B) Severity Filter Bar Data
  issueCounts = {
    all: 245,
    critical: 12,
    high: 35,
    medium: 80,
    low: 60,
    info: 38,
    warnings: 15,
    bestPractices: 5,
  };
  selectedSeverityFilter: string = 'all';

  // (C) Two-Panel Layout Data
  // LEFT PANEL — File Explorer Data
  fileTree: FileNode[] = [
    {
      name: 'src',
      path: 'src',
      issueCount: 200,
      isExpanded: true,
      children: [
        {
          name: 'app',
          path: 'src/app',
          issueCount: 150,
          isExpanded: true,
          children: [
            { name: 'core', path: 'src/app/core', issueCount: 50, isExpanded: false, children: [] },
            { name: 'features', path: 'src/app/features', issueCount: 80, isExpanded: false, children: [] },
            { name: 'shared', path: 'src/app/shared', issueCount: 20, isExpanded: false, children: [] },
            { name: 'main.ts', path: 'src/app/main.ts', issueCount: 0 },
          ],
        },
        { name: 'assets', path: 'src/assets', issueCount: 0 },
        { name: 'styles.scss', path: 'src/styles.scss', issueCount: 5 },
      ],
    },
    { name: 'package.json', path: 'package.json', issueCount: 10 },
    { name: 'README.md', path: 'README.md', issueCount: 0 },
  ];
  searchTerm: string = '';
  selectedFile: FileNode | null = { name: 'auth.service.ts', path: 'src/app/core/services/auth.service.ts', issueCount: 5 };

  // RIGHT PANEL — Detailed Analysis Data
  // File Header Data (derived from selectedFile)
  selectedFilePath: string = 'src/app/core/services/auth.service.ts';
  selectedFileTotalIssues: number = 5;
  selectedFileLastModified: string = '2025-11-29';
  selectedFileLOC: number = 320;

  // Code Viewer Data
  codeLines: CodeLine[] = [
    { lineNumber: 1, content: 'import { Injectable } from \'@angular/core\';', hasIssue: false },
    { lineNumber: 2, content: 'import { HttpClient } from \'@angular/common/http\';', hasIssue: false },
    { lineNumber: 3, content: '', hasIssue: false },
    { lineNumber: 4, content: '@Injectable({', hasIssue: false },
    { lineNumber: 5, content: '  providedIn: \'root\'', hasIssue: false },
    { lineNumber: 6, content: '})', hasIssue: false },
    { lineNumber: 7, content: 'export class AuthService {', hasIssue: false },
    { lineNumber: 8, content: '  private API_URL = \'https://api.codescope.com/auth\';', hasIssue: true, issueIds: ['issue-1'] },
    { lineNumber: 9, content: '', hasIssue: false },
    { lineNumber: 10, content: '  constructor(private http: HttpClient) { }', hasIssue: false },
    { lineNumber: 11, content: '', hasIssue: false },
    { lineNumber: 12, content: '  login(credentials: any) {', hasIssue: false },
    { lineNumber: 13, content: '    // Hardcoded credentials for demo - CRITICAL SECURITY ISSUE', hasIssue: true, issueIds: ['issue-2'] },
    { lineNumber: 14, content: '    if (credentials.username === "admin" && credentials.password === "password123") {', hasIssue: true, issueIds: ['issue-3'] },
    { lineNumber: 15, content: '      return this.http.post(`${this.API_URL}/login`, credentials);', hasIssue: false },
    { lineNumber: 16, content: '    }', hasIssue: false },
    { lineNumber: 17, content: '    throw new Error(\'Invalid Credentials\');', hasIssue: false },
    { lineNumber: 18, content: '  }', hasIssue: false },
    { lineNumber: 19, content: '}', hasIssue: false },
  ];

  // Issues List
  issues: Issue[] = [
    {
      id: 'issue-1',
      severity: 'High',
      title: 'Hardcoded API URL',
      description: 'The API endpoint is hardcoded directly in the service.',
      whyMatters: 'Hardcoding URLs makes the application difficult to configure for different environments (development, staging, production) without recompilation. It also poses a security risk if the URL ever needs to change quickly due to a breach or migration.',
      fixSuggestion: 'Use Angular\'s environment files to manage API URLs. Define different URLs for different environments and inject them into the service.',
      impact: 'maintainability',
      lineNumber: 8,
      codePatch: {
        before: '  private API_URL = \'https://api.codescope.com/auth\';',
        after: '  private API_URL = environment.apiUrl + \'/auth\'; // Assuming environment.apiUrl is configured'
      }
    },
    {
      id: 'issue-2',
      severity: 'Critical',
      title: 'Hardcoded Credentials in Login Logic',
      description: 'The login method contains hardcoded username and password.',
      whyMatters: 'Hardcoding credentials is a severe security vulnerability. It exposes sensitive information directly in the codebase, making it accessible to anyone with access to the source code. This can lead to unauthorized access, data breaches, and compromise the entire system.',
      fixSuggestion: 'Remove hardcoded credentials. Implement proper authentication mechanisms, typically involving a secure backend API that validates user input against a database or identity provider.',
      impact: 'security',
      lineNumber: 13,
      codePatch: {
        before: '    if (credentials.username === "admin" && credentials.password === "password123") {',
        after: '    return this.http.post(`${this.API_URL}/login`, credentials); // Rely on backend for authentication'
      }
    },
    {
      id: 'issue-3',
      severity: 'Critical',
      title: 'Insecure Password Storage/Comparison',
      description: 'The comparison `credentials.password === "password123"` directly compares a plaintext password.',
      whyMatters: 'Comparing plaintext passwords is highly insecure. If the system is compromised, all user passwords could be exposed. Passwords should never be stored or compared in plaintext; instead, secure hashing algorithms with salts should be used.',
      fixSuggestion: 'Ensure that passwords are hashed and salted on the backend before storage, and comparisons are done against the hashed values. Never transmit or store plaintext passwords.',
      impact: 'security',
      lineNumber: 14,
      codePatch: {
        before: '    if (credentials.username === "admin" && credentials.password === "password123") {',
        after: '    // Authentication logic handled by backend after sending credentials'
      }
    }
  ];
  expandedIssues: Set<string> = new Set(); // To manage accordion state

  // Deep Analysis Section Data
  detailedAnalysis: DetailedAnalysisMetrics = {
    cyclomaticComplexity: 75, // Placeholder value
    codeDuplicationPercentage: 15, // Placeholder value
    coupling: 0.6, // Placeholder value
    cohesion: 0.8, // Placeholder value
    lintScore: 'A', // Placeholder value
    securityWarnings: 3 // Placeholder value
  };

  // File Summary Data
  fileSummaryIssues: number = 5; // Matches selectedFileTotalIssues
  fileSummarySeverityBreakdown = {
    critical: 2,
    high: 1,
    medium: 0,
    low: 0,
    info: 2
  };

  constructor() { }

  ngOnInit(): void {
    // Initialize data or fetch from a service if available
  }

  // --- Methods for UI Interactions ---

  filterIssues(severity: string): void {
    this.selectedSeverityFilter = severity;
    // In a real app, you'd filter the issues array here
    console.log(`Filtering issues by: ${severity}`);
  }

  toggleFileNode(node: FileNode, event: Event): void {
    event.stopPropagation();
    if (node.children) {
      node.isExpanded = !node.isExpanded;
    }
  }

  selectFile(file: FileNode): void {
    this.selectedFile = file;
    // In a real app, fetch issues and code for this file
    this.selectedFilePath = file.path;
    this.selectedFileTotalIssues = file.issueCount || 0;
    // Placeholder logic for demo:
    if (file.path === 'src/app/core/services/auth.service.ts') {
      this.issues = this.issues; // Already loaded demo issues
      this.codeLines = this.codeLines; // Already loaded demo code
    } else {
      this.issues = [];
      this.codeLines = [{ lineNumber: 1, content: `// Content for ${file.name}`, hasIssue: false }];
    }
    console.log(`Selected file: ${file.path}`);
  }

  toggleIssueAccordion(issueId: string): void {
    if (this.expandedIssues.has(issueId)) {
      this.expandedIssues.delete(issueId);
    } else {
      this.expandedIssues.add(issueId);
    }
  }

  isIssueExpanded(issueId: string): boolean {
    return this.expandedIssues.has(issueId);
  }

  getIssueLines(issueIds: string[] | undefined): string {
    if (!issueIds || issueIds.length === 0) {
      return '';
    }
    return issueIds.map(id => {
      const issue = this.issues.find(i => i.id === id);
      return issue ? issue.lineNumber.toString() : '';
    }).join(', ');
  }

  // Action methods for buttons
  reRunAnalysis(): void { console.log('Re-run Analysis'); }
  downloadFullReport(): void { console.log('Download Full Report'); }
  exportPdfReport(): void { console.log('Export PDF Report'); }
  viewSummary(): void { console.log('View Summary'); }
  openFullView(): void { console.log('Open Full View for file'); }
  copyFilePath(): void { navigator.clipboard.writeText(this.selectedFilePath); console.log('File path copied'); }
  fixMostCritical(): void { console.log('Fix Most Critical Issues'); }
  runDeepScan(): void { console.log('Run Deep Scan'); }
  openDebugger(): void { console.log('Open Debugger'); }
}
