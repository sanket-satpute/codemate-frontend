import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFiles } from './project-files';

describe('ProjectFiles', () => {
  let component: ProjectFiles;
  let fixture: ComponentFixture<ProjectFiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFiles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectFiles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
