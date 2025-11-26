import { Component, HostListener, OnInit ,ViewChild } from "@angular/core";
import { TaxAuthorityService } from "src/app/core/Services/ManageOrders/TaxAuthorityService";
import { SalesReportService } from "src/app/core/Services/Reporting/sales-report.service";
import Swal from "sweetalert2";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import {
  ClickEventArgs,
  HandlingBackMessages,
  LanguageSerService,
  Router,
  SettingService,
  ToastrService,
  TranslateService
} from "../../adminstration/permission-imports";
import { GridComponent, OrderModel } from "../../return-order/return-order-imports";
import { deepCopy, setStimulsoftKey } from "src/app/core/Helper/objectHelper";
import { OrderService } from "../../follow-call-center-order/follow-call-center-order-imports";
declare var Stimulsoft: any;

@Component({
  selector: "app-sync-to-tax-authority",
  templateUrl: "./sync-to-tax-authority.component.html",
  styleUrls: ["./sync-to-tax-authority.component.scss"]
})
export class SyncToTaxAuthorityComponent implements OnInit {
  [key: string]: any;
  responseobj: any = {
    FromDate : new Date(),
    ToDate : new Date(),
    BranchDocumentIds: [],
    Status : 2
  };
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  fraction: string = "." + 2 + "-" + 2;  
  @ViewChild("gird") grid: GridComponent;
  constructor(
    private salesReportService: SalesReportService,
    private taxAuthorityService: TaxAuthorityService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages,
    public SettingSer: SettingService,
    public orderSer: OrderService,
  ) {
    this.initializeobjects();
    setStimulsoftKey(Stimulsoft);
  }
  initializeobjects(): void {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["Search", "ExcelExport"];
    this.editOptions = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: "Normal"
    };
    this.filterOptions = {
      type: "Menu"
    };
    this.StatusList = [{Id:1 , Name: this.translate.instant('tax.Synced')},
      {Id:2 , Name: this.translate.instant('tax.NotSynced')}];
    this.flds = { text: "Name", value: "Id" };

    this.GetSettings();
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
  toolbarClickOrders(args: ClickEventArgs): void {
    if (args.item.id === "Order_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.grid.pdfExport();
    }
    if (args.item.id === "Order_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.grid.excelExport();
    }
  }
  // Summary properties
  selectedOrdersSummary = {
    totalAmount: 0,
    totalTax: 0,
    ordersCount: 0
  };

  // Update summary when selection changes
  private updateSummary(): void {
    if (!this.Orders) {
      this.selectedOrdersSummary = { totalAmount: 0, totalTax: 0, ordersCount: 0 };
      return;
    }

    const selectedOrders = this.Orders.filter(order => order.IsSelected);
    this.selectedOrdersSummary = {
      totalAmount: selectedOrders.reduce((sum, order) => sum + (order.SubTotal || 0), 0),
      totalTax: selectedOrders.reduce((sum, order) => sum + (order.TotalTaxAmount || 0), 0),
      ordersCount: selectedOrders.length
    };
  }

