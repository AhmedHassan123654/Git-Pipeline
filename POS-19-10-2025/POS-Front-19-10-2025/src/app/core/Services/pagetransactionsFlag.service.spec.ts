/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { PagetransactionsFlagService } from "./pagetransactionsFlag.service";

describe("Service: PagetransactionsFlag", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PagetransactionsFlagService]
    });
  });

  it("should ...", inject([PagetransactionsFlagService], (service: PagetransactionsFlagService) => {
    expect(service).toBeTruthy();
  }));
});
