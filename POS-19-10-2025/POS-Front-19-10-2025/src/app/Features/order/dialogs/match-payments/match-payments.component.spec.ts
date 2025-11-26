import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchPaymentsComponent } from './match-payments.component';

describe('MatchPaymentsComponent', () => {
  let component: MatchPaymentsComponent;
  let fixture: ComponentFixture<MatchPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
