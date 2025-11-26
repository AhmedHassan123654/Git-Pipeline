import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CompoDetailListComponent } from "./compo-detail-list.component";

describe("CompoDetailListComponent", () => {
  let component: CompoDetailListComponent;
  let fixture: ComponentFixture<CompoDetailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompoDetailListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
