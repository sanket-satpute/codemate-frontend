import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ThemeService } from '../../../core/services/theme/theme.service';

@Component({
  selector: 'app-theme-wipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-wipe.component.html',
  styleUrls: ['./theme-wipe.component.scss'],
  animations: [
    trigger('wipeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })) // Fade in duration
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 })) // Fade out duration
      ])
    ])
  ]
})
export class ThemeWipeComponent {
  themeService = inject(ThemeService); // Inject ThemeService to use its state
}
