import { TestBed } from '@angular/core/testing';

import { ProjectFile } from './project-file';

describe('ProjectFile', () => {
  let service: ProjectFile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectFile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
