import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content">
      <h2>Logout</h2>
      <p>Confirm logout modal.</p>
    </div>
  `,
  styles: [`
    .page-content {
      padding: 20px;
      color: var(--color-text-primary);
    }
  `]
})
export class LogoutComponent {}
