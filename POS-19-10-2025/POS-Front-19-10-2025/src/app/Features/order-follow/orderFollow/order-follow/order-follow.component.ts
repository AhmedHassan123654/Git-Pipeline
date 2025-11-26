import { Component, ViewChild, OnDestroy } from "@angular/core";
import { DatePipe } from "src/app/Features/item-transfer-request/itemtransferrequest-imports";
import {
  Grid,
  Group,
  Search,
  Toolbar,
  Sort,
  Filter,
  Page,
  PdfExport,
  ExcelExport
} from "@syncfusion/ej2-angular-grids";
import * as imp from "../../followorders-imports";
import Swal from "sweetalert2";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-angular-grids";
import { OrderPayTypeModel } from "src/app/core/Models/Transactions/order-pay-type-model";
import { OrderPaymentModel } from "src/app/core/Models/order/OrderPaymentModel";
import { OrderModel } from "../../followorders-imports";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { PrintPreviewStiReport } from "src/app/core/Helper/objectHelper";
declare var Stimulsoft: any;
declare var $: any;
@Component({
  selector: "app-order-follow",
  templateUrl: "./order-follow.component.html",
  styleUrls: ["./order-follow.component.css"]
})
export class OrderFollowComponent extends imp.general implements imp.OnInit, OnDestroy {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public orderDateFormat: any = { type: "date", format: "dd.MM.yyyy" };
  public DateFormat: any = { type: "dateTime", format: "hh:mm a" };
  Reportgrid: Grid;
  Totalid: Grid;
  TotalDriverReport:boolean = false;
  //#endregion
  @ViewChild("grid") grid: imp.GridComponent;
  @ViewChild("grid2") grid2: imp.GridComponent;
  @ViewChild("Drivegrid") Drivegrid: imp.GridComponent;
  @ViewChild("Drivegrid2") Drivegrid2: imp.GridComponent;
  @ViewChild("followDriverGrid") followDriverGrid: imp.GridComponent;
  oading: boolean = true;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  public optionPaidFlds = { text: "Name", value: "OptionPaidId" };

  constructor(
    public followOrdersService: imp.FollowOrdersService,
    public toastr: imp.ToastrService,
    public translate: TranslateService,
    public toastrMessage: imp.HandlingBackMessages,
    public router: imp.Router,
    public datepipe: DatePipe,
    public dashboardSer: imp.DashboardService,
    private languageSerService: LanguageSerService,
    private SettingSer: imp.SettingService,
    private orderServ: OrderService
  ) {
    super();
    this.initializeobjects();
    this.GetSettings();
  }

