import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SaleReportModel } from "src/app/core/Models/Reporting/sale-report-model";
import { FollowOrdersService } from "src/app/core/Services/order/follow-orders.service";
import { DashboardService } from "src/app/core/Services/Transactions/dashboard.service";
import { StatisticallReportService } from "src/app/core/Services/Transactions/statisticall-report.service";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { HandlingBackMessages, Router, SettingService, ToastrService } from "src/app/shared/Imports/featureimports";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { formatDate } from "@angular/common";
import { ChartComponent } from "@syncfusion/ej2-angular-charts";
declare let $: any;
declare var Stimulsoft: any;
interface ITab {
  title: string;
  content: any;
  removable: boolean;
  disabled: boolean;
  active?: boolean;
  customClass?: string;
}

@Component({
  selector: "app-statistical-reports",
  templateUrl: "./statistical-reports.component.html",
  styleUrls: ["./statistical-reports.component.scss"]
})
export class StatisticalReportsComponent implements OnInit {
  [key: string]: any;
  tabs: ITab[] = [];
  responseobj: SaleReportModel = new SaleReportModel();
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  @ViewChild("Hourchart")
  public Hourchart: ChartComponent;
  @ViewChild("Monthchart")
  public Monthchart: ChartComponent;
  @ViewChild("Productchart")
  public Productchart: ChartComponent;
  constructor(
    public statisticallReportSer: StatisticallReportService,
    public translate: TranslateService,
    public dashboardSer: DashboardService,
    public followOrdersService: FollowOrdersService,
    private languageSerService: LanguageSerService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    public SettingSer: SettingService,
    public router: Router
  ) {
    this.initializeobjects();
  }
public languages: any[] = [
    { Id: 1, Name: "English" },
    { Id: 2, Name: "Arabic" },
    { Id: 3, Name: "Turkish" },
    { Id: 4, Name: "French" }
  ];
  ngOnInit(): void {
    this.GetSettings();
    this.printDetailobj.DestinationId = 1;
    this.fields = { text: "Name", value: "Id" };
    this.GetData();
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
    this.responseobj.Year = new Date().getFullYear();
  }
  GetData() {
    this.getAllUsers();
    this.GetAllOrderTypes();
    this.GetAllPaymentTypes();
    this.getAllBranches();
    this.GetAllPOS();
    this.GetAllTables();
    this.GetYearsList();
  }
  initializeobjects() {
    this.printDetailobj = {};
    this.languageSerService.currentLang.subscribe((lan) => this.translate.use(lan));
    //  $('#modal-1').modal('hide');
    // this.translate.use(this.language);
  }
  getAllUsers() {
    this.statisticallReportSer.getAllUsersInfo().subscribe(
      (res) => {
        this.UserList = res as any;
        this.UserFlds = { text: "UserName", value: "AppUserId" };
      },
      (res) => {}
    );
  }
  getAllBranches() {
    this.statisticallReportSer.GetAllBranches().subscribe(
      (res) => {
        this.BranchList = res as any;
        this.BrancheFlds = { text: "Name", value: "DocumentId" };
      },
      (res) => {}
    );
  }
  GetAllTables() {
    this.statisticallReportSer.GetAllTables().subscribe(
      (res) => {
        this.TableList = res as any;
        this.TableFlds = { text: "Name", value: "DocumentId" };
      },
      (res) => {}
    );
  }
  GetYearsList() {
    this.statisticallReportSer.GetYearsList().subscribe(
      (res) => {
        this.YearList = res as any;
      },
      (res) => {}
    );
  }
  GetAllPOS() {
    this.statisticallReportSer.GetAllPOS().subscribe(
      (res) => {
        this.POSList = res as any;
        this.POSFlds = { text: "Name", value: "DocumentId" };
      },
      (res) => {}
    );
  }
  GetAllOrderTypes() {
    this.statisticallReportSer.GetAllOrderTypes().subscribe(
      (res) => {
        this.OrderTypeList = res as any;
        this.OrderTypeFlds = { text: "Name", value: "DocumentId" };
      },
      (res) => {}
    );
  }

