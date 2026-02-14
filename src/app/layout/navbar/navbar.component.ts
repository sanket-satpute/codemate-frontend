import { Component, inject, signal, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationsComponent } from '../../modules/notifications/notifications.component';
import { NotificationsService } from '../../core/services/notifications/notifications.service';
import { ProfileDropdownComponent } from '../../modules/profile-dropdown/profile-dropdown.component';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationsComponent, ProfileDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  // ViewChildren for interactive elements
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('notificationContainer') notificationContainer!: ElementRef;
  @ViewChild('profileContainer') profileContainer!: ElementRef;
  @ViewChild('profileButton') profileButton!: ElementRef<HTMLButtonElement>; // NEW

  // Services
  private notificationsService = inject(NotificationsService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private elementRef = inject(ElementRef);

  // Signals for UI state
  showNotifications = signal(false);
  showProfileDropdown = signal(false);
  unreadCount = this.notificationsService.unreadCount;
  currentUser = this.authService.currentUser;
  currentTheme = this.themeService.currentTheme;

  /**
   * Toggle notifications panel
   */
  toggleNotifications(): void {
    this.showNotifications.set(!this.showNotifications());
    if (this.showNotifications()) {
      this.showProfileDropdown.set(false);
    }
  }

  /**
   * Toggle profile dropdown
   */
  toggleProfileDropdown(): void {
    this.showProfileDropdown.set(!this.showProfileDropdown());
    if (this.showProfileDropdown()) {
      this.showNotifications.set(false);
    }
  }

  /**
   * Close dropdowns when clicking outside their containers
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Close notifications if shown and clicked outside its container
    if (
      this.showNotifications() && 
      this.notificationContainer && 
      !this.notificationContainer.nativeElement.contains(event.target)
    ) {
      this.showNotifications.set(false);
    }

    // Close profile dropdown if shown and clicked outside its container
    if (
      this.showProfileDropdown() && 
      this.profileContainer && 
      !this.profileContainer.nativeElement.contains(event.target)
    ) {
      this.showProfileDropdown.set(false);
    }
  }

  /**
   * Handle logout
   */
  onLogout(): void {
    this.authService.logout();
    this.showProfileDropdown.set(false);
  }

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Focus the search input programmatically
   */
  focusSearch(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  /**
   * Handle search input focus
   */
  onSearchFocus(): void {
    // Optional: Add analytics tracking
    // this.analyticsService.trackEvent('search_focus');
    
    // Optional: Show search suggestions dropdown
    // this.showSearchSuggestions.set(true);
  }

  /**
   * Handle search input blur
   */
  onSearchBlur(): void {
    // Optional: Hide search suggestions after a delay
    // setTimeout(() => {
    //   this.showSearchSuggestions.set(false);
    // }, 200);
  }

  /**
   * Global keyboard shortcut handler
   * Handles ⌘K / Ctrl+K for search
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.focusSearch();
    }

    // Escape to close search and dropdowns
    if (event.key === 'Escape') {
      if (this.searchInput && document.activeElement === this.searchInput.nativeElement) {
        this.searchInput.nativeElement.blur();
      }
      
      // Close any open dropdowns
      if (this.showNotifications()) {
        this.showNotifications.set(false);
      }
      if (this.showProfileDropdown()) {
        this.showProfileDropdown.set(false);
      }
    }
  }
}