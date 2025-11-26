import { Component, ViewChild } from "@angular/core";
import Swal from "sweetalert2";
import * as imp from "../return-order-imports";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
import { SettingService } from "../../user/userimport";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-returnorderlist",
  templateUrl: "./returnorderlist.component.html",
  styleUrls: ["./returnorderlist.component.css"]
})
export class ReturnorderlistComponent extends imp.GeneralGrid implements imp.OnInit {
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: imp.GridComponent;
  //#endregion

  constructor(
    private returnOrderService: imp.ReturnOrderService,
    public toster: imp.ToastrService,
    public messages: imp.HandlingBackMessages,
    public Rout: imp.Router,
    private dashboardSer: imp.DashboardService,
    public SettingSer: imp.SettingService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService
  ) {
    super(toster, messages, SettingSer, Rout);
    this.initializeobjects();
    this.getAllUsers();
  }
  //#region Angular Life Cycle

  ngOnInit() {
    this.SettingSer.GetSettings().subscribe((data: SettingModel) => {
      this.settings = data;
    });
    this.GetGrideList().subscribe(() => {
      this.responseobj.List as imp.ReturnOrderModel;
      this.responseobj.List.forEach((item) => {
        this.Cashierlist.forEach((item2) => {
          if (item.CashierId == item2.AppUserId) {
            item.CashierName = item2.UserName;
          }
        });
      });
      ////////////////////////////////////////////////
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
      /*  if(this.showEdit)
   this.toolbarList.push({ text: '', tooltipText: 'Edit', prefixIcon: 'e-edit', id: "Edit" }); */
      if (this.showDelete && this.settings && this.settings.CountryType != 2)
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
  //#region Customer Methods
  initializeobjects(): void {
    this.responseobj = [];
    this.service = this.returnOrderService;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/returnorder";
    this.languageSerService.currentLang.subscribe((lan) => this.translate.use(lan));
  }
  getAllUsers() {
    this.dashboardSer.getAllUsersInfo().subscribe(
      (res) => {
        this.Cashierlist = [];
        this.Cashierlist = res as any;
      },
      (res) => {
      }
    );
  }

  //#endregion
}
