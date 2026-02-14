import { 
  Component, 
  EventEmitter, 
  Input, 
  Output, 
  inject, 
  ElementRef, 
  ViewChild, 
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.service';
import { ConfirmDialogData } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.model';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss']
})
export class ProfileDropdownComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() isVisible: boolean = false;
  @Input() username: string | null = null;
  @Input() email: string | null = null;
  @Input() triggerElement: HTMLElement | null = null;

  @Output() logout = new EventEmitter<void>();

  @ViewChild('dropdownPanel') dropdownPanel!: ElementRef<HTMLDivElement>;

  private confirmDialogService = inject(ConfirmDialogService);
  private renderer = inject(Renderer2);
  private originalParent: HTMLElement | null = null;

  ngAfterViewInit(): void {
    if (this.dropdownPanel) {
      // CRITICAL FIX: Move dropdown to body to escape all parent constraints
      this.originalParent = this.dropdownPanel.nativeElement.parentElement;
      this.renderer.appendChild(document.body, this.dropdownPanel.nativeElement);
      
      // Position it initially
      if (this.isVisible) {
        this.positionDropdown();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reposition when visibility changes
    if (changes['isVisible'] && this.isVisible && this.dropdownPanel) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => this.positionDropdown(), 0);
    }
  }

  ngOnDestroy(): void {
    // Clean up: remove dropdown from body when component is destroyed
    if (this.dropdownPanel && this.dropdownPanel.nativeElement.parentElement === document.body) {
      this.renderer.removeChild(document.body, this.dropdownPanel.nativeElement);
    }
  }

  /**
   * Position the dropdown panel relative to the trigger button
   */
  private positionDropdown(): void {
    if (!this.dropdownPanel || !this.triggerElement) return;

    const panel = this.dropdownPanel.nativeElement;
    const trigger = this.triggerElement;

    // Get trigger button position
    const triggerRect = trigger.getBoundingClientRect();

    // Calculate position (below and aligned to right of button)
    const top = triggerRect.bottom + 8; // 8px gap
    const right = window.innerWidth - triggerRect.right;

    // Apply position
    panel.style.top = `${top}px`;
    panel.style.right = `${right}px`;

    // Ensure it's within viewport bounds
    requestAnimationFrame(() => {
      const panelRect = panel.getBoundingClientRect();
      
      // If dropdown goes off bottom of screen, position it above the button
      if (panelRect.bottom > window.innerHeight - 10) {
        panel.style.top = `${triggerRect.top - panelRect.height - 8}px`;
      }

      // If dropdown goes off left of screen, align to left edge of button
      if (panelRect.left < 10) {
        const left = triggerRect.left;
        panel.style.left = `${left}px`;
        panel.style.right = 'auto';
      }
    });
  }

  onLogoutClick(): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel'
    };

    this.confirmDialogService.open(dialogData).subscribe(result => {
      if (result) {
        this.logout.emit();
      }
    });
  }
}