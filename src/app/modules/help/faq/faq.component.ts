import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  category: string;
  items: FaqItem[];
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  animations: [
    trigger('accordionToggle', [
      state('collapsed', style({ height: '0px', minHeight: '0', overflow: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ])
  ]
})
export class FaqComponent {
  faqCategories: FaqCategory[] = [
    {
      category: 'General',
      items: [
        {
          question: 'What is CodeScope?',
          answer: 'CodeScope is an AI-powered code analysis platform that helps developers identify issues, improve code quality, and understand their codebase better.'
        },
        {
          question: 'How does CodeScope work?',
          answer: 'CodeScope uses advanced machine learning models to analyze your source code for bugs, vulnerabilities, code smells, and provides actionable insights and recommendations.'
        },
        {
          question: 'What programming languages does CodeScope support?',
          answer: 'CodeScope supports a wide range of popular programming languages including JavaScript, Python, Java, C#, Go, and more. We are continuously expanding our language support.'
        }
      ]
    },
    {
      category: 'Projects',
      items: [
        {
          question: 'How do I create a new project?',
          answer: 'Navigate to the "Projects" section from the sidebar and click on the "Create New Project" button. Fill in the project details and save.'
        },
        {
          question: 'Can I upload multiple files to a project?',
          answer: 'Yes, you can upload multiple files or even entire repositories to a single project. CodeScope will analyze all the uploaded files together.'
        },
        {
          question: 'How do I delete a project?',
          answer: 'In the "Project Details" page, look for the "Settings" or "Manage Project" option, where you\'ll find the delete functionality. Be aware that this action is irreversible.'
        }
      ]
    },
    {
      category: 'Analysis',
      items: [
        {
          question: 'How do I run an analysis on my project?',
          answer: 'After uploading your files to a project, go to the "Project Details" page and click the "Run Analysis" button. The AI will start processing your code.'
        },
        {
          question: 'How long does an analysis take?',
          answer: 'The duration of an analysis depends on the size and complexity of your codebase. Smaller projects may take minutes, while larger ones could take longer.'
        },
        {
          question: 'What kind of issues does CodeScope identify?',
          answer: 'CodeScope identifies a variety of issues including syntax errors, logical bugs, security vulnerabilities, performance bottlenecks, and adherence to coding standards.'
        }
      ]
    },
    {
      category: 'Reports',
      items: [
        {
          question: 'How do I generate a report?',
          answer: 'Visit the "Reports" section from the sidebar. You can apply filters by project, status, or date range, and then generate either a CSV or PDF report.'
        },
        {
          question: 'What information is included in the reports?',
          answer: 'Reports include project name, analysis job details, status, creation and completion dates, overall code quality score, and key metrics like errors and warnings.'
        },
        {
          question: 'Can I customize reports?',
          answer: 'Currently, you can filter reports by project, analysis status, and date range. More customization options may be available in future updates.'
        }
      ]
    },
    {
      category: 'Billing',
      items: [
        {
          question: 'What are your pricing plans?',
          answer: 'Our pricing plans are flexible and designed to fit various team sizes and needs. Please visit our pricing page for detailed information.'
        },
        {
          question: 'How do I update my payment method?',
          answer: 'You can update your payment information in the "Settings" section under the "Billing" tab.'
        }
      ]
    }
  ];

  openCategory = signal<string | null>(null);

  toggleCategory(category: string): void {
    if (this.openCategory() === category) {
      this.openCategory.set(null);
    } else {
      this.openCategory.set(category);
    }
  }
}
