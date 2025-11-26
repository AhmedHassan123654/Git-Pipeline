import { TestBed } from "@angular/core/testing";

import { POSDashboardService } from "./posdashboard.service";

describe("POSDashboardService", () => {
  let service: POSDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(POSDashboardService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
