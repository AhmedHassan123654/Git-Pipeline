import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ExtraExpensesTypeComponent } from "./extra-expenses-type.component";

describe("ExtraExpensesTypeComponent", () => {
  let component: ExtraExpensesTypeComponent;
  let fixture: ComponentFixture<ExtraExpensesTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtraExpensesTypeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraExpensesTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
