import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import Swal from "sweetalert2";
import * as imp from "../integration-setting-import";
@Component({
  selector: "app-integration-list",
  templateUrl: "./integration-list.component.html",
  styleUrls: ["./integration-list.component.scss"]
})
export class IntegrationListComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: imp.GridComponent;
  //#endregion

  //#region Constructor
  constructor(
    public IntegrationSettingSer: imp.IntegrationSettingService,

    public toast: imp.ToastrService,
    public messages: imp.HandlingBackMessages,
    public SettingSer: imp.SettingService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    public Rout: imp.Router
  ) {
    super(toast, messages, SettingSer, Rout);
    this.initializeobjects();
  }

  ngOnInit(): void {
    this.GetGrideList().subscribe(() => {
      this.toolbarList = [];
      if (this.showNew) {
        this.toolbarList.push({
          text: "Add",
          tooltipText: "Add",
          prefixIcon: "e-add",
          id: "Add"
        });
      }
      if (this.showView)
        this.toolbarList.push({
          text: "",
          tooltipText: "View",
          prefixIcon: "e-view",
          id: "View"
        });
      if (this.showEdit)
        this.toolbarList.push({
          text: "",
          tooltipText: "Edit",
          prefixIcon: "e-edit",
          id: "Edit"
        });
      if (this.showDelete)
        this.toolbarList.push({
          text: "",
          tooltipText: "Delete",
          prefixIcon: "e-delete",
          id: "Delete"
        });
      if (this.showPrint)
        this.toolbarList.push({
          text: "",
          tooltipText: "Print",
          prefixIcon: "e-print",
          id: "Print"
        });
      this.toolbarOptions = this.toolbarList;
    });
    this.initializeGrid();
    setTimeout(() => {
      this.DisabledGridButton();
    }, 300);
  }
  //#region PricingClassList Methods

  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.IntegrationSettingSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/IntegrationSetting";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  onResourceEdit(event: any): void {
    const rowData = this.grid.getRowInfo(event.target).rowData as unknown;
    this.router.navigateByUrl("/IntegrationSetting", rowData);
  }

  onResourceEditIntegrationProducts(event: any, type: string = "IntegrationProducts") {
    const rowData = this.grid.getRowInfo(event.target).rowData as any;
    rowData.showEdit = this.showEdit;
    if (type == "IntegrationProducts") this.router.navigateByUrl("/IntegrationSetting/" + type, rowData);
    else this.router.navigateByUrl("/IntegrationSetting/IntegrationPayments", rowData);
  }
}
