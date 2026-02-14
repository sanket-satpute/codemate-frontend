// path: src/app/pages/project-detail/project-detail.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDetailComponent } from './project-detail';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { of, throwError } from 'rxjs';
import { ProjectDetails } from '../../core/models/project.model';
import { ProjectFile } from '../../modules/project-files/project-files.models'; // Corrected import path for ProjectFile
import { HttpErrorResponse } from '@angular/common/http';

describe('ProjectDetailComponent', () => {
  let component: ProjectDetailComponent;
  let fixture: ComponentFixture<ProjectDetailComponent>;
  let activatedRoute: Partial<ActivatedRoute>;
  let projectService: jasmine.SpyObj<ProjectService>;

  beforeEach(async () => {
    const projectServiceSpy = jasmine.createSpyObj('ProjectService', ['getProjectDetail']);

    await TestBed.configureTestingModule({
      imports: [ProjectDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => 'test-project-id' })
          }
        },
        { provide: ProjectService, useValue: projectServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load project details on ngOnInit', () => {
    const mockProjectDetails: ProjectDetails = {
      id: 'test-project-id', // Use 'id' matching Project interface
      name: 'Test Project',
      description: 'Test Description',
      createdAt: new Date().toISOString(), // Convert Date to ISO string
      status: 'COMPLETED', // Add status matching Project interface
      files: [{
        id: 'file1',
        projectId: 'test-project-id',
        name: 'test.js', // Corrected from fileName
        filePath: 'test.js',
        size: 100, // Corrected from fileSize
        type: 'application/javascript', // Added type
        uploadedDate: new Date().toISOString() // Corrected from uploadDate
      }],
    };
    projectService.getProjectDetail.and.returnValue(of(mockProjectDetails));
    fixture.detectChanges(); // Calls ngOnInit

    component.projectDetails$.subscribe(project => {
      expect(project).toEqual(mockProjectDetails);
    });
    expect(component.isLoading).toBeFalse();
    expect(component.selectedFile).toEqual(mockProjectDetails.files[0]);
    expect(projectService.getProjectDetail).toHaveBeenCalledWith('test-project-id');
  });

  it('should set error message if project ID is missing', () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { paramMap: of({ get: (key: string) => null }) } // Simulate missing ID
    });
    // Re-create component to pick up new ActivatedRoute mock
    fixture = TestBed.createComponent(ProjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Calls ngOnInit

    expect(component.errorMessage).toBe('Project ID is missing.');
    expect(component.isLoading).toBeFalse();
    expect(projectService.getProjectDetail).not.toHaveBeenCalled();
  });

  it('should set error message if project details fetch fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Project not found',
      status: 404,
      statusText: 'Not Found'
    });
    projectService.getProjectDetail.and.returnValue(throwError(() => errorResponse));
    fixture.detectChanges(); // Calls ngOnInit

    expect(component.errorMessage).toBe('Failed to load project details. Please try again.');
    expect(component.isLoading).toBeFalse();
  });

  it('should update selectedFile on onFileSelected', () => {
    const mockFile: ProjectFile = {
      id: 'file2',
      projectId: 'test-project-id',
      name: 'another.js', // Corrected from fileName
      filePath: 'another.js',
      size: 200, // Corrected from fileSize
      type: 'application/javascript', // Added type
      uploadedDate: new Date().toISOString() // Corrected from uploadDate
    };
    component.onFileSelected(mockFile);
    expect(component.selectedFile).toEqual(mockFile);
  });
});
