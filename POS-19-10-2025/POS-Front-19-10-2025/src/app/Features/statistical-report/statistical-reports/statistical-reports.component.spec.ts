import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StatisticalReportsComponent } from "./statistical-reports.component";

describe("StatisticalReportsComponent", () => {
  let component: StatisticalReportsComponent;
  let fixture: ComponentFixture<StatisticalReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticalReportsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticalReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
