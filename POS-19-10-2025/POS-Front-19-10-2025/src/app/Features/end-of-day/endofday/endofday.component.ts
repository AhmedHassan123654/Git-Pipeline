import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  GridModel,
  GridComponent,
  DetailRowService,
  ExcelExportService,
  ToolbarService,
  dataBound
} from "@syncfusion/ej2-angular-grids";
import { EndOfDayService } from "src/app/core/Services/Transactions/end-of-day.service";
import { SaleReportModel } from "src/app/core/Models/Reporting/sale-report-model";
import { DashboardService } from "src/app/core/Services/Transactions/dashboard.service";
import { ClickEventArgs, Router, SettingService } from "src/app/shared/Imports/featureimports";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import * as localForage from "localforage";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
import { DatePipe, formatDate } from "@angular/common";
import { TabsetComponent } from "ngx-bootstrap/tabs";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import {
  IAccTooltipRenderEventArgs,
  IPointRenderEventArgs,
  ITextRenderEventArgs
} from "@syncfusion/ej2-angular-charts";
import { key } from "localforage";
import { saveAs } from "file-saver";
//import { browser } from 'protractor';

declare let Stimulsoft: any;
interface ITab {
  title: string;
  content: any;
  removable: boolean;
  disabled: boolean;
  active?: boolean;
  customClass?: string;
}

declare let $: any;
@Component({
  selector: "app-endofday",

  templateUrl: "./endofday.component.html",
  styleUrls: ["./endofday.component.css"],
  providers: [DetailRowService, ExcelExportService, ToolbarService]
})
export class EndofdayComponent implements OnInit {
  // @ViewChild('cardInfo') cardInfo: ElementRef;
  [key: string]: any;
  // currentUserLanguage: string;
  EmailObj: any = {};
  priceFormat = { format: 'n2' };
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  responseobj: SaleReportModel = new SaleReportModel();
  public languages: any[] = [
    { Id: 1, Name: "English" },
    { Id: 2, Name: "Arabic" },
    { Id: 3, Name: "Turkish" },
    { Id: 4, Name: "French" }
  ];
  public printModels: any[] = [];
  public destinations: any[] = [
    { Id: 1, Name: "Preview" },
    { Id: 2, Name: "Email" }
  ];
  public fileFormats: any[] = [{ Id: 1, Name: "PDF" }];
  public showprint: boolean = false;
  public printflag: number;
  public child1: GridModel;
  public child2: GridModel;
  public child3: GridModel;
  public child4: GridModel;
  @ViewChild("ProductGroup") ProductGroupGrid: GridComponent;
  @ViewChild("Users") UsersGrid: GridComponent;
  @ViewChild("OrderType") OrderTypeGrid: GridComponent;
  @ViewChild("OrderPayType") OrderPayTypeGrid: GridComponent;
  @ViewChild("OrderPointOfSale") OrderPointOfSaleGrid: GridComponent;
  @ViewChild("Orders") OrdersGrid: GridComponent;
  @ViewChild("Shift") ShiftGrid: GridComponent;
  @ViewChild("CanceledOrdersGrid") CanceledOrdersGrid: GridComponent;
  @ViewChild("DeletedOrderSGrid") DeletedOrdersGrid: GridComponent;
  @ViewChild("ReturnOrderGrid") ReturnOrderGrid: GridComponent;
  @ViewChild("ProductItemsGrid") ProductItemsGrid: GridComponent;
  @ViewChild("SalesTargetGrid") SalesTargetGrid: GridComponent;
  messages: any[] = [];
  tabs: ITab[] = [];
  public primaryXAxis: Object;
  public chartData: Object[];
  public title: string;
  public primaryYAxis: Object;
  public marker: Object;
  constructor(
    private EndOfDayService: EndOfDayService,
    public translate: TranslateService,
    private languageSerService: LanguageSerService,
    private dashboardSer: DashboardService,
    private router: Router,
    public SettingSer: SettingService,
    public datepipe: DatePipe
  ) {
    this.printDetailobj = {};
    this.data = {};
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.priceLang = JSON.parse(localStorage.getItem('langs')) == 'fr'? 'fr-FR' : 'en-US'

    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    // this.currentUserLanguage = JSON.parse(localStorage.getItem("langs"))?.toLowerCase();

  }

