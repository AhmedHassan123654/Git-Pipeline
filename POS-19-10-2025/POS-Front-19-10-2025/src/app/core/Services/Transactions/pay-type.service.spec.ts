import { TestBed } from "@angular/core/testing";

import { PayTypeService } from "./pay-type.service";

describe("PayTypeService", () => {
  let service: PayTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayTypeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
