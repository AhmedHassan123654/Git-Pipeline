import { Component, OnInit, ViewChild } from "@angular/core";
import { Chart, LineSeries, DateTime, Legend, Tooltip } from "@syncfusion/ej2-charts";
import { LanguageSerService } from "../../daily-stock/daily-stock-imports";
import { POSDashboardService } from "src/app/core/Services/Transactions/posdashboard.service";
import { CommonService } from "../../branch/branchimport";
import { SaleReportModel } from "src/app/core/Models/Reporting/sale-report-model";
import { DashboardService } from "src/app/core/Services/Transactions/dashboard.service";
import { SalesReportService } from "src/app/core/Services/Reporting/sales-report.service";
import { TranslateService } from "@ngx-translate/core";

Chart.Inject(LineSeries, DateTime, Legend, Tooltip);
@Component({
  selector: "app-posdash-board",
  templateUrl: "./posdash-board.component.html",
  styleUrls: ["./posdash-board.component.scss"]
})
export class POSDashBoardComponent implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  data: any = {};

  responseObj: SaleReportModel = new SaleReportModel();
  primaryXAxis = {
    valueType: "Category"
  };

  legendSettings = {
    visible: true
  };
  marker = {
    dataLabel: {
      visible: true
    }
  };
  tooltip = {
    enable: true
  };
  ChartList: any = [];
  fraction: string = ".2-2";

  //#endregion
  constructor(
    public DashboardService: POSDashboardService,
    public common: CommonService,
    public dashboardService: DashboardService,

    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private salesReportService: SalesReportService
  ) {
    this.initializeobjects();
    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";
    this.defaultIm = "assets/images/v10.jpg";
  }

  // getAllUsers(){
  //   this.dashboardService.getAllUsersInfo().subscribe(
  //     (res) => {
  //       this.UserList = res as any;
  //       this.UserFlds = { text: "UserName", value: "AppUserId" };
  //     }
  //   );
  // }

  initializeobjects(): void {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  usersList: [] = [];
  userList: [] = [];
  ngOnInit() {
    // this.getAllUsers()
    this.getAllUserInfo();
    this.firstOpenDashBoard(this.responseObj);

    DateList: [] = [];
    // this.salesReportService.GetDateDataReport(this.responseobj).subscribe((res) => {
    //   this.requestStarted = true;
    //   this.DateList = res as any;

    // });
  }

  firstOpenDashBoard(resObject: any) {
    try {
      this.requestStarted = true;
      this.DashboardService.FirstOpen(resObject).subscribe({
        next: (res) => {
          this.data = res as any;
          this.requestStarted = false;
          this.ChartList = this.data.ChartList;
          if (this.ChartList != undefined)
            this.title = this.translate.instant("Shared.SalesPerMonth") + this.data.MonthName;
        }
      });
    } catch (error) {
      this.requestStarted = false;
    }
  }

  getAllUserInfo() {
    this.dashboardService.getUsersLoockUp().subscribe({
      next: (res) => {
        this.usersList = res as any;
        this.userFlds = { text: "UserName", value: "AppUserId" };
      }
    });
  }

  //showTotalSales(){
  //  if(this.responseObj.FromDate && this.responseObj.ToDate){
  //   return true;
  //  }else{
  //  return false;
  //}
  //  }
}
