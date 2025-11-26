import { Component, ViewChild, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { general, LanguageSerService, quickAction, RegionService } from "../region-imports";

@Component({
  selector: "app-region",
  templateUrl: "./region.component.html",
  styleUrls: ["./region.component.scss"]
})
export class RegionComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  //#endregion

  constructor(
    public _RegionService: RegionService,
    public languageSerService: LanguageSerService,
    public translate: TranslateService,
    public router: Router
  ) {
    super();
    this.initializeobjects();
  }

  ngOnInit() {
    this.scrFirstOpen().subscribe((res) => {
      this.responseobj.screenPermission.Print = false;
    });
  }
  //#region OperationMenu
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.afterNew({});
        break;
      case quickAction.beforeAdd:

        break;
      case quickAction.afterAdd:
        this.afterAdd();
        break;
    }
  }
  //#endregion
  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  //#endregion

  initializeobjects(): void {
    this.responseobj = {};
    this.service = this._RegionService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
}
