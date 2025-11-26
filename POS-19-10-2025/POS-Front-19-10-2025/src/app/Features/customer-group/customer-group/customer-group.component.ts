import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { general, CustomerGroupService, LanguageSerService, quickAction } from "../imports-customer-group";

@Component({
  selector: "app-customer-group",
  templateUrl: "./customer-group.component.html",
  styleUrls: ["./customer-group.component.scss"]
})
export class CustomerGroupComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  //#endregion
  constructor(
    public CustomerGroupSer: CustomerGroupService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private router: Router
  ) {
    super();
    this.initializeobjects();
  }

  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
    });
  }

  //#region driver Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.CustomerGroupSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  //#endregion

  //#region OperationMenu
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.afterNew({});
        this.responseobj.screenPermission.Print = false;
        break;

      case quickAction.afterAdd:
        this.afterAdd();
        break;
      case quickAction.afterModify:
        this.afterModify();
        break;
    }
  }
}
