import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ProjectsDashboardComponent } from './projects-dashboard.component';
import { ProjectService } from '../../../core/services/project.service';
import { ToastService } from '../../../core/services/toast';
import { Project } from '../../../core/models/project.model';

describe('ProjectsDashboardComponent', () => {
  let component: ProjectsDashboardComponent;
  let fixture: ComponentFixture<ProjectsDashboardComponent>;
  let projectService: ProjectService;

  const mockProjects: Project[] = [
    { id: '1', name: 'Test Project 1', createdAt: new Date().toISOString(), status: 'COMPLETED' },
    { id: '2', name: 'Test Project 2', createdAt: new Date().toISOString(), status: 'RUNNING' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ProjectsDashboardComponent
      ],
      providers: [ProjectService, ToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsDashboardComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on initialization', () => {
    spyOn(projectService, 'getProjects').and.returnValue(of({ projects: mockProjects }));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.projects().length).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('should handle error when loading projects', () => {
    spyOn(projectService, 'getProjects').and.returnValue(throwError(() => new Error('Failed to load')));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.error()).toBe('Failed to load projects. Please try again later.');
    expect(component.isLoading()).toBe(false);
  });
});
