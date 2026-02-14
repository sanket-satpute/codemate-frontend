import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component'; // Import EmptyStateComponent

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, EmptyStateComponent], // Add EmptyStateComponent
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  // You can add any specific logic for the not-found page here
}
