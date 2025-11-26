import { TestBed } from "@angular/core/testing";

import { FollowOrdersService } from "./follow-orders.service";

describe("FollowOrdersService", () => {
  let service: FollowOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowOrdersService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
