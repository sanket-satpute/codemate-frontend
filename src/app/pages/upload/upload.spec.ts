// path: src/app/pages/upload/upload.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadComponent } from './upload';
import { UploadService } from '../../core/services/upload.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { JobStatusResponse } from '../../core/models/job.model';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let uploadService: jasmine.SpyObj<UploadService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const uploadServiceSpy = jasmine.createSpyObj('UploadService', ['uploadFile']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UploadComponent],
      providers: [
        { provide: UploadService, useValue: uploadServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    uploadService = TestBed.inject(UploadService) as jasmine.SpyObj<UploadService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedFile on onFileSelected', () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    const mockEvt = { target: { files: [mockFile] } } as unknown as Event;
    component.onFileSelected(mockEvt);
    expect(component.selectedFile).toEqual(mockFile);
    expect(component.uploadProgress).toBe(0);
    expect(component.errorMessage).toBe('');
    expect(component.uploadSuccess).toBeFalse();
  });

  it('should call uploadService.uploadFile on uploadFile', () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    component.selectedFile = mockFile;
    const mockResponse: JobStatusResponse = {
      jobId: 'job123',
      status: 'PENDING',
      message: 'Upload started',
      projectId: 'proj123',
      resultId: '',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };
    uploadService.uploadFile.and.returnValue(of(mockResponse));

    component.uploadFile();

    expect(component.isUploading).toBeTrue();
    expect(uploadService.uploadFile).toHaveBeenCalledWith(mockFile);
  });

  it('should update progress and navigate on successful upload', () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    component.selectedFile = mockFile;
    const mockResponse: JobStatusResponse = {
      jobId: 'job123',
      status: 'COMPLETED',
      message: 'Upload complete',
      projectId: 'proj123',
      resultId: 'res123',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };
    uploadService.uploadFile.and.returnValue(of(mockResponse));

    component.uploadFile();

    expect(component.uploadProgress).toBe(100);
    expect(component.uploadSuccess).toBeTrue();
    expect(component.isUploading).toBeFalse();
    expect(component.uploadResponse).toEqual(mockResponse);
    expect(router.navigate).toHaveBeenCalledWith(['/projects', 'proj123']);
  });

  it('should set error message on upload failure', () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    component.selectedFile = mockFile;
    const errorResponse = new HttpErrorResponse({
      error: 'Upload failed',
      status: 500,
      statusText: 'Internal Server Error'
    });
    uploadService.uploadFile.and.returnValue(throwError(() => errorResponse));

    component.uploadFile();

    expect(component.errorMessage).toBe('File upload failed. Please try again.');
    expect(component.isUploading).toBeFalse();
    expect(component.uploadSuccess).toBeFalse();
  });

  it('should reset state on retryUpload', () => {
    component.uploadProgress = 50;
    component.isUploading = true;
    component.uploadSuccess = true;
    component.errorMessage = 'Error';
    component.selectedFile = new File(['content'], 'test.txt');
    component.uploadResponse = {
      jobId: 'job123',
      status: 'FAILED',
      message: 'Upload failed',
      projectId: 'proj123',
      resultId: '',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    component.retryUpload();

    expect(component.uploadProgress).toBe(0);
    expect(component.isUploading).toBeFalse();
    expect(component.uploadSuccess).toBeFalse();
    expect(component.errorMessage).toBe('');
    expect(component.uploadResponse).toBeNull();
  });
});
