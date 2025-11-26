import { Component, ViewChild } from "@angular/core";
import * as imp from "../servicechargeimports";

import Swal from "sweetalert2";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { SharedService } from "src/app/core/Services/Transactions/SharedService ";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-service-charge-list",
  templateUrl: "./service-charge-list.component.html",
  styleUrls: ["./service-charge-list.component.scss"]
})
export class ServiceChargeListComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: imp.GridComponent;
  //#endregion
  constructor(
    public serviceChargeSer: imp.ServiceChargeService,
    public toster: imp.ToastrService,
    public messages: imp.HandlingBackMessages,
    private _applayout: AppLayoutComponent,
    private _sharedService: SharedService,
    public SettingSer: imp.SettingService,
    public translate: TranslateService,
    private languageSerService: LanguageSerService,
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
    this.service = this.serviceChargeSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/serviceCharge";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  //#endregion
}
