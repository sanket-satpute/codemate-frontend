import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMeter } from './risk-meter';

describe('RiskMeter', () => {
  let component: RiskMeter;
  let fixture: ComponentFixture<RiskMeter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskMeter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskMeter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