  exportFirstReportToExcel() {
    try {
      const esc = (v: any) => (v === undefined || v === null ? '' : String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      const fmt = (v: any) => (typeof v === 'number' ? v : esc(v));

      const SEC_BG = '#cfe6c0'; // light green section headers (can tweak)
      const HL_BG = '#a8c9f3';  // highlight rows
      const ALT_BG = '#fafafa';

      const section = (title: string, rows: Array<[string, any]>) => {
        let h = `<table><tr><td class="sec" colspan="2">${esc(title)}</td></tr>`;
        rows.forEach((r, i) => {
          const alt = i % 2 === 1 ? ' class="alt"' : '';
          const strongLabels = [
            this.translate.instant('Reports.TotalPrice'),
            this.translate.instant('Reports.FinalSummary'),
            this.translate.instant('Reports.CashAmount'),
            this.translate.instant('Reports.VisaAmount'),
            this.translate.instant('Reports.CreditAmount')
          ];
          const isStrong = strongLabels.includes(r[0] as string);
          const rowCls = isStrong ? ' class="hl"' : (alt || '');
          const lblCls = isStrong ? ' class="lbl hl"' : ' class="lbl"';
          const valCls = isStrong ? ' class="val hl"' : ' class="val"';
          h += `<tr${rowCls}><td${valCls}>${fmt(r[1])}</td><td${lblCls}>${esc(r[0])}</td></tr>`;
        });
        h += `</table><br/>`;
        return h;
      };

      let body = '';

      if (this.OrderFlag) {
        const rows: Array<[string, any]> = [];
        rows.push([this.translate.instant('Shared.Value'), this.data?.OrderNetTotal]);
        rows.push([this.translate.instant('Shared.Discount'), -(this.data?.OrderDiscountAmount || 0)]);
        rows.push([this.translate.instant('Shared.Services'), this.data?.OrderServiceCharge]);
        rows.push([this.translate.instant('kds.delivery'), this.data?.OrderDeliveryPrice]);
        if (this.settings && this.settings.UseMinimumCharge && this.data?.OrderMinimumChargeDifferance){
          rows.push([this.translate.instant('kds.Minimumchargedifferance'), this.data?.OrderMinimumChargeDifferance]);
          // if (this.data?.minChargeTaxValue)
          //   rows.push([this.translate.instant('Reports.minChargeTaxValue'), this.data?.minChargeTaxValue]);
        }
        rows.push([this.translate.instant('products.Taxes'), this.data?.OrderTotalTaxAmount]);

        if (this.data?.RoundingFractions) rows.push([this.translate.instant('Reports.rounding'), this.data?.RoundingFractions]);
        rows.push([this.translate.instant('Reports.TotalPrice'), this.data?.OrderTotalPay]);
        (this.data?.OrdersPayTypeList || []).forEach((p: any) => rows.push([p?.payTypeName, p?.OrderAmount]));
        body += section(this.translate.instant('Screens.Orders'), rows);

        const rows2: Array<[string, any]> = [];
        rows2.push([this.translate.instant('Shared.Value'), this.data?.ReturnOrderNetTotal]);
        rows2.push([this.translate.instant('Shared.Discount'), -(this.data?.ReturnOrderDiscountAmount || 0)]);
        rows2.push([this.translate.instant('Shared.Services'), this.data?.ReturnOrderServiceCharge]);
        rows2.push([this.translate.instant('kds.delivery'), this.data?.ReturnOrderDeliveryPrice]);
        if (this.settings && this.settings.UseMinimumCharge && this.data?.ReturnOrderMinimumChargeDifferance){
          rows2.push([this.translate.instant('kds.Minimumchargedifferance'), this.data?.ReturnOrderMinimumChargeDifferance]);
          // if (this.data?.minChargeTaxValue)
          //   rows.push([this.translate.instant('Reports.minChargeTaxValue'), this.data?.minChargeTaxValue]);
        }
        rows2.push([this.translate.instant('products.Taxes'), this.data?.ReturnOrderTotalTaxAmount]);
        rows2.push([this.translate.instant('Reports.TotalPrice'), this.data?.ReturnOrderTotalPay]);
        (this.data?.ReturnPayTypeList || []).forEach((p: any) => rows2.push([p?.payTypeName, p?.ReturnOrderAmount]));
        body += section(this.translate.instant('Screens.ReturnOrders'), rows2);

      }

      if (this.OrderInsuranceFlag) {
        const rows: Array<[string, any]> = [];
        rows.push([this.translate.instant('Reports.TotalPrice'), this.data?.TotalInsurance]);
        (this.data?.InsurancePayTypeList || []).forEach((p: any) => rows.push([p?.payTypeName, p?.OrderAmount]));
        body += section(this.translate.instant('Reports.Insurance'), rows);

        const rows2: Array<[string, any]> = [];
        rows2.push([this.translate.instant('Reports.TotalPrice'), this.data?.TotalReturnInsurance]);
        (this.data?.RtInsurancePayTypeList || []).forEach((p: any) => rows2.push([p?.payTypeName, p?.ReturnOrderAmount]));
        body += section(this.translate.instant('Reports.ReturnInsurance'), rows2);
      }

      if (this.CashreceiptFlag) {
        const rows1: Array<[string, any]> = [];
        rows1.push([this.translate.instant('Reports.TotalPrice'), this.data?.CashreceiptAmounts]);
        (this.data?.CashreceiptPayTypeList || []).forEach((p: any) => rows1.push([p?.payTypeName, p?.OrderAmount]));
        body += section(this.translate.instant('Shared.recievefromcustomer'), rows1);
      }
      
      if (this.ExtraExpenseFlag) {
        const rows1: Array<[string, any]> = [];
        rows1.push([this.translate.instant('Reports.TotalPrice'), this.data?.ExtraExpenseAmounts]);
        (this.data?.ExtraExpensesPayTypeList || []).forEach((p: any) => {
          const name = p?.ExtraExpensesType ? `${p?.payTypeName} (${p?.ExtraExpensesType})` : p?.payTypeName;
          rows1.push([name, p?.ReturnOrderAmount]);
        });
        body += section(this.translate.instant('Reports.ExtraExpenseAmounts'), rows1);
      }
      if(this.data.Taxes?.length){
        body += `<table><tr><td class="sec" colspan="4">${esc(this.translate.instant('Reports.Taxes'))}</td></tr></table>`;
        body += `<table>
          <thead>
            <tr style="background-color: #cce0f6;text-align: center">
              <th>${esc(this.translate.instant('products.Taxes'))}</th>
              <th>${esc(this.translate.instant('Screens.Orders'))}</th>
              <th>${esc(this.translate.instant('Screens.ReturnOrders'))}</th>
              <th>${esc(this.translate.instant('Shared.Total'))}</th>
            </tr>
          </thead>
          <tbody>`;
        (this.data.Taxes || []).forEach((item: any) => {
          body += `<tr>
            <td class="text-center">${esc(item?.Name)}</td>
            <td class="text-center">${fmt(item?.OrderTaxValue)}</td>
            <td class="text-center">${fmt(item?.Returntaxvalue)}</td>
            <td class="text-center">${fmt(item?.Total)}</td>
          </tr>`;
        });
        body += `</tbody></table><br/>`;
      }

      const rows: Array<[string, any]> = [];
      rows.push([this.translate.instant('Reports.CashAmount'), this.data?.TotalCash]);
      rows.push([this.translate.instant('Reports.VisaAmount'), this.data?.TotalVisa]);
      rows.push([this.translate.instant('Reports.CreditAmount'), this.data?.TotalCreit]);
      if (this.data?.Tips) rows.push([this.translate.instant('Tips'), this.data?.Tips]);
      (this.data?.AllPayTypeTotals || []).forEach((p: any) => rows.push([p?.payTypeName, p?.TotalAmount]));
      body += section(this.translate.instant('Reports.FinalSummary'), rows);

      const html = `<!DOCTYPE html>
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"><title>End Of Day</title>
      <style>
        table{border-collapse:collapse;width:100%;margin:6px auto}
        td{border:1px solid #d0d0d0;padding:5px 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px}
        .sec{background:${SEC_BG};font-weight:700;text-align:center}
        .hl{background:${HL_BG};font-weight:800;font-size:15px;text-align:center}
        .alt{background:${ALT_BG}}
        .lbl{text-align:center;font-weight:500;width:55%}
        .val{text-align:center;width:45%}
        body{direction:${this.language === 'ar' ? 'rtl' : 'ltr'};text-align:center}
        @page { size: A4; margin: 12pt; }
      </style></head>
      <body>${body}</body></html>`;

      const rawDate = this.EmailObj?.Date || this.responseobj?.FromDate || '';
      const dateLabel = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;
      const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
      saveAs(blob, `EndOfDay-${dateLabel}.xls`);
    } catch (e) {
      console.error('Export to Excel failed', e);
    }
  }

  ngOnInit() {
    if (this.request.DocumentId == undefined) {
      this.router.navigateByUrl("/OpenDay");
    }
    //this.anyChert();
    $("#modal-5").modal("hide");
    this.fields = { text: "Name", value: "Id" };
    this.responseobj.OpenDayDocumentId = this.request.DocumentId;
    this.responseobj.FromDate = this.request.DayDate;
    this.responseobj.ToDate = this.request.DayDate;
    this.responseobj.FromTime = this.request.FromTime;
    this.responseobj.ToTime = this.request.ToTime;
    this.responseobj.DayName = this.request.DayName;
    this.responseobj.ShowReportWithoutStaffIncluded = this.request.ShowReportWithoutStaffIncluded;

    //this.printDetailobj.LanguageId = 2;
    this.GetSettings();
    this.printDetailobj.DestinationId = 1;
    this.getAllBranches();
    this.getAllUsers();
    this.ViewfirstReport = false;
    this.initializeGrid();
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
    this.options.toolbar.showSendEmailButton = true;
    if (this.request != undefined && this.request.DayDate != undefined) {
      this.request.DayDate = this.datepipe.transform(this.request.DayDate, "yyyy-MM-dd");
    }
    this.GetFinalReport();
  }
  initializeGrid(): void {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["ExcelExport"];
    this.filterOptions = {
      type: "Menu"
    };
  }
  getAllUsers() {
    this.dashboardSer.getAllUsersInfo().subscribe((res) => {
      this.UserList = res as any;
      this.UserFlds = { text: "UserName", value: "AppUserId" };
    });
  }

  getAllBranches() {
    this.EndOfDayService.GetAllBranches().subscribe((res) => {
      this.BranchList = res as any;
      this.BrancheFlds = { text: "Name", value: "DocumentId" };
    });
  }
  GetOrderday() {
    this.printflag = 50;
  }
  GetFinalReport() {
    this.requestStarted = true;
    this.PrintInReport = true;
    this.showprint = true;
    this.ViewfirstReport = true;
    this.printflag = 1;
    this.EndOfDayService.GetFinalReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.data = res as any;
      this.DayOrders = this.data.Orders;
      this.EmailObj = this.data.EmailObj;
      // Data About Oreders For Button Notifications
      this.closedOrderCount = this.data.closedOrderCount;
      this.NotclosedOrderCount = this.data.NotclosedOrderCount;
      this.DeletedOrderCount = this.data.DeletedOrderCount;
      this.CancelledProductsCount = this.data.CancelledProductsCount;
      //  show Or Hide OrderInsurance Section
      if ((this.data.OrderTotalPay != undefined && this.data.OrderTotalPay != 0)|| (this.data.ReturnOrderTotalPay != undefined && this.data.ReturnOrderTotalPay != 0)) {
        this.OrderFlag = true;
      }
      //  show Or Hide ReturnOrder Section
      // if (this.data.ReturnOrderTotalPay != undefined && this.data.ReturnOrderTotalPay != 0) {
      //   this.ReturnOrderFlag = true;
      // }
      //  show Or Hide OrderInsurance Section
      if ((this.data.TotalInsurance != undefined && this.data.TotalInsurance != 0) || (this.data.TotalReturnInsurance != undefined && this.data.TotalReturnInsurance != 0)) {
        this.OrderInsuranceFlag = true;
      }
      //  show Or Hide ReturnOrderInsurance Section
      // if (this.data.TotalReturnInsurance != undefined && this.data.TotalReturnInsurance != 0) {
      //   this.ReturnInsuranceFlag = true;
      // }
      //  show Or Hide Cashreceipt And ExtraExpense Section
      if (
        (this.data.CashreceiptAmounts != undefined && this.data.CashreceiptAmounts != 0)
      ) {
        this.CashreceiptFlag = true;
      }
      if (
        (this.data.ExtraExpenseAmounts != undefined && this.data.ExtraExpenseAmounts != 0)
      ) {
        this.ExtraExpenseFlag = true;
      }
      //  show Or Hide Taxes Section
      if (this.data.Taxes && this.data.Taxes.length) {
        this.TaxesFlag = true;
      }

      //    $('#modal-5').modal('show');
    });
  }
  takeScreenshot() {
    let content = document.getElementById("modal-5");
    let html = content?.innerHTML;
    this.EndOfDayService.sendmail({ Body: html }).subscribe((a) => {});
  }
  GetCanceledProductsReport() {
    this.requestStarted = true;
    this.EndOfDayService.GetCanceledProductsReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.printflag = 9;
      this.CanceledOrders = res as any;
    });
  }
  GetUsersReport() {
    this.requestStarted = true;
    this.EndOfDayService.GetUsersReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.UsersReport = res as any;

      this.dataUsersReport = this.UsersReport.UsersDataForGrid;
      this.UserChert();
      this.PrintInReport = false;
      this.showprint = true;
      this.ViewfirstReport = false;
      this.printflag = 2;
      this.child1 = {
        dataSource: this.UsersReport.SecondLevelList,
        queryString: "ClosingUserId",
        allowPaging: true,
        pageSettings: { pageSizes: true, pageSize: 8 },
        columns: [
          {
            field: "TransactionName",
            headerText: this.translate.instant("Reports.TransactionType")
          },
          {
            field: "numberofinvoices",
            headerText: this.translate.instant("Shared.numberofinvoices")
          },
          {
            field: "Total",
            headerText: this.translate.instant("Order.Net Total")
          },
          {
            field: "DiscountAmount",
            headerText: this.translate.instant("Shared.DiscountAmount")
          },
          {
            field: "ServiceChargeValue",
            headerText: this.translate.instant("Shared.ServiceChargeValue")
          },
          {
            field: "TotalTaxAmount",
            headerText: this.translate.instant("Reports.TotalTax")
          },
          {
            field: "DeliveryPrice",
            headerText: this.translate.instant("Shared.DeliveryPrice")
          },
          {
            field: "SubTotal",
            headerText: this.translate.instant("manageorder.SubTotal")
          }
        ],
        childGrid: {
          dataSource: this.UsersReport.ThirdLevelList,
          queryString: "ClosingUser",
          allowPaging: true,
          pageSettings: { pageSizes: true, pageSize: 8 },
          columns: [
            {
              field: "TransactionNumber",
              headerText: this.translate.instant("Reports.TransactionType")
            },
            {
              field: "NetTotal",
              headerText: this.translate.instant("Order.Net Total")
            },
            {
              field: "DiscountAmount",
              headerText: this.translate.instant("Shared.DiscountAmount")
            },
            {
              field: "ServiceChargeValue",
              headerText: this.translate.instant("Shared.ServiceChargeValue")
            },
            {
              field: "TotalTaxAmount",
              headerText: this.translate.instant("Reports.TotalTax")
            },
            {
              field: "DeliveryPrice",
              headerText: this.translate.instant("Shared.DeliveryPrice")
            },
            {
              field: "SubTotal",
              headerText: this.translate.instant("manageorder.SubTotal")
            }
          ]
        }
      };
      this.UsersGrid.refresh();
    });
  }
  GetGroupsReport() {
    this.requestStarted = true;
    this.EndOfDayService.GetGroupsReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.GroupsReport = res as any;
      this.PrintInReport = false;
      this.showprint = true;
      this.ViewfirstReport = false;
      this.printflag = 3;
      this.dataGroupsReport = this.GroupsReport.ProductGroupFinal;
      this.ProductGroupChert();
      this.child2 = {
        dataSource: this.GroupsReport.SecondLevelList,
        queryString: "ProductGroupDocumentId",
        allowPaging: true,
        pageSettings: { pageSizes: true, pageSize: 8 },
        columns: [
          {
            field: "ProductGroupTransactionName",
            headerText: this.translate.instant("Reports.TransactionType")
          },
          {
            field: "Total",
            headerText: this.translate.instant("Shared.Total")
          },
          {
            field: "DiscountAmount",
            headerText: this.translate.instant("Shared.DiscountAmount")
          },
          {
            field: "ServiceChargeValue",
            headerText: this.translate.instant("Shared.ServiceChargeValue")
          },
          {
            field: "TotalTaxAmount",
            headerText: this.translate.instant("Reports.TotalTax")
          },
          {
            field: "SubTotal",
            headerText: this.translate.instant("manageorder.SubTotal")
          }
        ],
        childGrid: {
          dataSource: this.GroupsReport.ThirdLevelList,
          queryString: "ProductFlag",
          allowPaging: true,
          pageSettings: { pageSizes: true, pageSize: 8 },
          columns: [
            {
              field: "ProductName",
              headerText: this.translate.instant("Shared.productName")
            },
            {
              field: "ProductPrice",
              headerText: this.translate.instant("Shared.ProductPrice")
            },
            {
              field: "ProductQuantity",
              headerText: this.translate.instant("Reports.Quantity")
            },
            {
              field: "TaxAmount",
              headerText: this.translate.instant("Reports.TotalTax")
            },
            {
              field: "DiscountAmount",
              headerText: this.translate.instant("Shared.DiscountAmount")
            },
            {
              field: "ServiceChargeValue",
              headerText: this.translate.instant("Shared.ServiceChargeValue")
            },
            {
              field: "Total",
              headerText: this.translate.instant("manageorder.SubTotal")
            }
          ]
        }
      };
      this.ProductGroupGrid.refresh();
    });
  }
  GetOrderTypeReport() {
    this.requestStarted = true;
    this.EndOfDayService.GetOrderTypeReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.OrderTypeReport = res as any;

      this.PrintInReport = false;
      this.showprint = true;
      this.ViewfirstReport = false;
      this.printflag = 5;
      this.dataOrderTypeReport = this.OrderTypeReport.Finallist;
      this.OrderTypeChert();
      this.child3 = {
        dataSource: this.OrderTypeReport.SecondLevelList,
        queryString: "OrderTypeId",
        allowPaging: true,
        pageSettings: { pageSizes: true, pageSize: 8 },
        columns: [
          {
            field: "TransactionName",
            headerText: this.translate.instant("Reports.TransactionType")
          },
          {
            field: "OrderTypeName",
            headerText: this.translate.instant("Shared.ordertype")
          },
          {
            field: "numberofinvoices",
            headerText: this.translate.instant("Shared.numberofinvoices")
          },
          {
            field: "ServiceChargeValue",
            headerText: this.translate.instant("Shared.ServiceChargeValue")
          },
          {
            field: "NetTotal",
            headerText: this.translate.instant("Order.Net Total")
          },
          {
            field: "DeliveryPrice",
            headerText: this.translate.instant("Shared.DeliveryPrice")
          },
          {
            field: "TotalTaxAmount",
            headerText: this.translate.instant("Reports.TotalTax")
          },
          {
            field: "DiscountAmount",
            headerText: this.translate.instant("Shared.DiscountAmount")
          },
          {
            field: "SubTotal",
            headerText: this.translate.instant("manageorder.SubTotal")
          }
        ],
        childGrid: {
          dataSource: this.OrderTypeReport.ThirdLevelList,
          queryString: "OrderType",
          allowPaging: true,
          pageSettings: { pageSizes: true, pageSize: 8 },
          columns: [
            {
              field: "TransactionNumber",
              headerText: this.translate.instant("Reports.TransactionType")
            },
            {
              field: "DiscountAmount",
              headerText: this.translate.instant("Shared.DiscountAmount")
            },
            {
              field: "NetTotal",
              headerText: this.translate.instant("Order.Net Total")
            },
            {
              field: "DeliveryPrice",
              headerText: this.translate.instant("Shared.DeliveryPrice")
            },
            {
              field: "TotalTaxAmount",
              headerText: this.translate.instant("Reports.TotalTax")
            },
            {
              field: "ServiceChargeValue",
              headerText: this.translate.instant("Shared.ServiceChargeValue")
            },
            {
              field: "SubTotal",
              headerText: this.translate.instant("manageorder.SubTotal")
            }
          ]
        }
      };
      this.OrderTypeGrid.refresh();
    });
  }

  GetReturnOrderReport() {
    this.requestStarted = true;
    this.EndOfDayService.GetReturnOrderReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.ReturnOrderReport = res as any;
      this.PrintInReport = false;
      this.showprint = true;
      this.ViewfirstReport = false;
      this.printflag = 6;
    });
  }

  GetOrderPayTypeReport() {
    this.requestStarted = true;
    this.EndOfDayService.GetOrderPayTypeReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.Report = res as any;
      this.PrintInReport = false;
      this.showprint = true;
      this.ViewfirstReport = false;
      this.printflag = 6;
      this.dataOrderPayTypeReport = this.Report.Finallist;
      this.PayTypeChert();
      this.OrderPayTypeGrid.refresh();
    });
  }
  GetOrderPointOfSaleReport() {
    this.requestStarted = true;
    this.EndOfDayService.GetOrderPointOfSaleReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.Report = res as any;
      this.PrintInReport = false;
      this.showprint = true;
      this.ViewfirstReport = false;
      this.printflag = 14;
      this.dataPointOfSaleReport = this.Report.Finallist;
      this.OrderPointOfSaleGrid?.refresh();
    });
  }

  GetProductItemsDataReport() {
    this.requestStarted = true;
    this.EndOfDayService.GetProductItemsDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.ProductItems = res as any;
      this.PrintInReport = false;
      this.showprint = true;
      this.ViewfirstReport = false;
      this.printflag = 10;
      //   this.OrderPayTypeGrid.refresh();
    });
  }
  GetSalesTargetDataReport() {
    this.requestStarted = true;
    this.EndOfDayService.GetSalesTargetDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.SalesTargetList = res as any;
      this.PrintInReport = false;
      this.showprint = true;
      this.ViewfirstReport = false;
      this.printflag = 11;
      //   this.OrderPayTypeGrid.refresh();
    });
  }

  GetNotClosedReport() {
    this.requestStarted = true;
    this.EndOfDayService.GetNotClosedReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.NotClosedList = res as any;
      this.PrintInReport = false;
      this.showprint = true;
      this.ViewfirstReport = false;
      this.printflag = 12;
      //   this.OrderPayTypeGrid.refresh();
    });
  }
  GetProductQuantityReport() {
    this.requestStarted = true;
    this.EndOfDayService.GetProductQuantityReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.ProductQuantityList = res as any;
      this.PrintInReport = false;
      this.showprint = true;
      this.ViewfirstReport = false;
      this.printflag = 13;
    });
  }
  toolbarClick2(args: ClickEventArgs): void {
    if (args.item.text === "Excel Export") {
      this.ProductGroupGrid.excelExport({ hierarchyExportMode: "All" });
    }
  }
  toolbarClick1(args: ClickEventArgs): void {
    if (args.item.text === "Excel Export") {
      this.UsersGrid.excelExport({ hierarchyExportMode: "All" });
    }
  }
  toolbarClick3(args: ClickEventArgs): void {
    if (args.item.text === "Excel Export") {
      this.OrderTypeGrid.excelExport({ hierarchyExportMode: "All" });
    }
  }
  toolbarClick4(args: ClickEventArgs): void {
    if (args.item.text === "Excel Export") {
      this.OrderPayTypeGrid.excelExport({ hierarchyExportMode: "All" });
    }
  }
  // message(s){
  //   this.messages.push(s);
  // }
  Print() {
    this.requestStarted = true;
    this.EndOfDayService.prepareReportLables(this.printDetailobj,this.responseobj , this.myjson);
    if (this.printflag == 1) {
      this.EndOfDayService.PrintFirst(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        if(!this.responseobj.ImmediatePrint){
          this.tabs.push({
            title: this.translate.instant("Shared.FinalReport"),
            content: data,
            disabled: false,
            removable: true,
            active: true
          });
        }
        this.responseobj.ImmediatePrint = false;
      },err=>{
        this.responseobj.ImmediatePrint = false;
        this.requestStarted = false;
      });
      this.takeScreenshot();
    }
    if (this.printflag == 2) {
      this.EndOfDayService.PrintUsersReport(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.tabs.push({
          title: this.translate.instant("Shared.accordingtotheuser"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      },err=>{
        this.responseobj.ImmediatePrint = false;
        this.requestStarted = false;
      });
    }
    if (this.printflag == 3) {

      this.EndOfDayService.PrintGroupsReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.requestStarted = false;
        this.tabs.push({
          title: this.translate.instant("Shared.accordingtothegroup"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      },err=>{
        this.responseobj.ImmediatePrint = false;
        this.requestStarted = false;
      });
    }
    if (this.printflag == 4) {
      this.responseobj.ProductGroupDocumentId = this.ProductGroupDocumentId;
      this.EndOfDayService.GetProductGroupPrint(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.tabs.push({
          title: this.translate.instant("Shared.accordingtothegroup"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      },err=>{
        this.responseobj.ImmediatePrint = false;
        this.requestStarted = false;
      });
    }
    if (this.printflag == 5) {
      this.EndOfDayService.PrintOrderType(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.tabs.push({
          title: this.translate.instant("Shared.accordingtoordertype"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      },err=>{
        this.responseobj.ImmediatePrint = false;
        this.requestStarted = false;
      });
    }
    if (this.printflag == 6) {
      this.EndOfDayService.PrintOrderPayType(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.tabs.push({
          title: this.translate.instant("Shared.accordingtopaytpe"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      },err=>{
        this.responseobj.ImmediatePrint = false;
        this.requestStarted = false;
      });
    }
    if (this.printflag == 7) {
      this.EndOfDayService.PrintShiftReport(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.tabs.push({
          title: this.translate.instant("Shared.Shifts"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      },err=>{
        this.responseobj.ImmediatePrint = false;
        this.requestStarted = false;
      });
    }
    if (this.printflag == 8) {
      this.EndOfDayService.PrintDeletedOrdersReport(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.tabs.push({
          title: this.translate.instant("Shared.DeletedOrder"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      },err=>{
        this.responseobj.ImmediatePrint = false;
        this.requestStarted = false;
      });
    }
    if (this.printflag == 9) {
      this.EndOfDayService.PrintCanceledProductsReport(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.tabs.push({
          title: this.translate.instant("Shared.CancelledProducts"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      },err=>{
        this.responseobj.ImmediatePrint = false;
        this.requestStarted = false;
      });
    }
    if (this.printflag == 10) {
      this.EndOfDayService.PrintProductItemsReport(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.tabs.push({
          title: this.translate.instant("Shared.ProductItems"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      },err=>{
        this.responseobj.ImmediatePrint = false;
        this.requestStarted = false;
      });
    }
    if (this.printflag == 11) {
      this.EndOfDayService.PrintSalesTargetReport(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.tabs.push({
          title: this.translate.instant("Shared.SalesTarget"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      },err=>{
        this.responseobj.ImmediatePrint = false;
        this.requestStarted = false;
      });
    }
    if (this.printflag == 12) {
      this.EndOfDayService.PrintNotClosedReport(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        this.tabs.push({
          title: this.translate.instant("Shared.NotClosed"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      },err=>{
        this.responseobj.ImmediatePrint = false;
        this.requestStarted = false;
      });
    }
    if (this.printflag == 13) {
      this.EndOfDayService.PrintProductQuantityReport(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        if(!this.responseobj.ImmediatePrint){
          this.tabs.push({
            title: this.translate.instant("Reports.productQuantityReport"),
            content: data,
            disabled: false,
            removable: true,
            active: true
          });
        }
        this.responseobj.ImmediatePrint = false;
      },err=>{
        this.requestStarted = false;
        this.responseobj.ImmediatePrint = false;
      });
    }
    if (this.printflag == 14) {
      this.EndOfDayService.PrintOrderPointOfSaleReport(this.responseobj).subscribe((data: Response) => {
        this.requestStarted = false;
        if(!this.responseobj.ImmediatePrint){
          this.tabs.push({
            title: this.translate.instant("Reports.FinalReportByPointOfSale"),
            content: data,
            disabled: false,
            removable: true,
            active: true
          });
        }
        this.responseobj.ImmediatePrint = false;
      },err=>{
        this.requestStarted = false;
        this.responseobj.ImmediatePrint = false;
      });
    }
    if (this.printflag == 50) {
      this.EndOfDayService.PrintOrdersReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.requestStarted = false;
        this.tabs.push({
          title: this.translate.instant("kds.orders"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
      },err=>{
        this.requestStarted = false;
        this.responseobj.ImmediatePrint = false;
      });
    }
    $("#modal-1").modal("hide");
  }
  removeTabHandler(tab: ITab): void {
    this.tabs.splice(this.tabs.indexOf(tab), 1);
    console.log("Remove Tab handler");
  }
  GetProdectGroupId(rowdata: any) {
    this.ProductGroupDocumentId = rowdata.ProductGroupDocumentId;
    this.printflag = 4;
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
    document.getElementById("viewer").dir = "ltr";
    /*    this.viewer.onEmailReport = function (args) {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
          if (this.readyState === 4) { // this.status
            if (this.responseText === 'OK') {
              alert("Message sent!");
            }
            else {
              alert(this.responseText);
            }
          }


      };
      xhr.open('POST', 'http://localhost:56740/api/SendReports/sendmail', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
              fileName: args.fileName,
              format: args.format,
              data: Stimulsoft.System.Convert.toBase64String(args.data),
              email: args.settings.email,
              subject: args.settings.subject,
              message: args.settings.message
            }));
          }; */
  }

  /*   this.viewer.onEmailReport = function (args) {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (this.readyState === 4) { // this.status
          if (this.responseText === 'OK') {
            alert("Message sent!");
          }
          else {
            alert(this.responseText);
          }
        }
      };

      xhr.open('POST', '/api/sendmail', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        fileName: args.fileName,
        format: args.format,
        data: Stimulsoft.System.Convert.toBase64String(args.data),
        email: args.settings.email,
        subject: args.settings.subject,
        message: args.settings.message
      }));
    }; */

  GetSettings() {
    this.SettingSer.GetSettings().subscribe((res) => {
      this.settings = res as SettingModel;
      this.printDetailobj.LanguageId = this.settings.SystemMainLanguage;
      this.priceFormat = { format: 'n' + this.settings?.Round };
      this.fraction = "." + this.settings.Round + "-" + this.settings.Round;

    });
  }

  GetShiftReport() {
    this.requestStarted = true;
    this.PrintInReport = false;
    this.showprint = true;
    this.ViewfirstReport = false;
    this.printflag = 7;
    if (this.printDetailobj.LanguageId == 1) {
      this.myjson = en["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.myjson = ar["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "ar";
    }

    if (this.printDetailobj.LanguageId == 3) {
      this.myjson = tr["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.myjson = fr["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
    }
    this.EndOfDayService.GetShiftReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.Shifts = res as any;
      this.shiftChert();
    });
  }
  GetDeletedOrderReport() {
    this.requestStarted = true;
    this.PrintInReport = false;
    this.showprint = true;
    this.ViewfirstReport = false;
    this.printflag = 8;
    /*  if(this.printDetailobj.LanguageId == 1){

            this.myjson = en['Reports'];
            this.responseobj.Labels=this.myjson;
            this.responseobj.CurrentLang='en';
          }
             if(this.printDetailobj.LanguageId == 2){
            this.myjson = ar['Reports'];
            this.responseobj.Labels=this.myjson;
            this.responseobj.CurrentLang='ar';
          }

          if(this.printDetailobj.LanguageId == 3){

            this.myjson = tr['Reports'];
            this.responseobj.Labels=this.myjson;
            this.responseobj.CurrentLang='en';
          }
          if(this.printDetailobj.LanguageId == 4){

            this.myjson = fr['Reports'];
            this.responseobj.Labels=this.myjson;
            this.responseobj.CurrentLang='en';
          } */
    this.EndOfDayService.GetDeletedOrders(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.DeletedOrders = res as any;
    });
  }
  public ProductGroupChert() {
    this.dataGroupsReport;
    this.legendSettingsproductGroup = {
      visible: false
    };

    let keys = Object.keys(this.dataGroupsReport[0]);
    this.xNameproductGroup = keys[1];
    this.yNameproductGroup = keys[5];
    this.mapproductGroup = "fill";
    this.ProductGroupdatalabel = {
      visible: true,
      name: "ProductGroupName",
      position: "Inside",
      connectorStyle: {
        //Length of the connector line in pixels
        length: "50px",
        //Width of the connector line in pixels
        width: 2,
        //dashArray of the connector line
        dashArray: "5,3",
        //Color of the connector line
        color: "#f4429e",
        //Specifies the type of the connector line either Line or Curve
        type: "Curve"
      }
    };
    this.tooltipproductGroup = {
      enable: true,
      shared: false,
      format: "${point.x} : ${point.y}"
    };
  }
  public UserChert() {
    this.dataUsersReport;
    this.legendSettingsUser = {
      visible: false
    };

    let keys = Object.keys(this.dataUsersReport[0]);
    this.xNameUser = keys[1];
    this.yNameUser = keys[6];
    this.mapUser = "fill";
    this.Userdatalabel = {
      visible: true,
      name: "CashierName",
      position: "Inside",
      connectorStyle: {
        //Length of the connector line in pixels
        length: "50px",
        //Width of the connector line in pixels
        width: 2,
        //dashArray of the connector line
        dashArray: "5,3",
        //Color of the connector line
        color: "#f4429e",
        //Specifies the type of the connector line either Line or Curve
        type: "Curve"
      }
    };
    this.tooltipUser = {
      enable: true,
      shared: false,
      format: "${point.x} : ${point.y}"
    };
  }
  public OrderTypeChert() {
    this.dataOrderTypeReport;
    this.legendSettingsOrderType = {
      visible: false
    };

    let keys = Object.keys(this.dataOrderTypeReport[0]);
    this.xNameOrderType = keys[1];
    this.yNameOrderType = keys[7];
    this.mapOrdertype = "fill";
    this.OrderTypedatalabel = {
      visible: true,
      name: "OrderTypeName",
      position: "Inside",
      connectorStyle: {
        //Length of the connector line in pixels
        length: "50px",
        //Width of the connector line in pixels
        width: 2,
        //dashArray of the connector line
        dashArray: "5,3",
        //Color of the connector line
        color: "#f4429e",
        //Specifies the type of the connector line either Line or Curve
        type: "Curve"
      }
    };
    this.tooltipOrdertype = {
      enable: true,
      shared: false,
      format: "${point.x} : ${point.y}"
    };
  }
  public PayTypeChert() {
    this.dataOrderPayTypeReport;
    this.legendSettingsPayType = {
      visible: false
    };

    let keys = Object.keys(this.dataOrderPayTypeReport[0]);
    this.xNamepayType = keys[1];
    this.yNamePayType = keys[7];
    this.mapPaytype = "fill";
    this.PayTypedatalabel = {
      visible: true,
      name: "payTypeName",
      position: "Inside",
      connectorStyle: {
        //Length of the connector line in pixels
        length: "50px",
        //Width of the connector line in pixels
        width: 2,
        //dashArray of the connector line
        dashArray: "5,3",
        //Color of the connector line
        color: "#f4429e",
        //Specifies the type of the connector line either Line or Curve
        type: "Curve"
      }
    };
    this.tooltipPaytype = {
      enable: true,
      shared: false,
      format: "${point.x} : ${point.y}"
    };
  }
  public shiftChert() {

    this.Shifts;
    let keys = Object.keys(this.Shifts[0]);
    this.yNameShift = keys[21];
    this.xNameShift = keys[1];
    this.marker = { dataLabel: { visible: true } };
    this.title = this.translate.instant("Shared.workshift");
    this.primaryXAxis = {
      title: "",
      valueType: "Category"
    };
    this.primaryYAxis = {
      title: this.translate.instant("Shared.DeficitOrIncreaseAmount")
    };
  }
  public pointRender(args: IPointRenderEventArgs): void {
    if (args.point.yValue < 0) {
      args.fill = "red";
    }
  }

  ShowReportWithoutStaffIncluded(event: any){
    debugger
    if(event == true){
      this.responseobj.ShowReportWithoutStaffIncluded = true;
    }
    else{
      this.responseobj.ShowReportWithoutStaffIncluded = false;
    }
    document.getElementById("pills-home-tab").click()
    this.GetFinalReport();
  }

  ImmediatePrint(){
    debugger
  this.responseobj.ImmediatePrint = true;
  this.Print();
  }
}

/*

//Set 'X' axis config object
    this.primaryXAxis = {
      title: this.chart.chartSettings?.titles['xTitle']
    };
    this.primaryXAxis.valueType = 'Category';
    //Set 'Y' axis config Object
    this.primaryYAxis = {
      title: Object.keys(this.chart.dataSource[0]).length <= 2 ? this.chart.chartSettings?.titles['y1Title'] : null
    };



           */
