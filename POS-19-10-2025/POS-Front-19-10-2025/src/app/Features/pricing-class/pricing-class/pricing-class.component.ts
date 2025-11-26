import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../pricing-classes-import";

@Component({
  selector: "app-pricing-class",
  templateUrl: "./pricing-class.component.html",
  styleUrls: ["./pricing-class.component.scss"]
})
export class PricingClassComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  customClass = "customClass";
  isFirstOpen = true;

  //#endregion
  constructor(
    public PricingClassesSer: imp.PricingClassesService,
    private router: imp.Router,
    public toastr: imp.ToastrService,
    public toastrMessage: imp.HandlingBackMessages,
    private languageSerService: LanguageSerService,
    public translate: TranslateService
  ) {
    super();
    this.initializeobjects();
  }
  //#region Angular Life Cycle
  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {});
  }
  //#endregion
  //#region PricingClasses Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.PricingClassesSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion

  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:

        break;
      case imp.quickAction.afterAdd:
        break;
      case imp.quickAction.beforeAdd:

        break;
      case imp.quickAction.afterModify:
        break;
    }
  }
  //#endregion

  //#region Pagger

  afterPag(event: any): void {
    this.formPaging({ formObj: event });
  }
  MyAfterNew() {
  }

  beforedd() {
  }
}
