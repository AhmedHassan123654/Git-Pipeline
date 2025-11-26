import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import {
  GeneralGrid,
  CustomerPromotionService,
  HandlingBackMessages,
  SettingService,
  LanguageSerService
} from "../imports-customer-promotion";
import { Router } from "@angular/router";
@Component({
  selector: "app-customer-promotion-list",
  templateUrl: "./customer-promotion-list.component.html",
  styleUrls: ["./customer-promotion-list.component.scss"]
})
export class CustomerPromotionListComponent extends GeneralGrid implements OnInit {
  //#region Declartions
  public href: string = "";
  [key: string]: any;
  @ViewChild("Grid", { static: false }) grid: GridComponent;
  //#endregion

  //#region Constructor
  constructor(
    public PromoSer: CustomerPromotionService,
    public toast: ToastrService,
    public messages: HandlingBackMessages,
    public SettingSer: SettingService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public Router: Router,
    private route: ActivatedRoute
  ) {
    super(toast, messages, SettingSer, Router);
    this.initializeobjects();
  }
  //#endregion

  //#region Angular Life Cycle
  ngOnInit(): void {
    // this.currentroutes = this.Router.url.split("/").slice(1);
    // console.log(this.router.url.split("/"));
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
      // if(this.showPrint)
      // this.toolbarList.push({ text: '', tooltipText: 'Print', prefixIcon: 'e-print', id: "Print" });
      this.toolbarOptions = this.toolbarList;
    });
    this.initializeGrid();
    setTimeout(() => {
      this.DisabledGridButton();
    }, 300);
  }

  //#endregion

  //#region CashReceiptList Methods

  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.PromoSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/CustomerPromotion";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
}
