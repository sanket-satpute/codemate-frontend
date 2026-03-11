import { Component, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

interface SidebarOption {
  name: string;
  icon: string;
  route?: string;
  subOptions?: SidebarOption[];
  tooltip?: string;
}

interface SidebarSection {
  label: string;
  items: SidebarOption[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Output() toggle = new EventEmitter<boolean>();
  @Output() logoutClicked = new EventEmitter<void>();
  isExpanded = true;
  expandedMenus: { [key: string]: boolean } = {};

  private router = inject(Router);

  /** Extract projectId from URL like /project-workspace/:projectId/... */
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  activeProjectId = computed(() => {
    const url = this.currentUrl();
    const match = url.match(/\/project-workspace\/([^/?]+)/);
    return match ? match[1] : null;
  });

  /** Build sidebar sections. Workspace routes are dynamic based on activeProjectId. */
  sidebarSections = computed<SidebarSection[]>(() => {
    const pid = this.activeProjectId();
    const wsBase = pid ? `/project-workspace/${pid}` : null;

    return [
      {
        label: 'Main',
        items: [
          { name: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard', tooltip: 'Dashboard' },
          { name: 'Projects', icon: 'fas fa-folder-open', route: '/projects', tooltip: 'Projects' },
          ...(wsBase ? [{
            name: 'Project Workspace',
            icon: 'fas fa-code-branch',
            tooltip: 'Project Workspace',
            subOptions: [
              { name: 'Overview', icon: 'fas fa-info-circle', route: `${wsBase}/overview`, tooltip: 'Overview' },
              { name: 'Code Analysis', icon: 'fas fa-chart-bar', route: `${wsBase}/code-analysis`, tooltip: 'Code Analysis' },
              { name: 'AI Chat', icon: 'fas fa-comments', route: `${wsBase}/ai-chat`, tooltip: 'AI Chat' },
            ],
          }] : []),
        ]
      },
      {
        label: 'Account',
        items: [
          { name: 'Notifications', icon: 'fas fa-bell', route: '/notifications', tooltip: 'Notifications' },
          { name: 'Settings', icon: 'fas fa-cog', route: '/settings', tooltip: 'Settings' },
        ]
      }
    ];
  });

  constructor(private authService: AuthService) { }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.toggle.emit(this.isExpanded);
  }

  toggleSubmenu(optionName: string) {
    this.expandedMenus[optionName] = !this.expandedMenus[optionName];
  }

  onLogoutClick() {
    this.logoutClicked.emit();
  }

  /** Fallback when logo SVG fails to load */
  onLogoError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    // The template shows a text fallback when the image is hidden
  }
}
