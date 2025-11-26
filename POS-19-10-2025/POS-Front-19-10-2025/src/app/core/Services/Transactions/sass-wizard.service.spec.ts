import { TestBed } from "@angular/core/testing";

import { SassWizardService } from "./sass-wizard.service";

describe("SassWizardService", () => {
  let service: SassWizardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SassWizardService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
