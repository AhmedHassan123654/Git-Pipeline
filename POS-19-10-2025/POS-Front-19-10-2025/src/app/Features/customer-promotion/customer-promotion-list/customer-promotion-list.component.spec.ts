import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerPromotionListComponent } from "./customer-promotion-list.component";

describe("CustomerPromotionListComponent", () => {
  let component: CustomerPromotionListComponent;
  let fixture: ComponentFixture<CustomerPromotionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerPromotionListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPromotionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
