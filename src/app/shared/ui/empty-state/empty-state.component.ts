import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Input() icon = 'fas fa-box-open'; // Font Awesome icon class
  @Input() title = 'No Data Available';
  @Input() message = 'There is no content to display here yet.';
  @Input() showButton = false;
  @Input() buttonText = 'Create New';
  @Input() buttonLink: string = '#'; // Router link or simple href
  @Input() buttonType: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'warning' | 'info' = 'primary';
}
