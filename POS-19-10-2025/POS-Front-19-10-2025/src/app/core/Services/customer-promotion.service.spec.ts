import { TestBed } from "@angular/core/testing";

import { CustomerPromotionService } from "./customer-promotion.service";

describe("CustomerPromotionService", () => {
  let service: CustomerPromotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerPromotionService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
