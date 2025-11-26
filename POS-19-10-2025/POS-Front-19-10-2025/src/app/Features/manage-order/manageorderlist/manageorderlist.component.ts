import { Component, ViewChild, AfterViewInit } from "@angular/core";
import Swal from "sweetalert2";
import * as imp from "../manageorderimport";
import { SettingService, Router } from "../../point-of-sale/pointofsaleimports";
import { InsuranceModel } from "src/app/core/Models/Transactions/insurance-model";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { OrderModel } from "../../return-order/return-order-imports";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { SalesReportService } from "src/app/core/Services/Reporting/sales-report.service";
import { CustomerModel } from "../../customer/customerimport";
import { setStimulsoftKey } from "src/app/core/Helper/objectHelper";
declare var $: any;
declare var Stimulsoft: any;
@Component({
  selector: "app-manageorderlist",
  templateUrl: "./manageorderlist.component.html",
  styleUrls: ["./manageorderlist.component.css"]
})
export class ManageorderlistComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  public orderDateFormat: any = { type: "date", format: "dd.MM.yyyy" };
  public DateFormat: any = { type: "dateTime", format: "hh:mm a" };
  oading: boolean = true;
  ImmediatePrint: boolean = false;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  selectedOrderForPrint: any;
  selectedPrintIsA4: boolean = false;
  //#endregion
  priceFormat = { format: 'n2' };
  @ViewChild("grid") grid: imp.GridComponent;
  creditPayType : boolean = false;
  constructor(
    public followOrdersService: imp.FollowOrdersService,
    public manageorderser: imp.ManageOrderService,
    public orderSer: OrderService,
    public datepipe: imp.DatePipe,
    public toastr: imp.ToastrService,
    public settingserv: SettingService,
    public translate: TranslateService,
    public toastrMessage: imp.HandlingBackMessages,
    private languageSerService: LanguageSerService,
    public router: Router,
    public salesReportService: SalesReportService
  ) {
    super();
    this.initializeobjects();
    this.languageSerService.currentLang.subscribe((lan) => {
      this.language = lan;
      this.translate.use(this.language);
    });
  }
  ngOnInit() {

    this.orderobj = new OrderModel();
    this.responseobj.FromDate = new Date();
    this.responseobj.ToDate = new Date();
    // this.GetAllOrderTypes();
    // this.GetAllOrderPayTypes();
    // this.GetAllOrders();
    // this.GetSettings();

    this.manageOrderFirstOpen();
    this.GetAllTables();
    setStimulsoftKey(Stimulsoft);
    
  }
  fillInsranceTypeCompo() {
    let all = this.translate.instant("ReturnOrder.All");
    let Retrieved = this.translate.instant("returninsurance.Retrieved");
    let NotRetrieved = this.translate.instant("returninsurance.NotRetrieved");
    this.InsuranceTypeList = [
      { Name: all, DocumentId: 1 },
      { Name: Retrieved, DocumentId: 2 },
      { Name: NotRetrieved, DocumentId: 3 }
    ];
  }
  GetAllTables() {
    this.salesReportService.GetAllTables().subscribe((res) => {
      this.TableList = res as any;
      this.TableFlds = { text: "Name", value: "DocumentId" };
    });
  }
  //#region Manageorder Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.myOrder = {};
    this.Properties = {};
    this.service = this.manageorderser;
    this.initializeGrid();
  }
  //#endregion
  manageOrderFirstOpen() {
    this.manageorderser.manageOrderFirstOpen(this.responseobj).subscribe((res) => {
      this.manageorderlist = [];
      this.manageorderlist = res["Orders"] as imp.OrderModel[];
      //this.ordersWithInsurance(this.OrdersHasInsurance);

      this.settings = res["Settings"];
      this.priceFormat = { format: 'n' + this.settings?.Round };
      this.OrderPayTypeList = res["OrderPayTypes"] as any;
      this.OrderTypeList = res["OrderTypes"] as any;
      this.Permissions = res["Permissions"];
      this.ViewPermission = this.checkPermissions("View");
      this.DeletePermission = this.checkPermissions("Delete");
      this.EditPermission = this.checkPermissions("Edit");
      this.PrintPermission = this.checkPermissions("Print");
      this.filteredOrders = this.cloneList(this.manageorderlist);
      this.OrderTypeFlds = { text: "Name", value: "DocumentId" };
      this.OrderPayTypeFlds = { text: "Name", value: "DocumentId" };
      this.fillInsranceTypeCompo();
      this.GetManageOrderSetting();
    });
    // this.grid.refresh();
  }
  checkPermissions(permission: string) {
    let permitted = false;
    if (this.Permissions) {
      if (this.Permissions.Item1) permitted = true;
      else {
        if (this.Permissions.Item2 && this.Permissions.Item2.length) {
          //select many
          let Permissions = this.Permissions.Item2.map((g) => g.POSScreenPermissions).reduce(function (a, b) {
            return a.concat(b);
          }, []);
          if (Permissions && Permissions.length) {
            let ManageOrders = Permissions.filter((s) => s.ScreenName == "ManageOrder");
            if (ManageOrders) {
              switch (permission) {
                case "View":
                  if (ManageOrders.filter((x) => x.View == true)[0]) permitted = true;
                  break;
                case "Delete":
                  if (ManageOrders.filter((x) => x.Delete == true)[0]) permitted = true;
                  break;
                case "Edit":
                  if (ManageOrders.filter((x) => x.Edit == true)[0]) permitted = true;
                  break;
                case "Print":
                  if (ManageOrders.filter((x) => x.Print == true)[0]) permitted = true;
                  break;
              }
            }
          }
        }
      }
    }
    return permitted;
  }
  GetAllOrders() {
    this.requestStarted = true;
    this.manageorderser.GetAllOrders(this.responseobj).subscribe((res) => {
      //  this.manageorderlist=[]=Array<imp.OrderModel>();
      this.requestStarted = false;
      this.manageorderlist = [];
      this.manageorderlist = res as imp.OrderModel[];
      //this.ordersWithInsurance(this.OrdersHasInsurance);
      this.filteredOrders = this.cloneList(this.manageorderlist);
      this.initializeGrid();
      this.grid.refresh();
    },err=>{
      this.requestStarted = false;
    });
    // this.grid.refresh();
  }
  GetSettings() {
    this.settingserv.GetSettings().subscribe((res) => {
      this.settings = res;
      // this.grid.refresh();
      this.fillInsranceTypeCompo();
    });
  }
  GetAllOrderPayTypes() {
    this.manageorderser.GetAllOrderPayTypes().subscribe((res) => {
      this.OrderPayTypeList = res as any;
      this.OrderPayTypeFlds = { text: "Name", value: "DocumentId" };
    });
  }
  GetAllOrderTypes() {
    this.manageorderser.GetAllOrderTypes().subscribe((res) => {
      this.OrderTypeList = res as any;
      this.OrderTypeFlds = { text: "Name", value: "DocumentId" };
    });
  }
  initializeGrid() {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["ExcelExport"];
    this.editOptions = {
      showDeleteConfirmDialog: true,
      allowEditing: true,
      allowDeleting: true
    };
    this.filterOptions = {
      type: "Menu"
    };
  }
  toolbarClick(args: imp.ClickEventArgs): void {
    if (args.item.id === "grid_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.grid.pdfExport();
    }
    if (args.item.id === "grid_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.grid.excelExport();
    }
  }
  GetValuepaymenttype(data: any) {
    if (data && data.itemData) this.myOrder.OrderPayTypeName = data.itemData.Name;
    if (data.itemData.PayType == 20) {
      this.CustonerFlag = true;
      this.myOrder.CustmerId = undefined;
      this.searchCustomer = undefined;
      this.creditPayType = true;
      // this.followOrdersService.GetCustomerList().subscribe((res) => {
      //   this.CustonerFlag = true;
      //   this.CustomerList = res as any;
      //   this.CustomerFlds = { text: "Name", value: "DocumentId" };
      // });
    } else {
      this.myOrder.CustmerId = undefined;
      this.searchCustomer = undefined;
      this.CustonerFlag = false;
      this.creditPayType = false;
    }
  }
  getdatarecord(data: any) {
    this.oldCustomerDocId = data?.CustomerDocumentId;
    this.oldCustomer = data?.Customer;
    this.CustonerFlag = false;
    this.myOrder.PaymentTypeId = undefined;
    this.myOrder.OrderNumber = data.OrderNumber;
    this.myOrder.OrderId = data.DocumentId;
  }
  SavePaymentType() {
    this.manageorderser.UpdateOrder(this.myOrder).subscribe((res) => {
      if (res == 2) {
        this.toastr.info(this.toastrMessage.GlobalMessages(res));
        this.GetAllOrders();
        $("#modal-3").modal("hide");
      }
    });
  }
  DeleteOrder(data: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it?"
    }).then((result) => {
      if (result.isConfirmed) {
        this.manageorderser.DeleteOrder(data.DocumentId).subscribe((res) => {
          if (res == 3) {
            this.toastr.warning(this.toastrMessage.GlobalMessages(res));
            this.GetAllOrders();
            this.grid.refresh();
          }
        });
      }
    });
  }
  openReturnInsurance(order: any) {
    this.router.navigateByUrl("/returnInsurances", order);
    // localForage.setItem('Order', order);
    // const link = this.router.serializeUrl(this.router.createUrlTree(['/returnInsurances']));
    // window.open(link, '_blank');
    // this.orderobj = order;
    // this.calculateTotalInsuranceAmount();
    // //this.getAllInsurances();
    // $("#modal-Insurances").modal("show");
  }
  PlusInsuranceItems(inedx) {
    if (this.orderobj.OrderInsuranceItems[inedx]) {
      if (!this.orderobj.OrderInsuranceItems[inedx].ReturnQuantity)
        this.orderobj.OrderInsuranceItems[inedx].ReturnQuantity = 0;
      if (
        Number(this.orderobj.OrderInsuranceItems[inedx].Quantity) >
        Number(this.orderobj.OrderInsuranceItems[inedx].ReturnQuantity)
      ) {
        this.orderobj.OrderInsuranceItems[inedx].ReturnQuantity += 1;
        this.calculateTotalInsuranceAmount();
      }
    }
  }
  MinusInsuranceItems(inedx) {
    if (this.orderobj.OrderInsuranceItems[inedx]) {
      if (!this.orderobj.OrderInsuranceItems[inedx].ReturnQuantity)
        this.orderobj.OrderInsuranceItems[inedx].ReturnQuantity = 0;
      if (this.orderobj.OrderInsuranceItems[inedx].ReturnQuantity > 0) {
        this.orderobj.OrderInsuranceItems[inedx].ReturnQuantity -= 1;
        this.calculateTotalInsuranceAmount();
      }
    }
  }
  calculateTotalInsuranceAmount() {
    if (this.orderobj.OrderInsuranceItems && this.orderobj.OrderInsuranceItems.length > 0) {
      this.orderobj.OrderInsuranceItems?.forEach((II) => {
        // if(Number(II.ReturnQuantity))
        //   II.TotPrice = II.Price * (Number(II.Quantity) - Number(II.ReturnQuantity));
        // else
        if (!II.ReturnQuantity) II.ReturnQuantity = 0;
        II.TotRTPrice = II.Price * Number(II.ReturnQuantity);
        II.TotPrice = II.Price * Number(II.Quantity);
      });
      this.orderobj.TotalInsuranceAmount = this.orderobj.OrderInsuranceItems.map((x) => x.TotPrice).reduce(
        (next, current) => next + current,
        0
      );
      this.orderobj.TotalReturnInsurance = this.orderobj.OrderInsuranceItems.map((x) => x.TotRTPrice).reduce(
        (next, current) => next + current,
        0
      );
    }
  }
  updateOrderInsurance() {
    this.orderSer.updateOrderInsurance(this.orderobj).subscribe((res) => {
      this.toastr.success(this.toastrMessage.GlobalMessages(res));
      $("#modal-Insurances").modal("hide");
    });
  }
  ordersWithInsurance(event) {
    switch (event) {
      case 1:
        this.filteredOrders = this.cloneList(
          this.manageorderlist.filter(
            (x) =>
              (x.OrderInsuranceItems && x.OrderInsuranceItems.length > 0) ||
              (x.OrderInsurance && x.OrderInsurance.DocumentId)
          )
        );
        break;
      case 2:
        this.filteredOrders = this.cloneList(
          this.manageorderlist.filter(
            (x) =>
              (x.OrderInsuranceItems &&
                x.OrderInsuranceItems.length > 0 &&
                x.OrderInsuranceItems.map((x) => x.Quantity).reduce((next, current) => next + current, 0) ==
                  x.OrderInsuranceItems.map((x) => x.ReturnQuantity).reduce((next, current) => next + current, 0)) ||
              (x.OrderInsurance &&
                x.OrderInsurance.DocumentId &&
                x.TotalInsuranceAmount == x.TotalReturnInsuranceAmount)
          )
        );
        break;
      case 3:
        this.filteredOrders = this.cloneList(
          this.manageorderlist.filter(
            (x) =>
              (x.OrderInsuranceItems &&
                x.OrderInsuranceItems.length > 0 &&
                x.OrderInsuranceItems.map((x) => x.Quantity).reduce((next, current) => next + current, 0) >
                  x.OrderInsuranceItems.map((x) => x.ReturnQuantity).reduce((next, current) => next + current, 0)) ||
              (x.OrderInsurance && x.OrderInsurance.DocumentId && x.TotalInsuranceAmount > x.TotalReturnInsuranceAmount)
          )
        );
        break;
      default:
        this.filteredOrders = this.cloneList(this.manageorderlist);
        break;
    }
    // if(event.target.checked){
    //   this.filteredOrders = this.cloneList(this.manageorderlist.filter(x=>(x.OrderInsuranceItems && x.OrderInsuranceItems.length > 0)||
    //            (x.OrderInsurance && x.OrderInsurance.DocumentId)));
    // }
    // else{
    //   this.filteredOrders = this.cloneList(this.manageorderlist);
    // }
  }
  // Print(data:any)
  // {
  //   this.followOrdersService.PrintPreviewOrder(data.DocumentId).subscribe(
  //     res => {
  //       if(res == 1)
  //         this.toastr.success("Printed Successfully");
  //       else
  //         this.toastr.error("");
  //     });

  // }
  ImmediatePrintFunc(data: any) {
    this.ImmediatePrint = true
    this.Print(data);
  }
  showOrder(data: any) {
    this.ImmediatePrint = false
    this.Print(data);
  }

  openPrintTypeModal(data: any) {
    this.selectedOrderForPrint = data;
    this.selectedPrintIsA4 = false;
    $("#modal-print-type").modal("show");
  }
  choosePrintType(isA4: boolean) {
    this.selectedPrintIsA4 = isA4;
    $("#modal-print-type").modal("hide");
    if (this.selectedOrderForPrint) {
      this.showOrder(this.selectedOrderForPrint);
    }
  }
  Print(data: any) {
    let order = this.getReportTranslationObj(data);
    this.orderSer.PrintOrderWithDataSet({ Order: order, IsA4: this.selectedPrintIsA4 ,ImmediatePrint : this.ImmediatePrint ? this.ImmediatePrint : false}).subscribe(
      (data: any) => {
        if (data && !this.ImmediatePrint) {
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
        }
        return false;
      },
      (err) => {}
    );
    data.ImmediatePrint = false;
  }
  getReportTranslationObj(orderobj: OrderModel) {
    let lang1, lang2;
    if (this.settings.CustomerReceiptReportLanguage1 > 0)
      lang1 = this.getJsonLang(this.settings.CustomerReceiptReportLanguage1);
    if (this.settings.CustomerReceiptReportLanguage2 > 0)
      lang2 = this.getJsonLang(this.settings.CustomerReceiptReportLanguage2);
    let keys = Object.keys(ar["Reports"]);
    let finalLang = this.clone(ar["Reports"]);

    keys.forEach((key) => {
      if (lang1) finalLang[key] = lang1[key];
      if (lang2) finalLang[key] += "\n" + lang2[key];
    });
    let Direction = "ar";
    // Change to Left to Right Because default report is rigth to left
    if (this.settings.ReportDirection == 1) Direction = "ar";
    if (this.settings.ReportDirection == 2) Direction = "en";
    let LanguageOptions = {
      CurrentUserLang: Direction,
      ReportsJson: finalLang
    };
    orderobj.LanguageOptions = LanguageOptions;
    return orderobj;
  }
  /* getReportTranslationObj(orderobj : OrderModel){
  let lang1,lang2
  if(this.settings.CustomerReceiptReportLanguage1 > 0)
    lang1 = this.getJsonLang(this.settings.CustomerReceiptReportLanguage1);
  if(this.settings.CustomerReceiptReportLanguage2 > 0)
    lang2 = this.getJsonLang(this.settings.CustomerReceiptReportLanguage2);
  let keys = Object.keys(ar['Reports']);
  let finalLang = this.clone(ar['Reports']);

  keys.forEach(key => {
    if(lang1)
      finalLang[key] = lang1[key];
    if(lang2)
      finalLang[key] += ("\n" +lang2[key]);
  });
  let Direction = "en";
  // Change to Left to Right Because default report is rigth to left
  if(this.settings.ReportDirection == 2)
    Direction = "ar";
  let LanguageOptions = {CurrentUserLang :Direction ,  ReportsJson : finalLang};
  orderobj.LanguageOptions = LanguageOptions;
  return orderobj;
} */
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
  SaveManageOrderSetting() {
    this.manageorderser.SaveManageOrderSettingAsync(this.Properties).subscribe((res) => {
      if (res == 1) {
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
        $("#modal-101").modal("hide");
        this.GetManageOrderSetting();
      }
    });
  }

  GetManageOrderSetting() {
    this.showgrid = false;
    this.manageorderser.GetManageOrderSetting().subscribe((res) => {
      this.Properties = res as any;
      // this.grid.refresh();
      this.showgrid = true;
    });
  }
  filterCustomers(searchterm: any, payTypeDocumentId) {
    let payType = this.OrderPayTypeList.find((x) => x.DocumentId === payTypeDocumentId);
    if (payType.PayType == 20) {
      const model: CustomerModel = new CustomerModel();
      if (searchterm.target.value.length >= 3) {
        if (Number(searchterm.target.value) > 0) {
          //search by phone
          model.Phone = searchterm.target.value;
        } else {
          //search by name
          model.Name = searchterm.target.value;
        }
        this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
          this.customers = res as CustomerModel[];
          this.customers = this.customers.filter((x) => x.UseCredit === true);
          //assign first customer of the search result
          this.setCustomer(this.customers[0]?.DocumentId);
        });
      }
    }
  }

  setCustomer(CustomerDocumentId) {
    if (!this.customers) this.customers = [];
    const customer = this.customers.filter((c) => c.DocumentId == CustomerDocumentId)[0];
    if (customer) {
      this.myOrder.Customer = customer;
      this.myOrder.CustmerId = customer.DocumentId;
      this.myOrder.CustomerDocumentId = customer.DocumentId;
    }
    else{
      this.myOrder.Customer =  this.oldCustomer ? this.oldCustomer: undefined;
      this.myOrder.CustmerId = this.oldCustomerDocId ? this.oldCustomerDocId : this.oldCustomer ? this.oldCustomer?.DocumentId : undefined;
      this.myOrder.CustomerDocumentId = this.oldCustomerDocId ? this.oldCustomerDocId : this.oldCustomer ? this.oldCustomer?.DocumentId : undefined;
    }
  }
}
