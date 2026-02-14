// path: src/app/pages/dashboard/dashboard.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { ProjectService } from '../../core/services/project.service';
import { of, throwError } from 'rxjs'; // Added throwError
import { ProjectListResponse, Project } from '../../core/models/project.model';
import { HttpErrorResponse } from '@angular/common/http'; // Moved import to top

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;

  beforeEach(async () => {
    const projectServiceSpy = jasmine.createSpyObj('ProjectService', ['getProjects']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: ProjectService, useValue: projectServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch projects on ngOnInit', () => {
    const mockProject: Project = { projectId: '1', name: 'Test Project', description: 'Desc', createdAt: new Date('2023-01-01T00:00:00Z'), userId: 'user1', jobs: [] };
    const mockProjectsResponse: ProjectListResponse = {
      count: 1,
      projects: [mockProject]
    };
    projectService.getProjects.and.returnValue(of(mockProjectsResponse));
    fixture.detectChanges(); // Calls ngOnInit

    expect(component.projects).toEqual(mockProjectsResponse.projects);
    expect(component.isLoading).toBeFalse();
    expect(projectService.getProjects).toHaveBeenCalled();
  });

  it('should display error message if project fetch fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found'
    });
    projectService.getProjects.and.returnValue(throwError(() => errorResponse)); // Simulate error with throwError
    fixture.detectChanges(); // Calls ngOnInit

    expect(component.errorMessage).toBe('Failed to load projects. Please try again later.');
    expect(component.isLoading).toBeFalse();
  });
});
