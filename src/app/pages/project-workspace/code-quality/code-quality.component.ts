import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for any input bindings, though not explicitly used for now, good practice.

// --- Data Interfaces for Code Quality Page ---

interface QualityMetric {
  title: string;
  value: string | number;
  grade?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  colorClass: string; // For text/icon color
  badgeText?: string;
  lastScanned?: string;
  tooltip: string;
}

interface TrendDataPoint {
  date: string; // e.g., '2025-10-01'
  value: number;
}

interface TrendChart {
  title: string;
  data: TrendDataPoint[];
  color: string; // Primary or Accent color for the line/bars
}

interface MaintainabilityMetric {
  label: string;
  value: number; // Changed to number as it's used in arithmetic operations
  max?: number; // For progress/bar charts
  colorClass: string;
  tooltip: string;
}

interface StandardCheck {
  id: string;
  label: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  count: number;
  fixSuggestion: string;
  isExpanded?: boolean;
}

interface LanguageMetric {
  language: string;
  issues: number;
  color: string;
}

interface ModuleMetric {
  module: string;
  issues: number;
  color: string;
}

interface ComplexityMetric {
  component: string;
  complexity: number;
  color: string;
}

interface SecurityIssueSummary {
  label: string;
  count?: number;
  icon: string;
  severity?: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info'; // Added 'Info'
  description?: string;
}

interface PerformanceIssueSummary {
  label: string;
  count?: number;
  icon: string;
  severity?: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info'; // Added 'Info'
  description?: string;
}

interface TestCoverageMetric {
  label: string;
  value: string | number;
  colorClass: string;
  icon?: string;
}

interface QualityGate {
  id: string;
  label: string;
  threshold: string;
  currentValue: string;
  status: 'PASS' | 'FAIL';
  statusColorClass: string;
  tooltip: string;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'Low' | 'Medium' | 'High';
  priority: number;
  files?: string[];
}


@Component({
  selector: 'app-code-quality',
  standalone: true,
  imports: [CommonModule, FormsModule], // Include FormsModule
  templateUrl: './code-quality.component.html',
  styleUrl: './code-quality.component.scss'
})
export class CodeQualityComponent implements OnInit {
  projectName: string = 'CodeMate AI Monorepo';
  lastOverallScan: string = '2025-12-01 09:45 AM';

  // 1. Hero Section: Top Summary Cards
  heroMetrics: QualityMetric[] = [
    {
      title: 'Overall Quality',
      value: 'A+',
      grade: 'A+',
      trend: 'up',
      trendValue: '+2%',
      colorClass: 'text-success',
      badgeText: 'Excellent',
      lastScanned: '5 mins ago',
      tooltip: 'Holistic assessment of code health.'
    },
    {
      title: 'Maintainability',
      value: '8.9/10',
      trend: 'neutral',
      colorClass: 'text-info',
      badgeText: 'High',
      lastScanned: '1 day ago',
      tooltip: 'Ease of modification and enhancement.'
    },
    {
      title: 'Security Quality',
      value: '92%',
      trend: 'up',
      trendValue: '+1%',
      colorClass: 'text-success',
      badgeText: 'Secure',
      lastScanned: '3 hours ago',
      tooltip: 'Protection against vulnerabilities.'
    },
    {
      title: 'Performance',
      value: '78%',
      trend: 'down',
      trendValue: '-0.5%',
      colorClass: 'text-warning',
      badgeText: 'Good',
      lastScanned: '2 days ago',
      tooltip: 'Efficiency and responsiveness of codebase.'
    },
    {
      title: 'Test Coverage',
      value: '85%',
      trend: 'up',
      trendValue: '+3%',
      colorClass: 'text-success',
      badgeText: 'High',
      lastScanned: '1 hour ago',
      tooltip: 'Percentage of code covered by tests.'
    },
    {
      title: 'Technical Debt',
      value: '22 hrs',
      trend: 'down',
      trendValue: '-5 hrs',
      colorClass: 'text-info',
      badgeText: 'Low',
      lastScanned: '1 week ago',
      tooltip: 'Estimated effort to fix all identified issues.'
    }
  ];

