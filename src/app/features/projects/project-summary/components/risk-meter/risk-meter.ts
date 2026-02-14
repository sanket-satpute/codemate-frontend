import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-risk-meter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-meter.html',
  styleUrls: ['./risk-meter.css'],
})
export class RiskMeterComponent {
  @Input() score = 0;

  getColor(): string {
    if (this.score <= 33) {
      return 'bg-green-500';
    } else if (this.score <= 66) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  }
}
