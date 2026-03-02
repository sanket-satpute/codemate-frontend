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
  Renderer2,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.service';
import { ConfirmDialogData } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.model';
import { ThemeService } from 'src/app/core/services/theme/theme.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

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
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private originalParent: HTMLElement | null = null;

  currentTheme = this.themeService.currentTheme;

  /** User initials computed from name */
  userInitials = computed(() => {
    const name = this.username;
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  });

  /** Per-user avatar gradient */
  avatarGradient = computed(() => {
    const name = this.username || this.email || '';
    const gradients = [
      'linear-gradient(135deg, #4F46E5, #22D3EE)',
      'linear-gradient(135deg, #7C3AED, #EC4899)',
      'linear-gradient(135deg, #059669, #22D3EE)',
      'linear-gradient(135deg, #D97706, #EF4444)',
      'linear-gradient(135deg, #2563EB, #8B5CF6)',
      'linear-gradient(135deg, #0891B2, #6366F1)',
      'linear-gradient(135deg, #DC2626, #F59E0B)',
      'linear-gradient(135deg, #7C3AED, #2DD4BF)',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  });

  /** Menu items */
  menuItems: MenuItem[] = [
    { icon: 'fas fa-user-circle', label: 'View Profile', route: '/settings' },
    { icon: 'fas fa-cog', label: 'Settings', route: '/settings' },
    { icon: 'fas fa-question-circle', label: 'Help Center', route: '/help-center' },
  ];

  ngAfterViewInit(): void {
    if (this.isVisible) {
      this.positionDropdown();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      // Wait for *ngIf to render the panel before positioning
      setTimeout(() => this.positionDropdown(), 0);
    }
  }

  ngOnDestroy(): void {
    // No explicit body cleanup needed since we no longer append to body
  }

  private positionDropdown(): void {
    if (!this.dropdownPanel || !this.triggerElement) return;

    const panel = this.dropdownPanel.nativeElement;
    const trigger = this.triggerElement;
    const triggerRect = trigger.getBoundingClientRect();

    const top = triggerRect.bottom + 16; // 16px gap below trigger
    const right = window.innerWidth - triggerRect.right;

    panel.style.top = `${top}px`;
    panel.style.right = `${right}px`;

    requestAnimationFrame(() => {
      const panelRect = panel.getBoundingClientRect();

      if (panelRect.bottom > window.innerHeight - 10) {
        panel.style.top = `${triggerRect.top - panelRect.height - 8}px`;
      }

      if (panelRect.left < 10) {
        panel.style.left = `${triggerRect.left}px`;
        panel.style.right = 'auto';
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
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
