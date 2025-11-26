import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SalesTargetListComponent } from "./sales-target-list.component";

describe("SalesTargetListComponent", () => {
  let component: SalesTargetListComponent;
  let fixture: ComponentFixture<SalesTargetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesTargetListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesTargetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
