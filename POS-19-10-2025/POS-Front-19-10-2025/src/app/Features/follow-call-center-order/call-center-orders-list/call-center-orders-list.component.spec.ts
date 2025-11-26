import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CallCenterOrdersListComponent } from "./call-center-orders-list.component";

describe("CallCenterOrdersListComponent", () => {
  let component: CallCenterOrdersListComponent;
  let fixture: ComponentFixture<CallCenterOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallCenterOrdersListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallCenterOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
