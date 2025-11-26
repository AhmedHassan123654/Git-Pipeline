import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PrepaingOrderComponent } from "./prepaing-order.component";

describe("PrepaingOrderComponent", () => {
  let component: PrepaingOrderComponent;
  let fixture: ComponentFixture<PrepaingOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrepaingOrderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepaingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
