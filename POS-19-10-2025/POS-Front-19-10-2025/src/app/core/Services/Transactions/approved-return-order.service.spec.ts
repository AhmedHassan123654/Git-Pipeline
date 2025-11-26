import { TestBed } from "@angular/core/testing";

import { ApprovedReturnOrderService } from "./approved-return-order.service";

describe("ApprovedReturnOrderService", () => {
  let service: ApprovedReturnOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprovedReturnOrderService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
