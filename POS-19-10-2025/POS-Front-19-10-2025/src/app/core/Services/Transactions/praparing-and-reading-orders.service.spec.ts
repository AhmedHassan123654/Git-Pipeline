import { TestBed } from "@angular/core/testing";

import { PraparingAndReadingOrdersService } from "./praparing-and-reading-orders.service";

describe("PraparingAndReadingOrdersService", () => {
  let service: PraparingAndReadingOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PraparingAndReadingOrdersService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