  ngOnInit() {
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
    this.initializeGrid();
    this.GetFollowOrderSetting();
    this.GetOrdersbyDateOrDriver();
    this.GetDriverList();
    this.getbranchName();
    this.getAllUsers();
    this.GetAllOrdersNotPaidDriver();
    // this.followOrdersService.GetCustomerList().subscribe((res) => {
    //   this.CustomerList = res as any;
    //   this.CustomerFlds = { text: "Name", value: "DocumentId" };
    // });
    this.interv = setInterval(() => {
      if (!this.Orders.some(x => x.IsSelected)) {
        this.GetGrideOrdersList();
      }
      if (!this.MyOrders?.some(x => x.Ispayment)) {
        this.GetOrdersbyDateOrDriver();
      }
    }, 30 * 1000);
  }
  ngOnDestroy() {
    this.clearAllIntervals();
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
  //#region FollowOrders Methods
  initializeobjects(): void {
    this.responseobj = {};
    // this.responseobj.Date2 = new Date();
    this.service = this.followOrdersService;
    this.controlpopup = true;
    this.payObject = {};
    this.myOrder = {};
    this.printDetailobj = {}
    this.CustonerFlag = false;
    this.dataobj = {};
    this.dataobj2 = {};
    // this.dataobj2.Date = new Date();
    this.Properties = {};
    this.languageSerService.currentLang.subscribe((lan) => {
      this.translate.use(lan);
    });
  }
  //#endregion
  toolbarClick(args: imp.ClickEventArgs): void {
    if (args.item.id === "Grid_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.grid.pdfExport();
    }
    if (args.item.id === "Grid_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.grid.excelExport();
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
    this.dataobj.FromDate = new Date();
    this.dataobj.ToDate = new Date();
  }
  GetAssginDriverList() {
    this.followOrdersService.GetAssginDriverList().subscribe((res) => {
      this.Drivers = res as any;
      this.filterdDrivers = this.Drivers;
    });
  }
  GetDriverList() {
    this.followOrdersService.GetDriverList().subscribe((res) => {
      this.DriverList = res as any;
      this.driverFlds = { text: "DriverName", value: "DocumentId" };
    });
  }
  getAllUsers() {
    this.dashboardSer.getAllUsersInfo().subscribe((res) => {
      this.CashierList = res as any;
      this.cashierFlds = { text: "UserName", value: "AppUserId" };
    });
  }

  GetBackDriverList() {
    this.followOrdersService.GetBackDriverList().subscribe((res) => {
      this.Drivers = res as any;
      this.filterdDrivers = this.Drivers;
    });
  }
  GetGrideOrdersList() {
    this.followOrdersService.GetGrideOrdersList(this.dataobj2).subscribe((res) => {
      this.Orders = res as any;
      this.Orders.forEach((item) => {
        item.IsSelected = false;
      });
    });
  }
  GetAllOrdersNotPaidDriver() {
    this.followOrdersService.GetAllOrdersNotPaidDriver().subscribe((res) => {
      this.NotPaidDriverOrders = res as any;
      this.NotPaidDriverOrders.forEach((item) => {
        item.DriverPaid = false;
      });
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
  public onRowSelectedfollowDriver(args: any): void {
    let queryData: any;
    if (args.data) queryData = args.data.valueOf();
    else queryData = args;
    if (queryData.DriverPaid == false) {
      this.NotPaidDriverOrders.forEach((item) => {
        if (item.DocumentId == queryData.DocumentId) {
          item.DriverPaid = true;
        }
      });
    } else {
      this.NotPaidDriverOrders.forEach((item) => {
        if (item.DocumentId == queryData.DocumentId) {
          item.DriverPaid = false;
        }
      });
    }
    this.followDriverGrid.refresh();
  }
  CheckAllRows(CheckAllPay) {
    this.MyOrders.forEach((item) => {
      item.Ispayment = !CheckAllPay;
    });
    this.grid2.refresh();
  }
  public onRowSelected2(args): void {
    this.checkorderNumber = 0.0;
    let queryData: any;
    if (args.data) queryData = args.data.valueOf();
    else queryData = args;
    if (queryData.Ispayment == false) {
      this.MyOrders.forEach((item) => {
        if (item.DocumentId == queryData.DocumentId) {
          item.Ispayment = true;
        }
      });
      this.grid2.refresh();
    } else {
      this.MyOrders.forEach((item) => {
        if (item.DocumentId == queryData.DocumentId) {
          item.Ispayment = false;
        }
      });
      this.grid2.refresh();
      //this.checkorderNumber=this.MyOrders.filter(x=> x.Ispayment==true).length;
    }

    this.ChoosenOrders = 0.0;
    this.ChoosenorderNumber - 0.0;
    this.list = [];
    this.MyOrders.forEach((item) => {
      if (item.Ispayment === true) {
        this.ChoosenOrders += item.SubTotal;
        this.list.push(item);
      }
    });
    this.ChoosenorderNumber = this.list.length;
  }
  AssignOnly(data: any) {
    // debugger
    this.mylist = [];
    this.Orders.forEach((item) => {
      if (item.IsSelected == true) {
        item.DriverName = data.DriverName;
        item.DriverPhone = data.TelephoneNumber;
        item.DriverDocumentId = data.DocumentId;
        if (item.DeliveryAssignTime == undefined) {
          item.DeliveryAssignTime = new Date();
        }
        item.IsSelected = false;
        item = this.getReportTranslationObj(item);
        this.mylist.push(item);
      }
    });
    this.followOrdersService.UpdateOrder(this.mylist).subscribe((res) => {
      if (res == 2) {
        this.toastr.info(this.toastrMessage.GlobalMessages(res));
        this.PrintAll(this.mylist);
        this.GetOrdersbyDateOrDriver();
        this.GetGrideOrdersList();
        this.GetAllOrdersNotPaidDriver();
      }
    });
    this.followDriverGrid?.refresh();
    this.grid?.refresh();
    $("#modal-1").modal("hide");
  }
  DriverPaidAsync() {
    let list = [];
    this.NotPaidDriverOrders.forEach((item) => {
      if (item.DriverPaid) {
        list.push(item);
      }
    });
    this.followOrdersService.DriverPaidAsync(list).subscribe((res) => {
      if (res == 2) {
        this.toastr.info(this.toastrMessage.GlobalMessages(res));
        this.GetAllOrdersNotPaidDriver();
        this.followDriverGrid.refresh();
      }
    });
  }
  AssignExtit(data) {
    this.mylist = [];
    this.Orders.forEach((item) => {
      if (item.IsSelected == true) {
        item.DriverName = data.DriverName;
        item.DriverPhone = data.TelephoneNumber;
        item.DriverDocumentId = data.DocumentId;
        if (item.DeliveryAssignTime == undefined) {
          item.DeliveryAssignTime = new Date();
        }

        item.DeliveryExitTime = new Date();
        item.IsSelected = false;
        item = this.getReportTranslationObj(item);
        this.mylist.push(item);
      }
    });
    this.followOrdersService.UpdateOrder(this.mylist).subscribe((res) => {
      if (res == 2) {
        this.toastr.info(this.toastrMessage.GlobalMessages(res));
        this.PrintAll(this.mylist);
        this.GetOrdersbyDateOrDriver();
        this.GetGrideOrdersList();
        this.GetAllOrdersNotPaidDriver();
      }
    });
    this.followDriverGrid.refresh();
    this.grid.refresh();
    $("#modal-1").modal("hide");
  }

  Back(data: any) {
    this.followOrdersService.UpdateOrderByDriverID(data).subscribe((res) => {
      if (res == 2) {
        this.toastr.info(this.toastrMessage.GlobalMessages(res));
      }

      this.GetGrideOrdersList();
      this.GetAllOrdersNotPaidDriver();
      this.followDriverGrid.refresh();
      this.grid.refresh();
      $("#modal-2").modal("hide");
    });
  }
  PrintAll(orders) {
    if(this.disablePrint) return; 
    Swal.fire({
      title: "",
      text: this.translate.instant("Shared.DoYouWantPrintthisOrder"),
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        orders.forEach((order) => {
          this.Print(order);
        });
      }
    });
  }
  GetOrdersbyDateOrDriver() {
    this.totalOfSub = 0.0;
    this.totalOfDeliveryPricePerson = 0.0;
    this.totalOfDeliveryPrice = 0.0;
    this.mydata = {};
    this.mydata.Date = this.responseobj.Date2;
    this.mydata.DriverdocumentId = this.responseobj.DriverdocumentId;
    this.followOrdersService.GetAllOrdersByDateOrDriver(this.mydata).subscribe((res) => {
      this.MyOrders = res as imp.OrderModel[];
      this.MyOrders.forEach((item) => {
        item.Ispayment = false;
        item.TotalDeliverPrice = item.DeliveryPersonDeliveryPrice + item.DeliveryPrice;
        this.totalOfSub += item.SubTotal;
        this.totalOfDeliveryPricePerson += item.DeliveryPersonDeliveryPrice;
        this.totalOfDeliveryPrice += item.DeliveryPrice;
      });

      this.myOrderCounts = 0;
      this.myOrderCounts = this.MyOrders.length;
      this.ChoosenOrders = 0.0;
      this.CheckAllPay = false;
    });
  }
  async UpdatePaidOrders() {
    return new Promise(async (resolve) => {
      this.mylist = [];
      this.MyOrders.forEach((item) => {
        if (item.Ispayment === true) {
          this.mylist.push(item);
        }
      });
      if (this.PrinterName == "" || this.PrinterName == "0" || !this.PrinterName) {
        this.toastr.warning(this.translate.instant("messages.followorderprinterwarning"));
        return false;
      }
      if (this.mylist.length != 0) {
        let errorExist = this.mylist.filter((x) => !x.DriverDocumentId)[0];
        if (errorExist) {
          this.toastr.warning("هناك فواتير غير مرتبطه بسائق");
          return false;
        }
        this.requestStarted = true;
        this.followOrdersService.UpdatePaidOrderAsync(this.mylist).subscribe({
          next: (res) => {
            if (res == 2 || res == 38) {
              this.toastr.info(this.toastrMessage.GlobalMessages(res));
              this.mylist2 = [];
              this.MyOrders.forEach((item) => {
                if (item.Ispayment === false) {
                  this.mylist2.push(item);
                }
              });
              this.MyOrders = this.mylist2;
              this.myOrderCounts = this.MyOrders.length;
              this.totalOfSub = 0.0;
              this.ChoosenOrders = 0.0;
              this.MyOrders.forEach((item) => {
                this.totalOfSub += item.SubTotal;
              });
              // this.mylist.forEach(order => {
              //   this.Print(order)
              // });
              this.requestStarted = false;
            }
          },
          error: (err) => {
            this.requestStarted = false;
          },
          complete: () => {
            this.GetGrideOrdersList();
            this.requestStarted = false;
          }
        });
        resolve("");
      }
    });
  }

  // Start : Print
  PrintPerview(data: any) {
    let order = this.getReportTranslationObj(data);

    this.orderServ.PrintOrderWithDataSet({ Order: order, IsA4: false }).subscribe(
      (data: any) => {
        return PrintPreviewStiReport(Stimulsoft,this.report, data?.report);
      },
      (err) => {
        //  this.toastr.error(this.ToastrMsgTranslate("ToastrMsg.UnExpError"),this.PageName);
      }
    );
  }
  Print(data) {
    if(this.disablePrint) return; 
    let order = this.getReportTranslationObj(data);
    this.followOrdersService.PrintPreviewOrder(order).subscribe((res) => {
      if (res == 1) this.toastr.success("Printed Successfully");
      else this.toastr.error("");
    });
  }
  // End : Print

  Getpaymentdata(data: any) {
    this.myOrder = data;
    this.followOrdersService.GetPaymentTypeList().subscribe((res) => {
      this.PaymentTypeList = res as any;
      this.paymentTypeFlds = { text: "Name", value: "DocumentId" };
      // this.checkCreditPay();
    });
  }
  GetValuepaymenttype(data: any) {
    // if (data.PayType == 20) {
    //   this.followOrdersService.GetCustomerList().subscribe((res) => {
    //     this.CustomerList = res as any;
    //     this.CustomerFlds = { text: "Name", value: "DocumentId" };
    //   });
    // }
    this.myOrder.OrderPayments = [];
    let creditPay;
    this.PaymentTypeList.forEach((p) => {
      if (p.PayType == 20) {
        creditPay = p;
      }
      if (p.Checked) {
        this.myOrder.OrderPayments.push({
          Amount: p.Amount,
          OrderId: this.myOrder.DocumentId,
          PayAmount: 0,
          PayTypeDocumentId: p.DocumentId,
          PayTypeId: p.Id,
          PayTypeName: p.Name
        });
      } else {
        let index = this.myOrder.OrderPayments.findIndex((x) => x.PayTypeDocumentId == p.DocumentId);
        if (index != -1) this.myOrder.OrderPayments.splice(index, 1);
      }
    });
    // let CreditExist;
    // if (creditPay) {
    //   CreditExist = this.myOrder.OrderPayments.find((x) => x.PayTypeDocumentId == creditPay.DocumentId);
    //   // if (CreditExist) this.CustonerFlag = true;
    //   // else this.CustonerFlag = false;
    // }
  }
  SavePaymentType() {
    if (this.validatePayment(this.myOrder)) {
      this.followOrdersService.SavePaymentOrder(this.myOrder).subscribe((res) => {
        if (res == 2) {
          this.toastr.info(this.toastrMessage.GlobalMessages(res));
          $("#modal-3").modal("hide");
          this.GetOrdersbyDateOrDriver();
          this.GetGrideOrdersList();
          this.GetAllOrdersNotPaidDriver();
          setTimeout(() => {
            this.myOrder.Ispayment = false;
            this.onRowSelected2(this.myOrder);
          }, 200);
        }
      });
    }
  }
  getbranchName() {
    this.followOrdersService.getBranchdata().subscribe((res) => {
      this.Branch = res as any;
    });
  }
  GetDataReport() {
    this.requestStarted = true;
    this.TotalDriverReport = false;
    this.followOrdersService.GetDataReport(this.dataobj).subscribe({
      next: (res) => {
        this.OrdersDriver = res as any;
        this.Totals = 0.0;
        this.DeliveryPrice = 0.0;
        this.DeliveryPersonDeliveryPrice = 0.0;
        this.OrdersDriver?.forEach((item) => {
          this.Totals += item.SubTotal;
          this.DeliveryPrice += item.DeliveryPrice;
          this.DeliveryPersonDeliveryPrice += item.DeliveryPersonDeliveryPrice;
        });
        let gridObj: any = document.getElementById("Reportgrid");
        if (gridObj != undefined && gridObj.ej2_instances != undefined) {
          var gridInstance = gridObj.ej2_instances.filter(
            (obj) => obj.localeObj != undefined && obj.localeObj.controlName === "grid"
          )[0];
          gridInstance.destroy();
        }

        Grid.Inject(Page, Filter, Sort, Search, Toolbar, Toolbar, PdfExport, Group, ExcelExport);
        this.Reportgrid = new Grid({
          dataSource: this.OrdersDriver,
          allowSorting: true,
          allowGrouping: true,
          allowFiltering: true,
          allowPaging: true,
          allowExcelExport: true,
          allowPdfExport: true,

          toolbar: ["Print", "PdfExport", "ExcelExport"],
          /* format: { type: 'dateTime', format: 'dd/MM/yyyy HH:mm:ss' } */
          columns: [
            {
              field: "OrderNumber",
              headerText: this.translate.instant("delivery.orderNumber"),
              textAlign: "Center"
            },
            {
              field: "DriverName",
              headerText: this.translate.instant("delivery.DriverName"),
              textAlign: "Center"
            },
            {
              field: "Customer.Name",
              headerText: this.translate.instant("delivery.CustomerName"),
              textAlign: "Center"
            },
            {
              field: "Customer.Phone",
              headerText: this.translate.instant("Shared.customerPhone"),
              textAlign: "Center"
            },
            {
              field: "CustomerAddress.RegionName",
              headerText: this.translate.instant("delivery.region"),
              textAlign: "Center"
            },
            {
              field: "CloseDate",
              headerText: this.translate.instant("Reports.Date"),
              format: "dd/MM/yyyy",
              type: "date",
              textAlign: "Center"
            },
            {
              field: "Paid",
              headerText: this.translate.instant("delivery.paid"),
              textAlign: "Center",
              type: "boolean",
              displayAsCheckBox: true
            },
            {
              field: "DeliveryAssignTime",
              headerText: this.translate.instant("ExtraExpenses.AssignTime"),
              format: "hh:mm",
              type: "date",
              textAlign: "Center"
            },
            {
              field: "DeliveryExitTime",
              headerText: this.translate.instant("ExtraExpenses.ExitTime"),
              format: "hh:mm",
              type: "date",
              textAlign: "Center"
            },
            {
              field: "DeliveryBackTime",
              headerText: this.translate.instant("ExtraExpenses.BackTime"),
              format: "hh:mm",
              type: "date",
              textAlign: "Center"
            },
            // {
            //   field: "Deliverytime",
            //   headerText: this.translate.instant("Delivery time"),
            //   format: "hh:mm",
            //   type: "time",
            //   textAlign: "Center"
            // },
            { field: "SubTotal", headerText: this.translate.instant("Reports.Total"), textAlign: "Center" },
            {
              field: "DeliveryPrice",
              headerText: this.translate.instant("Reports.DeliveryPrice"),
              textAlign: "Center"
            },
            {
              field: "DeliveryPersonDeliveryPrice",
              headerText: this.translate.instant("delivery.DeliveryPersonPrice"),
              textAlign: "Center"
            }
          ]
        });

        this.Reportgrid.appendTo("#Reportgrid");
        this.Reportgrid.toolbarClick = (args: Object) => {
          if (args["item"].id === "grid_excelexport") {
            this.Reportgrid.excelExport();
          }
          if (args["item"].id === "grid_pdfexport") {
            this.Reportgrid.pdfExport();
          }
        };
      },
      error: (err) => {
        this.requestStarted = false;
      },
      complete: () => {
        this.requestStarted = false;
      }
    });
  }
  GetDataReport2() {
    this.requestStarted = true;
    this.TotalDriverReport = false;
    this.followOrdersService.GetDataReport(this.dataobj).subscribe({
      next: (res) => {
        this.OrdersDriver = res as imp.OrderModel;
        this.Totals = 0.0;
        this.DeliveryPrice = 0.0;
        this.DeliveryPersonDeliveryPrice = 0.0;
        this.OrdersDriver.forEach((item) => {
          this.Totals += item.SubTotal;
          this.DeliveryPrice += item.DeliveryPrice;
          this.DeliveryPersonDeliveryPrice += item.DeliveryPersonDeliveryPrice;
          this.CashierList.forEach((item2) => {
            if (item.ClosingUserId == item2.AppUserId) {
              item.ClosingUserName = item2.UserName;
            }
          });
        });
        let gridObj: any = document.getElementById("Reportgrid");
        if (gridObj != undefined && gridObj.ej2_instances != undefined) {
          var gridInstance = gridObj.ej2_instances.filter(
            (obj) => obj.localeObj != undefined && obj.localeObj.controlName === "grid"
          )[0];
          gridInstance.destroy();
        }

        Grid.Inject(Page, Filter, Sort, Search, Toolbar, Toolbar, PdfExport, Group, ExcelExport);
        this.Reportgrid = new Grid({
          dataSource: this.OrdersDriver,
          allowSorting: true,
          allowGrouping: true,
          allowFiltering: true,
          allowPaging: true,
          allowExcelExport: true,
          allowPdfExport: true,

          toolbar: ["Print", "PdfExport", "ExcelExport"],
          /* format: { type: 'dateTime', format: 'dd/MM/yyyy HH:mm:ss' } */
          columns: [
            {
              field: "OrderNumber",
              headerText: this.translate.instant("delivery.orderNumber"),
              textAlign: "Center"
            },
            {
              field: "ClosingUserName",
              headerText: this.translate.instant("Shared.UserName"),
              textAlign: "Center"
            },
            {
              field: "Customer.Name",
              headerText: this.translate.instant("delivery.CustomerName"),
              textAlign: "Center"
            },
            {
              field: "Customer.Phone",
              headerText: this.translate.instant("Shared.customerPhone"),
              textAlign: "Center"
            },
            {
              field: "CustomerAddress.RegionName",
              headerText: this.translate.instant("delivery.region"),
              textAlign: "Center"
            },
            { field: "SubTotal", headerText: this.translate.instant("Reports.Total"), textAlign: "Center" }
          ]
        });

        this.Reportgrid.appendTo("#Reportgrid");
        this.Reportgrid.toolbarClick = (args: Object) => {
          if (args["item"].id === "grid_excelexport") {
            this.Reportgrid.excelExport();
          }
          if (args["item"].id === "grid_pdfexport") {
            this.Reportgrid.pdfExport();
          }
        };
      },
      error: (err) => {
        this.requestStarted = false;
      },
      complete: () => {
        this.requestStarted = false;
      }
    });
  }
  totalDrivertoolbarClick = (args: any) => {
    if (args["item"].id === "TotalDrivergrid_print") {
      args.cancel = true;
      this.PrintDriversTotal(this.TotalDriverData);
    }
   
  };
  totalDriverToolbarOptions = ["Print"];  

  GetTotalDriverReport() {
    this.requestStarted = true;
    this.TotalDriverReport = true;
    this.followOrdersService.GetTotalDriverReport(this.dataobj).subscribe({
      next: (res) => {
        this.TotalDriverData = res as any;
        this.Totals = 0.0;
        this.DeliveryPrice = 0.0;
        this.DeliveryPersonDeliveryPrice = 0.0;
        this.TotalDriverData.forEach((item) => {
          this.Totals += item.subTotal;
          this.DeliveryPrice += item.DeliveryPrice;
          this.DeliveryPersonDeliveryPrice += item.DeliveryPersonDeliveryPrice;
          if (item.DriverName == null || item.DriverName == "" || item.DriverName == undefined) {
            item.DriverName = "Not Assign yet";
          }
        });
        // let gridObj: any = document.getElementById("TotalDrivergrid");
        // if (gridObj != undefined && gridObj.ej2_instances != undefined) {
        //   var gridInstance = gridObj.ej2_instances.filter(
        //     (obj) => obj.localeObj != undefined && obj.localeObj.controlName === "grid"
        //   )[0];
        //   gridInstance.destroy();
        // }
        // Grid.Inject(Page, Filter, Sort, Search, Toolbar, Toolbar, PdfExport, Group, ExcelExport);
        // this.Reportgrid = new Grid({
        //   dataSource: this.OrdersDriver,
        //   allowSorting: true,
        //   allowGrouping: true,
        //   allowFiltering: true,
        //   allowPaging: true,
        //   allowExcelExport: true,
        //   allowPdfExport: true,
        //   toolbar: ["Print", "PdfExport", "ExcelExport"],
        //   columns: [
        //     {
        //       field: "DriverName",
        //       headerText: this.translate.instant("Reports.DriverName"),
        //       textAlign: "Center"
        //     },
        //     { field: "Count", headerText: this.translate.instant("Reports.OrdersCount"), textAlign: "Center" },
        //     { field: "PaidCount", headerText: this.translate.instant("delivery.paid"), textAlign: "Center" },
        //     // { field: "PaidOrdersTotals", headerText: this.translate.instant("delivery.PaidOrdersTotals"), textAlign: "Center" },
        //     { field: "NotPaidCount", headerText: this.translate.instant("delivery.notPaid"), textAlign: "Center" },
        //     // { field: "NotPaidOrdersTotals", headerText: this.translate.instant("delivery.NotPaidOrdersTotals"), textAlign: "Center" },
        //     { field: "subTotal", headerText: this.translate.instant("Reports.Total"), textAlign: "Center" },
        //     {
        //       field: "DeliveryPersonDeliveryPrice",
        //       headerText: this.translate.instant("delivery.DeliveryPersonPrice"),
        //       textAlign: "Center"
        //     }
        //   ]
        // });

        // this.TotalDrivergrid.appendTo("#TotalDrivergrid");
        // this.TotalDrivergrid.toolbarClick = (args: Object) => {
        //   if (args["item"].id === "grid_excelexport") {
        //     this.TotalDrivergrid.excelExport();
        //   }
        //   if (args["item"].id === "grid_pdfexport") {
        //     this.TotalDrivergrid.pdfExport();
        //   }
        // };
      },
      error: (err) => {
        this.requestStarted = false;
      },
      complete: () => {
        this.requestStarted = false;
      }
    });
  }
  setPrintLang(data : any){
    if (this.printDetailobj?.LanguageId == 1) {
      this.myjson = en["Reports"];
      data.Labels = this.myjson;
      data.CurrentLang = "en";
    }
    if (this.printDetailobj?.LanguageId == 2) {
      this.myjson = ar["Reports"];
      data.Labels = this.myjson;
      data.CurrentLang = "ar";
    }
    if (this.printDetailobj?.LanguageId == 3) {
      this.myjson = tr["Reports"];
      data.Labels = this.myjson;
      data.CurrentLang = "en";
    }
    if (this.printDetailobj?.LanguageId == 4) {
      this.myjson = fr["Reports"];
      data.Labels = this.myjson;
      data.CurrentLang = "en";
    }
  }
  printDriverDetail(data : any){
    // debugger
    this.setPrintLang(data);
    this.followOrdersService.PrintDriverDetail(data).subscribe({
      error: (err) => {
        this.toastr.error(this.translate.instant("messages.missingPrinter"))
      },
    });
  }
  PrintDriversTotal(data : any[]){
    this.setPrintLang(data[0]);

    this.followOrdersService.PrintDriversTotal(data).subscribe(
      (data: any) => {
        return PrintPreviewStiReport(Stimulsoft,this.report, data?.report);
      },
    );
  }
  //#region Payment List
  // checkCreditPay() {
  //   let creditPay;
  //   this.PaymentTypeList.forEach((p) => {
  //     if (p.PayType == 20) {
  //       creditPay = p;
  //     }
  //   });
  //   if (creditPay) {
  //     this.CreditExist = this.myOrder.OrderPayments.find((x) => x.PayTypeDocumentId == creditPay.DocumentId);
  //     if (this.CreditExist || this.myOrder.CustomerDocumentId) {
  //     }
  //     // toaster hna
  //   }
  // }

  // orderPayTypeClicked(value: OrderPayTypeModel) {
  //   if (
  //     this.myOrder.OrderPayments &&
  //     this.myOrder.OrderPayments.length == 1 &&
  //     !this.myOrder.OrderPayments[0].PayAmount
  //   )
  //     if (value.PayType == 20) {
  //       if (this.myOrder && (this.myOrder.Customer || this.myOrder.CustomerDocumentId)) {
  //         if (!this.myOrder.Customer && this.myOrder.CustomerDocumentId) {
  //           this.followOrdersService.GetByDocumentID(this.myOrder.CustomerDocumentId).subscribe((res) => {
  //             this.Customer = res as any;
  //             this.myOrder.Customer = this.Customer;
  //           });
  //         }
  //         if (this.myOrder.Customer && !this.myOrder.Customer.UseCredit == true) {
  //           this.toastr.warning("This Customer Not Dealing With Credits");
  //           return;
  //         }
  //       }
  //     }
  //   this.myOrder.OrderPayments = [];

  //   if (this.myOrder.OrderPayments && !this.myOrder.OrderPayments.filter((x) => !x.PayAmount || x.PayAmount == 0)[0]) {
  //     this.myOrder = this.setOrderPayType(value, this.myOrder);
  //   }
  //   this.setFocusById("PayAmount" + (this.myOrder.OrderPayments.length - 1));
  //   // this.checkCreditPay();
  // }

  orderPayTypeClicked(value: OrderPayTypeModel) {
    // debugger;
    if (value.PayType == 20) {
      if (this.myOrder && (this.myOrder.Customer || this.myOrder.CustomerDocumentId)) {
        if (!this.myOrder.Customer && this.myOrder.CustomerDocumentId) {
          this.followOrdersService.GetByDocumentID(this.myOrder.CustomerDocumentId).subscribe((res) => {
            this.Customer = res as any;
            this.myOrder.Customer = this.Customer;
          });
        }
        if (this.myOrder.Customer && !this.myOrder.Customer.UseCredit == true) {
          this.toastr.warning("This Customer Not Dealing With Credits");
          return;
        }
      }
    }
    if (
      this.myOrder.OrderPayments &&
      this.myOrder.OrderPayments.length == 1 &&
      !this.myOrder.OrderPayments[0].PayAmount
    ) {
      this.myOrder.OrderPayments = [];
    }
      if (
        this.myOrder.OrderPayments &&
        !this.myOrder.OrderPayments.filter((x) => !x.PayAmount || x.PayAmount == 0)[0]
      ) {
        this.setOrderPayType(value, this.myOrder);
      }
    this.setFocusById("PayAmount" + (this.myOrder.OrderPayments.length - 1));
  }

  setFocusById(elemId) {
    window.setTimeout(function () {
      let elem = document.getElementById(elemId);
      if (elem) document.getElementById(elemId).focus();
    }, 200);
  }
  setOrderPayType(value: OrderPayTypeModel, orderobj: imp.OrderModel) {
    if (!orderobj.OrderPayments) orderobj.OrderPayments = [];
    if (!value) value = new OrderPayTypeModel();
    if (!orderobj.TotalInsuranceAmount) orderobj.TotalInsuranceAmount = 0;
    let payment: OrderPaymentModel = new OrderPaymentModel();
    payment.PayTypeId = value.Id;
    payment.PayTypeDocumentId = value.DocumentId;
    orderobj.OrderPayTypeId = value.Id;
    orderobj.OrderTypeDocumentId = value.DocumentId;
    orderobj.OrderPayTypeName = value.Name;
    payment.PayTypeName = value.Name;
    payment.Amount = 0.0;
    //payment.PayAmount=0.00;

    if (orderobj.OrderPayments == null || orderobj.OrderPayments.length == 0) {
      // payment.Amount = orderobj.SubTotal + orderobj.TotalInsuranceAmount + orderobj.DeliveryPersonDeliveryPrice;
      payment.Amount = orderobj.SubTotal;
    } else {
      if (Number(orderobj.RemainigAmount) >= 0.0) {
        payment.Amount = 0.0;
      } else {
        payment.Amount = orderobj.RemainigAmount * -1;
      }
    }
    if (
      orderobj.OrderPayments == null ||
      orderobj.OrderPayments.length == 0 ||
      (orderobj.OrderPayments.findIndex(
        (x) =>
          (payment.PayTypeId && x.PayTypeId == payment.PayTypeId) || x.PayTypeDocumentId == payment.PayTypeDocumentId
      ) == -1 &&
        orderobj.OrderPayments[orderobj.OrderPayments.length - 1].Amount != 0)
    ) {
      orderobj.OrderPayments.push(payment);
      orderobj = this.calculateRemainingAmount(orderobj);
    }
    return orderobj;
  }
  calculateRemainingAmount(orderobj: imp.OrderModel) {
    this.totalOrderPayment = 0.0;
    if (orderobj.SubTotal) {
      if (orderobj.OrderPayments != null) {
        orderobj.OrderPayments.forEach((element) => {
          this.totalOrderPayment += element.PayAmount && element.PayAmount > 0 ? Number(element.PayAmount) : 0;
        });
      }
      orderobj.RemainigAmount =
        this.totalOrderPayment -
        orderobj.SubTotal -
        orderobj.TotalInsuranceAmount -
        orderobj.DeliveryPersonDeliveryPrice;
    }
    return orderobj;
  }
  DeletePayment(Payment: OrderPayTypeModel, index: number) {
    this.myOrder.OrderPayments.splice(index, 1);
    this.myOrder = this.calculateRemainingAmount(this.myOrder);
    // this.checkCreditPay();
  }
  onInputChangeNum = (event: any) => {
    if (this.myOrder.SubTotal == undefined) {
      this.myOrder.SubTotal = 0;
    }
    this.myOrder = this.calculateRemainingAmount(this.myOrder);
  };
  changePaymentAmount(index: number, orderPayment: OrderPaymentModel) {
    if (!orderPayment.PayAmount) orderPayment.PayAmount = 0;
    orderPayment.Amount = orderPayment.PayAmount;
    if (index < this.myOrder.OrderPayments.length - 1) {
      this.myOrder.OrderPayments = this.myOrder.OrderPayments.splice(index + 1, this.myOrder.OrderPayments.length);
    }
    let orderPaymentsAmounts = this.myOrder.OrderPayments.map((x) => Number(x.Amount)).reduce(
      (next, current) => next + current,
      0
    );
    if (
      orderPaymentsAmounts >
        this.myOrder.SubTotal + this.myOrder.DeliveryPersonDeliveryPrice + this.myOrder.TotalInsuranceAmount &&
      this.myOrder.OrderPayments.length == 1
    )
      orderPayment.Amount =
        this.myOrder.SubTotal + this.myOrder.DeliveryPersonDeliveryPrice + this.myOrder.TotalInsuranceAmount;
    else if (
      orderPaymentsAmounts >
        this.myOrder.SubTotal + this.myOrder.DeliveryPersonDeliveryPrice + this.myOrder.TotalInsuranceAmount &&
      this.myOrder.OrderPayments.length > 1
    ) {
      let orderPays = this.cloneList(this.myOrder.OrderPayments);
      orderPays.splice(this.myOrder.OrderPayments.length - 1, 1);
      let OldorderPaymentsAmounts = orderPays.map((x) => Number(x.Amount)).reduce((next, current) => next + current, 0);
      orderPayment.Amount =
        this.myOrder.SubTotal +
        this.myOrder.DeliveryPersonDeliveryPrice +
        this.myOrder.TotalInsuranceAmount -
        OldorderPaymentsAmounts;
    }
  }
  validatePayment(orderobj: OrderModel) {
    if (this.CreditExist && !orderobj.CustomerDocumentId) {
      this.toastr.info(this.translate.instant("messages.MustSelectCustomer"), "Order");
      return false;
    }
    if (!(orderobj.Discount == 100 && orderobj.DiscountType == "1")) {
      if (!orderobj.OrderPayments || orderobj.OrderPayments.length == 0) {
        this.toastr.warning("Please Insert Order Payment Types");
        return false;
      }
      if (orderobj.OrderPayments.filter((x) => !x.PayTypeDocumentId)[0]) {
        this.toastr.warning("Please Insert Order Payment Types Id");
        return false;
      }
      if (orderobj.OrderPayments.filter((x) => !x.Amount || x.Amount == 0)[0]) {
        let op = orderobj.OrderPayments.filter((x) => !x.Amount || x.Amount == 0)[0];
        let index = orderobj.OrderPayments.indexOf(op);
        this.toastr.warning("Payment Amount Can not be Zero");
        this.setFocusById("PayAmount" + index);
        return false;
      }

      let orderPaymentsAmounts = orderobj.OrderPayments.map((x) => Number(x.Amount)).reduce(
        (next, current) => next + current,
        0
      );

      // let diff = Number(
      //   orderobj.SubTotal + orderobj.DeliveryPersonDeliveryPrice + orderobj.TotalInsuranceAmount - orderPaymentsAmounts
      // );
      let diff = Number(
        orderobj.SubTotal + orderobj.TotalInsuranceAmount - orderPaymentsAmounts
      );
      if (diff > 0.01) {
        this.toastr.warning("Order Payment Must be Greater than or equal to total");
        return false;
      }
      if (
        this.settingobj.PreventClosingWithoutFullPayment &&
        orderobj.OrderPayments.filter((x) => !x.PayAmount || x.PayAmount == 0)[0]
      ) {
        let op = orderobj.OrderPayments.filter((x) => !x.PayAmount || x.PayAmount == 0)[0];
        let index = orderobj.OrderPayments.indexOf(op);
        this.toastr.warning("Payment Amount Can not be Zero");
        this.setFocusById("PayAmount" + index);
        return false;
      }
    }
    return true;
  }
  GetSettings() {
    this.SettingSer.GetSettings().subscribe((res) => {
      this.settingobj = res as any;
      this.dataobj2.Date = this.settingobj.DateFormFirstHour;
      this.responseobj.Date2 = this.settingobj.DateFormFirstHour;
      this.printDetailobj.LanguageId = this.settingobj.SystemMainLanguage;

      this.GetGrideOrdersList();
    });
  }
  GetFollowOrderSetting() {
    this.showgrid = false;
    this.followOrdersService.GetFollowOrderSetting().subscribe((res: any) => {
      this.pointOfSale = res.pos;
      this.Properties = res.setting;
      this.PrinterName = res.PrinterName;
      this.permission = res.permission?.screenPermission;
      // this.grid.refresh();
      this.showgrid = true;
      this.PaidFilterList = [
        { OptionPaidId: 1, Name: this.translate.instant('delivery.All') },
        { OptionPaidId: 2, Name: this.translate.instant("delivery.paid") },
        { OptionPaidId: 3, Name: this.translate.instant("delivery.notPaid") }
      ];
    });
  }
  get disablePrint(){
    return !this.permission?.Print;
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

  SaveFollowOrderSetting() {
    this.followOrdersService.SaveFollowOrderSetting(this.Properties).subscribe((res) => {
      if (res == 1) {
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
        $("#modal-101").modal("hide");
        this.GetFollowOrderSetting();
      }
    });
  }
  getFirstchar() {
    let names: any[] = [];
    if (this.filterdDrivers) {
      this.filterdDrivers.forEach((p: any) => {
        names.push(p.DriverName);
      });
    }
    let l = names
      .map((item) => item?.charAt(0).toLowerCase())
      .filter((value, index, self) => self.indexOf(value) === index);
    return l;
  }

  clickedBtnCheck(e: any) {
    if (this.Drivers && e) {
      e = e.toLowerCase();
      this.filterdDrivers = this.deepCopy(
        this.Drivers.filter((prod: any) => prod.DriverName.toLowerCase().startsWith(e))
      );
    } else this.filterdDrivers = this.Drivers;
  }
  assignAll(event:any) {
    this.Orders?.forEach(order => {
      order.IsSelected = !event.target?.checked;
      this.onRowSelected(order);
    });
  }
  get checkAssignAll(){
    return this.Orders?.every((item:any) => item.IsSelected);
  }
  get checkSelectedOrders(){
    return this.Orders?.some((x) => x.IsSelected == true)
  }
  //#endregion
}
