import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-card.html',
  styleUrls: ['./summary-card.css'],
})
export class SummaryCardComponent {
  @Input() title = '';
  @Input() metric: number | string = 0;
  @Input() description = '';
}
