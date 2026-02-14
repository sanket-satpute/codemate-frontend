import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeViewer } from './code-viewer';

describe('CodeViewer', () => {
  let component: CodeViewer;
  let fixture: ComponentFixture<CodeViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
