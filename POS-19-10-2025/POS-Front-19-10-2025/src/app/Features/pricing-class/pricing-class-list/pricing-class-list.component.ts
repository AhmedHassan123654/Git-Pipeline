import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { LocalstorgeService } from "src/app/localstorge.service";

import Swal from "sweetalert2";
import * as imp from "../pricing-classes-import";
@Component({
  selector: "app-pricing-class-list",
  templateUrl: "./pricing-class-list.component.html",
  styleUrls: ["./pricing-class-list.component.scss"]
})
export class PricingClassListComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: imp.GridComponent;
  //#endregion

  //#region Constructor
  constructor(
    public pricingClassestSer: imp.PricingClassesService,
    public Rout: imp.Router,
    public toast: imp.ToastrService,
    public messages: imp.HandlingBackMessages,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    private LocalstorgeService: LocalstorgeService,
    public SettingSer: imp.SettingService
  ) {
    super(toast, messages, SettingSer, Rout);
    this.initializeobjects();
  }
  ngOnInit(): void {
    // this.languageSerService.currentLang.subscribe(lan => this.translate.use(lan));

    //  this.translate.use(this.LocalstorgeService.get("langs"));
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
    });
    this.initializeGrid();
    setTimeout(() => {
      this.DisabledGridButton();
    }, 300);
  }

  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.pricingClassestSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/PricingClass";
    //  this.languageSerService.currentLang.subscribe(lan => this.translate.use(lan));
    this.translate.use(this.LocalstorgeService.get("langs"));
  }
  onResourceEditProductPricing(event: any) {

    const rowData = this.grid.getRowInfo(event.target).rowData as any;
    rowData.showEdit = this.showEdit;
    this.router.navigateByUrl("/PricingClass/ProductPricing", rowData);
  }
  //#endregion
}
