import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
declare var Stimulsoft: any;
declare var $: any;
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent, QueryCellInfoEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import { general, FollowCallCenterOrderService, LanguageSerService, OrderService, SettingService, HandlingBackMessages, ClickEventArgs, OrderModel } from "../follow-call-center-order-imports";
@Component({
  selector: "app-call-center-orders-list",
  templateUrl: "./call-center-orders-list.component.html",
  styleUrls: ["./call-center-orders-list.component.scss"]
})
export class CallCenterOrdersListComponent extends general implements OnInit, OnDestroy {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public orderDateFormat: any = { type: "date", format: "dd.MM.yyyy" };
  public DateFormat: any = { type: "dateTime", format: "hh:mm a" };
  @ViewChild("grid") grid: GridComponent;
  oading: boolean = true;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  //#endregion
  //#region Constructor
  constructor(
    public FollowCallCenterOrderSer: FollowCallCenterOrderService,
    public router: Router,
    public toastr: ToastrService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private orderSer: OrderService,
    private SettingSer: SettingService,
    public toastrMessage: HandlingBackMessages
  ) {
    super();
    this.initializeobjects();
  }
  //#endregion
  //#region CashReceipt Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.responseobj.Date = new Date();
    this.Properties = {};
    this.service = this.FollowCallCenterOrderSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === "Grid_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.grid.pdfExport();
    }
    if (args.item.id === "Grid_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.grid.excelExport();
    }
  }
  //#endregion
  ngOnInit(): void {
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
    this.initializeGrid();
    this.GetSettings();
    this.GetCustomers();
    this.GetFollowOrderSetting();
    this.interv = setInterval(() => {
      this.GetOrders();
    }, 30 * 1000);
  }
  ngOnDestroy() {
    this.clearAllIntervals();
  }
  GetCustomers() {
    this.FollowCallCenterOrderSer.GetAllCustomers().subscribe((res) => {
      this.CustomerList = res as any;
      this.CustomerFlds = { text: "Name", value: "DocumentId" };
    });
  }
  GetOrders() {
    this.FollowCallCenterOrderSer.GetAllCallCenterOrders(this.responseobj).subscribe((res) => {
      this.Orders = res as OrderModel[];
      this.Orders.forEach((item) => {
        item.IsSelected = false;
      });
    });
  }
  GetFollowOrderSetting() {
    this.showgrid = false;
    this.FollowCallCenterOrderSer.GetFollowOrderSetting().subscribe((res) => {
      this.Properties = res as any;
      this.showgrid = true;
    });
  }
  SaveFollowOrderSetting() {
    this.FollowCallCenterOrderSer.SaveFollowOrderSetting(this.Properties).subscribe((res) => {
      if (res == 1) {
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
        $("#modal-101").modal("hide");
        this.GetFollowOrderSetting();
      }
    });
  }
  public onRowSelected(args: any): void {
    let queryData: any;
    if (args.data) queryData = args.data.valueOf();
    else queryData = args;
    if (queryData.IsSelected == false) {
      this.Orders.forEach((item) => {
        if (item.DocumentId == queryData.DocumentId) {
          item.IsSelected = true;
        }
      });
      this.grid.refresh();
    } else {
      this.Orders.forEach((item) => {
        if (item.DocumentId == queryData.DocumentId) {
          item.IsSelected = false;
        }
      });
      this.grid.refresh();
    }
  }
  initializeGrid() {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["Search", "PdfExport", "ExcelExport"];
    this.editOptions = {
      showDeleteConfirmDialog: true,
      allowEditing: true,
      allowDeleting: true
    };
    this.selectOptions = { persistSelection: true };
    this.filterOptions = {
      type: "Menu"
    };
  }
  customiseCell(args: QueryCellInfoEventArgs) {
    if (args.column.field === "Freight") {
      if (args.data[args.column.field] < 30) {
        args.cell.classList.add("below-30");
      } else if (args.data[args.column.field] < 80) {
        args.cell.classList.add("below-80");
      } else {
        args.cell.classList.add("above-80");
      }
    }
  }
  PrintPerview(data: any) {
    let order = this.getReportTranslationObj(data);

    this.orderSer.PrintOrderWithDataSet({ Order: order, IsA4: false }).subscribe(
      (data: any) => {
        //  var report = new Stimulsoft.Report.StiReport();
        this.reprtresult = data?.report;
        this.report.loadDocument(this.reprtresult);
        // Render report
        this.report.renderAsync();

        // Create an HTML settings instance. You can change export settings.
        var settings = new Stimulsoft.Report.Export.StiHtmlExportSettings();
        // Create an HTML service instance.
        var service = new Stimulsoft.Report.Export.StiHtmlExportService();
        // Create a text writer objects.
        var textWriter = new Stimulsoft.System.IO.TextWriter();
        var htmlTextWriter = new Stimulsoft.Report.Export.StiHtmlTextWriter(textWriter);
        // Export HTML using text writer.
        service.exportTo(this.report, htmlTextWriter, settings);
        //  var contents =(<HTMLInputElement>document.getElementById("FrameDIv")).innerHTML;
        var frame1 = document.createElement("iframe");
        frame1.name = "frame1";
        frame1.style.position = "absolute";
        frame1.style.top = "-1000000px";
        document.body.appendChild(frame1);
        var frameDoc =
          (<HTMLIFrameElement>frame1).contentDocument || (<HTMLIFrameElement>frame1).contentWindow.document;
        frameDoc.open();
        frameDoc.write("</head><body>");
        frameDoc.write(textWriter.getStringBuilder().toString());
        frameDoc.write("</body></html>");
        frameDoc.close();
        setTimeout(function () {
          window.frames["frame1"].focus();
          window.frames["frame1"].print();
          document.body.removeChild(frame1);
        }, 500);
        return false;
      },
      (err) => {
        //  this.toastr.error(this.ToastrMsgTranslate("ToastrMsg.UnExpError"),this.PageName);
      }
    );
  }
  getReportTranslationObj(orderobj: OrderModel) {
    let lang1, lang2;
    if (this.settingobj.CustomerReceiptReportLanguage1 > 0)
      lang1 = this.getJsonLang(this.settingobj.CustomerReceiptReportLanguage1);
    if (this.settingobj.CustomerReceiptReportLanguage2 > 0)
      lang2 = this.getJsonLang(this.settingobj.CustomerReceiptReportLanguage2);
    let keys = Object.keys(ar["Reports"]);
    let finalLang = this.clone(ar["Reports"]);

    keys.forEach((key) => {
      if (lang1) finalLang[key] = lang1[key];
      if (lang2) finalLang[key] += "\n" + lang2[key];
    });
    let Direction = "en";
    // Change to Left to Right Because default report is rigth to left
    if (this.settingobj.ReportDirection == 2) Direction = "ar";
    let LanguageOptions = {
      CurrentUserLang: Direction,
      ReportsJson: finalLang
    };
    orderobj.LanguageOptions = LanguageOptions;
    return orderobj;
  }
  getJsonLang(lang) {
    switch (lang) {
      case 1:
        this.reportsJson = en["Reports"];
        break;
      case 2:
        this.reportsJson = ar["Reports"];
        break;
      case 3:
        this.reportsJson = tr["Reports"];
        break;
      case 4:
        this.reportsJson = fr["Reports"];
        break;
      default:
        this.reportsJson = en["Reports"];
        break;
    }
    return this.reportsJson;
  }
  GetSettings() {
    this.SettingSer.GetSettings().subscribe((res) => {
      this.settingobj = res as any;
    });
  }
}
