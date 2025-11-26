import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerPromotionComponent } from "./customer-promotion.component";

describe("CustomerPromotionComponent", () => {
  let component: CustomerPromotionComponent;
  let fixture: ComponentFixture<CustomerPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerPromotionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
