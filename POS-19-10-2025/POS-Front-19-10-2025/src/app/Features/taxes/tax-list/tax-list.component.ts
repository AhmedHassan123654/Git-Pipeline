import { Component, ViewChild } from "@angular/core";
import * as imp from "../taximports";

import Swal from "sweetalert2";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { SharedService } from "src/app/core/Services/Transactions/SharedService ";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";

@Component({
  selector: "app-tax-list",
  templateUrl: "./tax-list.component.html",
  styleUrls: ["./tax-list.component.scss"]
})
export class TaxListComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: imp.GridComponent;
  //#endregion
  constructor(
    public taxSer: imp.TaxService,
    public toster: imp.ToastrService,
    public messages: imp.HandlingBackMessages,
    public SettingSer: imp.SettingService,
    private _applayout: AppLayoutComponent,
    private _sharedService: SharedService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public Rout: imp.Router
  ) {
    super(toster, messages, SettingSer, Rout);
    this.initializeobjects();
  }
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
      /*  if(this.showPrint)
      this.toolbarList.push({ text: '', tooltipText: 'Print', prefixIcon: 'e-print', id: "Print" }); */
      this.toolbarOptions = this.toolbarList;
    });
    this.initializeGrid();
    setTimeout(() => {
      this.DisabledGridButton();
    }, 300);
  }
  //#endregion
  //#region productType Methods
  initializeobjects(): void {
    this.responseobj = [];
    this.service = this.taxSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/tax";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  assignTaxToProducts(event) {
    const rowData = this.grid.getRowInfo(event.target).rowData as unknown;
    this.router.navigateByUrl("/tax/assignTaxProducts", rowData);
  }

  //#endregion
}
