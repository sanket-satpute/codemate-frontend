import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SettingsService } from '../../core/services/settings/settings.service';
import { LoaderComponent } from '../../shared/ui/loader/loader.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ProfileFormComponent, ChangePasswordComponent, LoaderComponent, EmptyStateComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);

  currentUser = this.settingsService.currentUser;
  loading = this.settingsService.loading;
  error = this.settingsService.error;

  ngOnInit(): void {
    this.settingsService.getCurrentUser().subscribe();
  }
}
