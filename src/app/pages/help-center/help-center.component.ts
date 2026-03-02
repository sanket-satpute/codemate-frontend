import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  icon: string;
  title: string;
  description: string;
  color: string;
  articleCount: number;
}

interface Article {
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  readTime: string;
  icon: string;
}

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss']
})
export class HelpCenterComponent implements OnInit {
  searchTerm = '';

  categories: Category[] = [
    { icon: 'fas fa-rocket', title: 'Getting Started', description: 'Setup guides, onboarding, first project steps', color: '#6366f1', articleCount: 12 },
    { icon: 'fas fa-th-large', title: 'Project Workspace', description: 'Overview, Code Analysis, Code Quality, UI/UX Audit, AI Chat, File Explorer', color: '#06b6d4', articleCount: 24 },
    { icon: 'fas fa-brain', title: 'AI Tools', description: 'Automation tools, code generators, analyzers', color: '#8b5cf6', articleCount: 18 },
    { icon: 'fas fa-layer-group', title: 'Templates & Starters', description: 'Install and customize templates, scaffolding', color: '#f59e0b', articleCount: 9 },
    { icon: 'fas fa-credit-card', title: 'Billing & Account', description: 'Profile, email, password, subscription help', color: '#ec4899', articleCount: 7 },
    { icon: 'fas fa-wrench', title: 'Troubleshooting', description: 'Common errors and fixes', color: '#f97316', articleCount: 15 },
    { icon: 'fas fa-puzzle-piece', title: 'Integrations', description: 'GitHub, GitLab, CI/CD, Firebase, cloud connections', color: '#22c55e', articleCount: 11 },
    { icon: 'fas fa-shield-alt', title: 'Security & Privacy', description: 'Data storage, permissions, access rules', color: '#ef4444', articleCount: 6 },
  ];

  popularArticles: Article[] = [
    { title: 'How to upload a project', description: 'A step-by-step guide to importing your first project.', category: 'Getting Started', categoryColor: '#6366f1', readTime: '3 min', icon: 'fas fa-upload' },
    { title: 'Fixing analysis errors', description: 'Troubleshoot and resolve common code analysis issues.', category: 'Troubleshooting', categoryColor: '#f97316', readTime: '5 min', icon: 'fas fa-bug' },
    { title: 'How to regenerate reports', description: 'Generate new analysis reports on demand.', category: 'Project Workspace', categoryColor: '#06b6d4', readTime: '2 min', icon: 'fas fa-sync-alt' },
    { title: 'Connecting your GitHub repo', description: 'Integrate your GitHub repository for seamless analysis.', category: 'Integrations', categoryColor: '#22c55e', readTime: '4 min', icon: 'fas fa-code-branch' },
    { title: 'Understanding AI recommendations', description: 'Get the most out of AI-driven code improvement suggestions.', category: 'AI Tools', categoryColor: '#8b5cf6', readTime: '6 min', icon: 'fas fa-lightbulb' },
    { title: 'Managing your subscription plan', description: 'Upgrading, downgrading, and billing cycles.', category: 'Billing & Account', categoryColor: '#ec4899', readTime: '3 min', icon: 'fas fa-receipt' },
  ];

  filteredCategories: Category[] = [];
  filteredArticles: Article[] = [];

  ngOnInit() {
    this.filteredCategories = this.categories;
    this.filteredArticles = this.popularArticles;
  }

  onSearch() {
    const q = this.searchTerm.toLowerCase().trim();
    if (!q) {
      this.filteredCategories = this.categories;
      this.filteredArticles = this.popularArticles;
      return;
    }
    this.filteredCategories = this.categories.filter(c =>
      c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
    this.filteredArticles = this.popularArticles.filter(a =>
      a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.onSearch();
  }
}
