import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For potential future input elements

// --- Data Interfaces for UI/UX Audit Page ---

interface UxScore {
  score: number; // 0-100
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  summary: string;
  colorClass: string; // e.g., 'text-success', 'text-warning', 'text-error'
}

interface KeyFinding {
  icon: string; // Font Awesome class
  title: string;
  explanation: string;
  severity: 'Low' | 'Medium' | 'High';
}

interface HeuristicEvaluation {
  id: string;
  heuristic: string; // Nielsen Heuristic principle
  score: number; // 0-10
  summary: string;
  issuesFound: string[];
  recommendations: string[];
  isExpanded?: boolean;
}

interface AccessibilityAuditItem {
  label: string;
  score: 'Pass' | 'Needs Improvement' | 'Fail'; // This definition is already correct. The error likely comes from the data
  colorClass: string; // For status text color
  icon: string; // For status icon
  description?: string;
}

interface ColorPaletteItem {
  color: string; // Hex or rgba
  label: string;
  contrastRatio?: number | null; // Allow null for contrastRatio
  status?: 'Pass' | 'Fail' | 'Needs Improvement' | null; // Allow 'Needs Improvement' and null for status
}

interface VisualAnalysis {
  colorPalette: {
    extractedColors: ColorPaletteItem[];
    recommendations: string[];
  };
  typographyConsistency: {
    extractedFontSizes: string[]; // e.g., ['16px', '24px']
    weightUsage: string[]; // e.g., ['Inter-Regular', 'Inter-Bold']
    lineHeightIssues: string[]; // e.g., ['H1 has inconsistent line-height']
    recommendations: string[];
  };
}

interface UxRecommendation {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'Major' | 'Minor';
  actionItems: string[];
  visualExamples?: string[]; // URLs or paths to images
  isExpanded?: boolean;
}

@Component({
  selector: 'app-ui-ux-auditor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ui-ux-auditor.component.html',
  styleUrl: './ui-ux-auditor.component.scss'
})
export class UiUxAuditorComponent implements OnInit {
  projectName: string = 'CodeMate AI Monorepo';

  // TOP SECTION — Page Header
  auditTagline: string = 'Comprehensive design review for usability, consistency, and visual experience';

  // SECTION 1 — Overall UX Score
  overallUxScore: UxScore = {
    score: 82,
    rating: 'Good',
    summary: 'The application demonstrates strong usability, but a few areas require attention for an excellent experience.',
    colorClass: 'text-success' // Initially success, will be dynamic based on score
  };

  // SECTION 2 — Key UX Findings
  keyUxFindings: KeyFinding[] = [
    {
      icon: 'fas fa-map-signs',
      title: 'Navigation Flow',
      explanation: 'Users occasionally get lost in deep hierarchies. Simplify main paths.',
      severity: 'High'
    },
    {
      icon: 'fas fa-clone',
      title: 'Screen Consistency',
      explanation: 'Variations in component styling across different pages detected.',
      severity: 'Medium'
    },
    {
      icon: 'fas fa-sitemap',
      title: 'Visual Hierarchy',
      explanation: 'Important information sometimes blends with secondary content.',
      severity: 'Medium'
    },
    {
      icon: 'fas fa-cube',
      title: 'Information Architecture',
      explanation: 'Clustering of related content could be improved for clarity.',
      severity: 'Low'
    },
    {
      icon: 'fas fa-mouse-pointer',
      title: 'Interaction Design',
      explanation: 'Subtle inconsistencies in hover states and feedback animations.',
      severity: 'Low'
    },
    {
      icon: 'fas fa-palette',
      title: 'Typography & Colors',
      explanation: 'Minor deviations from the brand\'s color palette and font scale.',
      severity: 'Low'
    }
  ];

