import { TestBed } from "@angular/core/testing";

import { StopProductsService } from "./stop-products.service";

describe("StopProductsService", () => {
  let service: StopProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StopProductsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
