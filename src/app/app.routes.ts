import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
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
    path: 'onboarding',
    loadComponent: () => import('./modules/onboarding/onboarding.component').then(m => m.OnboardingComponent),
    children: [
      // Default to the first step, directly loading the component instead of redirecting
      { path: '', loadComponent: () => import('./modules/onboarding/welcome-onboarding/welcome-onboarding.component').then(m => m.WelcomeOnboardingComponent), pathMatch: 'full' },
      { path: 'welcome', loadComponent: () => import('./modules/onboarding/welcome-onboarding/welcome-onboarding.component').then(m => m.WelcomeOnboardingComponent) },
      { path: 'create-project', loadComponent: () => import('./modules/onboarding/onboarding-step/onboarding-step.component').then(m => m.OnboardingStepComponent) },
      { path: 'upload-files', loadComponent: () => import('./modules/onboarding/onboarding-step/onboarding-step.component').then(m => m.OnboardingStepComponent) },
      { path: 'run-analysis', loadComponent: () => import('./modules/onboarding/onboarding-step/onboarding-step.component').then(m => m.OnboardingStepComponent) },
      { path: 'chat-with-ai', loadComponent: () => import('./modules/onboarding/onboarding-step/onboarding-step.component').then(m => m.OnboardingStepComponent) },
      { path: 'view-results', loadComponent: () => import('./modules/onboarding/onboarding-step/onboarding-step.component').then(m => m.OnboardingStepComponent) },
    ]
  },
  {
    path: '',
    component: LayoutComponent, // This is the main layout component
    canActivate: [authGuard], // Protect all child routes
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'projects', loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent) },
      {
        path: 'project-workspace',
        children: [
          { path: 'overview', loadComponent: () => import('./pages/project-workspace/overview/overview.component').then(m => m.OverviewComponent) },
          { path: 'code-analysis', loadComponent: () => import('./pages/project-workspace/code-analysis/code-analysis.component').then(m => m.CodeAnalysisComponent) },
          { path: 'code-quality', loadComponent: () => import('./pages/project-workspace/code-quality/code-quality.component').then(m => m.CodeQualityComponent) },
          { path: 'ui-ux-auditor', loadComponent: () => import('./pages/project-workspace/ui-ux-auditor/ui-ux-auditor.component').then(m => m.UiUxAuditorComponent) },
          { path: 'ai-chat', loadComponent: () => import('./pages/project-workspace/ai-chat/ai-chat.component').then(m => m.AiChatComponent) },
          { path: 'file-explorer', loadComponent: () => import('./pages/project-workspace/file-explorer/file-explorer.component').then(m => m.FileExplorerComponent) },
        ]
      },
      { path: 'ai-tools', loadComponent: () => import('./pages/ai-tools/ai-tools.component').then(m => m.AiToolsComponent) },
      { path: 'templates', loadComponent: () => import('./pages/templates-starters/templates-starters.component').then(m => m.TemplatesStartersComponent) },
      { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings-page/settings-page').then(m => m.SettingsPage) },
      { path: 'help-center', loadComponent: () => import('./pages/help-center/help-center.component').then(m => m.HelpCenterComponent) },
      { path: 'logout', loadComponent: () => import('./pages/logout/logout.component').then(m => m.LogoutComponent) }, // Placeholder for logout action

      // Existing project-specific routes (if they are still needed outside the new structure)
      {
        path: 'projects/:projectId',
        loadComponent: () =>
          import('./modules/project-details/project-details.component')
            .then(m => m.ProjectDetailsComponent)
      },
      {
        path: 'projects/:projectId/chat',
        loadComponent: () =>
          import('./modules/chat/chat-room.component')
            .then(m => m.ChatRoomComponent)
      },
      {
        path: 'projects/:projectId/summary',
        loadComponent: () =>
          import(
            './features/projects/project-summary/project-summary/project-summary'
          ).then(m => m.ProjectSummaryComponent),
      },
      {
        path: 'projects/:projectId/analysis/:jobId',
        loadComponent: () => import('./modules/analysis-result/analysis-result.component').then(m => m.AnalysisResultComponent)
      },
      {
        path: 'projects/:projectId/suggestions',
        loadComponent: () =>
          import('./modules/suggestions/suggestions.component')
            .then(c => c.SuggestionsComponent),
        canActivate: [authGuard]
      },
      {
        path: 'projects/:projectId/ai-fix',
        loadComponent: () => import('./modules/ai-fix/ai-fix.component').then(m => m.AiFixComponent),
        canActivate: [authGuard]
      },
      {
        path: 'projects/:projectId/test-coverage',
        loadComponent: () =>
          import('./modules/test-coverage/test-coverage.component').then(
            (m) => m.TestCoverageComponent
          ),
      },
      {
        path: 'projects/:projectId/dependencies',
        loadComponent: () =>
          import('./modules/dependencies/dependencies.component')
            .then(m => m.DependenciesComponent)
      },
      {
        path: 'projects/:projectId/performance',
        loadComponent: () =>
          import('./modules/performance/performance.component')
            .then(m => m.PerformanceComponent)
      },
      {
        path: 'projects/:projectId/security',
        loadComponent: () =>
          import('./modules/security/security-dashboard.component')
            .then(m => m.SecurityDashboardComponent),
        canActivate: [authGuard]
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) } // Wildcard route for 404
    ]
  }
];
