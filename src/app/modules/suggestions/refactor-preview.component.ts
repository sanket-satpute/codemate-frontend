import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefactorPreview } from './suggestions.model';
import { LoaderComponent } from '../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-refactor-preview',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './refactor-preview.component.html',
  styleUrls: ['./refactor-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefactorPreviewComponent {
  @Input() preview: RefactorPreview | null = null;
  @Input() loading = false;
}
