import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProject } from './upload-project';

describe('UploadProject', () => {
  let component: UploadProject;
  let fixture: ComponentFixture<UploadProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadProject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadProject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
