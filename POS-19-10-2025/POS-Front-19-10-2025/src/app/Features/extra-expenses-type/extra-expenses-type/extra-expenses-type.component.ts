import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { general, ExtraExpensesTypeService, LanguageSerService, quickAction } from "../imports-extra-expenses-type";

@Component({
  selector: "app-extra-expenses-type",
  templateUrl: "./extra-expenses-type.component.html",
  styleUrls: ["./extra-expenses-type.component.scss"]
})
export class ExtraExpensesTypeComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public Flds = { text: "Name", value: "Id" };
  //#endregion
  //#region Constructor
  constructor(
    public ExtraExpensesTypeSer: ExtraExpensesTypeService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private router: Router,
    public toastr: ToastrService
  ) {
    super();
    this.initializeobjects();
  }
  //#endregion

  //#region ExtraExpensesType Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.ExtraExpensesTypeSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion
  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
      this.ExtraExpensesTypeDetailList = [
        { Id: 1, Name: this.translate.instant("Shared.General") },
        { Id: 2, Name: this.translate.instant("Shared.Employee") }
      ];
    });
  }

  //#region OperationMenu
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        break;
      case quickAction.afterAdd:
        this.afterAdd();
        break;
      case quickAction.afterModify:
        this.afterModify();
        break;
    }
  }
  //#endregion
  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  //#endregion
}
