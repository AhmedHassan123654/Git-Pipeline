import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ExtraExpensesTypeListComponent } from "./extra-expenses-type-list.component";

describe("ExtraExpensesTypeListComponent", () => {
  let component: ExtraExpensesTypeListComponent;
  let fixture: ComponentFixture<ExtraExpensesTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtraExpensesTypeListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraExpensesTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
