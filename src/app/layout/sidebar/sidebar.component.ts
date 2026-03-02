import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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

  constructor(private authService: AuthService) { }

  /** Grouped sidebar sections for visual hierarchy */
  sidebarSections: SidebarSection[] = [
    {
      label: 'Main',
      items: [
        { name: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard', tooltip: 'Dashboard' },
        { name: 'Projects', icon: 'fas fa-folder-open', route: '/projects', tooltip: 'Projects' },
        {
          name: 'Project Workspace',
          icon: 'fas fa-code-branch',
          tooltip: 'Project Workspace',
          subOptions: [
            { name: 'Overview', icon: 'fas fa-info-circle', route: '/project-workspace/overview', tooltip: 'Overview' },
            { name: 'Code Analysis', icon: 'fas fa-chart-bar', route: '/project-workspace/code-analysis', tooltip: 'Code Analysis' },
            { name: 'Code Quality', icon: 'fas fa-medal', route: '/project-workspace/code-quality', tooltip: 'Code Quality' },
            { name: 'UI/UX Auditor', icon: 'fas fa-vector-square', route: '/project-workspace/ui-ux-auditor', tooltip: 'UI/UX Auditor' },
            { name: 'AI Chat', icon: 'fas fa-comments', route: '/project-workspace/ai-chat', tooltip: 'AI Chat' },
            { name: 'File Explorer', icon: 'fas fa-folder', route: '/project-workspace/file-explorer', tooltip: 'File Explorer' },
          ],
        },
      ]
    },
    {
      label: 'Tools',
      items: [
        { name: 'AI Tools', icon: 'fas fa-robot', route: '/ai-tools', tooltip: 'AI Tools' },
        { name: 'Templates & Starters', icon: 'fas fa-rocket', route: '/templates', tooltip: 'Templates & Starters' },
      ]
    },
    {
      label: 'Account',
      items: [
        { name: 'Notifications', icon: 'fas fa-bell', route: '/notifications', tooltip: 'Notifications' },
        { name: 'Settings', icon: 'fas fa-cog', route: '/settings', tooltip: 'Settings' },
        { name: 'Help Center', icon: 'fas fa-question-circle', route: '/help-center', tooltip: 'Help Center' },
      ]
    }
  ];

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
