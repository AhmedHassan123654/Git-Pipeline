import { Component, ViewChild } from "@angular/core";
import {
  SelectionService,
  RowSelectEventArgs,
  GridComponent,
  ToolbarService,
  EditService,
  PageService} from "@syncfusion/ej2-angular-grids";
import { PopUpReturnOrderFiltterModel } from "src/app/core/Models/order/pop-up-return-order-filtter-model";
import { OrderDetailModel } from "src/app/core/Models/Transactions/order-detail-model";
import * as imp from "../return-order-imports";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";

import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { ReturnOrderDetailModel, ReturnOrderModel } from "../return-order-imports";
import { CustomerModel } from "src/app/core/Models/Transactions/CustomerModel";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { DatePipe } from "@angular/common";
declare var Stimulsoft: any;
declare let $: any;

@Component({
  selector: "app-returnorder",
  templateUrl: "./returnorder.component.html",
  styleUrls: ["./returnorder.component.css"],
  //  providers: [SelectionService]
  providers: [ToolbarService, EditService, PageService, SelectionService]
})
export class ReturnorderComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  controlpopup = true;
  responsedata = [];
  PaymentTypeList: [] = [];
  returnOrderObj3: ReturnOrderModel = new ReturnOrderModel();
  responseobj: ReturnOrderModel = new ReturnOrderModel();
  returnAllObj: ReturnOrderModel = new ReturnOrderModel();
  invoiceSummaryObj: ReturnOrderModel = new ReturnOrderModel();
  currentUserId: string;
  MyReturnOrder: ReturnOrderModel[];
  invoiceSummaryArr: ReturnOrderModel[];
  OrderDetailModelObj: OrderDetailModel = new OrderDetailModel();
  public OrderDetails: OrderDetailModel[] = [];
  public Orders: imp.OrderModel[] = [];
  public myOrder: imp.OrderModel = new imp.OrderModel();
  public filtterOrder: PopUpReturnOrderFiltterModel = new PopUpReturnOrderFiltterModel();
  breakSave: boolean = false;
  showCustomer: boolean = false;
  ReturnOrderDetailsObj: imp.ReturnOrderDetailModel = new imp.ReturnOrderDetailModel();
  @ViewChild("mastergrid") public mastergrid: GridComponent;
  @ViewChild("detailgrid") public detailgrid: GridComponent;
  @ViewChild("grid") public grid: GridComponent;
  @ViewChild("OrderPay") public OrderPay: GridComponent;
  @ViewChild("ReturnOrderPay") public ReturnOrderPay: GridComponent;
  oading: boolean = true;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  //#endregion
  returnAllOrder: ReturnOrderModel[];
  selectedReturnItem: ReturnOrderModel[];
  returnOrderList: ReturnOrderDetailModel[] = [];
  itemOrder: string = "";
  selectAllIsCheckedUnChecked: boolean = false;
  returnOrderListItemPrice: any;
  checkReturnDelivery: boolean = false;
  selectedProductRemindedQty: any;
  ProductREemindedId: any;
  mainRemaindValue: any;
  selectedReturnProduct: imp.ReturnOrderDetailModel = new imp.ReturnOrderDetailModel();
  mainProductValue: any;
  totalTaxReturnOrder: any;
  showHideReturnOrderList: boolean = false;
  returnObj: ReturnOrderModel = new ReturnOrderModel();
  deliverPrice: number = 0;
  selectedInvoiceOrderType: number;
  //selectedReturnProduct: BehaviorSubject<ReturnOrderDetailModel> = new BehaviorSubject(new ReturnOrderDetailModel());
  customerFlds = { text: "Name", value: "DocumentId" };

  constructor(
    public returnOrderService: imp.ReturnOrderService,
    public orderSer: OrderService,
    public toastr: imp.ToastrService,
    public toastrMessage: imp.HandlingBackMessages,
    public router: imp.Router,
    public settingService: imp.SettingService,
    public dashboardSer: imp.DashboardService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public datepipe: DatePipe
  ) {
    super();
    this.initializeobjects();
    console.log("responseobj", this.responseobj);
    console.log("invoiceSummaryObj", this.invoiceSummaryObj);

  }

  //#region ReturnOrder Methods
  initializeobjects(): void {
    //  this.responseobj={};
    this.settings = {};
    this.printDetailobj = {};
    this.filtterOrder.FromDate = this.datepipe.transform(new Date(), this.dateOnlyFormat);
    this.filtterOrder.ToDate = this.datepipe.transform(new Date(),  this.dateOnlyFormat);
    this.service = this.returnOrderService;
    this.settingService.GetSettings().subscribe((data: SettingModel) => {
      this.settings = data;
      if (this.settingobj) this.fraction = "." + this.settingobj.Round + "-" + this.settingobj.Round;
      if (this.settings && this.settings.SystemMainLanguage > 0)
        this.printDetailobj.LanguageId = this.settings.SystemMainLanguage;
      else this.printDetailobj.LanguageId = 2;
    });
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.service.pinUserId = this.request.state?.PinUserId;
    this.languageSerService.currentLang.subscribe((lan) => this.translate.use(lan));

  }
  setupOrderMasterTaxes(){
    if(this.responseobj.Taxes && this.responseobj.Taxes.length)
      this.taxes = this.responseobj.Taxes;
    if(this.responseobj.ReturnOrderMasterTaxes && this.responseobj.ReturnOrderMasterTaxes.length)
      this.responseobj.isServiceChargeReturned = true;
  }
  ngOnInit() {
    if (this.request.PageNumber != null) {
      this.scrFirstOpen().subscribe(() => {
        this.setupOrderMasterTaxes();
        this.GetAllpayTypeName();
        this.stopDeleteEdit();
        this.editeFromGridSubject();
      });
    } else {
      this.scrFirstOpen().subscribe(() => {
        this.setupOrderMasterTaxes();
        this.stopDeleteEdit();
        this.firstOpenSubject();
      });
    }
    // this.filterCustomers({text:'011'});
    this.currentUserId = JSON.parse(localStorage.getItem("UserLoginDocumentId")).CreatorUserId;
  }

  firstOpenSubject() {
    this.disableflage = true;
    this.checkflage = true;
    // this.showCustomer=false;
    if (
      this.responseobj.CustomerDocumentID != null &&
      this.responseobj.CustomerDocumentID != "" &&
      this.responseobj.CustomerDocumentID != undefined
    ) {
      this.showCustomer = true;
    } else {
      this.showCustomer = false;
    }
    this.getAllUsers();
    this.GetAllpayTypeName();
    if (this.responseobj.Order)
      this.myOrder = this.responseobj.Order;

    if (this.responseobj.POSReturnOrderDetails != undefined) {
      this.returnOrderList = this.responseobj.POSReturnOrderDetails;
      this.responseobj.POSReturnOrderDetails.forEach((item) => {
        item.ReturnOrderTotal = item.ReturnedQuantity * item.ProductPrice;
        item.IsDisabled = true;
      });
    }

    this.MySubTotal = this.responseobj.SubTotal;
    this.MyReturnOrder = [];
    this.mylist = [];
    this.mylist.push(this.responseobj);
    this.MyReturnOrder = this.mylist;
    this.InvoiceSummaryOfReturnOrderList();
  }

  editeFromGridSubject() {
    if (this.responseobj.Order)
      this.myOrder = this.responseobj.Order;

    if (
      this.responseobj.CustomerDocumentID != null &&
      this.responseobj.CustomerDocumentID != "" &&
      this.responseobj.CustomerDocumentID != undefined
    ) {
      this.showCustomer = true;
    } else {
      this.showCustomer = false;
    }
    this.GetAllpayTypeName();
    this.disableflage = true;
    this.checkflage = true;
    this.responseobj.POSReturnOrderDetails.forEach((item) => {
      item.Ischecked = true;
    });
    this.MyReturnOrder = [];
    this.MyReturnOrder.push(this.responseobj);
  }

  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    if(!this.responseobj.screenPermission) this.responseobj.screenPermission = {};
    this.responseobj.screenPermission.Edit = false;
    if(this.service.pinUserId){
      this.responseobj.PinUserId = this.service.pinUserId;
      this.responseobj.screenPermission.Delete = false;
    } 

    switch (event) {
      case imp.quickAction.afterNew:
        this.returnOrderList = [];
        this.afterNew({ dateFields: ["ReturnDate"] }).subscribe(() => {
          /*  this.Orders=[];
        this.Orders=this.responsedata; */
          this.stopDeleteEdit();
          this.controlpopup = false;
          this.showCustomer = false;
          this.editSettings = {
            allowEditing: true,
            allowAdding: true,
            allowDeleting: true,
            newRowPosition: "Top"
          };
        });
        this.FilterOrders();

        break;
      case imp.quickAction.beforeAdd:
        if (this.returnedQuantityValidate() === false) break;
        this.beforeinsert();
        this.returnOrderList = [];
        this.returnOrderList = this.responseobj.POSReturnOrderDetails;
        this.stopDeleteEdit();
        this.getReturnReportTranslationObj(this.responseobj);
        this.responseobj.OrderTypeName = this.responseobj?.Order?.OrderType?.Name;
        this.validateRTOrder();
        break;
      case imp.quickAction.afterAdd:
        this.GetAllpayTypeName();
        this.disableflage = true;
        this.checkflage = true;
        this._service = this.returnOrderService;
        this.Print(this.responseobj);
        break;
      case imp.quickAction.afterModify:
        this.Asyncdata(this.responseobj);
        //  this.GetAllpayTypeName();
        this.disableflage = false;
        this.checkflage = true;
        this.stopDeleteEdit();
        break;
      case imp.quickAction.afterDelete:
        this.afterDelete();
        this.stopDeleteEdit();
        break;
      case imp.quickAction.beforeUpdate:
        this.beforeUpdate();
        this.stopDeleteEdit();
        this.getReturnReportTranslationObj(this.responseobj);
        this.responseobj.OrderTypeName = this.responseobj?.Order?.OrderType?.Name;
        break;
      case imp.quickAction.afterUndo:
        // this.GetAllpayTypeName();
        this.disableflage = true;
        this.checkflage = true;
        //    this.responseobj.Order==
        this.stopDeleteEdit();
        break;
    }
  }

  stopDeleteEdit() {
    if(!this.responseobj?.screenPermission) return;
    this.responseobj.screenPermission.Edit = false;
    if (this.settings && this.settings.CountryType == 2) this.responseobj.screenPermission.Delete = false;
    if(this.service.pinUserId) this.responseobj.screenPermission.Delete = false;
  }

  Asyncdata(data: imp.ReturnOrderModel) {
    this.returnOrderService.Asyncdata(data).subscribe((res) => {
      this.responseobj.POSReturnOrderDetails = new Array<imp.ReturnOrderDetailModel>();
      this.responseobj.POSReturnOrderDetails = res as imp.ReturnOrderDetailModel[];
      this.responseobj.POSReturnOrderDetails.forEach((item) => {
        item.Ischecked = true;
      });
    });
  }

  GetAllpayTypeName() {
    this.returnOrderService.GetPaymentTypeList().subscribe((res) => {
      this.paymentTypeList = res as any;
      this.PaymentTypeFlds = { text: "Name", value: "DocumentId" };
      this.testdata = this.paymentTypeList;
      this.fids = this.PaymentTypeFlds;
    });
  }

  afterPag(event: any): void {
    /*  let pay=event.PaymentTypeList[0];
  
    if(pay.PayType==20){
    this.showCustomer=true;
   }
   else{
    this.showCustomer=false;
   } */
    if (event.CustomerDocumentID != null && event.CustomerDocumentID != "" && event.CustomerDocumentID != undefined) {
      this.showCustomer = true;
    } else {
      this.showCustomer = false;
    }
    this.disableflage = true;
    this.checkflage = true;
    this.GetAllpayTypeName();
    // this.responseobj = new ReturnOrderModel();
    this.responseobj = event;
    this.responseobj.NetTotal = event.NetTotal;
    this.responseobj.TotalTaxAmount = event.TotalTaxAmount;
    this.responseobj.TotalDiscountAmount = event.TotalDiscountAmount;
    // this.responseobj.ServiceChargeValue = event.ServiceChargeValue;
    this.responseobj.DeliveryPrice = event.DeliveryPrice;
    this.responseobj.SubTotal = event.SubTotal;
    this.returnOrderList = this.responseobj.POSReturnOrderDetails;
    this.invoiceSummaryArr = [];
    this.invoiceSummaryArr.push(this.responseobj);
    this.MyReturnOrder = [];
    this.mylist = [];
    this.mylist.push(this.responseobj);
    this.MyReturnOrder = this.mylist;
    this.myOrder = event.Order ?? new imp.OrderModel();
    this.setupOrderMasterTaxes();
    this.stopDeleteEdit();
    this.formPaging({ formObj: event });
  }
  //#endregion

  getAllUsers() {
    this.dashboardSer.getAllUsersInfo().subscribe((res) => {

      this.CashierList = res as any;
      this.cashierFlds = { text: "UserName", value: "AppUserId" };
    });
  }

  initializeGrid() {
    this.editSettings = {
      allowEditing: false,
      allowAdding: false,
      allowDeleting: false,
      newRowPosition: "Top"
    };
    this.pageSettings = { pageSizes: true, pageSize: 5 };
    this.editparams = { params: { popupHeight: "300px" } };
    this.selectionSettings = {
      persistSelection: true,
      type: "Multiple",
      checkboxOnly: true
    };
  }

  validateRTOrder(){
    let valid = true;
    if(this.responseobj.Order &&  this.responseobj.SubTotal && this.responseobj.SubTotal >= this.responseobj.Order.SubTotal 
      && this.responseobj.POSReturnOrderDetails?.length < this.responseobj.Order.OrderDetails?.filter(x=>x.ProductQuantity > 0)?.length && !this.responseobj?.IsMultiOrders){
        valid = false;
        this.toastr.error(this.translate.instant("ReturnOrder.ReturnOrderNotValid"))
      }
      // if not vaild make form not valid
      if(valid === false) this.frmRef.controls['CashierId']?.setErrors({ required: true });
  }
  beforeinsert() {
    let data = 0.0;
    this.responseobj.POSReturnOrderPayments.forEach((item) => {
      data += item.PayAmount;
    });
    let SubTotal = 0.0;
    this.responseobj.POSReturnOrderDetails = this.returnOrderList;
    this.responseobj.POSReturnOrderDetails.forEach((item2) => {
      SubTotal += item2.ReturnOrderTotal;
    });

    this.mylist = [];
    this.ReturnOrderDetailsObj = new imp.ReturnOrderDetailModel();

    this.responseobj.POSReturnOrderDetails.forEach((item) => {
      // save the Details
      if (item.Ischecked == true && item.ReturnedQuantity > 0) {
        this.ReturnOrderDetailsObj.DocumentId = null;
        this.ReturnOrderDetailsObj.TaxAmount = item.TaxAmount;
        this.ReturnOrderDetailsObj.ProductDocumentId = item.ProductDocumentId;
        this.ReturnOrderDetailsObj.ProductId = item.ProductId;
        this.ReturnOrderDetailsObj.ProductName = item.ProductName;
        this.ReturnOrderDetailsObj.ProductPrice = item.ProductPrice;
        this.ReturnOrderDetailsObj.ProductFinalPrice = item.ProductFinalPrice;
        this.ReturnOrderDetailsObj.ProductQuantity = item.ProductQuantity;
        this.ReturnOrderDetailsObj.ReturnOrderId = item.ReturnOrderId;
        this.ReturnOrderDetailsObj.ReturnedQuantity = Number(item.ReturnedQuantity);
        this.ReturnOrderDetailsObj.ReturnReasonDetail = item.ReturnReasonDetail;
        this.ReturnOrderDetailsObj.ServiceChargeValue = item.ServiceChargeValue;
        this.ReturnOrderDetailsObj.ProductVolumName = item.ProductVolumName;
        this.ReturnOrderDetailsObj.ReturnOrderTotal = item.ReturnOrderTotal;
        this.ReturnOrderDetailsObj.VolumeId = item.VolumeId;
        this.ReturnOrderDetailsObj.VolumeDocumentId = item.VolumeDocumentId;
        this.ReturnOrderDetailsObj.DiscountAmount = item.DiscountAmount;
        this.ReturnOrderDetailsObj.Id = item.Id;
        this.ReturnOrderDetailsObj.OrderDetailId = item.OrderDetailId;
        this.ReturnOrderDetailsObj.OrderDetailDocumentId = item.OrderDetailDocumentId;
        this.ReturnOrderDetailsObj.CancellationReason = item.CancellationReason;
        this.ReturnOrderDetailsObj.RealPrice = item.RealPrice;
        this.ReturnOrderDetailsObj.ReturnOrderDetailTaxes = item.ReturnOrderDetailTaxes;
        this.mylist.push(this.ReturnOrderDetailsObj);
        this.ReturnOrderDetailsObj = new imp.ReturnOrderDetailModel();
      }
    });
    if (this.mylist.length != 0) {
      this.responseobj.POSReturnOrderDetails = this.mylist;
      this.mylist = [];
    }
    if (this.MyReturnOrder[0].SubTotal != 0) {
      this.responseobj.SubTotal = this.responseobj.isMinChargeReturned ? this.returnAllObj.SubTotal + (this.responseobj?.Order?.MinimumChargeDifferance ?? 0) : this.returnAllObj.SubTotal;
      this.responseobj.NetTotal = this.returnAllObj.NetTotal;
      this.responseobj.TotalTaxAmount = this.returnAllObj.TotalTaxAmount;
      this.responseobj.TotalDiscountAmount = this.returnAllObj.TotalDiscountAmount;
      this.responseobj.DeliveryPrice = this.returnAllObj.DeliveryPrice;
      this.responseobj.MinimumChargeDifferance = this.responseobj.isMinChargeReturned ? (this.responseobj?.Order?.MinimumChargeDifferance ?? 0) : 0;
      // this.responseobj.ServiceChargeValue = this.returnAllObj.ServiceChargeValue;
      this.responseobj.POSReturnOrderPayments[0].PayAmount = this.responseobj.SubTotal;
      this.responseobj.POSReturnOrderPayments[0].Amount = this.responseobj.SubTotal;
    }
  }

  beforeUpdate() {
    this.CalculateReturnOrderTotal();
    let data = 0.0;
    this.responseobj.POSReturnOrderPayments.forEach((item) => {
      data += item.PayAmount;
    });
    let SubTotal = 0.0;
    this.responseobj.POSReturnOrderDetails.forEach((item2) => {
      SubTotal += item2.ReturnOrderTotal;
    });
  }

  ClosePopup() {
    if (this.responseobj.Order != undefined || this.responseobj.Order != null) {
      this.controlpopup = true;
    } else {
      if (this.request.PageNumber != null) {
        this.scrFirstOpen().subscribe(() => {
          this.editeFromGridSubject();
        });
      } else {
        this.afterUndo();
      }
      this.controlpopup = true;
    }
  }

  FilterOrders() {
    const fromVal: any = this.filtterOrder?.FromDate;
    const toVal: any = this.filtterOrder?.ToDate;
    if (fromVal && toVal) {
      const fromDate = new Date(fromVal);
      const toDate = new Date(toVal);
      if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
        if (fromDate > toDate) {
          this.filtterOrder.FromDate = toVal;
        }
      }
    }
    this.requestStarted = true;
    this.returnOrderService.GetAllOrdersbyDateAndUser(this.filtterOrder).subscribe({
      next : (res) =>{
        this.Orders = res as imp.OrderModel[];
        this.requestStarted = false;
      },
      error: (err) => {
        this.toastr.error(err);
        this.requestStarted = false;
      }
    });
  }

  // public onRowSelected(args: RowSelectEventArgs): void {
  //   debugger
  //   const queryData: any = args.data.valueOf();
  //   if (queryData.DocumentId != null || queryData.DocumentId != undefined) {
  //     this.returnOrderService.GetOrderDetails(queryData.DocumentId).subscribe((res) => {
  //       this.OrderDetails = [];
  //       this.OrderDetails = res as OrderDetailModel[];
  //       this.detailgrid?.refresh();
  //     });
  //   }
  // }

  checkboxChangemastergrid(args: any) {
    if(!this.responseobj?.IsMultiOrders) {
      this.Orders.forEach((item) => {
       item.IsView = false;
      });
    }

    this.mastergrid.refresh();
    let currentRowObject: any = this.mastergrid.getRowObjectFromUID(
      args.event.target.closest("tr").getAttribute("data-uid")
    );
    let currentRowData: Object = currentRowObject.data;
    currentRowData["IsView"] = args.checked;
    if (currentRowData["IsView"] === true) {
      this.selectedInvoiceOrderType = currentRowData["OrderType"].Value
    }
    // let rowIndex: any = args.event.target.closest("td").getAttribute("index");

    this.myID = currentRowData.valueOf();
    if (this.currentUserId != '1' &&this.myID?.ClosingUserId != this.currentUserId && this.settings?.PreventChangeCashierInReturnOrder) {
      this.toastr.warning("you have no access", "Authorization denied");
    }
  }

  GetthisOrderData() {
    if(this.responseobj.IsMultiOrders && !this.Orders?.some(x=>x.IsView))
      return false;

    if (this.myID == undefined || this.myID == null) 
      return false;

    else if (this.currentUserId != '1' && this.myID?.ClosingUserId != this.currentUserId && this.settings?.PreventChangeCashierInReturnOrder) {
      this.toastr.warning("you have no access", "Authorization denied");
      return false;
    }

    this.showHideReturnOrderList = true;
    this.mylist = [];
    const isMultiOrders = this.responseobj.IsMultiOrders;
    this.responseobj = new imp.ReturnOrderModel();
    if(isMultiOrders){
      this.returnOrderService.getSelectedOrdersData(this.Orders.filter(x=>x.IsView).map(x=> x.DocumentId)).subscribe((res: any) => {
        this.generateReturnOrderObject(res);
      });
    }
    else{
      this.returnOrderService.GetthisOrderData(this.myID.DocumentId).subscribe((res: any) => {
        const response = {ReturnOrders : [res.ReturnOrder] , PaymentTypeList:res.PaymentTypeList} 
        this.generateReturnOrderObject(response);
      });
    }
    this.controlpopup = true;
    this.InvoiceSummaryOfReturnOrderList();
  }

  generateReturnOrderObject(responses:{ ReturnOrders:any[] ,PaymentTypeList:any[]}){
    const response = responses;
    this.myOrder = response.ReturnOrders[0]?.Order ?? new imp.OrderModel();
    this.responseobj = response.ReturnOrders[0];
    if(response.ReturnOrders?.length > 1) this.responseobj.IsMultiOrders = true;

    this.responseobj.Order = response.ReturnOrders[0].Order;
    this.responseobj.ReturnDate = response.ReturnOrders[0].ReturnDate;
    this.responseobj.DeliveryPrice = this.myOrder.DeliveryPrice;
    this.responseobj.TotalDiscountAmount = this.myOrder.DiscountAmount;
    this.responseobj.TotalTaxAmount = this.myOrder.TotalTaxAmount;
    this.responseobj.NetTotal = this.myOrder.NetTotal;
    this.responseobj.SubTotal = this.myOrder.SubTotal;
    this.responseobj.ServiceChargeValue = this.myOrder.ServiceChargeValue;
    if (this.myOrder.OrderMasterTaxes && this.myOrder.OrderMasterTaxes.length > 0)
      this.responseobj.OrderMasterTaxesTotal = this.myOrder.OrderMasterTaxes.map((x) => x.TaxAmount).reduce(
        (a: any, b: any) => {
          return a + b;
        }
      ) as number;
    ///////////////////////ProductPriceBasedOnIncludeTaxOption
    this.myOrder.OrderDetails.forEach((args) => {
      if (this.settings.PriceIncludesTax) {
        args.ProductPrice = args.ProductPrice - args.TaxAmount;
      }
    });

    this.myOrder.OrderDetails.forEach((d) => {
      d.OrderDetailTaxes.forEach((dt) => {
        dt.ProductQuantity = d.ProductQuantity;
      });
    });

    let orderDetailTaxes = this.myOrder.OrderDetails.map((g) => g.OrderDetailTaxes).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    if (orderDetailTaxes && orderDetailTaxes.length > 0) {
      this.responseobj.OrderDetailTaxesTotal = orderDetailTaxes
        .map((x) => x.TaxValue * x.ProductQuantity)
        .reduce((a: any, b: any) => {
          return a + b;
        }) as number;
    }
    this.mylist.push(this.responseobj);
    this.MyReturnOrder = this.mylist;

    this.responseobj.POSReturnOrderDetails = (response.ReturnOrders as any).flatMap(x=>x.POSReturnOrderDetails);
    const allOrders = response.ReturnOrders.map(x=>x.Order);

    this.responseobj.POSReturnOrderDetails.forEach((item) => {
      item.Ischecked = true;
      item.ReturnedQuantity = item.RemaindQuantity;
      item.ReturnOrderTotal = (item.ProductPrice - item.DiscountAmount + item.TaxAmount) * item.ReturnedQuantity;
      item.OrderNumber = allOrders.find(x=>x.OrderDetails.some(d=>d.DocumentId === item.OrderDetailId))?.OrderNumber;
    });
    this.responseobj.POSReturnOrderPayments = response.ReturnOrders[0].POSReturnOrderPayments;
    this.responseobj.POSReturnOrderPayments[0].PayTypeDocumentId = this.myOrder.OrderPayments[0].PayTypeDocumentId;
    this.responseobj.POSReturnOrderPayments[0].PayAmount = this.responseobj.SubTotal;

    this.disableflage = false;
    this.checkflage = false;
  }

  checkboxChangegrid(args: any, index: any) {
    if (args.Ischecked === true && args.ReturnedQuantity > args.RemaindQuantity) {
      return false;
    }
    if (args.Ischecked === false) {
      this.returnOrderList.splice(index, 1);
      this.InvoiceSummaryOfReturnOrderList();
    }
  }

  returnedQuantityValidate() {
    this.returnOrderObj = new imp.ReturnOrderModel();
    let POSReturnOrderDetails: imp.ReturnOrderDetailModel[];
    POSReturnOrderDetails = this.responseobj.POSReturnOrderDetails;
    let errorExist = POSReturnOrderDetails.filter((x) => x.ReturnedQuantity <= 0 && x.DocumentId != null)[0];
    if (errorExist) {
      this.toastr.warning(this.toastrMessage.GlobalMessages(19));
      this.issue = false;
    }
    POSReturnOrderDetails.forEach((args) => {
      if (args.ReturnedQuantity > args.RemaindQuantity) {
        this.toastr.warning(this.toastrMessage.GlobalMessages(18));
        this.issue = false;
      }
    });
    return this.issue;
  }

  PlusProductRemindedQty(item: any) {
    if (item.ReturnedQuantity < item.RemaindQuantity) {
      item.ReturnedQuantity++;
    }
  }

  MinusProductRemindedQty(item: any) {
    if (item.ReturnedQuantity > 1) {
      item.ReturnedQuantity--;
    }
  }
  changeProductRemindedQty(item: any , quantity) {
    if (quantity > 0 && item.RemaindQuantity > 0 && item.UseWeights) {
      if(quantity > item.RemaindQuantity)
        item.ReturnedQuantity = item.RemaindQuantity;
      else
        item.ReturnedQuantity = quantity;
    }
  }
  SetReturnQty(item: any) {
    if (item.RemaindQuantity == 0) return;
    this.selectedReturnProduct = item;
    this.mainRemaindValue = item.RemaindQuantity;
    this.mainProductValue = item.ProductQuantity;
    item.ReturnedQuantity = 1;
    this.selectedProductRemindedQty = item.RemaindQuantity;
    if(item.UseWeights){
      this.selectedReturnProduct.ReturnedQuantity=item.RemaindQuantity;
    }
    $("#returnReasonItemModal").modal("show");
  }

  SubmitReturnOrderItems(item: any, index: number) {
    if (this.returnOrderList && this.returnOrderList.length > 0) {
      let exist = this.returnOrderList.find((x) => x.OrderDetailDocumentId == item.OrderDetailDocumentId ||
        x.OrderDetailId == item.OrderDetailId)
      if (exist) {
        // this.toastr.warning(this.toastrMessage.GlobalMessages(6));
        // return false;
      }
      else {
        item.Ischecked = true;
        this.returnOrderList.push(item);
        this.toastr.success(this.toastrMessage.GlobalMessages(39));
      }
    } else {
      item.Ischecked = true;
      this.returnOrderList.push(item);
      this.toastr.success(this.toastrMessage.GlobalMessages(39));
    }
    this.returnOrderList;
    this.InvoiceSummaryOfReturnOrderList();
  }

  DeleteReturnOrderItem(index: any) {
    this.returnOrderList.splice(index, 1);
    // this.toastr.success(this.toastrMessage.GlobalMessages(3));
    this.InvoiceSummaryOfReturnOrderList();
  }

  SelectAllReturnOrder() {
    if (this.selectAllIsCheckedUnChecked === true) {
      this.checkReturnDelivery = true;
      this.responseobj.POSReturnOrderDetails.forEach((item) => {
        if (item.RemaindQuantity > 0) {
          item.ReturnedQuantity = item.RemaindQuantity;
          item.Ischecked = true;
          if (!this.returnOrderList.includes(item)) {
            this.returnOrderList.push(item);
          }
        }
      });
      this.deliverPrice = this.responseobj.DeliveryPrice ? this.responseobj.DeliveryPrice : 0;
    } else {
      this.checkReturnDelivery = false;
      this.deliverPrice = 0;
      this.responseobj.POSReturnOrderDetails.forEach((item) => {
        item.ReturnedQuantity = 0;
      });
      this.returnOrderList.length = 0;
    }
    this.InvoiceSummaryOfReturnOrderList();
  }

  CalculateReturnOrderListItemPrice(TaxValueOfServiceCharge:number) {
    this.returnOrderListItemPrice = 0;
    this.returnAllObj = new ReturnOrderModel();
    this.returnOrderList.forEach((item) => {
      item.ReturnOrderTotal = (item.ProductPrice - item.DiscountAmount + item.TaxAmount) * item.ReturnedQuantity;
      this.totalTaxReturnOrder += item.TaxAmount * item.ReturnedQuantity;
      if (!this.returnAllObj.OrderDetailTaxesTotal) this.returnAllObj.OrderDetailTaxesTotal = 0;
      if (!this.returnAllObj.OrderMasterTaxesTotal) this.returnAllObj.OrderMasterTaxesTotal = 0;
      this.returnAllObj.OrderDetailTaxesTotal += item.TaxAmount * item.ReturnedQuantity;
      this.returnAllObj.OrderMasterTaxesTotal += item.ServiceChargeTaxAmount;
      this.returnAllObj.ServiceChargeValue = this.responseobj.ServiceChargeValue;
      this.returnAllObj.TotalTaxAmount += item.TaxAmount * item.ReturnedQuantity;
      this.returnAllObj.TotalDiscountAmount += item.DiscountAmount * item.ReturnedQuantity;
      this.returnAllObj.NetTotal += item.ProductPrice * item.ReturnedQuantity;

      this.returnAllObj.DeliveryPrice = this.deliverPrice;
      // this.returnOrderListItemPrice +=  (item.ProductPrice - item.DiscountAmount + item.TaxAmount) * item.ReturnedQuantity;
    });
    this.returnAllObj.TotalTaxAmount += TaxValueOfServiceCharge;

    this.returnAllObj.SubTotal =
        this.returnAllObj.NetTotal -
        this.returnAllObj.TotalDiscountAmount +
        this.returnAllObj.TotalTaxAmount +
        this.returnAllObj.DeliveryPrice +
        this.returnAllObj.ServiceChargeValue;

    this.selectedReturnItem = [];
    this.selectedReturnItem.push(this.returnAllObj);
  }

  ReturnDeliveryPrice() {
    if (this.checkReturnDelivery === true) {
      this.deliveryTax = (this.responseobj?.Order?.OrderMasterTaxes?.find(x => x.ServiceTaxType == 1)?.TaxAmount) ?? 0;
      this.deliverPrice = this.responseobj.DeliveryPrice;
      this.InvoiceSummaryOfReturnOrderList();
    } else {
      this.deliveryTax = 0;
      this.deliverPrice = 0;
      this.InvoiceSummaryOfReturnOrderList();
    }
  }

  CalculateReturnOrderTotal() {
    this.responseobj = new imp.ReturnOrderModel();
    let POSReturnOrderDetails: imp.ReturnOrderDetailModel[];
    POSReturnOrderDetails = this.responseobj.POSReturnOrderDetails;
    let errorExist = POSReturnOrderDetails.filter((x) => x.ReturnedQuantity <= 0 && x.DocumentId != null)[0];
    if (errorExist) {
      this.toastr.warning(this.toastrMessage.GlobalMessages(19));
      return false;
    }

    //the info of selected order
    POSReturnOrderDetails.forEach((args) => {
      if (args.ReturnedQuantity > args.RemaindQuantity) {
        this.toastr.warning(this.toastrMessage.GlobalMessages(18));
        return false;
      }
      //first
      if (args.ReturnedQuantity > 0 && args.Ischecked == true) {
        args.ReturnOrderTotal = (args.ProductPrice - args.DiscountAmount + args.TaxAmount) * args.ReturnedQuantity;

        if (!this.responseobj.OrderDetailTaxesTotal) this.returnOrderObj.OrderDetailTaxesTotal = 0;
        if (!this.responseobj.OrderMasterTaxesTotal) this.returnOrderObj.OrderMasterTaxesTotal = 0;
        this.responseobj.OrderDetailTaxesTotal += args.TaxAmount * args.ReturnedQuantity;
        this.responseobj.OrderMasterTaxesTotal += args.ServiceChargeTaxAmount;
        // this.responseobj.ServiceChargeValue += args.ServiceChargeValue;
        this.responseobj.TotalTaxAmount += args.TaxAmount * args.ReturnedQuantity;
        this.responseobj.TotalDiscountAmount += args.DiscountAmount * args.ReturnedQuantity;
        this.responseobj.NetTotal += args.ProductPrice * args.ReturnedQuantity;

        this.responseobj.DeliveryPrice = 0;
        this.responseobj.SubTotal =
          this.responseobj.NetTotal -
          this.responseobj.TotalDiscountAmount +
          this.responseobj.TotalTaxAmount +
          this.responseobj.DeliveryPrice +
          this.responseobj.ServiceChargeValue;

        this.MyReturnOrder = [];
        this.MyReturnOrder.push(this.responseobj);

        this.responseobj.POSReturnOrderDetails = [];
        this.responseobj.POSReturnOrderDetails = POSReturnOrderDetails;
      }
    });
    this.responseobj.POSReturnOrderPayments[0].PayAmount = this.MyReturnOrder[0].SubTotal;
    this.InvoiceSummaryOfReturnOrderList();
  }
  returnServiceCharge(){
    this.responseobj.isServiceChargeReturned = !this.responseobj.isServiceChargeReturned;
    this.InvoiceSummaryOfReturnOrderList();
  }
  returnMinCharge(){
    this.responseobj.isMinChargeReturned = !this.responseobj.isMinChargeReturned;
    this.InvoiceSummaryOfReturnOrderList();
  }
  InvoiceSummaryOfReturnOrderList() {
    let TaxValueOfServiceCharge = this.handleServiceCharge();

    this.CalculateReturnOrderListItemPrice(TaxValueOfServiceCharge);
    for (const key in this.invoiceSummaryObj) {
      this.invoiceSummaryObj[key] = 0;
    }

    // if (!this.invoiceSummaryObj.OrderDetailTaxesTotal) this.invoiceSummaryObj.OrderDetailTaxesTotal = 0;
    // if (!this.invoiceSummaryObj.OrderMasterTaxesTotal) this.invoiceSummaryObj.OrderMasterTaxesTotal = 0;
    // this.invoiceSummaryObj.OrderDetailTaxesTotal = this.returnAllObj.OrderDetailTaxesTotal;
    // this.invoiceSummaryObj.OrderMasterTaxesTotal = this.returnAllObj.OrderMasterTaxesTotal;

    // this.invoiceSummaryObj.ServiceChargeValue = this.returnAllObj.ServiceChargeValue;
    this.invoiceSummaryObj.ServiceChargeValue = this.responseobj.ServiceChargeValue;
    this.invoiceSummaryObj.ReturnOrderMasterTaxes = this.responseobj.ReturnOrderMasterTaxes;

    this.invoiceSummaryObj.TotalTaxAmount = this.returnAllObj.TotalTaxAmount + (this.deliveryTax ?? 0);
    this.invoiceSummaryObj.NetTotal = this.returnAllObj.NetTotal;
    this.invoiceSummaryObj.DeliveryPrice = !this.deliverPrice ? 0 : this.responseobj.DeliveryPrice;
    this.invoiceSummaryObj.TotalDiscountAmount = this.returnAllObj.TotalDiscountAmount;
    this.invoiceSummaryObj.MinimumChargeDifferance = (this.responseobj?.Order?.MinimumChargeDifferance ?? 0);
    this.invoiceSummaryObj.NetTotal = this.invoiceSummaryObj.NetTotal;

    this.invoiceSummaryObj.SubTotal =
      (this.invoiceSummaryObj?.NetTotal ?? 0) -
      (this.invoiceSummaryObj?.TotalDiscountAmount ?? 0) +
      (this.invoiceSummaryObj?.TotalTaxAmount ?? 0) +
      (this.deliverPrice ?? 0) +
      (this.responseobj.isMinChargeReturned ? this.responseobj?.Order?.MinimumChargeDifferance ?? 0 : 0) +
      (this.invoiceSummaryObj?.ServiceChargeValue ?? 0);

    this.invoiceSummaryArr = [];
    this.invoiceSummaryArr.push(this.invoiceSummaryObj);
  }

  handleServiceCharge(){
    let TaxValueOfServiceCharge = 0;
    if (this.responseobj.isServiceChargeReturned && this.responseobj.isMinChargeReturned) {
      this.responseobj.ServiceChargeValue = this.responseobj.Order.ServiceChargeValue;
      this.responseobj.ReturnOrderMasterTaxes = this.responseobj.Order.OrderMasterTaxes;
      if(this.taxes && this.taxes.length && this.responseobj.ReturnOrderMasterTaxes && this.responseobj.ReturnOrderMasterTaxes.length){
        const valueAddedTaxIds:string[] = this.taxes.filter(x=>x.Type == 1).map(x=>x.DocumentId);
        TaxValueOfServiceCharge = this.responseobj.ReturnOrderMasterTaxes.filter(x=> valueAddedTaxIds.includes(x.TaxDocumentId))
          .map(x=>x.TaxAmount).reduce((a, b) => { return Number(a) + Number(b);},0);
      }
    }
    else if (this.responseobj.isServiceChargeReturned) {
      this.responseobj.ServiceChargeValue = this.responseobj.Order.ServiceChargeValue;
      this.responseobj.ReturnOrderMasterTaxes = this.responseobj.Order.OrderMasterTaxes.filter(x=>x.ServiceTaxType != 2);

      if(this.taxes && this.taxes.length && this.responseobj.ReturnOrderMasterTaxes && this.responseobj.ReturnOrderMasterTaxes.length){
        const valueAddedTaxIds:string[] = this.taxes.filter(x=>x.Type == 1).map(x=>x.DocumentId);
        TaxValueOfServiceCharge = this.responseobj.ReturnOrderMasterTaxes.filter(x=> valueAddedTaxIds.includes(x.TaxDocumentId))
          .map(x=>x.TaxAmount).reduce((a, b) => { return Number(a) + Number(b);},0);
      }
    } else if (this.responseobj.isMinChargeReturned) {
      this.responseobj.ServiceChargeValue = 0;
      this.responseobj.ReturnOrderMasterTaxes = this.responseobj.Order.OrderMasterTaxes.filter(x=>x.ServiceTaxType == 2);

      if(this.taxes && this.taxes.length && this.responseobj.ReturnOrderMasterTaxes && this.responseobj.ReturnOrderMasterTaxes.length){
        const valueAddedTaxIds:string[] = this.taxes.filter(x=>x.Type == 1).map(x=>x.DocumentId);
        TaxValueOfServiceCharge = this.responseobj.ReturnOrderMasterTaxes.filter(x=> valueAddedTaxIds.includes(x.TaxDocumentId))
          .map(x=>x.TaxAmount).reduce((a, b) => { return Number(a) + Number(b);},0);
      }
    } else {
      this.responseobj.ServiceChargeValue = 0;
      this.responseobj.ReturnOrderMasterTaxes = [];
    }
    return TaxValueOfServiceCharge;
  }

  countPayAmount(PayAmount: any) {
    let result = new imp.ReturnOrderModel();
    result = this.MyReturnOrder[0];
    let data = Number(PayAmount);
    if (data != result.SubTotal) {
      this.breakSave = true;
      this.toastr.error(this.toastrMessage.GlobalMessages(17));
    } else {
      this.breakSave = false;
    }
  }

  afterDelete() {
    this.responseobj = new imp.ReturnOrderModel();
    this.MyReturnOrder = [];
  }

  ShowCustomers(data: any) {
    if (data.itemData.PayType == 20) {
      this.responseobj.CustomerDocumentID = "";

      this.showCustomer = true;
    } else {
      this.showCustomer = false;
    }
  }

  //#endregion
  PrintAfterAdd() {
    this.model = [];
    if (this.printDetailobj.LanguageId == 1) {
      this.model.push("");
      this.myjson = en["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.model.push("");
      this.myjson = ar["Reports"];
      this.model.push(this.myjson);
      this.model.push("ar");
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.model.push("");
      this.myjson = tr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.model.push("");
      this.myjson = fr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    this.model.push(this.printDetailobj.PrintModelId);
    this.model.push(this.printDetailobj.DestinationId);
    this.model.push(this.printDetailobj.FileFormatId);

    if (this.printDetailobj.DestinationId == 2) {
      this.model.push(this.printDetailobj.Reciever);
      this.model.push(this.printDetailobj.Title);
      this.model.push(this.printDetailobj.Message);
      this.ifPerview = false;
    } else {
      this.ifPerview = true;
    }

    this.returnOrderService.printAfterAdd(this.model).subscribe((data: Response) => {

      this.loading = false;
      this.report.loadDocument(data);
      this.viewer.report = this.report;
      this.viewer.renderHtml("myviewer");
      $("#modal-5").modal("show");
    });
    this.ifPerview = false;

    return false;
  }
  Print(data: any) {
    data.ImmediatePrint = true ;
    this.model = [];
    if (this.printDetailobj.LanguageId == 1) {
      this.model.push(data.DocumentId);
      this.myjson = en["Reports"];
      this.model.push(this.myjson);
      this.model.push("ar");
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.model.push(data.DocumentId);
      this.myjson = ar["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.model.push(data.DocumentId);
      this.myjson = tr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.model.push(data.DocumentId);
      this.myjson = fr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    this.model.push(data.ImmediatePrint)
    //// this._service.print _service is used in pagetransaction as an input 
    this._service.print(this.model).subscribe({
      next : (res : any) =>{
        data.ImmediatePrint = false;
        this.ifPerview = false;
        this.loading = false;

      },
      error: (err) => {
        this.toastr.error(this.translate.instant("messages.missingKOTPrinter"));
      }
    });
  }
  getReturnReportTranslationObj(returnOrder : ReturnOrderModel){
    let Direction : string = "ar";
    let finalLang : any;
    if (this.printDetailobj.LanguageId == 1) {
      Direction = "en";
      finalLang = this.deepCopy(en["Reports"]);
    }
    if (this.printDetailobj.LanguageId == 2) {
      Direction = "ar";
      finalLang = this.deepCopy(ar["Reports"]);
    }
    if (this.printDetailobj.LanguageId == 3) {
      Direction = "en";
      finalLang = this.deepCopy(tr["Reports"]);
    }
    if (this.printDetailobj.LanguageId == 4) {
      Direction = "en";
      finalLang = this.deepCopy(fr["Reports"]);

    }
    let LanguageOptions = {
      CurrentUserLang: Direction,
      ReportsJson: finalLang
    };
    returnOrder.LanguageOptions = LanguageOptions;
    return returnOrder;
  }
  PrintOrder(documentId: string) {
    // this.requestStarted = true;
    this.orderSer.PrintOrderWithPreview(documentId).subscribe(
      (data: any) => {
        // this.requestStarted = false;
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
      (err) => {}
    );
  }

  filterCustomers(searchterm?: any) {
    let model: CustomerModel = new CustomerModel();
    if (searchterm?.text?.length >= 3) {
      //search by phone
      if (Number(searchterm?.text) > 0)
        model.Phone = searchterm?.text;
        //search by name
      else
        model.Name = searchterm?.text;

      this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
        this.customers = res as CustomerModel[];
      });
    }
  }
}
