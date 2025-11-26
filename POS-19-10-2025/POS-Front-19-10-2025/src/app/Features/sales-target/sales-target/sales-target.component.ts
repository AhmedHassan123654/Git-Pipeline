import { Component, ViewChild, OnInit } from "@angular/core";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import {
  general,
  SalesTargetService,
  SettingService,
  LanguageSerService,
  SettingModel,
  quickAction
} from "../sales-target-imports";
declare var Stimulsoft: any;
declare let $: any;

@Component({
  selector: "app-sales-target",
  templateUrl: "./sales-target.component.html",
  styleUrls: ["./sales-target.component.scss"]
})
export class SalesTargetComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  oading: boolean = true;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  //#endregion
  //#region Constructor
  constructor(
    public salestargetSer: SalesTargetService,
    public router: Router,
    public toastr: ToastrService,
    public settingService: SettingService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    super();
    this.initializeobjects();
  }
  //#endregion

  ngOnInit(): void {

    this.scrFirstOpen().subscribe(() => {
      this.Products = this.responseobj.Products;
      this.Flds = { text: "Name", value: "DocumentId" };
      if (this.request.currentAction == "Add") {
        this.responseobj.Date = new Date();
      }
      if (this.request.currentAction == "Edit") {
        this.disableflage = false;
      }
    });
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));

    this.translate.use(this.language);
  }
  //#endregion

  //#region SalesTarget Methods

  initializeobjects(): void {
    this.disableflage = true;
    this.responseobj = {};
    this.settings = {};
    this.printDetailobj = {};
    this.service = this.salestargetSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.settingService.GetSettings().subscribe((data: SettingModel) => {
      this.settings = data;
      if (this.settings && this.settings.SystemMainLanguage > 0)
        this.printDetailobj.LanguageId = this.settings.SystemMainLanguage;
      else this.printDetailobj.LanguageId = 2;
    });

    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion

  //#region OperationMenu
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.afterNew({ dateFields: ["Date"] }).subscribe(() => {
          this.responseobj.SalesTargetDetails = [];
          this.responseobj.SalesTargetDetails.push({});
          this.disableflage = false;
          //  let x = this.responsedata;
          //Empty
        });
        break;
      case quickAction.beforeAdd:
        if (this.responseobj.SalesTargetDetails != undefined) {
          this.responseobj.SalesTargetDetails.forEach((item) => {
            item.ProductName = this.Products.filter((i) => i.DocumentId == item.ProductDocumentId)[0].Name;
          });
        }
        break;
      case quickAction.beforeUpdate:
        if (this.responseobj.SalesTargetDetails != undefined) {
          this.responseobj.SalesTargetDetails.forEach((item) => {
            item.ProductName = this.Products.filter((i) => i.DocumentId == item.ProductDocumentId)[0].Name;
          });
        }
        break;
      case quickAction.afterAdd:
        this.disableflage = true;
        this.afterAdd();
        this.PrintAfterAdd();
        break;
      case quickAction.afterModify:
        this.afterModify();
        this.disableflage = false;
        break;
      case quickAction.afterUpdate:
        this.disableflage = false;
        break;
    }
  }
  //#endregion

  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  //#endregion
  AddRow() {
    this.responseobj.SalesTargetDetails.push({});
  }
  DeleteRow(index) {
    if (index !== -1) {
      this.responseobj.SalesTargetDetails.splice(index, 1);
    }
  }
  PrintAfterAdd() {
    this.model = [];
    if (this.printDetailobj.LanguageId == 1) {
      this.model.push("");
      this.myjson = en["Reports"];
      this.model.push(this.myjson);
      this.model.push("ar");
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.model.push("");
      this.myjson = ar["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.model.push("");
      this.myjson = tr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.model.push("");
      this.myjson = fr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    this.model.push(this.printDetailobj.PrintModelId);
    this.model.push(this.printDetailobj.DestinationId);
    this.model.push(this.printDetailobj.FileFormatId);

    if (this.printDetailobj.DestinationId == 2) {
      this.model.push(this.printDetailobj.Reciever);
      this.model.push(this.printDetailobj.Title);
      this.model.push(this.printDetailobj.Message);
      this.ifPerview = false;
    } else {
      this.ifPerview = true;
    }

    this.salestargetSer.printAfterAdd(this.model).subscribe((data: Response) => {

      this.loading = false;
      this.report.loadDocument(data);
      this.viewer.report = this.report;
      this.viewer.renderHtml("myviewer");
      $("#modal-5").modal("show");
    });
    this.ifPerview = false;

    return false;
  }
}
