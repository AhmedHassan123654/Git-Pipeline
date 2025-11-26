//import { element } from "protractor";
import { OrderPaymentModel } from "./../../../core/Models/order/OrderPaymentModel";
import { LoginService } from "./../../../core/Services/Authentication/login.service";
import { CustomerModel } from "src/app/core/Models/Transactions/CustomerModel";
import { OrderPayTypeModel } from "./../../../core/Models/Transactions/order-pay-type-model";
import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter, Inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { CategoryModel } from "src/app/core/Models/Transactions/category-model";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { Router } from "@angular/router";
import { OrderComponent } from "../order/order.component";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { OrderMasterTaxModel } from "src/app/core/Models/Transactions/order-master-tax-model";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { OrderHelper } from "../OrderHelper";
import { SettingService } from "src/app/core/Services/Settings/SettingService";
import Swal from "sweetalert2";
import { DeliveryCustomerComponent } from "../deliverycustomer/deliverycustomer.component";
import { TranslateService } from "@ngx-translate/core";
import Keyboard from "simple-keyboard";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { MyPointDetailModel } from "../../../core/Models/order/MyPointDetail.Model";
import { CouponService } from "src/app/core/Services/Transactions/coupon.service";
import { OtelPrimoService } from "src/app/core/Services/Integrations/otel-primo.service";

