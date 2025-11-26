import { ComponentFixture, TestBed } from "@angular/core/testing";

import { POSDashBoardComponent } from "./posdash-board.component";

describe("POSDashBoardComponent", () => {
  let component: POSDashBoardComponent;
  let fixture: ComponentFixture<POSDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [POSDashBoardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POSDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
