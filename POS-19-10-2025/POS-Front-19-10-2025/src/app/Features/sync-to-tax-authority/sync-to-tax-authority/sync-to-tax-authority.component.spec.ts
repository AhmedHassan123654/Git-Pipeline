import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SyncToTaxAuthorityComponent } from "./sync-to-tax-authority.component";

describe("SyncToTaxAuthorityComponent", () => {
  let component: SyncToTaxAuthorityComponent;
  let fixture: ComponentFixture<SyncToTaxAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyncToTaxAuthorityComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncToTaxAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
