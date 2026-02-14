import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { RouterModule } from '@angular/router'; // Import RouterModule for potential routing

interface Category {
  icon: string;
  title: string;
  description: string;
}

interface Article {
  title: string;
  description: string;
}

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Add FormsModule and RouterModule
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss']
})
export class HelpCenterComponent implements OnInit {
  categories: Category[] = [
    {
      icon: 'fas fa-hand-sparkles',
      title: 'Getting Started',
      description: 'Setup guides, onboarding, first project steps'
    },
    {
      icon: 'fas fa-th-large',
      title: 'Project Workspace',
      description: 'How to use Overview / Code Analysis / Code Quality / UI/UX Audit / AI Chat / File Explorer'
    },
    {
      icon: 'fas fa-magic',
      title: 'AI Tools',
      description: 'How to use automation tools, code generators, analyzers'
    },
    {
      icon: 'fas fa-layer-group',
      title: 'Templates & Starters',
      description: 'How to install, customize templates, scaffolding help'
    },
    {
      icon: 'fas fa-wallet',
      title: 'Billing & Account',
      description: 'Profile, email, password, subscription help'
    },
    {
      icon: 'fas fa-wrench',
      title: 'Troubleshooting',
      description: 'Common errors and fixes'
    },
    {
      icon: 'fas fa-puzzle-piece',
      title: 'Integrations',
      description: 'GitHub, GitLab, CI/CD, Firebase, cloud connections'
    },
    {
      icon: 'fas fa-lock',
      title: 'Security & Privacy',
      description: 'Data storage, permissions, access rules'
    },
  ];

  popularArticles: Article[] = [
    {
      title: 'How to upload a project',
      description: 'A step-by-step guide to importing your first project.'
    },
    {
      title: 'Fixing analysis errors',
      description: 'Troubleshoot and resolve common code analysis issues.'
    },
    {
      title: 'How to regenerate reports',
      description: 'Learn how to generate new analysis reports on demand.'
    },
    {
      title: 'Connecting GitHub repo',
      description: 'Integrate your GitHub repository for seamless code analysis.'
    },
    {
      title: 'Understanding AI recommendations',
      description: 'Get the most out of AI-driven code improvement suggestions.'
    },
    {
      title: 'Managing your subscription plan',
      description: 'Details on upgrading, downgrading, and billing cycles.'
    },
  ];

  searchTerm: string = ''; // For the search bar input

  constructor() {}

  ngOnInit(): void {
    // Initialization logic if any
  }

  // No specific methods needed for this static content currently,
  // but could add search or navigation logic later.
}
