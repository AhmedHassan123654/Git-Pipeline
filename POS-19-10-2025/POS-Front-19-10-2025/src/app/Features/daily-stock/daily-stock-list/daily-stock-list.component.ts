import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import { GeneralGrid, DailyStockService, HandlingBackMessages, SettingService, LanguageSerService } from "../daily-stock-imports";
@Component({
  selector: "app-daily-stock-list",
  templateUrl: "./daily-stock-list.component.html",
  styleUrls: ["./daily-stock-list.component.scss"]
})
export class DailyStockListComponent extends GeneralGrid implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("Grid", { static: false }) grid: GridComponent;
  //#endregion

  //#region Constructor
  constructor(
    public dailyStockService: DailyStockService,
    public toster: ToastrService,
    public messages: HandlingBackMessages,
    public SettingSer: SettingService,
    public Rout: Router,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    super(toster, messages, SettingSer, Rout);
    this.initializeobjects();
  }
  //#endregion
  //#endregion
  //#region Angular Life Cycle
  ngOnInit() {
    this.GetGrideList().subscribe(() => {
      this.toolbarList = [];
      if (this.showNew)
        this.toolbarList.push({
          text: "",
          tooltipText: "Add",
          prefixIcon: "e-add",
          id: "Add"
        });
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
      setTimeout(() => {
        this.DisabledGridButton();
      }, 300);
    });
    this.initializeGrid();
  }

  //#endregion
  //#region Customer Methods
  initializeobjects(): void {
    this.responseobj = [];
    this.service = this.dailyStockService;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/dailystock";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  //#endregion
}