  // 2. Quality Trend Graphs
  qualityTrends: TrendChart[] = [
    {
      title: 'Quality Score Over Time',
      data: [
        { date: 'Oct 1', value: 85 }, { date: 'Oct 15', value: 87 }, { date: 'Nov 1', value: 86 },
        { date: 'Nov 15', value: 89 }, { date: 'Dec 1', value: 91 }
      ],
      color: 'var(--color-primary-indigo-600)'
    },
    {
      title: 'Bug Density Over Time',
      data: [
        { date: 'Oct 1', value: 1.2 }, { date: 'Oct 15', value: 1.1 }, { date: 'Nov 1', value: 1.0 },
        { date: 'Nov 15', value: 0.9 }, { date: 'Dec 1', value: 0.8 }
      ],
      color: 'var(--color-error)'
    },
    {
      title: 'Code Smells Over Time',
      data: [
        { date: 'Oct 1', value: 120 }, { date: 'Oct 15', value: 110 }, { date: 'Nov 1', value: 105 },
        { date: 'Nov 15', value: 100 }, { date: 'Dec 1', value: 95 }
      ],
      color: 'var(--color-warning)'
    },
    {
      title: 'Technical Debt Trend',
      data: [
        { date: 'Oct 1', value: 30 }, { date: 'Oct 15', value: 28 }, { date: 'Nov 1', value: 25 },
        { date: 'Nov 15', value: 23 }, { date: 'Dec 1', value: 22 }
      ],
      color: 'var(--color-accent-cyan-400)'
    }
  ];

  // 3. Maintainability Section
  maintainabilityMetrics: MaintainabilityMetric[] = [
    { label: 'Cyclomatic Complexity (Avg)', value: 12, max: 20, colorClass: 'text-info', tooltip: 'Average number of independent paths through a function.' },
    { label: 'Avg Function Complexity', value: 4.5, max: 10, colorClass: 'text-success', tooltip: 'Average complexity per function.' },
    { label: 'Long Method Count', value: 8, max: 50, colorClass: 'text-warning', tooltip: 'Number of methods exceeding a defined line limit.' },
    { label: 'Deep Nesting Cases', value: 3, max: 10, colorClass: 'text-error', tooltip: 'Number of code blocks with excessive nesting levels.' },
    { label: 'Duplicated Code %', value: 7, max: 20, colorClass: 'text-success', tooltip: 'Percentage of duplicated code blocks across the project.' },
    { label: 'Inheritance Depth (Max)', value: 4, max: 10, colorClass: 'text-info', tooltip: 'Maximum depth of inheritance hierarchy.' },
    { label: 'Coupling Between Components', value: 0.75, max: 1, colorClass: 'text-warning', tooltip: 'Degree of interdependence between modules.' },
  ];

  // 4. Code Standards & Best Practices
  standardChecks: StandardCheck[] = [
    {
      id: 'doc-missing',
      label: 'Missing documentation',
      severity: 'Medium',
      count: 45,
      fixSuggestion: 'Add JSDoc/TSDoc to public functions and interfaces. Ensure module-level READMEs are present.',
      isExpanded: false
    },
    {
      id: 'naming-violations',
      label: 'Naming convention violations',
      severity: 'Low',
      count: 23,
      fixSuggestion: 'Adhere to project\'s ESLint/Prettier rules for naming. Use consistent casing (camelCase, PascalCase).',
      isExpanded: false
    },
    {
      id: 'dead-code',
      label: 'Dead code detected',
      severity: 'Info',
      count: 10,
      fixSuggestion: 'Remove unreachable code paths and unused variables/functions. Use tree-shaking tools.',
      isExpanded: false
    },
    {
      id: 'hardcoded-values',
      label: 'Hardcoded values',
      severity: 'High',
      count: 5,
      fixSuggestion: 'Move magic numbers/strings to constants files or environment variables.',
      isExpanded: false
    },
    {
      id: 'deprecated-apis',
      label: 'Deprecated API usage',
      severity: 'Medium',
      count: 7,
      fixSuggestion: 'Update to modern API equivalents. Consult library documentation for migration guides.',
      isExpanded: false
    }
  ];

  // 5. Language / Module Breakdown
  languageBreakdown: LanguageMetric[] = [
    { language: 'TypeScript', issues: 120, color: '#3178C6' },
    { language: 'Java', issues: 80, color: '#EA2D2E' },
    { language: 'SCSS', issues: 30, color: '#CD6799' },
    { language: 'HTML', issues: 15, color: '#E34C26' }
  ];

  moduleBreakdown: ModuleMetric[] = [
    { module: 'Frontend (Angular)', issues: 150, color: 'var(--color-primary-indigo-600)' },
    { module: 'Backend (Spring Boot)', issues: 90, color: 'var(--color-accent-cyan-400)' },
    { module: 'Database (PostgreSQL)', issues: 5, color: '#336791' }
  ];

  complexityByComponent: ComplexityMetric[] = [
    { component: 'AuthService', complexity: 25, color: 'var(--color-error)' },
    { component: 'DashboardComponent', complexity: 18, color: 'var(--color-warning)' },
    { component: 'ProjectListComponent', complexity: 10, color: 'var(--color-success)' },
    { component: 'ReportGenerator', complexity: 30, color: 'var(--color-critical)' },
  ];

