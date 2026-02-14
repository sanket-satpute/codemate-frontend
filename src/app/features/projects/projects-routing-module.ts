import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list';
import { ProjectDetailComponent } from '../../pages/project-detail/project-detail';
import { ProjectFilesComponent } from './project-files/project-files';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: ':id', component: ProjectDetailComponent },
  {
    path: ':projectId/summary',
    loadComponent: () =>
      import('./project-summary/project-summary/project-summary').then(
        m => m.ProjectSummaryComponent
      ),
  },
  {
    path: ':projectId/files',
    component: ProjectFilesComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