  GetAllPaymentTypes() {
    this.statisticallReportSer.GetAllPaymentTypes().subscribe(
      (res) => {
        this.PaymentTypeList = res as any;
        this.PaymentTypeFlds = { text: "Name", value: "DocumentId" };
      },
      (res) => {}
    );
  }
  GetSettings() {
    this.SettingSer.GetSettings().subscribe((res) => {
      this.settings = res as SettingModel;
      this.printDetailobj.LanguageId = this.settings.SystemMainLanguage;
    });
  }

  GetHourStatisticalReport() {
    this.printflag = 1;
    this.Print();
  }
  GetMonthStatisticalReport() {
    this.printflag = 2;
    this.Print();
  }
  GetHourProductsStatisticalReport() {
    this.printflag = 3;
    this.Print();
  }
  GetOrderAndReturnOrderStatisticalReport() {
    this.printflag = 4;
    this.Print();
  }
  Print() {
    $("#modal-4").modal("hide");
    const format = "dd/MM/yyyy";
    const locale = "en-US";
    let fromdata: string = "";
    let ToDate: string = "";
    let fromtime: string = "";
    let Totime: string = "";
    let Year: string = "";
    if (this.responseobj != undefined && this.responseobj.FromDate != undefined) {
      fromdata = formatDate(this.responseobj.FromDate, format, locale);
    }
    if (this.responseobj != undefined && this.responseobj.ToDate != undefined) {
      ToDate = formatDate(this.responseobj.ToDate, format, locale);
    }
    if (this.responseobj != undefined && this.responseobj.FromTime != undefined) {
      fromtime = this.responseobj.FromTime.toString();
    }
    if (this.responseobj != undefined && this.responseobj.ToTime != undefined) {
      Totime = this.responseobj.ToTime.toString();
    }
    if (this.responseobj != undefined && this.responseobj.Year != undefined) {
      Year = this.responseobj.Year.toString();
    }

    let UsersName: any = "";
    if (
      this.responseobj.UsersList != undefined &&
      this.responseobj.UsersList != null &&
      this.responseobj.UsersList.length > 0
    ) {
      this.responseobj.UsersList.forEach((item) => {
        UsersName += this.UserList.filter((x) => x.AppUserId == item)[0].UserName;
        let breakname = ",";
        UsersName = UsersName + breakname;
      });
    }
    let BranchName: any = "";
    if (
      this.responseobj.BranchDocumentIdList != undefined &&
      this.responseobj.BranchDocumentIdList != null &&
      this.responseobj.BranchDocumentIdList.length > 0
    ) {
      this.responseobj.BranchDocumentIdList.forEach((item) => {
        BranchName += this.BranchList.filter((x) => x.DocumentId == item)[0].Name;
        let breakname = ",";
        BranchName = BranchName + breakname;
      });
    }
    if (this.printDetailobj.LanguageId == 1) {
      this.myjson = en["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
      this.responseobj.ReportOptions =
        this.responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        this.responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        this.responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        this.responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        this.responseobj.Labels["Users"] +
        ":" +
        UsersName +
        "\n" +
        this.responseobj.Labels["BranchName"] +
        ":" +
        BranchName +
        "\n" +
        this.responseobj.Labels["Year"] +
        ":" +
        Year;
    }

    if (this.printDetailobj.LanguageId == 2) {
      this.myjson = ar["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "ar";
      this.responseobj.ReportOptions =
        fromdata +
        ":" +
        this.responseobj.Labels["Fromdate"] +
        "\n" +
        ToDate +
        ":" +
        this.responseobj.Labels["Todate"] +
        "\n" +
        fromtime +
        ":" +
        this.responseobj.Labels["FromTime"] +
        "\n" +
        Totime +
        ":" +
        this.responseobj.Labels["ToTime"] +
        "\n" +
        UsersName +
        ":" +
        this.responseobj.Labels["Users"] +
        "\n" +
        this.responseobj.Labels["BranchName"] +
        ":" +
        BranchName +
        "\n" +
        this.responseobj.Labels["Year"] +
        ":" +
        Year;
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.myjson = tr["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
      this.responseobj.ReportOptions =
        this.responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        this.responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        this.responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        this.responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        this.responseobj.Labels["Users"] +
        ":" +
        UsersName +
        "\n" +
        this.responseobj.Labels["BranchName"] +
        ":" +
        BranchName +
        "\n" +
        this.responseobj.Labels["Year"] +
        ":" +
        Year;
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.myjson = fr["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
      this.responseobj.ReportOptions =
        this.responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        this.responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        this.responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        this.responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        this.responseobj.Labels["Users"] +
        ":" +
        UsersName +
        "\n" +
        this.responseobj.Labels["BranchName"] +
        ":" +
        BranchName +
        "\n" +
        this.responseobj.Labels["Year"] +
        ":" +
        Year;
    }
    if (this.printflag == 1) {
      this.requestStarted = true;
      this.statisticallReportSer.GetHourStatisticalReport(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.ShowChartbtn = true;
        this.Reportdata = data;

        this.tabs.push({
          title: this.translate.instant("Reports.Totalsalesreportbyhours"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 2) {
      this.requestStarted = true;
      this.ShowChartbtn = true;
      this.statisticallReportSer.GetMonthStatisticalReport(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.Reportdata = data;

        this.tabs.push({
          title: this.translate.instant("Reports.Totalsalesreportbymonths"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 3) {
      this.requestStarted = true;
      this.ShowChartbtn = true;
      this.statisticallReportSer.GetHourProductsStatisticalReport(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.Reportdata = data;

        this.tabs.push({
          title: this.translate.instant("Reports.Totalmealsperhourreport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 4) {
      this.requestStarted = true;
      this.ShowChartbtn = false;
      this.statisticallReportSer
        .GetOrderAndReturnOrderStatisticalReport(this.responseobj)
        .subscribe((data: Response) => {
          this.requestStarted = false;
          this.Reportdata = data;

          this.tabs.push({
            title: this.translate.instant("Reports.OrdersReports"),
            content: data,
            disabled: false,
            removable: true,
            active: true
          });
        });
    }
    //  $('#modal-1').modal('hide');
  }
  ShowChart() {
    if (this.printflag == 1) {
      $("#modal-1").modal("show");
      this.statisticallReportSer.GetHourStatisticalChart(this.responseobj).subscribe((data: Response) => {
        this.chartHourList = data;
        this.HourChartXAxis = {
          valueType: "Category",
          title: "Hours"
        };
        this.title = "Sales For Hours";
      });
    }
    if (this.printflag == 2) {
      $("#modal-2").modal("show");

      this.statisticallReportSer.GetMonthStatisticalChart(this.responseobj).subscribe((data: Response) => {
        this.chartMonthList = data;
        this.MonthChartXAxis = {
          valueType: "Category",
          title: "Monthes"
        };
        this.title = "Sales For Monthes";
      });
    }
    if (this.printflag == 3) {
      $("#modal-3").modal("show");

      this.statisticallReportSer.GetHourProductsStatisticalChart(this.responseobj).subscribe((data: Response) => {
        this.chartProductList = data;
        this.ProductChartXAxis = {
          valueType: "Category",
          title: "Products"
        };
        this.title = "Sales For Products";
      });
    }
  }
  printchartMonth() {
    this.Monthchart.print();
  }
  printchartHour() {
    this.Hourchart.print();
  }
  printchartProduct() {
    this.Productchart.print();
  }

  selectTab(tabz: any) {
    tabz.active = true;
    let container = document.getElementById("container");
    let newReport = document.createElement("div");
    newReport.id = "viewer";
    container.appendChild(newReport);
    this.report.loadDocument(tabz.content);
    this.viewer.report = this.report;
    this.viewer.renderHtml("viewer");
  }
  selectLang(){
    $("#modal-4").modal("show");
  }
}
