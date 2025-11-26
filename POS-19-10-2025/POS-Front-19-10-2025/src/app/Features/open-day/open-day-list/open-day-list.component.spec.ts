import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OpenDayListComponent } from "./open-day-list.component";

describe("OpenDayListComponent", () => {
  let component: OpenDayListComponent;
  let fixture: ComponentFixture<OpenDayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenDayListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
