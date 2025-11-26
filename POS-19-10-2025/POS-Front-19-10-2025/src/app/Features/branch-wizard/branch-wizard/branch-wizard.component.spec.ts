import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BranchWizardComponent } from "./branch-wizard.component";

describe("BranchWizardComponent", () => {
  let component: BranchWizardComponent;
  let fixture: ComponentFixture<BranchWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BranchWizardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
