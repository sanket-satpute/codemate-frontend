import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router'; // Import Router
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ThemeService } from '../core/services/theme/theme.service';
import { ThemeWipeComponent } from '../shared/ui/theme-wipe/theme-wipe.component'; // Corrected path
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmDialogComponent } from '../shared/ui/confirm-dialog/confirm-dialog.component'; // Corrected path
import { ConfirmDialogService } from '../shared/ui/confirm-dialog/confirm-dialog.service'; // Keep existing confirm dialog service
import { LogoutConfirmationDialogComponent } from '../shared/ui/logout-confirmation-dialog/logout-confirmation-dialog.component'; // Import new logout dialog
import { AuthService } from '../core/services/auth/auth.service'; // Import AuthService for logout logic (corrected path)

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    ThemeWipeComponent,
    ConfirmDialogComponent, // Include existing confirm dialog
    LogoutConfirmationDialogComponent // Include new logout dialog
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isSidebarExpanded = true;
  isLogoutDialogOpen = false; // Property to control logout dialog visibility

  private themeService = inject(ThemeService);
  public confirmDialogService = inject(ConfirmDialogService); // Make public for template access if needed
  private authService = inject(AuthService); // Inject AuthService
  private router = inject(Router); // Inject Router

  dialogData = this.confirmDialogService.dialogData; // Access signal directly

  isWiping = this.themeService.isWiping; // Access signal directly

  onSidebarToggle(isExpanded: boolean) {
    this.isSidebarExpanded = isExpanded;
  }

  // Wrapper methods for existing ConfirmDialogService
  onConfirmGlobalDialog() {
    this.confirmDialogService.close(true);
  }

  onCancelGlobalDialog() {
    this.confirmDialogService.close(false);
  }

  // Methods for new LogoutConfirmationDialog
  openLogoutDialog() {
    this.isLogoutDialogOpen = true;
  }

  onLogoutConfirmed() {
    console.log('Analytics Event: logout_confirmed'); // Emit analytics event
    this.authService.logout(); // Assuming AuthService has a logout method
    this.router.navigate(['/auth/login']); // Navigate to login page
    this.isLogoutDialogOpen = false; // Close dialog
  }

  onLogoutCanceled() {
    console.log('Analytics Event: logout_canceled'); // Emit analytics event
    this.isLogoutDialogOpen = false; // Close dialog
  }

  // Public wrapper for console.log for template events
  logDialogOpened(dialogType: string) {
    console.log(`Analytics Event: ${dialogType}_dialog_opened`);
  }

  logDialogClosed(dialogType: string) {
    console.log(`Analytics Event: ${dialogType}_dialog_closed`);
  }
}
