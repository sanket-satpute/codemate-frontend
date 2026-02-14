import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.html',
  styleUrls: ['./progress-bar.scss'],
})
export class ProgressBarComponent {
  @Input({ required: true }) progress = 0; // Progress from 0 to 100
  @Input() showPercentage = true;
}