  // 6. Security Quality Indicators
  securityIndicators: SecurityIssueSummary[] = [
    { label: 'Unsafe functions detected', count: 3, icon: 'fas fa-skull-crossbones', severity: 'Critical', description: 'Functions like `eval()` or deprecated crypto methods.' },
    { label: 'Missing input sanitization', count: 7, icon: 'fas fa-filter', severity: 'High', description: 'Lack of validation for user inputs, leading to XSS/SQLi.' },
    { label: 'Weak authentication patterns', count: 1, icon: 'fas fa-user-lock', severity: 'Critical', description: 'Use of insecure password storage or session management.' },
    { label: 'Outdated dependencies summary', count: 12, icon: 'fas fa-archive', severity: 'Medium', description: 'Dependencies with known CVEs or requiring updates.' }
  ];

  // 7. Performance Quality Indicators
  performanceIndicators: PerformanceIssueSummary[] = [
    { label: 'Slow functions detected', count: 5, icon: 'fas fa-stopwatch', severity: 'High', description: 'Functions with execution times exceeding thresholds.' },
    { label: 'High memory usage paths', count: 2, icon: 'fas fa-memory', severity: 'Medium', description: 'Code sections consuming excessive memory.' },
    { label: 'Inefficient loops/algorithms', count: 8, icon: 'fas fa-redo-alt', severity: 'Low', description: 'Loops that can be optimized for better performance.' },
    { label: 'Redundant operations', count: 4, icon: 'fas fa-minus-circle', severity: 'Info', description: 'Calculations or API calls performed unnecessarily.' }
  ];

  // 8. Testability & Coverage
  hasTests: boolean = true;
  testCoverageMetrics: TestCoverageMetric[] = [
    { label: 'Overall Coverage', value: '85%', colorClass: 'text-success' },
    { label: 'Line Coverage', value: '82%', colorClass: 'text-success' },
    { label: 'Branch Coverage', value: '78%', colorClass: 'text-warning' },
    { label: 'Function Coverage', value: '88%', colorClass: 'text-success' },
  ];
  untestedCriticalFiles: string[] = ['src/app/core/auth.service.ts', 'src/app/utils/crypto.ts'];
  testQualityScore: string = 'B+';
  failingTestsCount: number = 2;
  slowTestsCount: number = 5;

  // 9. Quality Gates
  qualityGates: QualityGate[] = [
    {
      id: 'maintainability-gate',
      label: 'Maintainability Index',
      threshold: '>= 70',
      currentValue: '89',
      status: 'PASS',
      statusColorClass: 'text-success',
      tooltip: 'Maintainability index must be at least 70.'
    },
    {
      id: 'duplication-gate',
      label: 'Code Duplication',
      threshold: '< 10%',
      currentValue: '7%',
      status: 'PASS',
      statusColorClass: 'text-success',
      tooltip: 'Code duplication percentage must be below 10%.'
    },
    {
      id: 'lint-gate',
      label: 'Lint Score',
      threshold: '> 85',
      currentValue: '82',
      status: 'FAIL',
      statusColorClass: 'text-error',
      tooltip: 'Overall lint score must be above 85.'
    },
    {
      id: 'complexity-gate',
      label: 'Avg Complexity',
      threshold: '<= 15',
      currentValue: '12',
      status: 'PASS',
      statusColorClass: 'text-success',
      tooltip: 'Average cyclomatic complexity per function must be 15 or less.'
    }
  ];

  // 10. AI Recommendations Section
  aiRecommendations: AIRecommendation[] = [
    {
      id: 'ai-rec-1',
      title: 'Refactor Auth Service Login Logic',
      description: 'The login method in `AuthService` is overly complex and contains hardcoded values. Simplify logic and externalize sensitive data.',
      impact: 'High',
      effort: 'Medium',
      priority: 1,
      files: ['src/app/core/auth.service.ts']
    },
    {
      id: 'ai-rec-2',
      title: 'Add TSDoc to Dashboard Components',
      description: 'Many public components in the dashboard lack proper TypeScript documentation. This reduces maintainability.',
      impact: 'Medium',
      effort: 'Low',
      priority: 3,
      files: ['src/app/features/dashboard/dashboard.component.ts', 'src/app/components/dashboard/project-card/project-card.component.ts']
    },
    {
      id: 'ai-rec-3',
      title: 'Optimize Database Query in Report Module',
      description: 'A specific query in the report generation module is identified as a performance bottleneck.',
      impact: 'High',
      effort: 'High',
      priority: 2,
      files: ['src/main/java/com/codescope/ReportService.java']
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialization logic, potentially fetching real data
  }

  // --- UI Interaction Methods ---

  toggleStandardCheckAccordion(id: string): void {
    const check = this.standardChecks.find(c => c.id === id);
    if (check) {
      check.isExpanded = !check.isExpanded;
    }
  }

  // Action methods for sticky bottom bar
  exportQualityReport(): void { console.log('Export Quality Report (PDF)'); }
  viewProjectSummary(): void { console.log('View Project Summary'); }
  openCodeAnalysis(): void { console.log('Open Code Analysis Page'); }
  reRunQualityScan(): void { console.log('Re-run Quality Scan'); }
}