declare var $: any;
@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent extends OrderHelper implements OnInit {
  [key: string]: any;
  get noteTerm(): string {
    return this._noteTerm;
  }
  set noteTerm(value: string) {
    this._noteTerm = value;
  }

  // Extra Notes Modal Methods
  openExtraNotesModal() {
    // Initialize extra notes if they are undefined
    if (this._orderobj.ExtraNote1 === undefined) this._orderobj.ExtraNote1 = '';
    if (this._orderobj.ExtraNote2 === undefined) this._orderobj.ExtraNote2 = '';
    if (this._orderobj.ExtraNote3 === undefined) this._orderobj.ExtraNote3 = '';
    
    // Show the modal
    $('#extraNotesModal').modal('show');
  }

  constructor(
    public _otelPrimoService: OtelPrimoService,
    public orderSer: OrderService,
    public toastr: ToastrService,
    public router: Router,
    private LoginSer: LoginService,
    @Inject(OrderComponent) private order: OrderComponent,
    public toastrMessage: HandlingBackMessages,
    public translate: TranslateService,
    private languageSerService: LanguageSerService,
    public settingServ: SettingService,
    private couponService: CouponService
  ) {
    super(settingServ, orderSer, toastr, toastrMessage, router, translate);
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  ordermastertaxobj: OrderMasterTaxModel = new OrderMasterTaxModel();
  ordermastertaxlist: OrderMasterTaxModel[] = [];
  config: any;
  ValidationPay: boolean;
  closedCalender: any;
  categorylist: CategoryModel[] = [];
  // totalpayment: number;
  selectedInput3 = "";
  vlv: boolean;
  paymentAmountList: any[] = [];
  employeeName: string;
  selectEmployee: any;
  selectedIndexOrderPayment: string;
  showCustomer: boolean;
  selectedNumInput = "";
  _isDelivery: boolean;
  canUseCashBack: boolean;
  clickedRedeemPoints: boolean = false;
  myPointCards: MyPointDetailModel[];
  couponNumber: string = "";
  couponChecked: boolean;
  returnedRoomObj: any[] = [];
  couponInvalid: boolean = false;
  customerInvalid: boolean = false;
  selectedRoomIndex: number;
  otelPrimoRooms: any = [];

  @ViewChild("PayAmount") PayAmount: ElementRef;
  @ViewChild(DeliveryCustomerComponent)
  deliveryCustomerComponent: DeliveryCustomerComponent;

  @Input("orderobj") _orderobj: OrderModel;

  @Output() backtoproductsEvent: EventEmitter<any> = new EventEmitter();
  @Input() validateOrder: (_orderobj: any) => boolean;
  private _noteTerm: string;

  ngOnInit() {
    if (!this._orderobj.OrderPayments[0].ReservationPayment) {
      this._orderobj.OrderPayments[0].Amount =
        this._orderobj?.TotalInsuranceAmount != 0 || this._orderobj?.TotalInsuranceAmount
          ? this._orderobj?.SubTotal + this._orderobj?.TotalInsuranceAmount
          : this._orderobj?.SubTotal;
    } else {
      this._orderobj.OrderPayments[0].Amount = this._orderobj.OrderPayments[0].PayAmount;
    }

    this.FLG = { text: "Name", value: "DocumentId" };
    this.PrintOrderWithDataSet(this._orderobj);
    this.validationList = this.getValidationOptions();
    if (this._orderobj.settings)
      this.fraction = "." + this._orderobj.settings.Round + "-" + this._orderobj.settings.Round;
    this.paymentFirstOpen();
    if (this._orderobj.OrderTypeId == undefined || this._orderobj.OrderType.Value == 2) {
      this.showCustomer = true;
    } else {
      this.showCustomer = false;
    }
    if (this._orderobj.myPoint && this._orderobj.myPoint.MyPointDetails.length > 0) {
      this.myPointCards = this._orderobj.myPoint.MyPointDetails;
    }
    if ((this._orderobj.settings.UseMyPoints && !this._orderobj?.OrderType?.ForStaff)|| this._orderobj.settings.UseMyCoupons) this.getCashBackPermission();

    if(this._orderobj.CouponApplied && !this._orderobj.DocumentId) {
      this.couponChecked = true;
      this.couponNumber = this._orderobj.CouponApplied;
      // this.orderSer.isCouponAccepted.next(true);
    }
  }
  getCashBackPermission() {
    if (this._orderobj.isAdmin == true) return (this.canUseCashBack = true);
    this.canUseCashBack = this._orderobj.userPermissions.some((x) => {
      return x.POSOrderPayTypes.some((p) => p.PayType === 70);
    });
  }
  cashBackToaster() {
    if (!this.canUseCashBack) {
      this.toastr.warning(this.translate.instant("messages.mustHaveCashBackPermission"));
    } else {
      this.myPointDetail = {};
      if (this._orderobj.myPoint && this._orderobj.myPoint.MyPointDetails.length > 0) {
        this.myPointCards = this.deepCopy(this._orderobj.myPoint.MyPointDetails);
        let defaultCard = this.deepCopy(this.myPointCards?.find(x => x.IsDefault && x.PointsCount > 0 && x.Value > 0));
        if(defaultCard){
          this.myPointCards.splice(this.myPointCards.indexOf(defaultCard), 1);
          const customerPoints = this._orderobj.Customer.CustomerPoints || 0;
          const subTotal = this._orderobj.SubTotal || 0;
      
          // 💰 Value per point
          const valuePerPoint = defaultCard.Value / defaultCard.PointsCount;
      
          // 🧮 Points needed to cover subtotal
          const pointsNeeded = subTotal / valuePerPoint;
      
          // 🧾 Determine how many points actually used
          const pointsUsed =
            customerPoints >= pointsNeeded ? pointsNeeded : customerPoints;
      
          // 💵 Value covered by these points
          const coveredValue = pointsUsed * valuePerPoint;
      
          // 🟢 Update existing defaultCard values
          defaultCard.PointsCount = Math.ceil(pointsUsed);
          defaultCard.Value = parseFloat(coveredValue.toFixed(2));
          this.myPointCards.unshift(defaultCard);
        }
      }
      $("#modal-DetailsMyPoint").modal("show");
    }
  }
  openKeyboard() {
    this.LoginSer.openkeyboard().subscribe(
      (res: any) => {},
      (err) => {}
    );
  }
  DeliveryCustomer() {
    this._isDelivery = true;
    this.showCustomerPopUp(this._orderobj, this.validationList);
  }
  paymentFirstOpen() {
    if (!this._orderobj.PayAmount) this._orderobj.PayAmount = "0.00";
    if (!this._orderobj.DiscountType || this._orderobj.DiscountType == "0") this._orderobj.DiscountType = "1";
    if (!this._orderobj.Discount) this._orderobj.Discount = 0;
    if (this._orderobj.OrderPayments) this.setFocusById("PayAmount" + (this._orderobj.OrderPayments.length - 1));
    this.validationList = this.grantOptionsForUser(
      this._orderobj.isAdmin,
      this.validationList,
      this._orderobj.userPermissions
    );
  }

  backProduct(value: string, isFromValidate = false, isWaiter = false, isGeneral = false) {
    const model = {
      value: value,
      isFromValidate: isFromValidate,
      isWaiter: isWaiter,
      isGeneral: isGeneral
    };
    this.backtoproductsEvent.emit(model);
    this.order.refresh();
    this.order.ngAfterViewInit();
  }

  categoryClicked(value: any) {
    if (this.selectedIndexOrderPayment != null) {
      if (!this._orderobj.OrderPayments[this.selectedIndexOrderPayment].PayAmount)
        this._orderobj.OrderPayments[this.selectedIndexOrderPayment].PayAmount = 0;
      if (!Number(value)) value = 0;
      this._orderobj.OrderPayments[this.selectedIndexOrderPayment].PayAmount = Number(
        Number(this._orderobj.OrderPayments[this.selectedIndexOrderPayment].PayAmount) + Number(value)
      );
      this.changePaymentAmount(
        Number(this.selectedIndexOrderPayment),
        this._orderobj.OrderPayments[this.selectedIndexOrderPayment]
      );
    }
    if (this._orderobj.SubTotal == undefined) {
      this._orderobj.SubTotal = 0;
    }
    this.calculateRemainingAmount(this._orderobj);
  }

  orderPayTypeClicked(value: OrderPayTypeModel, paymentSystem = null) {
    this._orderobj.paymentErrorFired = false;
    if (
      this._orderobj.OrderPayments &&
      this._orderobj.OrderPayments.length == 1 &&
      !this._orderobj.OrderPayments[0].PayAmount
    ) {
      this._orderobj.OrderPayments = [];
    }

    if (
      this._orderobj.OrderPayments &&
      !this._orderobj.OrderPayments.filter((x) => !x.PayAmount || x.PayAmount == 0)[0]
    ) {
      this.setOrderPayType(value, this._orderobj, paymentSystem);
      if (
        value.PayType == 20 &&
        (!this._orderobj.CustomerDocumentId || !this._orderobj.Customer || !this._orderobj.Customer.UseCredit)
      ) {
        this.DeliveryCustomer();
      }
    }
    this.checkPaymentPromo();
    this.setFocusById("PayAmount" + (this._orderobj.OrderPayments.length - 1));
    this.PrintOrderWithDataSet(this._orderobj);
  }

  checkPaymentPromo(){
    if(this._orderobj?.OrderType?.IsPromo && this._orderobj.OrderDetails.some(x=> x.Product?.Promos?.length)){
      const product = this._orderobj.OrderDetails.find(x=> x.Product?.Promos?.length)?.Product;
      const orderPaysIds = (this._orderobj.OrderPayments as any)?.flatMap(x=> x.PayTypeDocumentId) ?? [];
      const promosOrderPaysIds = (product?.Promos?.filter(x=> x.OrderPayTypesList?.length ) as any)?.flatMap(x=> x.OrderPayTypesList);
      const promoOrderPayTypeExist = promosOrderPaysIds?.length && orderPaysIds?.length && orderPaysIds?.every(op=>promosOrderPaysIds.includes(op));
      
      // const promoOrderPayTypeNotExist = product.Promos[0]?.OrderPayTypesList?.length &&
      //   (!product.Promos[0]?.OrderPayTypesList.find(x => this._orderobj?.OrderPayments?.some(p=>p.PayTypeDocumentId == x)) );
      
      if((promoOrderPayTypeExist || product.Promos[0]?.OrderPayTypesList?.length) && this._orderobj.OrderPayments?.length){
        if(this._orderobj.OrderPayments.length > 1 && !promoOrderPayTypeExist)
          this.toastr.warning(this.translate.instant('messages.promoCancelledForPayment'));

        this._orderobj = this.recalculateOrderObject(this._orderobj,false);
        const orderPaymentsAmounts = this._orderobj.OrderPayments.map((x) => Number(x.Amount)).reduce( (next, current) => next + current, 0);
        if(orderPaymentsAmounts > this.totalForAllPay(this._orderobj))
          this._orderobj.OrderPayments[this._orderobj.OrderPayments.length -1].Amount-= orderPaymentsAmounts - this.totalForAllPay(this._orderobj);
        else if(orderPaymentsAmounts < this.totalForAllPay(this._orderobj))
          this._orderobj.OrderPayments[this._orderobj.OrderPayments.length -1].Amount+= this.totalForAllPay(this._orderobj) - orderPaymentsAmounts;
      } 
    }
  }
  DeletePayment(Payment: OrderPayTypeModel, index: number) {
    if (index === -1) return;
    if (Payment.PayType === 70) {
      this._orderobj.PointsCountApplied = 0;
    }
    this._orderobj.OrderPayments.splice(index, 1);
    this.calculateRemainingAmount(this._orderobj);
    const cashBackPayment = this._orderobj.OrderPayments.find((p: OrderPaymentModel) => p.PayType === 70);

    if(this._orderobj.OrderPayments?.length > 0 && !cashBackPayment){
      const lastPayment = this._orderobj.OrderPayments[this._orderobj.OrderPayments.length - 1];
      lastPayment.PayAmount = 0;
      this.calculateRemainingAmount(this._orderobj);

      if(this._orderobj.OrderPayments?.length === 1) lastPayment.Amount = this.totalForAllPay(this._orderobj);
      else{
        if (Number(this._orderobj.RemainigAmount) >= 0) lastPayment.Amount = 0;
        else lastPayment.Amount = this._orderobj.RemainigAmount * -1;
      }
    }
    this.checkPaymentPromo();
    
  }

  setFullPayment(index: number, orderPayment: OrderPaymentModel){
    if(this._orderobj.OrderPayments?.length == 1)
      orderPayment.PayAmount = this._orderobj.SubTotal;
    else{
      const parts = orderPayment.Amount.toString().split('.');
      // number of fraction more than 5
      if (parts.length === 2 && parts[1].length > 5)
        orderPayment.PayAmount = Number(orderPayment.Amount.toFixed(this.settingobj?.Round));
      else
        orderPayment.PayAmount = orderPayment.Amount;
    }

    this.onInputChangeNum({}); 
      
    this.changePaymentAmount(index, orderPayment);

    if (this._orderobj.OrderPayments) this.setFocusById("PayAmount" + (this._orderobj.OrderPayments.length - 1));

  }
  changePaymentAmount(index: number, orderPayment: OrderPaymentModel) {
    if (!orderPayment.PayAmount) orderPayment.PayAmount = 0;
    orderPayment.Amount = orderPayment.PayAmount;
    if (index < this._orderobj.OrderPayments.length - 1) {
      this._orderobj.OrderPayments = this._orderobj.OrderPayments.splice(
        index + 1,
        this._orderobj.OrderPayments.length
      );
    }
    let orderPaymentsAmounts = this._orderobj.OrderPayments.map((x) => Number(x.Amount)).reduce(
      (next, current) => next + current,
      0
    );
    if (
      orderPaymentsAmounts >
        this._orderobj.SubTotal + this._orderobj.DeliveryPersonDeliveryPrice + this._orderobj.TotalInsuranceAmount &&
      this._orderobj.OrderPayments.length == 1
    ) {
      orderPayment.Amount =
        this._orderobj.SubTotal + this._orderobj.DeliveryPersonDeliveryPrice + this._orderobj.TotalInsuranceAmount;
    } else if (
      orderPaymentsAmounts >
        this._orderobj.SubTotal + this._orderobj.DeliveryPersonDeliveryPrice + this._orderobj.TotalInsuranceAmount &&
      this._orderobj.OrderPayments.length > 1
    ) {
      let orderPays = this.cloneList(this._orderobj.OrderPayments);
      orderPays.splice(this._orderobj.OrderPayments.length - 1, 1);
      let OldorderPaymentsAmounts = orderPays.map((x) => Number(x.Amount)).reduce((next, current) => next + current, 0);
      orderPayment.Amount =
        this._orderobj.SubTotal +
        this._orderobj.DeliveryPersonDeliveryPrice +
        this._orderobj.TotalInsuranceAmount -
        OldorderPaymentsAmounts;
    }
  }

  async closeOrder(IsNoPrint: boolean = false) {
    if (
      this.settingobj?.UseFirePrint &&
      this._orderobj?.OrderType?.Value == 4 &&
      this._orderobj?.OrderDetails?.length
    ) {
      const err = this._orderobj.OrderDetails.find((x) => !x.IsCancelled && !x.Printed);
      if (err) {
        this.toastr.warning(this.translate.instant("messages.paymentprintorderwarning"));
        return;
      }
    }
    if(this.orderSer.stopLoaderOnError) this.handelLoaderIfLoaderStoppedOnError();
    this.orderSer.pendingOrdersStarted = false;
    if (!this.requestStarted) {
      this.requestStarted = true;
      const result = await this.order.closeOrder(IsNoPrint);
      this.requestStarted = false;
      this.orderSer.closeOrderFromPayment = true;
      if (result == "closePayment") {
        return;
      } else if (result === true) {
        this.clearSearch();
        this.backProduct("CloseOrder");
        this.orderSer.isCouponAccepted.next(false);
        return;
      }
    }
    return;
  }

  private handelLoaderIfLoaderStoppedOnError() {
    this.requestStarted = false;
    this.orderSer.stopLoaderOnError = false;
    const preloader = document.getElementById('preloader-wrap');
    if (preloader)
      preloader.style.display = 'flex';
  }

  radioClick() {
    this._orderobj.Discount = 0;
    this._orderobj = this.recalculateOrderObject(this._orderobj);
    this.PrintOrderWithDataSet(this._orderobj);
    this.setFocusById("exampleDiscount");
  }

  onKeyUpDiscount(event) {
    let discval = event.target.value;
    if (discval == "" || discval == undefined) {
      discval = 0;
    }

    let MaxDiscountValue = 100;
    let userPermission = this._orderobj.userPermissions;
    if (!this._orderobj.isAdmin) {
      let userOptions = userPermission.map((x) => x.POSUserRoleOptions);
      let options = [];

      userOptions.forEach((userOption) => {
        let option = userOption.filter((x) => x.Name == "CanAddDiscount" && x.IsGranted)[0];
        if (option) options.push(option);
      });
      let discounts = [];
      if (options && options.length > 0) discounts = options.map((x) => x.MaxDiscountValue);
      else if (this.validationList["CanAddDiscount"]) discounts.push(MaxDiscountValue);
      let MaxDiscount = Math.max.apply(null, discounts);
      if (MaxDiscount > 0) MaxDiscountValue = MaxDiscount;
      else MaxDiscountValue = 0;
    }

    if (this._orderobj.DiscountType == "1") {
      if (discval > 100) {
        discval = 100;
        this._orderobj.Discount = 100;
      }
      if (discval > MaxDiscountValue) {
        discval = MaxDiscountValue;
        this._orderobj.Discount = MaxDiscountValue;
        this.toastr.warning("Your Maximum Discount Is " + MaxDiscountValue + "%");
      }
    }
    if (this._orderobj.DiscountType == "2") {
      let discvalper = (discval * 100) / this._orderobj.SubTotal;
      if (discvalper > MaxDiscountValue) {
        discval = 0;
        this._orderobj.Discount = 0;
        this.toastr.warning("Your Maximum Discount Is " + MaxDiscountValue + "%");
      }
    }
    this._orderobj = this.recalculateOrderObject(this._orderobj);
    this.PrintOrderWithDataSet(this._orderobj);
  }

  hotelCustomer: CustomerModel = new CustomerModel();
  openOtelPrimo() {
    this._otelPrimoService.getAllRoomsOccupies().subscribe((res: any) => {
      this.otelPrimoRooms = res.OtelPrimoRooms;
      this.hotelCustomer = res.Customer;
      this.returnedRoomObj = this.deepCopy(this.otelPrimoRooms);
      $("#modal-OtelPrimo").modal("show");
    });
  }

  selectRoomOtelPrimo(room: any, index: number) {
    this._orderobj.OtelPrimoRoomNo = room.room_No;
    this._orderobj.OtelPrimoRoom = room;
    this._orderobj.Customer = this.hotelCustomer;
    this._orderobj.CustomerDocumentId = this.hotelCustomer.DocumentId;
    this._orderobj.CustomerName = this.hotelCustomer.Name;

    let orderpaytype = this.orderPayTypelist.find((p) => p.PayType == 20);
    if (orderpaytype) {
      this.orderPayTypeClicked(orderpaytype);
      $("#modal-OtelPrimo").modal("hide");
    }
    this.selectedRoomIndex = index;
  }

  removeRoomOtelPrimoAfterSelect() {
    this._orderobj.OtelPrimoRoomNo = undefined;
    this._orderobj.OtelPrimoRoom = undefined;
    this.selectedRoomIndex = -1;
  }

  searchRoom(room: any) {
    this.returnedRoomObj = this.filterListByKeys(this.otelPrimoRooms, ["person_Name", "room_No"], room);
  }

  openEmployeeModel(isWaiter : any = "General", permission?:string) {
    if(isWaiter != "General" && !this.validationList[permission]){
      this.enterPinForUser(permission);
      return;
    }
    this.isWaiter = isWaiter;
    this.SearchEmployee(this.isWaiter);
    $("#modal-Waiter2").modal("show");
  }
  SearchEmployee(isWaiter) {
    let name = this.employeeName ? this.employeeName : ("" as string);
    this.orderSer.GetEmployeeByName(name).subscribe((res) => {
      this.employeeList = res as [];
      if (isWaiter == true) this.employeeList = this.employeeList.filter((x) => x.UserType == 5);
      else if (isWaiter == "General") this.employeeList = this.employeeList;
      else this.employeeList = this.employeeList.filter((x) => x.UserType == 7);
    });
  }
  SelectEmployee(Employee: any, isSelect: boolean) {
    if (isSelect) {
      this._orderobj.EmployeeId = Employee.Id;
      this._orderobj.EmployeeDocumentId = Employee.DocumentId;
      this._orderobj.EmployeeName = Employee.FullName || Employee.FirstName;
      this._orderobj = this.UnselectCustomer(this._orderobj);
    } else {
      this._orderobj.EmployeeId = undefined;
      this._orderobj.EmployeeDocumentId = undefined;
      this._orderobj.EmployeeName = "";
    }
    $("#modal-Waiter2").modal("hide");
    this.PrintOrderWithDataSet(this._orderobj);
  }
  SelectedEmployee(Employee: any) {
    this.selectEmployee = Employee;
  }
  AddEmployee() {
    this._orderobj.EmployeeId = this.selectEmployee.Id;
    this._orderobj.EmployeeDocumentId = this.selectEmployee.DocumentId;
    this._orderobj.EmployeeName = this.selectEmployee.FullName;
    $("#modal-41444").modal("hide");
  }
  clearEmployee() {
    this.selectEmployee = undefined;
    this.employeeList = [];
    this.employeeName = "";
  }

  // /******Keyboard function********/
  ngAfterViewInit() {
    this.openkeyboardNum(true);
    this.openkeyboard5("DiscountPercentage11");
  }

  // Start : Keyboard Num Functions
  openkeyboardNum(IsPayment: boolean) {
    if (IsPayment) {
      this.KeyboardPay = new Keyboard(".simple-key", {
        onChange: (input) => this.onChangeNumPay(input),
        onKeyPress: (button) => this.onKeyPressNum(button),
        layout: {
          default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"]
        },
        theme: "hg-theme-default hg-layout-numeric numeric-theme",

        display: {
          "{bksp}": '<i class="fas fa-backspace"></i>'
        },

        preventMouseDownDefault: true
      });
      this.KeyboardPay.setInput("0.00", "PayAmount");
    } else {
      this.KeyboardDiscount = new Keyboard(".simple-key", {
        onChange: (input) => this.onChangeNumDiscount(input),
        onKeyPress: (button) => this.onKeyPressNumDiscount(button),
        layout: {
          default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"]
        },
        theme: "hg-theme-default hg-layout-numeric numeric-theme",

        display: {
          "{bksp}": '<i class="fas fa-backspace"></i>'
        },

        preventMouseDownDefault: true
      });
      this.KeyboardDiscount.setInput("0.00", "exampleDiscount");
    }
  }
  openkeyboard5(type: string) {
    if (this.Keyboardnum5) {
      this.Keyboardnum5.destroy();
    }

    this.Keyboardnum5 = new Keyboard(".numberKeyboard5", {
      onChange: (input) => {
        this.onChangeKeyBoardValue(type, input);
      },
      layout: { default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"] },
      theme: "hg-theme-default hg-layout-numeric numeric-theme",
      display: { "{bksp}": '<i class="fas fa-backspace"></i>' },
      preventMouseDownDefault: true
    });
    this.Keyboardnum5.setInput("", "");
  }

  onChangeKeyBoardValue(type: string, input) {
    this.discType = type;
    if (this.discType == "DiscountAmount11") {
      this._orderobj.DiscountPer = 0;
      this._orderobj.DiscountVal = Number(input);
    }
    if (this.discType == "DiscountPercentage11") {
      this._orderobj.DiscountVal = 0;
      this._orderobj.DiscountPer = Number(input);
    }
  }

  saveFinalDiscountChange(input) {
    this._orderobj.Discount = this._orderobj.DiscountVal = this._orderobj.DiscountPer = 0;
    this.recalculateOrderObject(this._orderobj);

    let MaxDiscountValue = 100;
    let userOptions = this._orderobj.userPermissions.map((x) => x.POSUserRoleOptions);
    if (this.pinUserPermissions?.length) userOptions.push(...this.pinUserPermissions.map((x) => x.POSUserRoleOptions));
    let options = [];
    if (!this._orderobj.isAdmin) {
      options = userOptions.flatMap((x) => x).filter((x) => x.Name == "CanAddDiscount" && x.IsGranted);
      let discounts = [];
      if (options && options.length > 0) discounts = options.map((x) => x.MaxDiscountValue);
      else if (this.validationList["CanAddDiscount"]) discounts.push(0);
      let MaxDiscount = Math.max.apply(null, discounts);
      if (MaxDiscount > 0) MaxDiscountValue = MaxDiscount;
      else MaxDiscountValue = 0;
    }

    let discval: any = Number(input);
    this._orderobj.OriginalDiscountType = "1";

    if (this.discType == "DiscountAmount11") {
      // the original discoout type before convert to percentage
      this._orderobj.OriginalDiscountType = "2";

      // discval = (Number(input) / (this._orderobj.SubTotal)) * 100;
      discval = (Number(input) / (this._orderobj.SubTotal - this._orderobj.DeliveryPrice)) * 100;
      this.discType = "DiscountPercentage11";
    }

    // if (discval > 0) {
    //   discval = Number(discval.toPrecision(3));
    //   this.IsOrderDiscount = true;
    // } else {
    //   discval = discval;
    //   this.IsOrderDiscount = false;
    // }
    let permission = "CanAddDiscount";

    // switch (type) {
    //   case "DiscountPercentage11":
    // if (!this._orderobj.DiscountVal) this._orderobj.DiscountType = "1";
    this._orderobj.DiscountType = "1";
    if (discval > 100) {
      discval = 100;
      this._orderobj.Discount = 100;
    }
    let option = options.find((option: any) => option.Name === "CanAddDiscount");
    // let option: any;
    // userOptions.forEach((userOption: any) => {
    //   option = userOption.find((option: any) => option.Name === "CanAddDiscount");
    // });

    if (!this._orderobj.isAdmin && (option?.MaxDiscountValue ?? 0) < discval) {
      $("#modal-DetailDiscount").modal("hide");
      this.enterPinForDiscount(permission, discval, MaxDiscountValue);
      return;
    } else {
      this._orderobj.DiscountPer = discval;
      this._orderobj.Discount = discval;
    }

    // break;
    // case "DiscountAmount11":
    //   this.truncate(this._orderobj);
    //   Math.trunc(discval);
    //   if (!this._orderobj.DiscountPer) this._orderobj.DiscountType = "2";
    //   this.counter++;
    //   if (this.counter === 1) this.orderSer.originalSubTotal.next(this._orderobj.SubTotal);
    //   if (discval > this.orderSer.originalSubTotal.getValue()) {
    //     discval = this.orderSer.originalSubTotal.getValue();
    //     this._orderobj.SubTotal = 0;
    //   }
    //   if (discval === 0) this.counter = 0;
    //   let discvalper = (discval * 100) / this._orderobj.SubTotal;

    //   if (!this._orderobj.isAdmin && discvalper > MaxDiscountValue) {
    //     $("#modal-DetailDiscount").modal("hide");
    //     this.enterPinForUser(permission, discval, MaxDiscountValue);
    //     return;
    //   } else {
    //     this._orderobj.DiscountVal = discval;
    //     this._orderobj.Discount = discval;
    //   }
    //   break;
    //   default:
    //     break;
    // }
    // if (this._orderobj.Discount && this.settingobj.UseMinimumCharge && this._orderobj.HasMinimumCharge == true) {
    //   if (this._orderobj.SubTotal <= this._orderobj.MinimumChargeValue) {
    //     // this.ApplySubTotalWithMinChargeValue();
    //   } else {
    //     this._orderobj = this.recalculateOrderObject(this._orderobj);
    //     if (this._orderobj.SubTotal <= this._orderobj.MinimumChargeValue) {
    //       // this.ApplySubTotalWithMinChargeValue();
    //     }
    //     this._orderobj.MinimumChargeDifferance = 0;
    //   }
    // } else {
      // if (discval) this._orderobj = this.recalculateOrderObject(this._orderobj);
      // else this._orderobj = this.recalculateOrderObject(this._orderobj, false);
      // this._orderobj = this.recalculateOrderObject(this._orderobj, false);
      // if(discval === 0) this.Keyboardnum5.destroy();
      this._orderobj = this.recalculateOrderObject(this._orderobj);
    // }

    this.PrintOrderWithDataSet(this._orderobj);
  }

  openDiscountModel() {
    if (this._orderobj.Discount) {
      if (this._orderobj.DiscountType == "1") this._orderobj.DiscountPer = this._orderobj.Discount;
      else if (this._orderobj.DiscountType == "2") this._orderobj.DiscountVal = this._orderobj.Discount;
    }
    if (!this._orderobj.DiscountVal) this._orderobj.DiscountVal = 0;
    if (!this._orderobj.DiscountPer) this._orderobj.DiscountPer = 0;
    let permission = "CanAddDiscount";
    if (!this.validationList[permission]) this.CheckISGrantedToWithAskForPin(permission);
    else this.ContinueAfterPin(permission);
  }
  closeDiscountModel() {
    $("#modal-DetailDiscount").modal("hide");
    if (this.discType == "DiscountAmount11") this.saveFinalDiscountChange(this._orderobj.DiscountVal);
    else this.saveFinalDiscountChange(this._orderobj.DiscountPer);
  }

  cancelService(event){
    let permission = "CanCancelService";
    if (!this.validationList[permission]){
      event.source.checked = this._orderobj.CancelServices ? true : false;
      this.CheckISGrantedToWithAskForPin(permission);
    }
    else this.ContinueAfterPin(permission);
  }

  openTipsModel() {
    let permission = "CanAddTips";
    if (!this.validationList[permission]) this.CheckISGrantedToWithAskForPin(permission);
    else this.ContinueAfterPin(permission);
    this.openkeyboardTips();
  }
  openkeyboardTips() {
    if (this.KeyboardTips) {
      this.KeyboardTips.destroy();
    }

    this.KeyboardTips = new Keyboard(".KeyboardTips", {
      onChange: (input) => {
        this._orderobj.Tips = Number(input);
      },
      layout: { default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"] },
      theme: "hg-theme-default hg-layout-numeric numeric-theme",
      display: { "{bksp}": '<i class="fas fa-backspace"></i>' },
      preventMouseDownDefault: true
    });
    this.KeyboardTips.setInput("", "");
  }
  
  // ApplySubTotalWithMinChargeValue() {
  //   this._orderobj.DiscountAmount = 0;
  //   this._orderobj.Discount = 0;
  //   this._orderobj = this.recalculateOrderObject(this._orderobj);
  //   this._orderobj.MinimumChargeDifferance = this._orderobj.MinimumChargeValue - this._orderobj.SubTotal;
  //   this._orderobj = this.recalculateOrderObject(this._orderobj);
  //   if (this._orderobj.SubTotal > this._orderobj.MinimumChargeValue) {
  //     this._orderobj.DiscountAmount = this._orderobj.SubTotal - this._orderobj.MinimumChargeValue;
  //   }
  //   this._orderobj.SubTotal = this._orderobj.MinimumChargeValue;
  //   this._orderobj.RemainigAmount = this._orderobj.MinimumChargeValue * -1;
  //   this._orderobj.OrderPayments[0].Amount = this._orderobj.MinimumChargeValue;
  //   this.toastr.warning(this.translate.instant("messages.minimumchargedicountmessage"));
  // }
  // onDiscountCategoryClick(type: string, input) {
  //   if (!this._orderobj.DiscountVal) this.onChangeKeyBoardValue(type, input);
  //   else if (this._orderobj.DiscountVal && !this._orderobj.DiscountPer) this._orderobj.DiscountType = "2";
  // }
  freeDiscountClicked() {
    let permission = "CanAddDiscount";
    if (!this.validationList[permission]) {
      this.CheckISGrantedToWithAskForPin(permission);
      return;
    }
    this.orderSer.free.next(!this.orderSer.free.getValue());
    this.discType == "DiscountPercentage11";
    if (this.orderSer.free.getValue() === true) {
      this.saveFinalDiscountChange(100);
      this._orderobj.Free = this.orderSer.free.getValue();
    } else {
      this.saveFinalDiscountChange(0);
      this._orderobj.Free = this.orderSer.free.getValue();
    }
  }

  onInputFocusNumPay = (event: any, index: string) => {
    this.KeyboardPay.setInput("", "");
    this.openkeyboardNum(true);
    if (this.selectedIndexOrderPayment != index) {
      this.KeyboardPay.setInput(this._orderobj.OrderPayments[index].PayAmount, "PayAmount" + index);
    }
    if (event.target.classList.contains("MarkText")) {
      event.target.value = null;
      this.ValidationPay = false;
    }
    this.selectedNumInput = event.target.id;
    this.selectedIndexOrderPayment = index;
    this.KeyboardPay.setOptions({
      inputName: event.target.id
    });
  };
  onInputFocusNumDiscount = (event: any) => {
    this.openkeyboardNum(false);
    this.KeyboardDiscount.setInput(this._orderobj.Discount, "exampleDiscount");

    event.target.value = null;

    this.selectedNumInput = event.target.id;
    this.KeyboardDiscount.setOptions({
      inputName: event.target.id
    });
  };
  onChangeNumPay = (input: string) => {
    if (this.selectedIndexOrderPayment != null) {
      this._orderobj.OrderPayments[this.selectedIndexOrderPayment].PayAmount = (!input ? '0' : input);
      this.changePaymentAmount(
        Number(this.selectedIndexOrderPayment),
        this._orderobj.OrderPayments[this.selectedIndexOrderPayment]
      );
    }
    if (this._orderobj.SubTotal == undefined) {
      this._orderobj.SubTotal = 0;
    }
    this.calculateRemainingAmount(this._orderobj);
    if (this._orderobj.settings && this._orderobj.settings.IsUsingCustomerPriceDisplay) {
      this._orderobj.DispalyMode = 3;
      this.orderSer.VFDDisplay(this._orderobj).subscribe();
    }
  };
  onInputChangeNum = (event: any) => {
    if (this._orderobj.SubTotal == undefined) {
      this._orderobj.SubTotal = 0;
    }
    this.calculateRemainingAmount(this._orderobj);
    if (this._orderobj.settings && this._orderobj.settings.IsUsingCustomerPriceDisplay) {
      this._orderobj.DispalyMode = 3;
      this.orderSer.VFDDisplay(this._orderobj).subscribe();
    }
  };
  onChangeNumDiscount = (input: string) => {
    this._orderobj.Discount = Number(input);
    this.onKeyUpDiscount({ target: { value: this._orderobj.Discount } });
  };
  onKeyPressNum = (button: string) => {
    if (button === "{shift}" || button === "{lock}") this.handleShiftNum();
  };
  handleShiftNum = () => {
    let currentLayout = this.KeyboardPay.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";
    this.KeyboardPay.setOptions({
      layoutName: shiftToggle
    });
  };
  onKeyPressNumDiscount = (button: string) => {
    if (button === "{shift}" || button === "{lock}") this.handleShiftNumDiscount();
  };
  handleShiftNumDiscount = () => {
    let currentLayout = this.KeyboardDiscount.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";
    this.KeyboardDiscount.setOptions({
      layoutName: shiftToggle
    });
  };
  // End : Keyboard Num Functions
  callkeyboard() {
    this.orderSer.openkeyboard().subscribe(
      (res: any) => {},
      (err) => {
        this.toastr.error(this.toastrMessage.LoginMessages(err), "payment");
      }
    );
  }

  async addDisc(permission: string) {
    this.CheckISGrantedToWithAskForPin("CanAddDiscount");
    this.setFocusById("exampleDiscount");
  }
  async CheckISGrantedToWithAskForPin(permission: string) {
    let permited = this.validationList[permission];
    if (!permited) {
      let userPermissions = this._orderobj.userPermissions;
      userPermissions.forEach((up) => {
        up.POSUserRoleOptions.forEach((option) => {
          if (option.Name == permission && option.IsGranted) {
            permited = true;
          }
        });
      });
      if (permited == false) {
        this.enterPinForDiscount(permission);
      } else {
        this.validationList[permission] = true;
      }
    }
  }

  enterPinForUser(permission: string) {
    Swal.fire({title: "You Do not have Permission",
      input: "text",
      inputLabel: "Add Pin?",
      inputAttributes: {
        autocomplete: 'off'
      },
      customClass: {
        input: "inputAsPassword"
      },
      inputValue: undefined,
      showCancelButton: true,
      inputValidator: (value) => {
        if (value) {
          this._orderobj.Pin = value;
          let model = { Pin: value, Option: permission};
          this.orderSer.checkUserWithOption(model).subscribe(
            (res) => {
              this.validationList[permission] = res;
              if (res == true) {
                if (this._orderobj.allUsers && this._orderobj.allUsers.length) {
                  let user = this._orderobj.allUsers.filter((u) => u.Pin == this._orderobj.Pin)[0];
                  if (user) {
                    this._orderobj.PinUserId = user.AppUserId;
                    if (permission === "CanEditTheWaiterInOrder") 
                      this.openEmployeeModel(true,'CanEditTheWaiterInOrder');
                    else if (permission === "CanEditTheCaptainInOrder") 
                      this.openEmployeeModel(false,'CanEditTheCaptainInOrder');
                    else
                      return;
                  }
                }
              } 
              else 
                this.toastr.warning(this.translate.instant("messages.userHasNoPermission"));
            },
            (error) => {
              this.toastr.error(error.message, "Order");
              this.validationList[permission] = false;
            });
          return "";
        }
      }
    });
  }
  
  enterPinForDiscount(permission: string, discountValue: number = 0, MaxDiscountValue: number = 0) {
    Swal.fire({
      title: "You Do not have Permission",
      input: "text",
      inputLabel: "Add Pin?",
      inputValue: undefined,
      customClass: {
        input: "inputAsPassword"
      },
      inputAttributes: {
        autocomplete: 'off'
      },
      showCancelButton: true,
      inputValidator: (value) => {
        if (value) {
          this._orderobj.Pin = value;
          let model = { Pin: value, Option: permission, DiscountValue: discountValue };
          this.orderSer.checkUserWithOption(model).subscribe(
            (res) => {
              if (this._orderobj.allUsers && this._orderobj.allUsers.length) {
                let user = this._orderobj.allUsers.filter((u) => u.Pin == this._orderobj.Pin)[0];
                if (user) this._orderobj.PinUserId = user.AppUserId;
              }
              this.validationList[permission] = res;
              if (res === true && permission.toLowerCase().includes('discount') && this.orderSer.free.getValue() === false) {
                this._orderobj.Discount = discountValue;
                this._orderobj.DiscountPer = discountValue;
                this._orderobj = this.recalculateOrderObject(this._orderobj);
              } else if (res === true && permission.toLowerCase().includes('discount') && this.orderSer.free.getValue() === true) {
                // this.onDiscountCategoryClick("DiscountPercentage11", 100);
                this._orderobj.Free = this.orderSer.free.getValue();
                this._orderobj.Discount = discountValue;
                this._orderobj.DiscountPer = discountValue;
                this._orderobj.DiscountType = "1";
                this._orderobj = this.recalculateOrderObject(this._orderobj);
              } else if(res === true && !permission.toLowerCase().includes('discount')){
                this.ContinueAfterPin(permission);
              }
               else {
                 if(!permission.toLowerCase().includes('discount'))
                  this.toastr.info(this.translate.instant("messages.userHasNoPermission"));
                 else
                  this.toastr.warning("You do not permission for discount " + discountValue + "%");
                this.validationList[permission] = false;
                this.ContinueAfterPin(permission);
                this.orderSer.free.next(false);
              }
            },
            (error) => {
              this.toastr.error(error.message, "Order");
              this.validationList[permission] = false;
              this.orderSer.free.next(false);
            }
          );
          this.checkPinPermission(value);
          return "";
        } else {
          this.orderSer.free.next(false);
        }
      }
    }).then((result) => {
      if ((result.isDismissed || result.isDenied) && this.orderSer.free.getValue() === true) {
        this.orderSer.free.next(false);
      }
    });
  }
  ContinueAfterPin(permission) {
    if (permission == "CanAddDiscount" && this.validationList[permission]) {
      $("#modal-DetailDiscount").modal("show");
    }
    if (permission == "CanAddTips" && this.validationList[permission]) {
      $("#modal-Tips").modal("show");
      setTimeout(() => {
        this.setFocusById("Tips");
      }, 200);
    }
    if (permission == "CanCancelService" && this.validationList[permission]) {
      this._orderobj.CancelServices = !this._orderobj.CancelServices;
      this._orderobj = this.recalculateOrderObject(this._orderobj);
    }
  }
  checkPinPermission(pin) {
    if (Number(pin) >= 0) {
      this.orderSer.CheckPinUserWithPermission(pin).subscribe((res) => {
        if (res && res["Item2"]) this.pinUserPermissions = res["Item2"];
      });
    }
  }
  //#region Turky Payment Systems
  openPaymentSystemPopUp(p) {
    if (p && p.SystemPayments) {
      this.turkyPayment = p;
      $("#modal-TurkyPayment").modal("show");
    }
  }
  paymentSystemClicked(paymentSystem) {
    let orderpaytype = this.orderPayTypelist.filter((p) => p.DocumentId == paymentSystem.PayTypeDocumentId)[0];
    this.orderPayTypeClicked(orderpaytype, paymentSystem);
    $("#modal-TurkyPayment").modal("hide");
  }
  closeMyPointsModel() {
    $("#modal-DetailsMyPoint").modal("hide");
  }

  // Handle redeem points
  openPointsModal() {
    this.clickedRedeemPoints = true;
    $("#modal-RedeemPoints").modal("show");
  }

  redeemPointsModal(card: MyPointDetailModel) {
    this.selectedPointsCard = card;
    this.cashBack = this._orderobj.OrderPayments.find((x) => x.PayTypeName === this.cashBackPayType.Name);
    this.cashBackindex = this._orderobj.OrderPayments.findIndex((x) => x.PayTypeName === this.cashBackPayType.Name);
    if (this.cashBack && this.cashBackindex != null) {
      this.DeletePayment(this.cashBack, this.cashBackindex);
    }
    this.orderPayTypeClicked(this.cashBackPayType);
    this.clickedRedeemPoints = false;
    $("#modal-RedeemPoints").modal("hide");
    $("#modal-DetailsMyPoint").modal("hide");
  }

  cardSelected(card: MyPointDetailModel) {
    this.selectedPointsCard = card;
  }

getCoupon(): Promise<any>{
  let couponObj = {};
    couponObj = {
      CustomerDocumentId: this._orderobj.CustomerDocumentId,
      CouponCode: this.couponNumber
    };
    return new Promise((resolve) => {
      this.couponService.CheckCouponValidate(couponObj).subscribe(res=>{
        resolve(res);
      },err=>{
        resolve(err);
      });
    });
}

  async submitCoupon() {
    if (this.couponNumber) {

      let res = await this.getCoupon();
      if(!res) return ;

      if (res.CouponValidation !== "Coupon Invalid" && res.CustomerValidation !== "Customer Invalid") {
        let detailsForCoupon = [];
        if (res?.CouponObj?.ProductsIds?.length) {
          detailsForCoupon = this._orderobj.OrderDetails.filter((x) => res?.CouponObj?.ProductsIds?.includes(x.ProductDocumentId));
          if (!detailsForCoupon?.length) {
            this.couponInvalid = true;
            return;
          }
        }
        let discVal: number = res?.CouponObj?.Value;
        this.orderSer.type.next(res?.CouponObj?.DiscountType);
        // discount on details only
        if(detailsForCoupon?.length){
          detailsForCoupon.forEach(detail=>{
            if (this.orderSer.type.getValue() === 2)
              discVal = (Number(discVal) / (detail.ProductPrice * detail.ProductQuantity)) *100;

            detail.DiscountPercentage = Number(discVal);
            detail.DiscountAmount =0;
          });
          
          this._orderobj = this.recalculateOrderObject(this._orderobj);
        }
        // discount on Master only
        else{
          if (this.orderSer.type.getValue() === 1) {
            this.onChangeKeyBoardValue("DiscountPercentage11", discVal);
            this.saveFinalDiscountChange(discVal);
          }
          else if (this.orderSer.type.getValue() === 2) {
            this.onChangeKeyBoardValue("DiscountAmount11", discVal);
            this.saveFinalDiscountChange(discVal);
          }
        }
        this.customerInvalid = false;
        this.couponInvalid = false;
        this.couponvalid = true;
        this._orderobj.CouponApplied = this.couponNumber;
        this.orderSer.isCouponAccepted.next(true);
      }
      if (res.CouponValidation && res.CouponValidation === "Coupon Invalid") {
        this.couponInvalid = true;
        return;
      }
      if (res.CustomerValidation && res.CustomerValidation === "Customer Invalid") {
        this.customerInvalid = true;
        return;
      }
        
    }
  }

  async clearCoupon() {
    let res = await this.getCoupon();

    if (res?.CouponObj?.ProductsIds?.length) {
      let detailsForCoupon = this._orderobj.OrderDetails.filter((x) => res?.CouponObj?.ProductsIds?.includes(x.ProductDocumentId));
      detailsForCoupon.forEach(detail=>{
        detail.DiscountPercentage = 0;
        detail.DiscountAmount =0;
      });
      this._orderobj = this.recalculateOrderObject(this._orderobj);
    }
    else{
        this.onChangeKeyBoardValue("DiscountPercentage11", 0);
        this.saveFinalDiscountChange(0);
    }
    
    this.couponInvalid = false;
    this.customerInvalid = false;
    this.couponvalid = false;
    this.couponNumber = this._orderobj.CouponApplied = ""
    this.orderSer.isCouponAccepted.next(false);
  }
  get disablePrint() {
    const permitted = this.permittedPrint(this._orderobj);
    return (
      !permitted ||
      !this._orderobj?.DocumentId ||
      this._orderobj.OrderPayments?.some((p) => p.PayAmount) || 
      this._orderobj.OrderDetails?.some(x=>!x.DocumentId)
    );
  }
  // get disablePrint() {
  //   return (
  //     !this.validationList["CanPrint"] ||
  //     !this._orderobj?.DocumentId ||
  //     this._orderobj.OrderPayments?.some((p) => p.PayAmount) || 
  //     this._orderobj.OrderDetails?.some(x=>!x.DocumentId)
  //   );
  // }
  SelectWaiter(Waiter: any, isSelect: boolean) {
      if (isSelect) {
        this._orderobj.WaiterId = Waiter.Id;
        this._orderobj.WaiterDocumentId = Waiter.DocumentId;
        this._orderobj.WaiterName = Waiter.FullName || Waiter.FirstName;
        $("#modal-Waiter2").modal("hide");
      }
    }
  
    SelectCaptain(Captain: any, isSelect: boolean) {
      if (isSelect) {
        this._orderobj.CaptainId = Captain.Id;
        this._orderobj.CaptainDocumentId = Captain.DocumentId;
        this._orderobj.CaptainName = Captain.FullName || Captain.FirstName;
        $("#modal-Waiter2").modal("hide");
      } 
    }

    addPaymentNote(paymentIndex:number){
      Swal.fire({
        title: this.translate.instant("messages.EnterNote"),
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
          autocomplete: 'off'
        },
        inputValue:this._orderobj.OrderPayments[paymentIndex].Note,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('Shared.Save'),
        cancelButtonText:this.translate.instant('Shared.Cancel'),
        showLoaderOnConfirm: true,
        preConfirm: (noteForPayment) => {
          this._orderobj.OrderPayments[paymentIndex].Note = noteForPayment;
        }
      });
    }
}
