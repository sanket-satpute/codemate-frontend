import { Component, inject, signal, computed, ElementRef, HostListener, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { NotificationsComponent } from '../../modules/notifications/notifications.component';
import { NotificationsService } from '../../core/services/notifications/notifications.service';
import { ProfileDropdownComponent } from '../../modules/profile-dropdown/profile-dropdown.component';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme/theme.service';
import { ShortcutService } from '../../core/services/shortcut.service';
import { filter, map, Subscription } from 'rxjs';

/** Breadcrumb item with label and optional route */
interface BreadcrumbItem {
  label: string;
  route: string | null; // null = current page (not clickable)
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationsComponent, ProfileDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  // ViewChildren for interactive elements
  @ViewChild('notificationContainer') notificationContainer!: ElementRef;
  @ViewChild('profileContainer') profileContainer!: ElementRef;
  @ViewChild('profileButton') profileButton!: ElementRef<HTMLButtonElement>;

  // Services (Fix #9: Removed unused ActivatedRoute)
  private notificationsService = inject(NotificationsService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private elementRef = inject(ElementRef);
  private shortcutService = inject(ShortcutService);
  private router = inject(Router);

  // Signals for UI state
  showNotifications = signal(false);
  showProfileDropdown = signal(false);
  unreadCount = this.notificationsService.unreadCount;
  currentUser = this.authService.currentUser;
  currentTheme = this.themeService.currentTheme;
  isAuthenticated = this.authService.isAuthenticated;

  // FIX #17: User initials computed from name
  userInitials = computed(() => {
    const name = this.currentUser()?.name;
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  });

  // FIX #6: Per-user avatar gradient
  avatarGradient = computed(() => {
    const name = this.currentUser()?.name || this.currentUser()?.email || '';
    const gradients = [
      'linear-gradient(135deg, #4F46E5, #22D3EE)', // indigo → cyan
      'linear-gradient(135deg, #7C3AED, #EC4899)', // violet → pink
      'linear-gradient(135deg, #059669, #22D3EE)', // emerald → cyan
      'linear-gradient(135deg, #D97706, #EF4444)', // amber → red
      'linear-gradient(135deg, #2563EB, #8B5CF6)', // blue → purple
      'linear-gradient(135deg, #0891B2, #6366F1)', // teal → indigo
      'linear-gradient(135deg, #DC2626, #F59E0B)', // red → amber
      'linear-gradient(135deg, #7C3AED, #2DD4BF)', // purple → teal
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  });

  // FIX #4: OS-aware keyboard shortcut
  searchShortcut = navigator.userAgent.includes('Mac') ? '⌘K' : 'Ctrl+K';

  // FIX #8: Clickable breadcrumbs with routes
  breadcrumbs = signal<BreadcrumbItem[]>([]);
  private routeSub!: Subscription;

  /** Route-to-label mapping */
  private routeLabelMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'projects': 'Projects',
    'project-workspace': 'Workspace',
    'overview': 'Overview',
    'code-analysis': 'Code Analysis',
    'code-quality': 'Code Quality',
    'ui-ux-auditor': 'UI/UX Auditor',
    'ai-chat': 'AI Chat',
    'file-explorer': 'File Explorer',
    'ai-tools': 'AI Tools',
    'templates': 'Templates',
    'notifications': 'Notifications',
    'settings': 'Settings',
    'help-center': 'Help Center',
    'help': 'Help',
  };

  // FIX #10: Segments to exclude from breadcrumbs
  private excludedSegments = new Set(['auth', 'login', 'register', 'onboarding']);

  ngOnInit(): void {
    this.updateBreadcrumbs(this.router.url);

    this.routeSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects || event.url)
    ).subscribe(url => {
      this.updateBreadcrumbs(url);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  // FIX #8 + #10: Build clickable breadcrumbs, exclude auth segments
  private updateBreadcrumbs(url: string): void {
    // Strip query params and fragments
    const cleanUrl = url.split('?')[0].split('#')[0];
    const segments = cleanUrl.split('/').filter(s => s && s !== '');

    // FIX #10: If first segment is excluded (auth, onboarding), clear breadcrumbs
    if (segments.length > 0 && this.excludedSegments.has(segments[0])) {
      this.breadcrumbs.set([]);
      return;
    }

    const items: BreadcrumbItem[] = segments.map((segment, index) => {
      const label = this.routeLabelMap[segment] || this.toTitleCase(segment);
      const isLast = index === segments.length - 1;
      const route = isLast ? null : '/' + segments.slice(0, index + 1).join('/');
      return { label, route };
    });

    this.breadcrumbs.set(items);
  }

  private toTitleCase(str: string): string {
    return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /** Toggle notifications panel */
  toggleNotifications(): void {
    this.showNotifications.set(!this.showNotifications());
    if (this.showNotifications()) {
      this.showProfileDropdown.set(false);
    }
  }

  /** Toggle profile dropdown */
  toggleProfileDropdown(): void {
    this.showProfileDropdown.set(!this.showProfileDropdown());
    if (this.showProfileDropdown()) {
      this.showNotifications.set(false);
    }
  }

  /** FIX #12: Early return when no dropdowns are open */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.showNotifications() && !this.showProfileDropdown()) return;

    if (
      this.showNotifications() &&
      this.notificationContainer &&
      !this.notificationContainer.nativeElement.contains(event.target)
    ) {
      this.showNotifications.set(false);
    }

    if (
      this.showProfileDropdown() &&
      this.profileContainer &&
      !this.profileContainer.nativeElement.contains(event.target)
    ) {
      this.showProfileDropdown.set(false);
    }
  }

  /** Handle logout */
  onLogout(): void {
    this.authService.logout();
    this.showProfileDropdown.set(false);
  }

  /** Toggle theme */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /** Open global command palette */
  openCommandPalette(): void {
    this.shortcutService.openCommandPalette();
  }

  /** FIX #11: Global keyboard shortcut handler with focus restoration */
  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.shortcutService.toggleCommandPalette();
    }

    if (event.key === 'Escape') {
      // FIX #11: Restore focus to trigger element after closing
      if (this.showNotifications()) {
        this.showNotifications.set(false);
        this.notificationContainer?.nativeElement?.querySelector('button')?.focus();
      }
      if (this.showProfileDropdown()) {
        this.showProfileDropdown.set(false);
        this.profileButton?.nativeElement?.focus();
      }
    }
  }
}
