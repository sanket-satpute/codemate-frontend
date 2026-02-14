import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-export-buttons',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './export-buttons.component.html',
  styleUrls: ['./export-buttons.component.scss']
})
export class ExportButtonsComponent {
  @Input() disabled = false;
  @Input() exportingCsv = false;
  @Input() exportingPdf = false;
  @Output() exportCsv = new EventEmitter<void>();
  @Output() exportPdf = new EventEmitter<void>();

  onExportCsv(): void {
    this.exportCsv.emit();
  }

  onExportPdf(): void {
    this.exportPdf.emit();
  }
}
