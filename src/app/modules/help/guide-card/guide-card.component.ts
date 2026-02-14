import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Guide {
  title: string;
  description: string;
  icon: string; // Font Awesome icon class
  link: string;
}

@Component({
  selector: 'app-guide-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './guide-card.component.html',
  styleUrls: ['./guide-card.component.scss']
})
export class GuideCardComponent {
  @Input() guide!: Guide;
}
