import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quick-actions.html',
  styleUrls: ['./quick-actions.css'],
})
export class QuickActionsComponent {
  @Input() projectId = '';

  constructor(private router: Router) {}

  navigateToChat(): void {
    this.router.navigate(['/projects', this.projectId, 'chat']);
  }

  navigateToFiles(): void {
    this.router.navigate(['/projects', this.projectId, 'files']);
  }

  navigateToDetailedAnalysis(): void {
    this.router.navigate(['/projects', this.projectId, 'analysis']);
  }
}
