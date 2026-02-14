import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiResponse } from './ai-response';

describe('AiResponse', () => {
  let component: AiResponse;
  let fixture: ComponentFixture<AiResponse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiResponse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiResponse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