  // SECTION 3 — Heuristic Evaluation
  heuristicEvaluations: HeuristicEvaluation[] = [
    {
      id: 'h1',
      heuristic: 'Visibility of system status',
      score: 8,
      summary: 'Users generally know what is going on, but complex operations lack clear progress indicators.',
      issuesFound: ['Long-running tasks do not always provide real-time feedback.', 'Some forms lack immediate validation messages.'],
      recommendations: ['Implement loading spinners for all async operations.', 'Provide instant feedback on form input validation.'],
      isExpanded: false
    },
    {
      id: 'h2',
      heuristic: 'Match between system & real world',
      score: 9,
      summary: 'Terminology and concepts largely align with user expectations.',
      issuesFound: [],
      recommendations: [],
      isExpanded: false
    },
    {
      id: 'h3',
      heuristic: 'User control & freedom',
      score: 7,
      summary: 'Users can easily undo actions, but some processes are irreversible without clear warning.',
      issuesFound: ['Deletion actions lack a confirmation step.', 'No "undo" option after certain data modifications.'],
      recommendations: ['Add confirmation modals for destructive actions.', 'Implement an "undo" feature for key user operations.'],
      isExpanded: false
    },
    {
      id: 'h4',
      heuristic: 'Consistency & standards',
      score: 6,
      summary: 'Design elements and interactions are mostly consistent, but some pages diverge.',
      issuesFound: ['Button styles vary slightly across modules.', 'Iconography is not uniformly applied.'],
      recommendations: ['Establish a strict component library for all UI elements.', 'Conduct a comprehensive icon audit.'],
      isExpanded: false
    },
    {
      id: 'h5',
      heuristic: 'Error prevention',
      score: 7,
      summary: 'Many errors are prevented, but some critical inputs lack guardrails.',
      issuesFound: ['No real-time validation for complex data inputs.', 'Form submission allows empty required fields.'],
      recommendations: ['Implement client-side and server-side validation for all inputs.', 'Use intelligent defaults where possible.'],
      isExpanded: false
    },
    {
      id: 'h6',
      heuristic: 'Recognition vs recall',
      score: 8,
      summary: 'System functions are visible, but some context is lost between steps.',
      issuesFound: ['Lack of breadcrumbs in multi-step processes.', 'User preferences are not always remembered.'],
      recommendations: ['Introduce breadcrumbs for complex navigation paths.', 'Implement persistent user settings.'],
      isExpanded: false
    },
    {
      id: 'h7',
      heuristic: 'Flexibility & efficiency',
      score: 8,
      summary: 'The interface is efficient for both new and experienced users.',
      issuesFound: [],
      recommendations: [],
      isExpanded: false
    },
    {
      id: 'h8',
      heuristic: 'Aesthetic & minimalistic design',
      score: 9,
      summary: 'The design is clean and visually appealing with minimal clutter.',
      issuesFound: [],
      recommendations: [],
      isExpanded: false
    },
    {
      id: 'h9',
      heuristic: 'Error recovery',
      score: 7,
      summary: 'Error messages are clear, but recovery options could be more explicit.',
      issuesFound: ['Generic error messages without specific solutions.', 'Error states sometimes lack a clear path forward.'],
      recommendations: ['Provide specific, actionable error messages.', 'Offer direct links or buttons for error resolution.'],
      isExpanded: false
    },
    {
      id: 'h10',
      heuristic: 'Help & documentation',
      score: 8,
      summary: 'In-context help is available, but overall documentation could be more extensive.',
      issuesFound: ['Some advanced features lack tooltips.', 'External documentation links are sometimes outdated.'],
      recommendations: ['Expand tooltip coverage for all interactive elements.', 'Regularly review and update external documentation.'],
      isExpanded: false
    }
  ];

  // SECTION 4 — Accessibility Audit (WCAG Based)
  accessibilityAudit: AccessibilityAuditItem[] = [
    { label: 'Color Contrast Report', score: 'Needs Improvement', colorClass: 'text-warning', icon: 'fas fa-circle-half-stroke', description: 'Some text-background combinations fail WCAG AA contrast standards.' },
    { label: 'Keyboard Navigation', score: 'Pass', colorClass: 'text-success', icon: 'fas fa-keyboard', description: 'All interactive elements are reachable and operable via keyboard.' },
    { label: 'Alt Text Completeness', score: 'Needs Improvement', colorClass: 'text-warning', icon: 'fas fa-image', description: 'Many images are missing descriptive alt text, impacting screen reader users.' },
    { label: 'ARIA Roles Implementation', score: 'Pass', colorClass: 'text-success', icon: 'fas fa-universal-access', description: 'ARIA roles are generally correctly applied to custom components.' },
    { label: 'Responsive Breakpoints', score: 'Pass', colorClass: 'text-success', icon: 'fas fa-mobile-alt', description: 'The UI adapts well across various screen sizes and devices.' },
    { label: 'Screen Reader Issues', score: 'Fail', colorClass: 'text-error', icon: 'fas fa-braille', description: 'Several critical elements are not properly announced or structured for screen readers.' },
  ];

