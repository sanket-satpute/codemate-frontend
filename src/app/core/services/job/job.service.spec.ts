import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JobService } from './job.service';
import { WebSocketService } from '../websocket/websocket.service';
import { ToastService } from '../toast';
import { JobStatus } from '../../models/job.model'; // Removed JobState
import { Subject } from 'rxjs'; // Removed 'of'

describe('JobService', () => {
  let service: JobService;
  let httpMock: HttpTestingController;
  let websocketServiceSpy: jasmine.SpyObj<WebSocketService>;
  // Removed unused variable toastServiceSpy

  beforeEach(() => {
    const wsSpy = jasmine.createSpyObj('WebSocketService', ['onTopic', 'isConnected']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['showError', 'showWarning']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        JobService,
        { provide: WebSocketService, useValue: wsSpy },
        { provide: ToastService, useValue: toastSpy },
      ],
    });

    service = TestBed.inject(JobService);
    httpMock = TestBed.inject(HttpTestingController);
    websocketServiceSpy = TestBed.inject(WebSocketService) as jasmine.SpyObj<WebSocketService>;
    // Removed toastServiceSpy injection as it's not used
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getJobOnce', () => {
    it('should fetch job status successfully', () => {
      const mockJobStatus: JobStatus = { jobId: '123', state: 'COMPLETED', updatedAt: new Date().toISOString() };
      service.getJobOnce('123').subscribe(status => {
        expect(status).toEqual(mockJobStatus);
      });
      const req = httpMock.expectOne('/api/job/123');
      expect(req.request.method).toBe('GET');
      req.flush(mockJobStatus);
    });
  });

  describe('subscribeToJob', () => {
    it('should use WebSocket when connected and receive updates', (done) => {
      const jobId = 'ws-test';
      const wsTopic = `/topic/job/${jobId}`;
      const mockStatus1: JobStatus = { jobId, state: 'IN_PROGRESS', progress: 50, updatedAt: new Date().toISOString() };
      const mockStatus2: JobStatus = { jobId, state: 'COMPLETED', updatedAt: new Date().toISOString() };
      
      const wsSubject = new Subject<JobStatus>();
      websocketServiceSpy.isConnected.and.returnValue(true);
      websocketServiceSpy.onTopic.withArgs(wsTopic).and.returnValue(wsSubject.asObservable());

      const initialMockStatus: JobStatus = { jobId, state: 'PENDING', updatedAt: new Date().toISOString() };
      
      let updateCount = 0;
      service.subscribeToJob(jobId).subscribe({
        next: (status) => {
          updateCount++;
          if (updateCount === 1) {
            expect(status).toEqual(initialMockStatus);
          } else if (updateCount === 2) {
            expect(status).toEqual(mockStatus1);
          } else if (updateCount === 3) {
            expect(status).toEqual(mockStatus2);
            done();
          }
        }
      });

      const req = httpMock.expectOne(`/api/job/${jobId}`);
      req.flush(initialMockStatus);

      wsSubject.next(mockStatus1);
      wsSubject.next(mockStatus2);
      wsSubject.complete();
    });

    it('should fall back to HTTP polling when WebSocket is not connected', (done) => {
        const jobId = 'poll-test';
        const mockStatus1: JobStatus = { jobId, state: 'IN_PROGRESS', progress: 50, updatedAt: new Date().toISOString() };
        const mockStatus2: JobStatus = { jobId, state: 'COMPLETED', updatedAt: new Date().toISOString() };
  
        websocketServiceSpy.isConnected.and.returnValue(false);
  
        let updateCount = 0;
        service.subscribeToJob(jobId, 100).subscribe({
          next: (status) => {
            updateCount++;
            if(updateCount === 1) {
                expect(status.state).toBe('IN_PROGRESS');
            } else if (updateCount === 2) {
                expect(status.state).toBe('COMPLETED');
                done();
            }
          }
        });
  
        const req1 = httpMock.expectOne(`/api/job/${jobId}`);
        req1.flush(mockStatus1);

        const req2 = httpMock.expectOne(`/api/job/${jobId}`);
        req2.flush(mockStatus2);
    });

    it('should fall back to HTTP polling if WebSocket times out', (done) => {
        const jobId = 'timeout-test';
        const mockStatus1: JobStatus = { jobId, state: 'IN_PROGRESS', progress: 50, updatedAt: new Date().toISOString() };
        const mockStatus2: JobStatus = { jobId, state: 'COMPLETED', updatedAt: new Date().toISOString() };

        const wsSubject = new Subject<JobStatus>();
        websocketServiceSpy.isConnected.and.returnValue(true);
        websocketServiceSpy.onTopic.and.returnValue(wsSubject.asObservable());

        let updateCount = 0;
        service.subscribeToJob(jobId, 100).subscribe({
            next: (status) => {
                updateCount++;
                if(updateCount === 1) {
                    expect(status.state).toBe('IN_PROGRESS');
                } else if (updateCount === 2) {
                    expect(status.state).toBe('COMPLETED');
                    done();
                }
            }
        });

        const req1 = httpMock.expectOne(`/api/job/${jobId}`);
        req1.flush(mockStatus1);

        // Simulate timeout by not emitting from wsSubject

        const req2 = httpMock.expectOne(`/api/job/${jobId}`);
        req2.flush(mockStatus2);
    });
  });
});
