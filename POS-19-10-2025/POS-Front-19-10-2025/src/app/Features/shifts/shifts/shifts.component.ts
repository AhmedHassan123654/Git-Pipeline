import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../shift-imports";
@Component({
  selector: "app-shifts",
  templateUrl: "./shifts.component.html",
  styleUrls: ["./shifts.component.css"]
})
export class ShiftsComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  @ViewChild("grid") grid: imp.GridComponent;
  @ViewChild("grid2") grid2: imp.GridComponent;
  public gridFlage: boolean = true;

  //#endregion
  public toolbarTemplate: any;
  constructor(
    public shiftSer: imp.ShiftsService,
    public dashboardSer: imp.DashboardService,
    public toastr: imp.ToastrService,
    public toastrMessage: imp.HandlingBackMessages,
    public translate: TranslateService,
    private languageSerService: LanguageSerService,
    private router: imp.Router
  ) {
    super();
    this.initializeobjects();
  }

  ngOnInit() {
    this.initializeGrid();
    if (this.request.PageNumber != null) {
      this.scrFirstOpen().subscribe(() => {
        this.gridFlage = false;
        if (this.responseobj.WorkTimeDays != null || this.responseobj.WorkTimeDays != undefined) {
          this.WorkTimeDays = [];
          this.WorkTimeDays = this.responseobj.WorkTimeDays.slice();
        }
        this.getAllUsers();
      });
    } else {
      this.scrFirstOpen().subscribe(() => {
        if (this.responseobj.WorkTimeDays != null || this.responseobj.WorkTimeDays != undefined) {
          this.WorkTimeDays = [];
          this.WorkTimeDays = this.responseobj.WorkTimeDays.slice();
        }
        this.getAllUsers();
      });
    }
  }

  //#region CashReceipt Methods
  initializeobjects(): void {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.responseobj = {};
    this.Getdataobj = {};
    this.service = this.shiftSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
  }
  //#endregion
  getAllUsers() {
    this.dashboardSer.getAllUsersInfo().subscribe((res) => {

      this.CashierList = res as imp.WorkTimeCachierModel;
      if (this.responseobj.WorkTimeCachiers != undefined || this.responseobj.WorkTimeCachiers != null) {
        this.responseobj.WorkTimeCachiers.forEach((item) => {
          this.CashierList.forEach((item2) => {
            if (item.AppUserId == item2.AppUserId) {
              item2.IsSelected = true;
            }
          });
        });
      }
      //  this.cashierFlds = { text: "UserName", value: "AppUserId" };
    });
  }
  //#region Pagger
  afterPag(event: unknown): void {
    this.responseobj = event;
    this.WorkTimeDays = [];
    this.WorkTimeDays = this.responseobj.WorkTimeDays.slice();
    this.CashierList.forEach((item) => {
      item.IsSelected = false;
    });
    if (this.responseobj.WorkTimeCachiers != undefined || this.responseobj.WorkTimeCachiers != null) {
      this.responseobj.WorkTimeCachiers.forEach((item) => {
        this.CashierList.forEach((item2) => {
          if (item.AppUserId == item2.AppUserId) {
            item2.IsSelected = true;
          }
        });
      });
    }
    this.grid2.refresh();
  }
  //#endregion

  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
        this.AfterMyNew();

        break;
      case imp.quickAction.beforeAdd:
        this.MybeforSave();
        break;
      case imp.quickAction.afterAdd:
        this.gridFlage = true;
        break;

      case imp.quickAction.beforeUpdate:
        this.MybeforSave();
        break;
      case imp.quickAction.afterUpdate:
        this.gridFlage = true;
        break;
      case imp.quickAction.afterModify:
        this.gridFlage = false;
        break;
      case imp.quickAction.afterUndo:
        this.gridFlage = true;
        break;
    }
  }
  //#endregion
  AfterMyNew() {
    this.gridFlage = false;
    this.CashierList.forEach((item) => {
      item.IsSelected = true;
    });
    this.grid2.refresh();

    for (const name in this.frmRef.controls) {
      this.WorkTimeDays.forEach((item, index) => {
        item.IsDayActive = true;
        this.itemwithindex = "IsDayActive" + index;
        if (name == this.itemwithindex) this.frmRef.controls[name].setValue(true);
      });
    }
  }

  MybeforSave() {
    //  let Exist = this.CashierList.filter(x=>x.IsSelected ==true)[0];
    //  if(!Exist){
    //   this.toastr.warning(this.toastrMessage.GlobalMessages(23));
    //   return false;
    //  }
    this.responseobj.WorkTimeCachiers = [];
    this.responseobj.WorkTimeDays = [];
    this.responseobj.WorkTimeDays = this.WorkTimeDays;
    this.CashierList.forEach((item) => {
      if (item.IsSelected == true) {
        item.Id = 0;
        this.responseobj.WorkTimeCachiers.push(item);
      }
    });
  }
  initializeGrid() {
    this.pageSettings = { pageCount: 10 };
    this.filterOptions = {
      type: "Menu"
    };
  }
  public onRowSelected(args): void {
    if (this.gridFlage == true) {
      return;
    }
    let queryData;
    if (args.data) queryData = args.data.valueOf();
    else queryData = args;

    if (queryData.IsSelected == false) {
      this.CashierList.forEach((item) => {
        if (item.AppUserId == queryData.AppUserId) {
          item.IsSelected = true;
        }
      });
    } else {
      this.CashierList.forEach((item) => {
        if (item.AppUserId == queryData.AppUserId) {
          item.IsSelected = false;
        }
      });
    }
    this.grid2.refresh();
  }
  GetTimeValue() {
    this.WorkTimeDays.forEach((item) => {
      item.FromTime = this.Getdataobj.FromTime;
      item.ToTime = this.Getdataobj.ToTime;
    });
  }
}
