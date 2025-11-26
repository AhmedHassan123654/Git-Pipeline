import { TestBed } from "@angular/core/testing";

import { ExtraExpensesTypeService } from "./extra-expenses-type.service";

describe("ExtraExpensesTypeService", () => {
  let service: ExtraExpensesTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtraExpensesTypeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
