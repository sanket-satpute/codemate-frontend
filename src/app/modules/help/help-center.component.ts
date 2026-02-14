import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuideCardComponent } from './guide-card/guide-card.component';
import { RouterModule } from '@angular/router';

interface Guide {
  title: string;
  description: string;
  icon: string; // Font Awesome icon class
  link: string;
}

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, GuideCardComponent, RouterModule],
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss']
})
export class HelpCenterComponent implements OnInit {
  guides: Guide[] = [
    {
      title: 'Start a Project',
      description: 'Learn how to create and configure your first code analysis project.',
      icon: 'fa-folder-open',
      link: '/help/docs/getting-started'
    },
    {
      title: 'Upload Files',
      description: 'Guide to uploading your source code files for analysis.',
      icon: 'fa-upload',
      link: '/help/docs/getting-started'
    },
    {
      title: 'Run Analysis',
      description: 'Understand how to initiate and manage code analysis jobs.',
      icon: 'fa-play-circle',
      link: '/help/docs/how-analysis-works'
    },
    {
      title: 'Chat with AI',
      description: 'Discover how to use the AI chat for code explanations and assistance.',
      icon: 'fa-comments',
      link: '/help/docs/using-chat'
    },
    {
      title: 'View Reports',
      description: 'Access and interpret your detailed code analysis reports.',
      icon: 'fa-chart-bar',
      link: '/help/docs/downloading-reports'
    },
    {
      title: 'Troubleshooting',
      description: 'Find solutions to common issues and problems.',
      icon: 'fa-tools',
      link: '/help/docs/troubleshooting'
    },
    {
      title: 'FAQ',
      description: 'Browse frequently asked questions for quick answers.',
      icon: 'fa-question-circle',
      link: '/help/faq'
    }
  ];

  filteredGuides = signal<Guide[]>([]);

  ngOnInit(): void {
    this.filteredGuides.set(this.guides);
  }

  searchTopics(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredGuides.set(
      this.guides.filter(
        guide =>
          guide.title.toLowerCase().includes(searchTerm) ||
          guide.description.toLowerCase().includes(searchTerm)
      )
    );
  }
}
