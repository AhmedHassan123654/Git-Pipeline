import { Component, OnInit, ViewChild } from "@angular/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import * as imp from "../../insuranceimports";

@Component({
  selector: "app-insurance",
  templateUrl: "./insurance.component.html",
  styleUrls: ["./insurance.component.scss"]
})
export class InsuranceComponent extends imp.general implements imp.OnInit {
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  constructor(
    public insuranceSer: imp.InsuranceService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private router: imp.Router
  ) {
    super();
    this.initializeobjects();
  }

  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
    });
  }
  initializeobjects(): void {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.responseobj = {};
    this.service = this.insuranceSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
  }
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({});
        this.responseobj.screenPermission.Print = false;
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        this.responseobj.screenPermission.Print = false;
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        this.responseobj.screenPermission.Print = false;
        break;
      case imp.quickAction.beforeAdd:
        if (
          this.responseobj != undefined &&
          (this.responseobj.IsStopped == null || this.responseobj.IsStopped == undefined)
        ) {
          this.responseobj.IsStopped = false;
        }
        break;
    }
  }
}