  // SECTION 5 — Visual Analysis
  visualAnalysis: VisualAnalysis = {
    colorPalette: {
      extractedColors: [
        { color: '#4F46E5', label: 'Primary Indigo', contrastRatio: 4.5, status: 'Pass' },
        { color: '#22D3EE', label: 'Accent Cyan', contrastRatio: 3.8, status: 'Needs Improvement' },
        { color: '#0F172A', label: 'Background Navy', contrastRatio: null, status: null },
        { color: '#1E293B', label: 'Card Surface', contrastRatio: null, status: null },
        { color: '#E2E8F0', label: 'Bright Text', contrastRatio: 16.5, status: 'Pass' },
      ],
      recommendations: ['Ensure all text-background combinations meet WCAG AA.', 'Define a secondary accent color for lighter backgrounds.']
    },
    typographyConsistency: {
      extractedFontSizes: ['12px', '14px', '16px', '18px', '24px', '32px'],
      weightUsage: ['Inter-Regular', 'Inter-Medium', 'Inter-SemiBold', 'Inter-Bold', 'JetBrains Mono-Regular'],
      lineHeightIssues: ['Line height on headings in mobile view is too tight.', 'Body text line height is slightly inconsistent across modules.'],
      recommendations: ['Standardize heading line heights across all breakpoints.', 'Review and apply a consistent line-height to body text elements.']
    }
  };

  // SECTION 6 — UX Recommendations Section
  uxRecommendations: UxRecommendation[] = [
    {
      id: 'rec-1',
      title: 'Simplify Main Navigation Paths',
      description: 'The primary navigation has too many levels, making it difficult for users to find core features quickly. Consider flattening or grouping related items.',
      severity: 'Critical',
      actionItems: ['Conduct card sorting with target users.', 'Redesign sidebar navigation to a max of 2 levels.', 'Introduce a global search with fuzzy matching.'],
      visualExamples: ['assets/images/simplified-nav.png'], // Placeholder
      isExpanded: false
    },
    {
      id: 'rec-2',
      title: 'Enhance Form Error Feedback',
      description: 'Current form error messages are generic and not always tied to specific fields. Improve inline validation feedback.',
      severity: 'Major',
      actionItems: ['Implement real-time inline validation for all form fields.', 'Provide specific, actionable error messages.', 'Highlight problematic fields clearly.'],
      isExpanded: false
    },
    {
      id: 'rec-3',
      title: 'Standardize Component States',
      description: 'There are subtle inconsistencies in button and input field hover, focus, and disabled states across the application.',
      severity: 'Minor',
      actionItems: ['Create a living style guide for all component states.', 'Conduct a UI audit to identify and correct discrepancies.'],
      isExpanded: false
    }
  ];

  // SECTION 7 — Final UX Grade
  finalUxGrade: string = 'B+';
  finalUxSummary: string = 'A solid foundation with good user experience, but attention to consistency and accessibility can elevate it to world-class.';

  constructor() { }

  ngOnInit(): void {
    this.updateUxScoreColorClass();
  }

  updateUxScoreColorClass(): void {
    if (this.overallUxScore.score >= 80) {
      this.overallUxScore.colorClass = 'text-success';
      this.overallUxScore.rating = 'Excellent';
    } else if (this.overallUxScore.score >= 60) {
      this.overallUxScore.colorClass = 'text-warning';
      this.overallUxScore.rating = 'Good';
    } else if (this.overallUxScore.score >= 40) {
      this.overallUxScore.colorClass = 'text-info'; // Using info for fair
      this.overallUxScore.rating = 'Fair';
    } else {
      this.overallUxScore.colorClass = 'text-error';
      this.overallUxScore.rating = 'Poor';
    }
  }

  toggleHeuristicAccordion(id: string): void {
    const heuristic = this.heuristicEvaluations.find(h => h.id === id);
    if (heuristic) {
      heuristic.isExpanded = !heuristic.isExpanded;
    }
  }

  toggleRecommendationAccordion(id: string): void {
    const recommendation = this.uxRecommendations.find(r => r.id === id);
    if (recommendation) {
      recommendation.isExpanded = !recommendation.isExpanded;
    }
  }

  // Action methods for Page Header and Bottom Action Bar
  downloadReport(): void { console.log('Download UI/UX Audit Report'); }
  reRunAudit(): void { console.log('Re-run UI/UX Audit'); }
  generateFixPlan(): void { console.log('Generate Fix Plan'); }
}
