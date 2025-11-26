import { TestBed } from "@angular/core/testing";

import { StatisticallReportService } from "./statisticall-report.service";

describe("StatisticallReportService", () => {
  let service: StatisticallReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticallReportService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