  public ChangeAllSelections(args: any): void {
    if (this.gridFlag) return;

    if (args.isInteracted && args.data) {
      if (args.name == "rowDeselecting") {
        if (args.data.length)
          args.data.forEach((d) => {
            if (d) d.IsSelected = false;
          });
        else if (args.data.length == undefined) args.data.IsSelected = false;
      } else if (args.name == "rowSelecting") {
        if (args.data.length)
          args.data.forEach((d) => {
            if (d) d.IsSelected = true;
          });
        else if (args.data.length == undefined) args.data.IsSelected = true;
      }
      this.updateSummary();
    }
  }
  ngOnInit(): void {
    this.getAllBranches();
    this.FirstOpen();
    // this.GetNonSyncedTaxOrders();
  }
  FirstOpen() {
    this.taxAuthorityService.FirstOpen().subscribe(
      (res) => {
        const result = res as any;
        this.UserList = result.usersInfo;
        this.orderTypes = result.orderTypes;
        this.UserFlds = { text: "UserName", value: "AppUserId" };
        this.orderTypesFlds = { text: "Name", value: "DocumentId" };
        this.updateSummary();
      }
    );
  }
  getAllBranches() {
    this.salesReportService.GetAllBranches().subscribe((res) => {
      this.BranchList = res as any;
      this.BrancheFlds = { text: "Name", value: "DocumentId" };
      this.StatusList = [{Id:1 , Name: this.translate.instant('tax.Synced')},
        {Id:2 , Name: this.translate.instant('tax.NotSynced')}];
    });
  }
  GetNonSyncedTaxOrders() {
    this.requestStarted = true;

    this.taxAuthorityService.GetNonSyncedTaxOrders(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.Orders = res as any;
      this.RTOrders = undefined;
      this.updateSummary();
    },err=>{
      this.requestStarted = false;
    });
  }
  GetNonSyncedTaxRTOrders() {
    this.requestStarted = true;

    this.taxAuthorityService.GetNonSyncedTaxRTOrders(this.responseobj).subscribe((res) => {
      this.requestStarted = false;

      this.RTOrders = res as any;
      this.Orders = undefined;
      this.updateSummary();
    },err=>{
      this.requestStarted = false;
    });
  }
  SyncOrdersToTaxAuthority() {
    if (this.Orders) {
      let OrdersIds = this.Orders.filter((x) => x.IsSelected).map((x) => x.DocumentId);
      if (OrdersIds && OrdersIds.length) {
        this.requestStarted = true;

        this.taxAuthorityService.SyncOrdersToTaxAuthority(OrdersIds).subscribe((res: any) => {
          this.requestStarted = false;

          if (res == true) this.toastr.success(this.toastrMessage.GlobalMessages(1));
          else this.toastr.error(res);

          this.GetNonSyncedTaxOrders();
        },err=>{
          this.requestStarted = false;
        });
      }
    } else if (this.RTOrders) {
      let RTOrdersIds = this.RTOrders.filter((x) => x.IsSelected).map((x) => x.DocumentId);
      if (RTOrdersIds && RTOrdersIds.length) {
        this.requestStarted = true;

        this.taxAuthorityService.SyncRTOrdersToTaxAuthority(RTOrdersIds).subscribe((res: any) => {
          this.requestStarted = false;
          if (res == true) this.toastr.success(this.toastrMessage.GlobalMessages(1));
          else this.toastr.error(res);

          this.GetNonSyncedTaxRTOrders();
        },err=>{
          this.requestStarted = false;
        });
      }
    }
  }
  updateSubmissionStatues() {
    this.requestStarted = true;
    this.taxAuthorityService.updateSubmissionStatues(this.responseobj).subscribe((res) => {
      this.Orders = res as any;
      this.RTOrders = undefined;
      this.requestStarted = false;
    },err=>{
      this.requestStarted = false;
    });
  }

  @HostListener("document:keyup", ["$event"])
  handleKeyboardUpEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key == "F3")
      this.deleteOrdersWarning();
    
  }
  deleteOrdersWarning() {
    if(!this.settingobj || !this.settingobj.DeleteOrderAfterSynced || !this.Orders || !this.Orders.find((x) => x.IsSelected) ) return;
    Swal.fire({
      title: this.translate.instant("messages.Warning") + "!",
      text: this.translate.instant("messages.DeleteSelectedOrders"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("Shared.No"),
      confirmButtonText: this.translate.instant("Shared.Yes?")
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSyncedOrders()
      }
    });
  }
  deleteSyncedOrders() {
    if (this.Orders) {
      let OrdersIds = this.Orders.filter((x) => x.IsSelected).map((x) => x.DocumentId);
      if (OrdersIds && OrdersIds.length) {
        const model = {
          OrdersIds : OrdersIds,
          Filter : this.responseobj
        }

        this.requestStarted = true;
        this.taxAuthorityService.deleteSyncedOrders(model).subscribe((res) => {
          this.requestStarted = false;
          this.Orders = res as any;
          this.RTOrders = undefined;
        },err=>{
          this.requestStarted = false;
        });
      }
    }
    

  }
  GetSettings() {
    this.SettingSer.GetSettings().subscribe((res) => {
      this.settingobj = res as any;
    });
  }

  Print(data: any) {
    let order = this.getReportTranslationObj(data);
    if(this.settingobj && this.settingobj?.CountryType == 3) 
      order.FromTaxScreen = true;

    this.orderSer.PrintWithPreview(order).subscribe(
      (data: any) => {
        if (data) {
          //  var report = new Stimulsoft.Report.StiReport();
          const reprtresult = data?.report;
          this.report.loadDocument(reprtresult);
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
        }
        return false;
      },
      (err) => {}
    );
    data.ImmediatePrint = false;
  }
  getReportTranslationObj(orderobj: OrderModel) {
    let lang1, lang2;
    if (this.settingobj.CustomerReceiptReportLanguage1 > 0)
      lang1 = this.getJsonLang(this.settingobj.CustomerReceiptReportLanguage1);
    if (this.settingobj.CustomerReceiptReportLanguage2 > 0)
      lang2 = this.getJsonLang(this.settingobj.CustomerReceiptReportLanguage2);
    let keys = Object.keys(ar["Reports"]);
    let finalLang = deepCopy(ar["Reports"]);

    keys.forEach((key) => {
      if (lang1) finalLang[key] = lang1[key];
      if (lang2) finalLang[key] += "\n" + lang2[key];
    });
    let Direction = "ar";
    // Change to Left to Right Because default report is rigth to left
    if (this.settingobj.ReportDirection == 1) Direction = "ar";
    if (this.settingobj.ReportDirection == 2) Direction = "en";
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
}
