import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dashboard } from '../../../core/models/dashboard.model'; // Import Dashboard
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './summary-cards.component.html',
  styleUrls: ['./summary-cards.component.scss']
})
export class SummaryCardsComponent {
  @Input() dashboardData: Dashboard | null = null; // Changed input to Dashboard
}
