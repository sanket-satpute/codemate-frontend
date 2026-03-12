import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [guestGuard], // Protect auth routes from logged-in users
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: LayoutComponent, // This is the main layout component
    canActivate: [authGuard], // Protect all child routes
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'projects', loadComponent: () => import('./features/projects/project-list/project-list').then(m => m.ProjectListComponent) },
      {
        path: 'project-workspace/:projectId',
        children: [
          { path: 'overview', loadComponent: () => import('./pages/project-workspace/overview/overview.component').then(m => m.OverviewComponent) },
          { path: 'code-analysis', loadComponent: () => import('./pages/project-workspace/code-analysis/code-analysis.component').then(m => m.CodeAnalysisComponent) },
          { path: 'ai-chat', loadComponent: () => import('./pages/project-workspace/ai-chat/ai-chat.component').then(m => m.AiChatComponent) },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
        ]
      },
      { path: 'upload', loadComponent: () => import('./pages/upload/upload').then(m => m.UploadComponent) },

      { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings-page/settings-page').then(m => m.SettingsPage) },

      { path: 'logout', loadComponent: () => import('./pages/logout/logout.component').then(m => m.LogoutComponent) }, // Placeholder for logout action

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) } // Wildcard route for 404
    ]
  }
];
