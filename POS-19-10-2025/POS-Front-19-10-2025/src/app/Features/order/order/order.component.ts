import { LoginService } from "../../../core/Services/Authentication/login.service";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from "@angular/core";
import { DatePipe, DOCUMENT, Location } from "@angular/common";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { ProductTypeModel } from "src/app/core/Models/Transactions/product-type-model";
import { ProductGroupModel } from "src/app/core/Models/Transactions/product-group-model";
import { ProductGroupClassModel } from "src/app/core/Models/Transactions/product-group-class-model";
import { ProductModel } from "src/app/core/Models/Transactions/product-model";
import { OrderDetailModel } from "src/app/core/Models/Transactions/order-detail-model";
import { CommonService } from "src/app/core/Services/Common/common.service";
import { ProductVolumeModel } from "src/app/core/Models/Transactions/product-volume-model";
import { ProductSubItemModel } from "src/app/core/Models/Transactions/product-sub-item-model";
import { OrderDetailSubItemModel } from "src/app/core/Models/Transactions/order-detail-sub-item-model";
import { NoteModel } from "src/app/core/Models/Transactions/note-model";
import { OrderDetailNoteModel } from "src/app/core/Models/Transactions/order-detail-note-model";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { InsuranceModel } from "src/app/core/Models/Transactions/insurance-model";
import { OrderDetailInsuranceModel } from "src/app/core/Models/order/order-detail-insurance-model";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { TranslateService } from "@ngx-translate/core";
import { LocalstorgeService } from "../../../localstorge.service";
import { BarcodeSettingModel } from "src/app/core/Models/Transactions/barcode-setting-model";
import Keyboard from "simple-keyboard";
import { OrderTypeModel } from "src/app/core/Models/Transactions/order-type-model";
import { CustomerModel } from "src/app/core/Models/Transactions/CustomerModel";
import { SettingService } from "src/app/core/Services/Settings/SettingService";
import { OrderHelper } from "../OrderHelper";
import { OrderDetailCancellationModel } from "src/app/core/Models/order/OrderDetailsCancellationModel";
import Swal from "sweetalert2";
import { DeliveryCustomerComponent } from "../deliverycustomer/deliverycustomer.component";

import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { PerfectScrollbarComponent } from "ngx-perfect-scrollbar";
import { ProductPricingClassModel } from "../../pricing-class/pricing-classes-import";
import { ProductPricingClassVolumeModel } from "src/app/core/Models/Transactions/ProductPricingClassVolumeModel";
import { IntegrationService } from "src/app/core/Services/Transactions/integration.service";
import { CustomerOrderService } from "src/app/core/Services/Transactions/customerOrder.service";
import { PointOfSaleModel } from "../../point-of-sale/pointofsaleimports";
import { CustomerOrderModel } from "../../../core/Models/order/customer-order.model";
import { BsModalService } from "ngx-bootstrap/modal";
import { MatchPaymentsComponent } from "../dialogs/match-payments/match-payments.component";
import { debounceTime, distinctUntilChanged, map, switchMap, take } from "rxjs/operators";
import { AssignDriverComponent } from "../dialogs/assign-driver/assign-driver.component";
import { IncomingUserModel } from "src/app/core/Models/Transactions/incoming-user-model";
import { OrderPayTypeModel } from "../../pay-type/pay-type-import";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { CancellationReasonService } from "src/app/core/Services/Transactions/cancellationReason.service";
import { VolumeModel } from "../../volume/volume-imports";
import { OrderInsuranceService } from "../../order-insurance/orderInsuranceimport";
import { clamp, deepCopy, sumByKey} from "src/app/core/Helper/objectHelper";
import { DashboardService } from "../../return-order/return-order-imports";
import { getAllGroupMealsCombos, isAChildOfMealGroup } from "src/app/core/Helper/productHelper";
import { Subject } from "rxjs";
declare var $: any;

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"]
})
export class OrderComponent extends OrderHelper implements OnInit, AfterViewInit, OnDestroy, AfterContentChecked {
  refreshingIntegrationOrders = false;
  noteInput$ = new Subject<string>();
  radioModel: any;
  selectedProdGroupName: any;
  selectedProdGroup: {};
  selectedProdGroupId: any;
  domyreturned: any[];
  showIcons: boolean;
  returnedArray: any[];
  tableStatuses: any[];
  @ViewChildren("tooltipRef") tooltipchilds: QueryList<ElementRef>;
  @ViewChildren("childRefPrice") childPrice: QueryList<ElementRef>;
  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChild("perfectScroll") perfectScroll: PerfectScrollbarComponent;

  checkAllCancel: boolean = false;
  indexItem: any;
  checkedNte: boolean = false;
  DropDownItem: any;
  showPencile: boolean = false;
  EditPathImg: string;
  innerWidth: any;
  EditingProducts: boolean = false;
  Showingkeyboard: boolean = false;
  Showingkeyboard2: boolean = false;
  Showingkeyboard4: boolean = false;
  selectedInput = "";
  selectDineIn: boolean = false;
  keyboard: Keyboard;
  Keyboardnum: Keyboard;
  keyboardNote: Keyboard;
  listStyle: any;
  goToPayment: boolean = false;
  productName: string = "";
  productprice: any;
  private _searchTerm: string;
  Fullscreen: boolean;
  accepted: boolean = false;
  incominguserobj: IncomingUserModel = new IncomingUserModel();
  productStyle: boolean = false;
  freeProductSelected: boolean = false;

  dynamicStyles: any = {
    height: "6%",
    padding: "2px 12px"
  };
  alertSound = new Audio("/assets/Config/song.mp3");
  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    if (value) {
      this._searchTerm = value;
      this.productlisFilterd = this.productlistFilter(value).filter((x) => !x.EntertainmentService);
      this.productlisFilterd = this.hideZeroProducts(this.productlisFilterd);
    } else this.productlisFilterd = [];
  }

  hideZeroProducts(productlist: ProductModel[], hideMealGroupChildren: boolean = true): ProductModel[] {

    if(hideMealGroupChildren) productlist = productlist?.filter(x=>!isAChildOfMealGroup(x,this.orderSer.allCombos));

    if (this.settingobj && this.settingobj.HideZerosProducts)
      return productlist?.filter((x) => x.Price > 0 || x.AsGroupMeal);

    return productlist;
  }
  // #region Suggestion management
  suggestions: ProductModel[] = [];

  setSuggestions(suggestions: any[]) {
    const filterProducts = this.allproductlist.filter((pr) =>
      suggestions.find((sg) => pr.DocumentId == sg.ProductDocumentId)
    );
    this.suggestions = filterProducts;
    this.LocalstorgeService.set("suggestions", this.suggestions);
  }

  clearSuggestions() {
    this.setSuggestions([]);
  }

  // #endregion

  productlistFilter(searchString: string) {
    if (this.settingobj && this.settingobj.ShowBothNameAndForeignName) {
      return this.allproductlist.filter(
        (prod) => this.getName(prod).toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1
      );
    } else {
      return this.allproductlist.filter(
        (prod) => prod.Name.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1
      );
    }
  }

  //#region Definitions

  result: any;
  res: any[];
  NumberItems: number;
  valuechar: any;
  aciveTab: boolean = false;
  okSearch: boolean = true;
  vtv: any;
  selectValue: any;
  volumes: any;
  promos: any;
  condition: any = (x) => !x.IsCancelled;
  checkedOrderType: boolean = false;
  @ViewChild("ProductQuantity", { static: false }) ProductQuantity: ElementRef;
  @ViewChild("countNum", { static: false }) countNum: ElementRef;
  @ViewChild("closeModal", { static: false }) ChValue: ElementRef;
  @ViewChild("widgetsContent", { static: false }) widgetsContent: ElementRef;
  @ViewChild("psBottom") psBottom: ElementRef;
  @ViewChildren("detailsOrderRef") childs: QueryList<ElementRef>;
  @ViewChild(DeliveryCustomerComponent)
  deliveryCustomerComponent: DeliveryCustomerComponent;
  blockClass: string;
  closeOrderTypeB: boolean = false;
  CheckedOrderTypeB: boolean = true;
  defaultIm: string;
  productImg: string;
  selectedNumInput = "";
  clicked: boolean = false;
  checkCol8: boolean = true;
  checkcol8Bayment: boolean = false;
  elem;
  closedClickedOk: boolean = false;
  value = 0;
  zeroValue: false;
  count: number = 1;
  ProductShowing: boolean = true;
  paymentShow: boolean = false;
  ordertypelist: OrderTypeModel[] = [];
  orderobj: OrderModel = new OrderModel();
  // orderdetailobj: OrderDetailModel = new OrderDetailModel();
  // settingobj:SettingModel=new SettingModel();
  producttypeobj: ProductTypeModel = new ProductTypeModel();
  // orderdetailpromoobj:OrderDetailPromoModel=new OrderDetailPromoModel();
  productTypeList: ProductTypeModel[] = [];
  productgrouplist: ProductGroupModel[] = [];
  productgroupclasslist: ProductGroupClassModel[] = [];
  productlist: ProductModel[] = [];
  productlisFilterd: ProductModel[] = [];
  productvolumslist: ProductVolumeModel[] = [];
  productsubitemlist: ProductSubItemModel[] = [];
  orderdetailsubitemobj: OrderDetailSubItemModel = new OrderDetailSubItemModel();
  orderdetailsubitemlist: OrderDetailSubItemModel[] = [];
  currentproductgroup: ProductGroupModel = new ProductGroupModel();
  // orderdetailslist: OrderDetailModel[] = [];
  productwithvolum: ProductModel = new ProductModel();
  volumeShowAsAproduct: ProductModel = new ProductModel();

  productwithsidedishes: ProductModel = new ProductModel();
  codebarproduct: any;
  checkcodebarexists: boolean = false;
  noteslist: NoteModel[] = [];
  filterNotesList: NoteModel[] = [];
  ss: string = "";
  noteobj: NoteModel = new NoteModel();
  orderdetailnotesobj: OrderDetailNoteModel = new OrderDetailNoteModel();
  orderdetailnotelist: OrderDetailNoteModel[] = [];
  orderdetailnotelisttemp: OrderDetailNoteModel[] = [];
  insurancelist: InsuranceModel[] = [];
  orderdetailinsurancelist: OrderDetailInsuranceModel[] = [];
  orderdetailinsurancelisttemp: OrderDetailInsuranceModel[] = [];
  orderdetailinsurancesobj: OrderDetailInsuranceModel = new OrderDetailInsuranceModel();
  barcodesettobj: BarcodeSettingModel = new BarcodeSettingModel();
  insuranceval: number;
  shownoteerror: boolean = false;
  showvolumicon: boolean = false;
  showsidedishesicon: boolean = false;
  existedrow: boolean = false;
  insuranceexistedrow: boolean = false;
  Showduplicatesidedishes: boolean = false;
  checksidedishesdeleted: boolean = false;
  checknoteexist: boolean = false;
  tempsidedishesvalue: number = 0;
  orderdetailindex: any;
  imgURL: any = "";
  statuss: boolean = true;
  activeordertype: boolean = false;
  public itemss: Array<number>;
  isDelivery: boolean;
  showTable: boolean = false;
  typeOfOrder: string;
  ReplaceImg: string;
  dropUl: boolean;
  height: number;
  width: number;
  dontUsePageinationInOrderScreen = false;
  productNameFontSize?: number;
  currentPage: number = 1;
  dimensionsChanged: boolean = false;
  orderDetailWithCustomPromo?: OrderDetailModel;
  visaSameOrderPayTimeCount = 0;

  @ViewChild("groupRef", { static: false }) groupRef: ElementRef;
  @ViewChild("codbarqty", { static: false }) codbarqty: ElementRef;
  @ViewChild("closeModal", { static: false }) closeModal: ElementRef;

  // Printing status indicator
  isPrinting = false;

  //#endregion

  scrollToTop(y: number, S: number) {
    this.componentRef.directiveRef.scrollToTop(y, S);
  }

  constructor(
    @Inject(DOCUMENT) private document: any,
    public orderSer: OrderService,
    public dashboardSer:DashboardService,
    public integrationSer: IntegrationService,
    public customerOrderSer: CustomerOrderService,
    private common: CommonService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    public translate: TranslateService,
    private location: Location,
    private cdref: ChangeDetectorRef,
    private LocalstorgeService: LocalstorgeService,
    private _el: ElementRef,
    public route: ActivatedRoute,
    private LoginSer: LoginService,
    public router: Router,
    public settingServ: SettingService,
    public datepipe: DatePipe,
    private modalService: BsModalService,
    private cancelReasonService: CancellationReasonService,
    private orderInsuranceService : OrderInsuranceService
  ) {
    super(settingServ, orderSer, toastr, toastrMessage, router, translate);
    this.defaultIm = "assets/images/v10.jpg";

    this.typeOfOrder = this.router.getCurrentNavigation().extras as string;
    this.orderobj = new OrderModel();
    this.orderobj.OrderDetails = [];

    this.setSuggestions([]);

    this.listStyle = {
      width: "auto", //width of the list defaults to 300,
      height: "auto", //height of the list defaults to 250,
      display: "flex",
      dropZoneHeight: "50px" // height of the dropzone indicator defaults to 50
    };
    this.changeCssFile();

    // for drag & drop
    this.target = null;
    this.source = null;
  }

  updateTableStatusSync(tableStatusId: any) {
    this.orderSer.updateTableStatusSync(tableStatusId).subscribe(
      (res) => {
        this.toastr.success("table status updated successfully", "success");
        this.GetMobileOrdersCount();
      },
      (err) => {
        this.toastr.error(err, "error");
      }
    );
  }

  clickedClear() {
    this.searchTerm = null;
    let elem: any = document.getElementById("searchOrder");
    if (elem) elem.value = "";
  }

  OkSearch() {
    this.okSearch = !this.okSearch;
    if (!this.okSearch) {
      this.clickedClear();
    }
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "200px";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  scrollLeft() {
    this.widgetsContent.nativeElement.scrollTop -= 100;
  }

  scrollRight() {
    this.widgetsContent.nativeElement.scrollTop += 100;
  }

  changeCssFile() {
    if (this.LocalstorgeService.get("langs") == null) this.LocalstorgeService.set("langs", "en");

    let langsSet: string = this.LocalstorgeService.get("langs");
    //let langsSet="en";
    let headTag = this.document.getElementsByTagName("head")[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById("langCss") as HTMLLinkElement;
    let bundleName = langsSet === "ar" ? "englishStyle.css" : "englishStyle.css";
    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      let newLink = this.document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.type = "text/css";
      newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }

    this.translate.setDefaultLang(langsSet);
    this.translate.use(langsSet);
    let htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = langsSet === "ar" ? "ltr" : "ltr";
    this.setLang = langsSet;
  }

  refresh() {
    this.cdref.detectChanges();
  }

  showHideComponents(component) {
    if (this.requestStarted) return false;
    this.orderobj.isAdmin = this.isAdmin;
    this.orderobj.userPermissions = this.userPermissions;
    if (this.isAdmin) this.validationList["CanNotEditOrderForAnotherUser"] = false;
    this.orderobj.validationList = this.validationList;
    this.orderobj.IsHallPos = this.pointOfSale.IsHallPos;
    this.orderobj.pointOfSale = this.pointOfSale;
    this.orderobj.allUsers = this.users;
    this.orderobj.settings = this.settingobj;
    this.pos = this.pointOfSale;
    this.orderobj.appUserId = this.appUserId;
    this.orderobj.myPoint = this.myPoint;
    if (!component) {
      if (this.typeOfOrder == "table") component = "table";
      else component = "product";
    }
    if (component == "table") {
      //this.showOrderTypeModal();
      this.selectDineIn = true;
      this.ProductShowing = false;
      this.paymentShow = false;
    }
    if (component == "product") {
      // this.showOrderTypeModal();
      this.selectDineIn = false;
      this.ProductShowing = true;
      this.paymentShow = false;
      if (!this.pointOfSale || !this.pointOfSale.IsTabletDevice) this.setFocusById("CodeBarcodeId");
    }
    if (component == "payment") {
      this.selectDineIn = false;
      this.ProductShowing = false;
      this.paymentShow = true;
      if (this.settingobj.IsUsingCustomerPriceDisplay) {
        this.orderobj.DispalyMode = 3;
        this.orderSer.VFDDisplay(this.orderobj).subscribe();
      }
    }

    //open order type model
    if (!this.orderobj.OrderTypeDocumentId || !this.orderobj.OrderType) {
      let orderType;

      if (this.pointOfSale && this.pointOfSale.OrderTypeId)
        orderType = this.ordertypelist.find((x) => x.DocumentId == this.pointOfSale.OrderTypeId);

      if (orderType) this.setOrderType(orderType);
      else this.showOrderTypeModal();
    } else $("#modal-OrderType").modal("hide");
    this.checkAllCancel = false;
  }

  setOrderType(orderType: OrderTypeModel,showCustomerModal : boolean = true) {
    this.orderobj.orderTypeChangedAfterSave = false;
    if(this.orderSer.settings.ChangeOrderTypeAfterSave && this.orderobj.DocumentId && this.orderobj.OrderTypeDocumentId != orderType.DocumentId)
      this.orderobj.orderTypeChangedAfterSave = true;
    this.orderobj.OrderTypeId = orderType.Id;
    this.orderobj.OrderTypeDocumentId = orderType.DocumentId;
    this.orderobj.OrderTypeName = orderType.Name;
    this.orderobj.OrderType = orderType;
    // set orderPayType For order Type
    this.checkOrderTypePayment(this.orderobj);

    if (this.orderobj.OrderType.Value == 2 && showCustomerModal) {
      this.setDelivery(orderType);
    }
    if (this.orderobj.OrderType.Value == 4) {
      this.showHideComponents("table");
    }
    if (this.orderobj.OrderType.ForStaff) {
      this.isWaiter = "ShouldHaveMeal";
      this.SearchEmployee(this.isWaiter);
      $("#modal-Waiter").modal("show");
    }
    $("#modal-OrderType").modal("hide");
    this.orderobj = this.reassignPricesToAllProducts(this.orderobj);

    // if order type has discount set it to order
    this.setOrderTypeOptions(this.orderobj);
  }
  setOrderTypeOptions(orderobj:OrderModel){
    this.setOrderTypeDiscount();

    if(this.ShortCutKey == "F4" && orderobj.OrderType && orderobj.OrderType.SelectWaiterInOrder &&
        !orderobj.WaiterId && !orderobj.WaiterDocumentId ) {
        this.toastr.info(this.translate.instant("messages.PleaseSelectWaiter"));
        this.isWaiter = true;
        this.SearchEmployee(this.isWaiter);
        $("#modal-Waiter").modal("show");
    }
    if (this.promos?.length) {
      this.allproductlist?.forEach(product=>{
        product = this.assignPromoToProduct(product,orderobj);
      })
    }
  }

  setOrderTypeDiscount() {
    // if order type has discount set it to order
    if (this.orderobj.OrderType && this.orderobj.OrderType.Discount > 0) {
      if (!this.orderobj.OrderType.DiscountType) this.orderobj.OrderType.DiscountType = 1;
      if (this.orderobj.OrderType.DiscountType == 1) {
        if (this.orderobj.OrderType.Discount > 100) this.orderobj.OrderType.Discount = 100;
      }
      this.orderobj.Discount = this.orderobj.OrderType.Discount;
      this.orderobj.DiscountVal = this.orderobj.OrderType.Discount;
      this.orderobj.DiscountType = this.orderobj.OrderType.DiscountType.toString();
      this.orderobj = this.recalculateOrderObject(this.orderobj);
    }
  }

  showTableAll() {
    if (this.showTable) {
      this.showTable = false;
    } else {
      this.showTable = true;
    }
  }

  pageRefresh() {
    location.reload();
  }

  ngOnInit() {
    //this.returnedArray = this.filteredOrders?.slice(0,10);
    this.radioModel = 0;
    this.filterNotes();
    let LockedScreen = localStorage.getItem("LockedScreen");
    this.LockedScreen = LockedScreen == "true" ? true : false;
    if (this.LockedScreen) this.LockScreen(true);
    this.innerWidth = window.innerWidth;
    this.validationList = this.getValidationOptions();
    this.elem = document.documentElement;
    this.firstOpen();

    if (this.searchTerm) {
      this.productlisFilterd = [];
    } else {
      this.productlisFilterd = this.productlist;
    }
    // if(this.typeOfOrder == 'table')
    // $('#modal-OrderType').modal('show');
  }

  EditBg(event) {
    if (event.toElement.className == "btn mr-1 bg-Orangee") {
      event.toElement.className = "btn mr-1 yellow-Dark";
    } else {
      event.toElement.className = "btn mr-1 bg-Orangee";
    }
  }

  CheckPointOfSale() {
    if (this.pointOfSale && this.pointOfSale.IsCallCenter) {
      this.ordertypelist = this.ordertypelist.filter((o) => o.Value != 4);
      if (!this.ordertypelist || this.ordertypelist.length == 0) this.routIfMissingData("ordertype");
    } else if (this.pointOfSale.ShowPinAfterPayment) {
      this.ordertypelist = this.ordertypelist;
      if (!this.ordertypelist || this.ordertypelist.length == 0) this.routIfMissingData("ordertype");
      else {
        this.SearchEmployee("");
        this.ClearPin();
        $("#modal-Pin").modal("show");
        setTimeout(() => {
          this.setFocusById("NewPin");
        }, 300);
      }
    } else if (this.pointOfSale && this.pointOfSale.IsHallPos && this.users) {
      this.ordertypelist = this.ordertypelist.filter((o) => o.Value == 4);
      if (!this.ordertypelist || this.ordertypelist.length == 0) this.routIfMissingData("ordertype");
      else {
        this.SearchEmployee("");
        this.ClearPin();
        $("#modal-Pin").modal("show");
        setTimeout(() => {
          this.setFocusById("NewPin");
        }, 300);
      }
    }
  }

  ifHallPointOfSale() {
    if (this.orderobj.Pin || this.orderobj.Pin === "0") {
      this.orderSer.CheckPinUserWithPermission(this.orderobj.Pin).subscribe(
        (res) => {
          if (res) {
            // if (this.pointOfSale.ShowPinAfterPayment == true){
            this.isAdmin = res["Item1"];
            this.userPermissions = res["Item2"];
            // }
            this.validationList = this.grantOptionsForUser(this.isAdmin, this.validationList, this.userPermissions);
            if (this.pointOfSale.ShowPinAfterPayment == true) this.showHideComponents("product");
            else this.showHideComponents("table");
            if (this.users) {
              const user = this.users.filter((x) => x.Pin == this.orderobj.Pin)[0];
              if (user) {
                this.orderobj.PinUserId = user.AppUserId;
                const captain = this.employeeList.filter((c) => c.UserId == user.AppUserId && c.UserType == 7)[0];
                if (captain) {
                  this.HallCaptain = captain;
                  this.orderobj.CaptainId = captain.Id;
                  this.orderobj.CaptainDocumentId = captain.DocumentId;
                  this.orderobj.CaptainName = captain.FullName || captain.FirstName;
                  $("#modal-Pin").modal("hide");
                  this.GetMobileOrdersCount();
                } else if (this.pointOfSale.ShowPinAfterPayment == true) {
                  this.OpenShiftUserId = user.Id;
                  this.CreatorUserId = user.AppUserId;
                  this.ShowPinAfterPayment(user);
                } else this.routIfMissingData("user");
              } else this.routIfMissingData("user");
            }
          } else this.routIfMissingData("user");
        },
        (error) => {
          this.toastr.error(error.message, "Order");
          this.routIfMissingData("user");
        }
      );
      return "";
    } else this.routIfMissingData("pin");
  }
  openOpenShiftModal(){
    this.showOpenShiftModal = true;
    $("#openshiftmodal").modal("show");
  }
  closeOpenShiftModal(){
    this.showOpenShiftModal = false;
    $("#openshiftmodal").modal("hide");
  }
  ShowPinAfterPayment(user: any) {
    this.orderobj.UserId = user.Id;
    this.orderSer.CheckAvailableIncomingUser(this.orderobj).subscribe((response: any) => {
      if (response.Result.done == false) {
        this.openOpenShiftModal();
        this.toastr.info(this.translate.instant("messages.MustOpenShift"));
        return false;
      } else {
        if (response.Result.UserLogin.token != null) {
          localStorage.setItem("token", response.Result.UserLogin.token);
          // let data: any = new UserLoginModel();
          //   this.LoginSer.UserLogin(data).subscribe((model: any) => {
          //     localStorage.setItem("UserLoginDocumentId", JSON.stringify(model));
          //   });
          $("#modal-Pin").modal("hide");
          this.GetMobileOrdersCount();
        } else {
          this.toastr.info(this.translate.instant("messages.tryagain"));
          return false;
        }
      }
    });
  }
  openShift() {
    this.incominguserobj.OpenShiftUserId = this.OpenShiftUserId;
    this.incominguserobj.PointOfSaleDocumentId = this.pointOfSale.DocumentId;
    this.incominguserobj.CreatorUserId = this.CreatorUserId;
    this.orderSer.OpenDay(this.incominguserobj).subscribe(
      (res: any) => {
        if (res == 1) {
          this.toastr.success("Saved successfully");
          this.closeOpenShiftModal();
        }
      },
      (err) => {
        this.toastr.error("Failed to complete the process");
      }
    );
  }
  newFilteredProducts: any[] = []; // newFilteredProducts => products that have volume

  firstOpen() {
    this.requestStarted = true;
    this.incominguserobj.OpenBalance = 0;
    this.orderSer.free.next(false);
    setTimeout(() => {
      if (this.requestStarted) this.requestStarted = false;
    }, 2200);
    this.orderobj = new OrderModel();
    if (this.deliveryCustomerComponent && this.orderobj.OrderType.Value === 2) {
      this.deliveryCustomerComponent.initFromParent();
    }
    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";

    if(this.ordertypelist?.length && this.intervalInputsChangedIn == this.firstOpenInputsChangedIn)
      this.updateAllProductsAfterOrdersSave();
    else{
      this.orderSer.FirstOpen().subscribe((res) => {
        this.requestStarted = false;
        if (!res) this.routIfMissingData("pointofsale");
        this.originalProductTypeList = res["productTypes"] as ProductTypeModel[];
        if (!this.originalProductTypeList || this.originalProductTypeList.length == 0) this.routIfMissingData("producttype");
        this.settingobj = res["settingModel"];
        this.setCartWidthPercentage(this.settingobj.DetailCartWidth ?? 33.33);
        this.width = !this.settingobj.ProductWidth || this.settingobj.ProductWidth < 7 ? 7 : this.settingobj.ProductWidth;
        this.height =
          !this.settingobj.ProductHeight || this.settingobj.ProductHeight < 7 ? 7 : this.settingobj.ProductHeight;
        this.settingobj.ProductNameFontSize =
          this.settingobj.ProductNameFontSize < 14 ? 14 : this.settingobj.ProductNameFontSize;
        if (!this.settingobj) this.routIfMissingData("setting");
        this.workTime = res["workTime"];
        this.orderSer.workTime = res["workTime"];
        if (!this.workTime) this.routIfMissingData("workTime" , "Order.ShiftMissing");
        this.barcodesettobj = res["barcodesettModel"];
        this.ordertypelist = res["ordertypes"] as OrderTypeModel[];
        this.orderSer.allOrderTypes = this.ordertypelist;
        if (!this.ordertypelist || this.ordertypelist.length == 0) this.routIfMissingData("ordertype");
        this.volumes = res["volumes"];
        this.promos = res["promos"];
        this.isAdmin = res["userWithPermission"]["Item1"];
        this.userPermissions = res["userWithPermission"]["Item2"];
        this.appUserId = res["userWithPermission"]["Item3"];
        this.users = res["users"];
        this.pointOfSale = res["pointOfSale"];
        this.pointOfSaleD = res["pointOfSale"] as PointOfSaleModel;
        this.productTaxes = res["productTaxes"];
        this.taxes = res["taxes"];
        this.productsProperties = res["productProperties"];
        this.cancellationReasons = res["cancellationReasons"];
        this.productPricingClasses = res["productPricingClasses"] as ProductPricingClassModel[];
        this.productPricingClasseVolumes = res["productPricingClasseVolumes"] as ProductPricingClassVolumeModel[];
        this.halls = res["halls"];
        this.integrationSettings = res["integrationSettings"];
        this.unClosedOrdersCount = res["unClosedOrdersCount"];
        this.mobileOrdersCount = res["mobileOrdersCount"];
        this.callCenterOrdersCount = res["callCenterOrdersCount"];

        this.ReservationsCount = res["CustomerOrdersCount"];
        this.branches = res["branches"];
        this.lastOrder = res["lastOrder"];
        this.notPrintedOrdersCount = res["notPrintedOrdersCount"];
        this.notPrintedKotCount = res["notPrintedKotCount"];
        this.comboProducts = res["comboProducts"];
        this.firstOpenInputsChangedIn = res["inputsChangedIn"];
        this.orderSer.foodPlans = res["foodPlans"];
        this.hasLateOrders = res["hasLateOrders"];
        if (this.settingobj) this.fraction = "." + this.settingobj.Round + "-" + this.settingobj.Round;
        
        this.actionsAfterFirstOpen();
      });
    }
    
    this.clearSearch();
  }


  private handelProductsAfterFirstOpen() {
    this.productgrouplist = [];
    this.productgroupclasslist = [];
    this.productlist = [];
    this.productlisFilterd = [];
    this.productTypeList =this.deepCopy(this.originalProductTypeList);
    if (this.promos && this.ordertypelist && this.ordertypelist.length > 0 && this.promos.length > 0) {
      for (let index = 0; index < this.promos.length; index++) {
        const promo = this.promos[index];
        if (promo.OrderTypesList && promo.OrderTypesList.length > 0) {
          promo.OrderTypesList.forEach((x) => {
            var ot = this.ordertypelist.find((otl) => otl.DocumentId == x);
            if (ot) {
              ot.IsPromo = true;
            }
          });
        }
      }
      // if (!this.orderobj.OrderTypeDocumentId || !this.orderobj.OrderType) {
      //   let orderType;
      //   if (this.pointOfSale && this.pointOfSale.OrderTypeId)
      //     orderType = this.ordertypelist.find((x) => x.DocumentId == this.pointOfSale.OrderTypeId);
      //   if (orderType) this.setOrderType(orderType);
      //   else this.showOrderTypeModal();
      // } else $("#modal-OrderType").modal("hide");
      // this.checkAllCancel = false;
    }
    if (this.ordertypelist.length != 0) {
      if (this.typeOfOrder == "takeAway") this.ordertypelist = this.ordertypelist.filter((x) => x.Value == 1);

      if (this.typeOfOrder == "table") this.ordertypelist = this.ordertypelist.filter((x) => x.Value == 4);

      if (this.typeOfOrder == "delivery") this.ordertypelist = this.ordertypelist.filter((x) => x.Value == 2);
    }

    this.productTypeList = this.productTypeList.filter((x) => x.ProductGroups?.length && x.ProductGroups.some(group => group.Products?.length));

    if (this.productTypeList[0].ProductGroups.length != 0) {
      this.productTypeList[0].ProductGroups.forEach((element) => {
        this.productgrouplist.push(element);
      });
    }
    if (this.productTypeList.length > 0) {
      this.productTypeList.forEach((productType) => {
        if (productType.ProductGroups.length > 0) {
          productType.ProductGroups.forEach((productGroup) => {
            if (productGroup.Products.length > 0) {
              productGroup.Products.forEach((product) => {
                product = this.assignTaxToProduct(product);
                product = this.assignPromoToProduct(product);
                product = this.assignProductProperties(product);
                product = this.assignProductPrice(product, this.orderobj, this.pointOfSale);

                // if product has combo details then mark it as a combo
                const comboProduct = this.comboProducts?.filter((c) => c.ProductDocumentId == product.DocumentId)[0];
                if (comboProduct && comboProduct.ComboDetails && comboProduct.ComboDetails.length)
                  product.IsCombo = true;

                if (!product.Price) product.Price = 0;
                if (product.ProductVolumes &&
                  product.ProductVolumes.length > 0 &&
                  this.volumes &&
                  this.volumes.length > 0) {
                  product.ProductVolumes.forEach((pv) => {
                    this.volumeShowAsAproduct = new ProductModel();
                    this.assignPriceToVolumes(product);
                    let ee = this.volumes.find(
                      (v) =>
                        // (pv.VolumeFerpCode && v.VolumeFerpCode == pv.VolumeFerpCode) ||
                        (pv.VolumeId && v.Id == pv.VolumeId) ||
                        (pv.VolumeDocumentId && v.DocumentId == pv.VolumeDocumentId)
                    );

                    pv.VolumeName = this.getTypeName(ee);
                    // )?.Name;
                    if (this.settingobj.ShowVolumeAsProduct == true) {
                      let separatorCharacter = this.settingobj?.VolumeAndProductNameSeparatorCharacter ?? "/";
                      this.volumeShowAsAproduct = this.deepCopy(product);
                      this.volumeShowAsAproduct.ProductVolumes = [];
                      this.volumeShowAsAproduct.Price = pv.Price;
                      this.volumeShowAsAproduct.VolumeDocumentId = pv.VolumeDocumentId;
                      this.volumeShowAsAproduct.VolumeId = pv.VolumeId;
                      // this.volumeShowAsAproduct.Name = product.Name + "" + "/" + pv.VolumeName;
                      if (this.settingobj.ShowVolumeNameBeforeProductName) {
                        this.volumeShowAsAproduct.Name = pv.VolumeName + " " + separatorCharacter + " " + product.Name;
                      }
                      else {
                        this.volumeShowAsAproduct.Name = product.Name + " " + separatorCharacter + " " + pv.VolumeName;
                      }
                      this.volumeShowAsAproduct.IsVolume = true;
                      this.volumeShowAsAproduct.ProductVolumeName = pv.VolumeName;
                      this.volumeShowAsAproduct = this.assignPromoToProduct(this.volumeShowAsAproduct);
                      productGroup.Products.push(this.volumeShowAsAproduct);
                    }
                  });
                  // newFilteredProducts => products that have volume
                  this.newFilteredProducts.push(product);
                }

                this.allproductlist.push(product);
              });
              if (this.settingobj.ShowVolumeAsProduct) {
                // nested loops to remove the main product in case settingobj.ShowVolumeAsProduct === true
                for (let i = 0; i < productGroup.Products.length; i++) {
                  if (productGroup.Products[i].ProductVolumes.length > 0) {
                    for (let j = 0; j < this.newFilteredProducts.length; j++) {
                      if ((productGroup.Products[i].Id !== undefined &&
                        this.newFilteredProducts[j].Id !== undefined &&
                        productGroup.Products[i].Id === this.newFilteredProducts[j].Id) ||
                        (productGroup.Products[i].DocumentId !== undefined &&
                          this.newFilteredProducts[j].DocumentId !== undefined &&
                          productGroup.Products[i].DocumentId === this.newFilteredProducts[j].DocumentId)) {
                        productGroup.Products.splice(i, 1);
                      }
                    }
                  }
                }
                this.newFilteredProducts = [];
              }
            }
          });
        }
      });

      // loop to remove duplicated products
      this.allproductlist = this.distinct(this.allproductlist, "DocumentId");
      this.orderSer.originalProductList = deepCopy(this.allproductlist);
      this.orderSer.allCombos = getAllGroupMealsCombos(this.orderSer.originalProductList);
    }

    this.orderSer.entertainmentServiceProducts = this.deepCopy(this.allproductlist.filter(x=>x.EntertainmentService && !x.ProductSubItems?.length && !x.ProductVolumes?.length));


    if (this.productTypeList[0].HideProductGroupsInOrder) this.loadProductGroupsDetails(this.productTypeList[0]);
    else this.loadProductDetails(this.productgrouplist[0]);
  }

  updateAllProductsAfterOrdersSave(){
    if(this.settingobj.UseDailyStock || this.settingobj.ShowProductsAvalQty){
      this.orderSer.updateAllProductsAfterOrdersSave().subscribe((res:any[]) => {
        if(res && res.length){

          if (this.originalProductTypeList.length > 0) {
            this.originalProductTypeList.forEach((productType) => {
              if (productType.ProductGroups.length > 0) {
                productType.ProductGroups.forEach((productGroup) => {
                  if (productGroup.Products.length > 0) {
                    productGroup.Products.forEach((product) => {
                      let p = res.find((x) => x.DocumentId == product.DocumentId);
                      if (p)
                        product.AvailableQuantity = p.AvailableQuantity;
                    });
                  }
                });
              }
            });
          }

          // res.forEach(prod => {

            
          //   let product = this.allproductlist.find(x=>x.DocumentId == prod.DocumentId);
          //   if(product) product.AvailableQuantity = prod.AvailableQuantity;
          // });
        }
        this.actionsAfterFirstOpen();
      });
    }
    else
      this.actionsAfterFirstOpen();
  }
  actionsAfterFirstOpen(){
      if(this.isAdmin && !this.settingobj?.AllowAdminAccessPOSTransactons) this.routIfMissingData("admin");
      this.requestStarted = false;
      this.resetConectedScreens();
      this.CheckPointOfSale();
      this.checkShift();
      this.updatePendingOrders(this.orderobj);

      this.getMobileIntegration(true);

      this.handelProductsAfterFirstOpen();

      this.checkProductsMealInTime();

      this.validationList = this.grantOptionsForUser(this.isAdmin, this.validationList, this.userPermissions);
      if (!this.pointOfSale.IsHallPos) {
        this.showHideComponents(undefined);
      }

      if (!this.orderobj.OrderTypeDocumentId || !this.orderobj.OrderType) {
        let orderType;
        if (this.pointOfSale && this.pointOfSale.OrderTypeId)
          orderType = this.ordertypelist.find((x) => x.DocumentId == this.pointOfSale.OrderTypeId);
        if (orderType && !this.orderobj.TableId) this.setOrderType(orderType);
      }

      // check IsCallCenter
      this.orderobj.pointOfSale = this.pointOfSale;
      this.orderobj = this.checkCallCenter(this.orderobj);

      this.holdedOrders = this.LocalstorgeService.get(this.holdedOrdersKey);
      if (this.typeOfOrder == "CustomerOrder" && this.ReservationsCount && this.ReservationsCount > 0) {
        this.GetAllCustomerOrders();
        this.typeOfOrder = null;
      }
  }

  checkProductsMealInTime()
  {
    if(this.allproductlist?.length && this.allproductlist.some(p=> p.Meals?.length))
    {
      this.refreshDateAndTime();
      this.allproductlist.filter(p=> p.Meals?.length).forEach(p=>{
        const mealExist = p.Meals.some(m => (!m.FromTime || m.FromTime <= this.currentMachineTime) &&
        (!m.ToTime || m.ToTime >= this.currentMachineTime));

        if(!mealExist) {
          this.allproductlist = this.allproductlist.filter(x=> x.DocumentId != p.DocumentId);
          let productType = this.productTypeList.find(x=> x.ProductGroups.some(g=> g.DocumentId == p.ProductGroupDocumentId));
          if(productType){
            const index = productType.ProductGroups.findIndex(x=> x.DocumentId == p.ProductGroupDocumentId);
            if(index != -1) productType.ProductGroups[index].Products = productType.ProductGroups[index].Products?.filter(x=> x.DocumentId != p.DocumentId);
          }
        }
      });
        
    }
  }
  getHallByTable(TableId) {
    let hall;
    this.halls.forEach((h) => {
      let tableIds = h.Tables.map((t) => t.DocumentId);
      if (tableIds && tableIds.length > 0 && tableIds.includes(TableId)) hall = h;
    });
    return hall;
  }

  getProductPricingClasseVolumes(product: ProductModel, order: OrderModel, pos) {
    if(!this.currentppp?.PricingClassDocumentId && !this.currentppp?.PricingClassId)
      this.currentppp = this.getCurrenPricingClass(order, product, pos);

    let productPricingClasseVolumes = product.ProductPricingClasses?.filter(
      (x) =>
        this.currentppp &&
        ((this.currentppp?.PricingClassDocumentId &&
          x.PricingClassDocumentId == this.currentppp?.PricingClassDocumentId) ||
          (this.currentppp?.PricingClassId && x.PricingClassId == this.currentppp?.PricingClassId))
    )[0]?.ProductPricingClassVolumes;
    let changed = false;
    if (this.productPricingClasseVolumes && this.productPricingClasseVolumes.length > 0) {
      if (order && order.TableId && this.halls && this.halls.length > 0) {
        let hall = this.getHallByTable(order.TableId);
        if (hall && hall.PricingClassDocumentId) {
          changed = true;
          let ppcv = this.productPricingClasseVolumes.filter(
            (x) => x.PricingClassDocumentId == hall.PricingClassDocumentId && x.ProductDocumentId == product.DocumentId
          );
          if (ppcv && ppcv.length > 0) {
            productPricingClasseVolumes = ppcv;
          }
        }
      }
      if (pos && pos.PricingClassId && !changed) {
        changed = true;
        let ppcv = this.productPricingClasseVolumes.filter(
          (x) => x.PricingClassDocumentId == pos.PricingClassId && x.ProductDocumentId == product.DocumentId
        );
        if (ppcv && ppcv.length > 0) {
          productPricingClasseVolumes = ppcv;
        }
      }
      if (order && order.OrderType && order.OrderType.PricingClassDocumentId && !changed) {
        changed = true;
        let ppcv = this.productPricingClasseVolumes.filter(
          (x) =>
            x.PricingClassDocumentId == order.OrderType.PricingClassDocumentId &&
            x.ProductDocumentId == product.DocumentId
        );
        if (ppcv && ppcv.length > 0) {
          productPricingClasseVolumes = ppcv;
        }
      }
    }
    this.assignPromoCustomPrice(product,productPricingClasseVolumes);
    return productPricingClasseVolumes;
  }

  assignProductPrice(product: ProductModel, order: OrderModel, pos, detail: OrderDetailModel = null) {
    // let productPricingClass = product.ProductPricingClasses[0] ;
    if (product) {
      if(!product?.ProductPricingClasses?.length){
        product.ProductPricingClasses = this.deepCopy(this.allproductlist?.find(x=>(product.Id && x.Id == product.Id) ||
        (product.DocumentId && x.DocumentId == product.DocumentId)))?.ProductPricingClasses;
      }
      let productPricingClass = this.getCurrenPricingClass(order, product, pos);
      if (this.settingobj.ShowVolumeAsProduct == true && product.IsVolume == true) {
        product.Price;
      } else {
        product.Price = productPricingClass && productPricingClass.Price ? productPricingClass.Price : 0;
      }

      if (detail?.VolumeFerpCode !== undefined || detail?.VolumeDocumentId !== undefined) {
        product.VolumeDocumentId = detail.VolumeDocumentId ? detail.VolumeDocumentId : null;
        product.VolumeFerpCode = detail.VolumeFerpCode;
      }
      this.currentppp = this.deepCopy(productPricingClass);

      if(productPricingClass?.PricingClassDocumentId)
         this.orderobj.PricingClassDocumentId = productPricingClass.PricingClassDocumentId;

      if (product.ProductVolumes && product.ProductVolumes.length > 0) {
        product = this.assignPriceToVolumes(product);

        if (!product.Price || (detail && !detail.DocumentId)) {
          let productVolum = product.ProductVolumes.filter((x) => x.MainUnit)[0];
          if (detail && (detail.VolumeDocumentId || detail.VolumeId || detail.VolumeFerpCode ))
            productVolum = product.ProductVolumes.filter(
              (x) =>
                (detail.VolumeDocumentId && x.VolumeDocumentId == detail.VolumeDocumentId) ||
                (detail.VolumeId && x.VolumeId == detail.VolumeId)||
                (detail.VolumeFerpCode && x.VolumeFerpCode == detail.VolumeFerpCode)
            )[0];
          product.Price = productVolum && productVolum.Price ? productVolum.Price : 0;
          if (detail && !detail.DocumentId) detail.ProductPrice = product.Price;
        }
      }

      this.assignPromoCustomPrice(product);
      return product;
    }
  }

  private getCurrenPricingClass(order: OrderModel, product: ProductModel, pos: any) {
    let productPricingClass = new ProductPricingClassModel();
    let changed = false;
    if (this.productPricingClasses && this.productPricingClasses.length > 0) {
      if (order && order.TableId && this.halls && this.halls.length > 0) {
        let hall = this.getHallByTable(order.TableId);
        if (hall && hall.PricingClassDocumentId) {
          changed = true;
          let pPClass = this.productPricingClasses.find(
            (pp) => pp.ProductDocumentId == product.DocumentId && pp.PricingClassDocumentId == hall.PricingClassDocumentId
          );
          if (pPClass) productPricingClass = pPClass;
          this.orderobj.PricingClassDocumentId = hall.PricingClassDocumentId;
        }
      }
      if (pos && pos.PricingClassId && !changed) {
        changed = true;
        let pPClass = this.productPricingClasses.find(
          (pp) => pp.ProductDocumentId == product.DocumentId && pp.PricingClassDocumentId == pos.PricingClassId
        );
        if (pPClass) productPricingClass = pPClass;
        this.orderobj.PricingClassDocumentId = pos.PricingClassId;
      }
      if (order && order.OrderType && order.OrderType.PricingClassDocumentId && !changed) {
        changed = true;
        let pPClass = this.productPricingClasses.find(
          (pp) => pp.ProductDocumentId == product.DocumentId &&
            pp.PricingClassDocumentId == order.OrderType.PricingClassDocumentId
        );
        if (pPClass) productPricingClass = pPClass;
        this.orderobj.PricingClassDocumentId = order.OrderType.PricingClassDocumentId;
      }
    }
    return productPricingClass;
  }

  reassignPricesToAllProducts(order: OrderModel) {
    this.allproductlist.forEach((x) => {
      if (!x.PriceChanged) x = this.assignProductPrice(x, order, this.pointOfSale);
    });
    const volumesAsProducts = (this.productTypeList as any).flatMap((x) => x.ProductGroups).flatMap(((x) => x.Products)).filter((x) => x.IsVolume == true);
    volumesAsProducts.forEach((x) => {
      if (!x.PriceChanged) x = this.assignPriceToVolumeAsProduct(x);
    });
    order.OrderDetails?.forEach((d) => {
      if (!d.Product.PriceChanged) d.Product = this.assignProductPrice(d.Product, order, this.pointOfSale, d);
    });

    if (this.productTypeList[0].HideProductGroupsInOrder) this.loadProductGroupsDetails(this.productTypeList[0]);
    else this.loadProductDetails(this.productgrouplist[0]);
    return order;
  }

  assignTaxToProduct(product: ProductModel) {
    if (product) {
      let productTaxes = undefined;

      if (this.productTaxes && this.productTaxes.length > 0 && this.taxes && this.taxes.length > 0) {
        productTaxes = this.productTaxes.filter(
          (x) => (product?.Id && x.ProductId == product?.Id) || x.ProductDocumentId == product?.DocumentId
        );

        if (productTaxes && productTaxes.length) {
          // check if any system allow Multi Taxes on product
          productTaxes.forEach((pt) => {
            const tax = this.taxes.find(
              (t) =>
                ((pt.TaxId && t.Id == pt.TaxId) || (pt.TaxDocumentId && t.DocumentId == pt.TaxDocumentId)) &&
                t.ValueType == 1
            );
            pt.Tax = tax;
          });
          productTaxes = productTaxes.filter((x) => x.Tax && x.Tax.Value);

          if (!this.settingobj.AllowMultiTaxOnPrduct && productTaxes.length) productTaxes = [productTaxes[0]];
        }
      }
      if(!productTaxes?.length && this.taxes?.length && this.taxes.some(x=>x.DefaultForProduct && x.ValueType == 1)){
        const defaultTax = this.taxes.find(x=>x.DefaultForProduct && x.ValueType == 1);
        productTaxes = [{TaxId :defaultTax.Id,TaxDocumentId :defaultTax.DocumentId,ProductId :product.Id,ProductDocumentId :product.DocumentId ,Tax: defaultTax} ];
      }
      product.ProductTaxes = productTaxes;
      return product;
    }
  }

  assignPromoToProduct(product: ProductModel,orderobj:OrderModel = undefined) {
    product.Promos = [];
    if (this.promos && this.promos.length > 0) {
      if(this.settingobj?.ShowVolumeAsProduct == true && product.ProductVolumes?.length && !product.VolumeDocumentId)
        return product;        
      let promos = this.promos.filter((x) =>
        x.PromoProducts.map((pr) => pr.TakeProductDocumentId).includes(product.DocumentId)
      );
      if(promos?.length > 0 && product.VolumeDocumentId)
        promos = promos.filter(x=>x.PromoProducts.some(pr=>pr.TakeProductVolumeDocumentId == product.VolumeDocumentId && pr.TakeProductDocumentId == product.DocumentId));

      // return items.filter(it => it[args[0]] == args[1]);
      if (promos && promos.length > 0) {
        product.Promos.push(...promos);
        this.handlePromo(product, undefined, orderobj);
      }
    }
    return product;
  }

  assignProductProperties(element3: ProductModel) {
    if (this.productsProperties && this.productsProperties.length > 0) {
      let productProperties = this.productsProperties.filter(
        (x) =>
          (element3.Id && x.ProductId == element3.Id) ||
          (element3.DocumentId && x.ProductDocumentId == element3.DocumentId)
      )[0];
      if (productProperties) {
        element3.ProductProperties = productProperties;
        if (productProperties.ImgPath) element3.PicturePath = productProperties.ImgPath;
        else element3.PicturePath = "";
        element3.IndexInGroup = productProperties.IndexInGroup;
      } else element3.PicturePath = "";
    } else element3.PicturePath = "";
    return element3;
  }

  loadAllProducts() {
    this.productlist = [];
    if (this.currentproductgroup.Products.length != 0) {
      this.currentproductgroup.Products.forEach((element) => {
        this.productlist.push(element);
      });
      // sort products by customer past arrangment
      this.productlist.sort(function (a, b) {
        return a.IndexInGroup - b.IndexInGroup;
      });

      const initialItems = this.settingobj.DontUsePageinationInOrderScreen ? 1000 : this.getItemsPerPageForPagination();
      this.finalProductList = this.getFinalProductList(this.productlist, 0, initialItems);
      // this.changeProductCardDimensions();
    }
  }

  getFinalProductList(list: ProductModel[], startnum: number, endnum: number) {
    let l;
    list = list?.filter(x=>!x.EntertainmentService);
    list = this.hideZeroProducts(list);
    l = list.slice(startnum, endnum);
    return l;
  }

  handleNotes(product: ProductModel) {
    // if (product.Notes.length != 0) {
    //   this.orderdetailobj.OrderDetailNotes = [];
    //   product.Notes.forEach((element) => {
    //     this.orderdetailnotesobj.NoteId = element.Id;
    //     this.orderdetailnotesobj.NoteDocumentId = element.DocumentId;
    //     this.orderdetailnotesobj.NoteName = element.Name;
    //     this.orderdetailobj.OrderDetailNotes.push(this.orderdetailnotesobj);
    //   });
    //   this.orderdetailnotelist = this.orderdetailobj.OrderDetailNotes;
    //   this.orderdetailobj.ShowNotes = true;
    // } 
    // else {
      this.orderdetailobj.OrderDetailNotes = [];
      this.orderdetailobj.ShowNotes = false;
    // }
  }

  assignPriceToVolumeAsProduct(product: ProductModel) {
    if(product.IsVolume){
      let productPricingClassVolumes = this.getProductPricingClasseVolumes(this.deepCopy(product), this.orderobj, this.pointOfSale);
      // this.assignPromoCustomPrice(product,productPricingClassVolumes);
      product.Price = productPricingClassVolumes?.find(pv=> (product.VolumeDocumentId && pv.VolumeDocumentId == product.VolumeDocumentId) ||
       (product.VolumeFerpCode && pv.VolumeFerpCode == product.VolumeFerpCode) || (product.VolumeId && pv.VolumeId == product.VolumeId))
       ?.Price ?? 0;
    }
  }
  assignPriceToVolumes(product: ProductModel) {
    let productPricingClassVolumes = this.getProductPricingClasseVolumes(
      this.deepCopy(product),
      this.orderobj,
      this.pointOfSale
    );
    if(product.ProductVolumes?.length) product.ProductVolumes.forEach(x=>x.Price = 0);
    // this.assignPromoCustomPrice(product,productPricingClassVolumes);

    if (productPricingClassVolumes?.length && !this.orderobj?.IsCallCenter && !this.orderobj?.IsMobileOrder) {
      productPricingClassVolumes.forEach((pp) => {
        const volume = this.getVolumeByProductVolumeOrPricingClassVolume(pp);

        let index = product.ProductVolumes.findIndex(
          (x) =>
          (volume?.DocumentId && x.VolumeDocumentId == volume?.DocumentId)||
          (volume?.Id && x.VolumeId == volume?.Id) ||
          (volume?.FerpCode && x.VolumeFerpCode == volume?.FerpCode)
        );
        if (index != -1){
          product.ProductVolumes[index].Price = pp.Price;
          if(!product?.ProductVolumes[index]?.VolumeFerpCode)
             product.ProductVolumes[index].VolumeFerpCode = volume?.FerpCode;
          if(!product?.ProductVolumes[index]?.VolumeDocumentId)
             product.ProductVolumes[index].VolumeDocumentId = volume?.DocumentId;
        }
      });
    }

    if ((product?.VolumeFerpCode !== undefined || (product?.VolumeDocumentId !== undefined && this?.pointOfSaleD?.LinkWithOnlineOrder)) &&
      productPricingClassVolumes?.length ) {

      productPricingClassVolumes.forEach((pp) => {
        const volume = this.getVolumeByProductVolumeOrPricingClassVolume(pp);

        let index = product.ProductVolumes.findIndex(
          (x) =>
          (volume?.DocumentId && x.VolumeDocumentId == volume?.DocumentId)||
          (volume?.Id && x.VolumeId == volume?.Id) ||
          (volume?.FerpCode && x.VolumeFerpCode == volume?.FerpCode)
        );
        if (index != -1) product.ProductVolumes[index].Price = pp.Price;
      });
  
      
      product.Price = productPricingClassVolumes.filter(
        (ppVolume: any) =>
          product.ProductVolumes.find((pv: any) => pv.VolumeId === ppVolume.VolumeId) ||
          ppVolume.VolumeFerpCode === product.VolumeFerpCode ||
          ppVolume.VolumeDocumentId === product.VolumeDocumentId
      )[0]?.Price;
    }

    if (this.settingobj.HideZerosProducts) {
      // when not linked with FERP
      product.ProductPricingClasses?.forEach((pricingClass: any) => {
        pricingClass.ProductPricingClassVolumes = pricingClass.ProductPricingClassVolumes.filter(
          (pricingClassVolume: any) => pricingClassVolume.Price > 0
        );
      });

      // when linked with FERP
      // product.ProductVolumes = product.ProductVolumes.filter((volume: any) => volume.Price > 0);
    }

    return product;
  }

  getVolumeByProductVolumeOrPricingClassVolume(pv:ProductPricingClassVolumeModel | ProductVolumeModel):VolumeModel|undefined{
    if(this.volumes?.length && pv){
      return this.deepCopy(this.volumes.find((v:VolumeModel) => (pv.VolumeDocumentId && pv.VolumeDocumentId == v.DocumentId)
      ||(pv.VolumeId && pv.VolumeId == v.Id) ||(pv.VolumeFerpCode && pv.VolumeFerpCode == v.FerpCode) ));
    }
    return;
  }
  
  productSelected: boolean = false;
  async addToOrderDetailList(product: ProductModel) {
    let detail = undefined;
    this.productName = product.Name;
    this.productprice = product.Price;
    // this.productSelected = true
    product.Selected = !product.Selected;
    if (
      product.ProductItems &&
      product.ProductItems.length > 0 &&
      product.AvailableQuantity <= 0 &&
      this.settingobj.UseStocksAndPurchase &&
      !this.settingobj.AllowUsingProductsWithNoAvalQty
    ) {
      this.toastr.info(this.translate.instant("messages.NoAvailableQuantity") + " " + product.Name, "Order");
      return false;
    }
    if (this.checkIsProductTempStopped(product)) {
      return false;
    }
    this.productvolumslist = [];
    this.orderdetailindex = undefined;
    this.productsubitemlist = [];
    this.orderdetailobj.OrderDetailPromo = [];
    this.existedrow = false;
    let existDetail = undefined;

    if(!this.fromGroupMealPopup && this.isGroupMealProduct(product)) return false;
    else 
      this.closeGroupMealModal();

    let filterdDetails = this.orderobj.OrderDetails.filter(
      (x) =>
        ((product.Id && x.ProductId == product.Id) ||
          (product.DocumentId && x.ProductDocumentId == product.DocumentId)) &&
        !x.IsPromo
    );

    if (product.VolumeId) filterdDetails = filterdDetails.filter((x) => x.VolumeId == product.VolumeId);

    if (product.VolumeDocumentId)
      filterdDetails = filterdDetails.filter((x) => x.VolumeDocumentId == product.VolumeDocumentId);

    if (filterdDetails.length) existDetail = filterdDetails[filterdDetails.length - 1];

    // check if already exists
    let existFilter = existDetail && this.settingobj.ClickProductPlusQuantity &&
     !existDetail.DiscountAmount && (!existDetail.OrderDetailNotes || !existDetail.OrderDetailNotes.length)
     && (!existDetail.DocumentId || !existDetail.DocumentId.trim()) && !existDetail.IsParentPromo;

    if (product.ProductVolumes.length > 0) {
      const productWithVolume = this.assignPriceToVolumes(this.deepCopy(product));
      this.productvolumslist = productWithVolume.ProductVolumes;
      $("#modal-Volums").modal("show");
      this.productwithvolum = productWithVolume;
      this.productwithvolum.FromSearch = false;
    } else {

      if (product.IsCombo && !this.settingobj.OpenSideDishesPopUpAfterSelectProduct) {
        let comboProduct = this.comboProducts.find(c => c.ProductDocumentId == product.DocumentId);
        if (comboProduct && comboProduct.ComboDetails && comboProduct.ComboDetails.length) {
          if(existFilter && comboProduct.MandatoryLoadingOfSideDishes){
            this.clickedPlus(existDetail);
            return false;
          }
          else{
            this.openNewComboProductsModel(comboProduct, true);
            return false;
          }
        }
      }

      if (product.ProductSubItems.length != 0 && (!this.settingobj.OpenSideDishesPopUpAfterSelectProduct || product.ProductSubItems.some(x=>x.IsMandatory))) {
        this.openNewSideDish(product, true);
      } else {
        let productQuantity = 1 ;
        //#region Check ZebraScale
        if(this.pointOfSale?.UseScaler && product.UseWeights)
          productQuantity = await this.getScalerWeight();
        //#endregion

        if (this.orderobj.OrderDetails.length != 0) {
          this.orderdetailobj.ProductPrice = product.Price;

          if (existFilter)
            this.clickedPlus(existDetail);
          else if (this.existedrow == false) {
            this.orderdetailobj.ProductId = product.Id;
            this.orderdetailobj.ProductDocumentId = product.DocumentId;
            this.orderdetailobj.ProductPrice = product.Price;
            this.orderdetailobj.ProductName = product.Name;
            this.orderdetailobj.Product = product;
            this.orderdetailobj.ProductQuantity = productQuantity;
            if (this.settingobj.ShowVolumeAsProduct == true) {
              this.orderdetailobj.ProductVolumName = product.ProductVolumeName;
              this.orderdetailobj.VolumeDocumentId = product.VolumeDocumentId;
              this.orderdetailobj.VolumeId = product.VolumeId;
            }
            this.ss = "1";
            //  this.Keyboardnum.setInput("1");
            this.handleNotes(product);

            this.orderdetailobj = this.handlePromo(product, this.orderdetailobj, this.orderobj);

            this.orderdetailobj = this.handelProductDiscount(product, this.orderdetailobj, this.orderobj);

            this.orderdetailobj.OrderDetailTaxes = [];
            this.orderdetailobj = this.handelProductTax(product, this.orderdetailobj);

            if (!product.ProductGroupId && !product.ProductGroupDocumentId) {
              let nProduct = this.allproductlist.find(
                (x) => (product.Id && x.Id == product.Id) || x.DocumentId == product.DocumentId
              );
              this.orderdetailobj.ProductGroupId = nProduct.ProductGroupId;
              this.orderdetailobj.ProductGroupDocumentId = nProduct.ProductGroupDocumentId;
              this.orderdetailobj.ProductGroupName = nProduct.ProductGroupName;
            } else {
              this.orderdetailobj.ProductGroupId = product.ProductGroupId;
              this.orderdetailobj.ProductGroupDocumentId = product.ProductGroupDocumentId;
              this.orderdetailobj.ProductGroupName = product.ProductGroupName;
            }
            this.orderdetailobj.ShowInsurance = false;
            this.orderdetailobj.Total = this.calculateOrderDetailTotal(this.orderdetailobj);
            if (!this.orderdetailobj.ProductIndex && this.orderdetailobj.ProductIndex != 0)
              this.orderdetailobj.ProductIndex = this.orderobj.OrderDetails.length;
            this.orderobj.OrderDetails.push(this.orderdetailobj);
            this.addLiStyle(this.orderdetailobj);
            this.calculateTotals(this.orderobj, true);
            detail = this.orderdetailobj;
            this.orderdetailobj = new OrderDetailModel();
          }
        } else {
          this.orderdetailobj.ProductId = product.Id;
          this.orderdetailobj.ProductDocumentId = product.DocumentId;
          this.orderdetailobj.ProductPrice = product.Price;
          this.orderdetailobj.ProductName = product.Name;
          this.orderdetailobj.ProductQuantity = productQuantity;
          this.orderdetailobj.Product = product;
          if (this.settingobj.ShowVolumeAsProduct == true) {
            this.orderdetailobj.ProductVolumName = product.ProductVolumeName;
            this.orderdetailobj.VolumeDocumentId = product.VolumeDocumentId;
            this.orderdetailobj.VolumeId = product.VolumeId;
          }

          this.handleNotes(product);
          this.orderdetailobj = this.handlePromo(product, this.orderdetailobj, this.orderobj);
          this.orderdetailobj = this.handelProductDiscount(product, this.orderdetailobj, this.orderobj);
          this.orderdetailobj.OrderDetailTaxes = [];
          this.orderdetailobj = this.handelProductTax(product, this.orderdetailobj);

          if (!product.ProductGroupId && !product.ProductGroupDocumentId) {
            let nProduct = this.allproductlist.find(
              (x) => (product.Id && x.Id == product.Id) || x.DocumentId == product.DocumentId
            );
            this.orderdetailobj.ProductGroupId = nProduct.ProductGroupId;
            this.orderdetailobj.ProductGroupDocumentId = nProduct.ProductGroupDocumentId;
            this.orderdetailobj.ProductGroupName = nProduct.ProductGroupName;
          } else {
            this.orderdetailobj.ProductGroupId = product.ProductGroupId;
            this.orderdetailobj.ProductGroupDocumentId = product.ProductGroupDocumentId;
            this.orderdetailobj.ProductGroupName = product.ProductGroupName;
          }
          this.orderdetailobj.ShowInsurance = false;
          this.orderdetailobj.Total = this.calculateOrderDetailTotal(this.orderdetailobj);
          if (!this.orderdetailobj.ProductIndex && this.orderdetailobj.ProductIndex != 0)
            this.orderdetailobj.ProductIndex = this.orderobj.OrderDetails.length;
          this.orderobj.OrderDetails.push(this.orderdetailobj);
          this.addLiStyle(this.orderdetailobj);
          this.calculateTotals(this.orderobj, true);
          detail = this.orderdetailobj;
          this.orderdetailobj = new OrderDetailModel();
        }
      }
    }

    // Set suggestions for clicked product
    this.setSuggestions(product.ProductSuggestions ?? []);

    // this.clickedClear();
    this.orderobj = this.recalculateOrderObject(this.orderobj);

    // this.orderDetailWithCustomPromo = this.orderobj.OrderDetails.find((x) =>
    //   // x.EditingSelected == true &&
    //   x.Product?.Promos.find(
    //     (p) => p.ValueType == 3 && p?.OrderTypesList?.includes(this.orderobj?.OrderType?.DocumentId)
    //   )
    // );
    // this.orderDetailWithCustomPromo = this.orderdetailobj;
    if (detail && detail.Product && this.orderobj && this.orderobj.OrderType.IsPromo) {
      this.handelCustomPromo(detail.Product, detail, this.orderobj);
    }
  }

  addOrUpdateToOrderDetailListFromSearch(product: any) {
    if (
      this.codbarqty.nativeElement.value == "" ||
      !this.codbarqty.nativeElement.value ||
      Number(this.codbarqty.nativeElement.value) == 0
    )
      this.codbarqty.nativeElement.value = "1";
    if (this.codbarqty.nativeElement.value != "" && this.codebarproduct) {
      if(this.validationList['CanChangeQuantityAfterSaveForWeightedProduct'] && this.codebarproduct?.UseWeights)
        this.changeQuantityAfterSave(this.codebarproduct);
      else{
        let detail = this.orderobj.OrderDetails.find((x) => !x.DocumentId && x.ProductDocumentId == product.DocumentId);
        if (this.settingobj && this.settingobj.ClickProductPlusQuantity && detail)
          detail.ProductQuantity += Number(this.codbarqty.nativeElement.value);
        else
          this.addToOrderDetailListFromSearch(product);
        
        this.clearCodeBarData();
      }
   
    }
  }
  addToOrderDetailListFromSearch(product: ProductModel , donotPrint:boolean = false) {
    this.addToOrderDetailList(product);
    const detail = this.orderobj.OrderDetails.filter((x) => !x.DocumentId && x.ProductDocumentId == product.DocumentId).reverse()[0];
    if (detail){
      detail.ProductQuantity = Number(this.codbarqty.nativeElement.value);
      if(donotPrint)
        detail.Printed = true;
    } 
  }
  clearCodeBarData(){
    this.codebarproduct = undefined;
    this.checkcodebarexists = false;
    this.groupRef.nativeElement.value = "";
    this.codbarqty.nativeElement.value = "";
    document.getElementById("CodeBarcodeId")?.focus();
    // this.setFocusById("CodeBarcodeId");

    this.orderobj = this.recalculateOrderObject(this.orderobj, true);
  }

  async volumChanged(productvolum: ProductVolumeModel) {
    // let thisProduct = Object.assign({}, this.productwithvolum);
    let thisProduct = this.deepCopy(this.productwithvolum);
    let productPricingClassVolumes = this.getProductPricingClasseVolumes(thisProduct, this.orderobj, this.pointOfSale);
    const volume = this.getVolumeByProductVolumeOrPricingClassVolume(productvolum);
    let productPricingClassVolume = this.deepCopy(productPricingClassVolumes?.find(x=>
      (volume?.DocumentId && x.VolumeDocumentId == volume?.DocumentId)||
      (volume?.Id && x.VolumeId == volume?.Id) ||
      (volume?.FerpCode && x.VolumeFerpCode == volume?.FerpCode)
    ));

    let orderdetailobj = new OrderDetailModel();
    orderdetailobj.OrderDetailPromo = [];
    orderdetailobj.ProductId = thisProduct.Id;
    orderdetailobj.ProductDocumentId = thisProduct.DocumentId;
    orderdetailobj.ProductPrice =
      productPricingClassVolume && productPricingClassVolume.Price ? productPricingClassVolume.Price : 0;
    orderdetailobj.ProductName = thisProduct.Name;
    orderdetailobj.ProductVolumName = productvolum.VolumeName;
    orderdetailobj.VolumeId = productvolum.VolumeId;
    orderdetailobj.VolumeDocumentId = productvolum.VolumeDocumentId;
    orderdetailobj.VolumeFerpCode = productvolum.VolumeFerpCode;
    orderdetailobj.Product = thisProduct;
    orderdetailobj.ProductGroupId = thisProduct.ProductGroupId;
    orderdetailobj.ProductGroupDocumentId = thisProduct.ProductGroupDocumentId;
    orderdetailobj.ProductGroupName = thisProduct.ProductGroupName;
    orderdetailobj.Product.Price =
      productPricingClassVolume && productPricingClassVolume.Price ? productPricingClassVolume.Price : 0;
    orderdetailobj.ProductQuantity = 1;
    if (!orderdetailobj.ProductIndex && orderdetailobj.ProductIndex != 0)
      orderdetailobj.ProductIndex = this.orderobj.OrderDetails.length;

    this.orderobj.OrderDetails.push(orderdetailobj);
    this.orderobj = this.recalculateOrderObject(this.orderobj);

   await $("#modal-Volums").modal("hide");
    this.orderobj.OrderDetails.forEach((x) => {
      x.Selected = false;
    });
    this.orderobj.OrderDetails.forEach((x) => {
      x.EditingSelected = false;
    });

    // this.orderDetailWithCustomPromo = this.orderobj.OrderDetails.find((x) =>
    //   // x.EditingSelected == true &&
    //   {
    //     x.Product?.Promos.find(
    //       (p) => p.ValueType == 3 && p?.OrderTypesList?.includes(this.orderobj?.OrderType?.DocumentId)
    //     );
    //   }
    // );
    if (orderdetailobj && orderdetailobj.Product && this.orderobj && this.orderobj.OrderType.IsPromo) {
      this.handelCustomPromo(orderdetailobj.Product, orderdetailobj, this.orderobj);
    }

    orderdetailobj.Selected = true;
    orderdetailobj.EditingSelected = false;
    this.addLiStyle(orderdetailobj);
    if (thisProduct?.ProductSubItems?.length != 0 && !this.settingobj.OpenSideDishesPopUpAfterSelectProduct) {
        setTimeout(()=>{
          this.openNewSideDish(thisProduct, false);
       },400)
    }
  }

  showUpdateVolumModal(orderdetail: OrderDetailModel) {
    this.orderdetailindex = orderdetail.ProductIndex;
    this.uuid = orderdetail.UUID;
    // index = ;
    orderdetail = this.DropDownItem;
    this.productvolumslist = [];
    let product = this.allproductlist.find(
      (p) => (orderdetail.ProductId && p.Id === orderdetail.ProductId) || p.DocumentId === orderdetail.ProductDocumentId
    );
    if (product.ProductVolumes.length != 0) {
      product.ProductVolumes.forEach((element) => {
        product = this.assignPriceToVolumes(product);
        element.Showduplicatevolum = false;
        if (orderdetail.ProductVolumName == element.VolumeName) {
          element.SelectedVolum = true;
        } else {
          element.SelectedVolum = false;
        }
      });
    }
    this.productvolumslist = product.ProductVolumes;
    $("#updatemodal-Volums").modal("show");
    this.productwithvolum = product;
  }

  updateVolum(productvolum: ProductVolumeModel){
    this.orderdetailindex = this.orderobj.OrderDetails.findIndex(x=>x.UUID == this.uuid);
    if(!this.uuid || this.orderdetailindex == -1) return;
    let orderdetail = this.orderobj.OrderDetails.find(x=>x.UUID == this.uuid);

    this.productwithvolum = this.allproductlist.find((p) => (orderdetail.ProductId && p.Id === orderdetail.ProductId) || p.DocumentId === orderdetail.ProductDocumentId) ;

    this.orderobj.OrderDetails.splice(this.orderdetailindex,1);

    this.volumChanged(productvolum);
    $("#updatemodal-Volums").modal("hide");
  }

  // updateVolumOld(productvolum: ProductVolumeModel) {
  //   let orderdetail = this.orderobj.OrderDetails[this.orderdetailindex];
  //   let productPricingClassVolumes = this.getProductPricingClasseVolumes(
  //     orderdetail.Product,
  //     this.orderobj,
  //     this.pointOfSale
  //   );
  //   const volume = this.getVolumeByProductVolumeOrPricingClassVolume(productvolum);
  //   let productPricingClassVolume = this.deepCopy(productPricingClassVolumes?.find(x=>
  //     (volume?.DocumentId && x.VolumeDocumentId == volume?.DocumentId)||
  //     (volume?.Id && x.VolumeId == volume?.Id) ||
  //     (volume?.FerpCode && x.VolumeFerpCode == volume?.FerpCode)
  //   ));

  //   orderdetail.ProductPrice =
  //     productPricingClassVolume && productPricingClassVolume.Price ? productPricingClassVolume.Price : 0;
  //   orderdetail.ProductVolumName = productvolum.VolumeName;
  //   orderdetail.VolumeId = productvolum.VolumeId;
  //   orderdetail.VolumeDocumentId = productvolum.VolumeDocumentId;
  //   orderdetail.VolumeFerpCode = productvolum.VolumeFerpCode;
  //   orderdetail.Product.Price =
  //     productPricingClassVolume && productPricingClassVolume.Price ? productPricingClassVolume.Price : 0;

  //   this.orderobj = this.recalculateOrderObject(this.orderobj);
  //   $("#updatemodal-Volums").modal("hide");
  // }

  showHideIcons(orderdetail: OrderDetailModel) {
    this.showvolumicon = false;
    this.showsidedishesicon = false;
    let product = this.allproductlist.find(
      (p) => (orderdetail.ProductId && p.Id === orderdetail.ProductId) || p.DocumentId === orderdetail.ProductDocumentId
    ) as ProductModel;

    if (orderdetail.ProductVolumName != null && orderdetail.ProductVolumName != "undefined") {
      this.showvolumicon = true;
    }

    if (product.ProductSubItems && product.ProductSubItems.length != 0) {
      this.showsidedishesicon = true;
    }
  }

  DeleteOrderDetail(index: any) {
    let detail = this.orderobj.OrderDetails[index];
    if (detail && (!detail.DocumentId || !detail.DocumentId.trim())) {
      this.orderobj.OrderDetails.splice(index, 1);
      // delete detail promos
      if (detail.IsParentPromo) {
        let promoDetails = this.orderobj.OrderDetails.filter(
          (x) =>
            x.IsPromo &&
            x.PromoProductName == detail.ProductName &&
            x.ProductIndex == detail.ProductIndex &&
            !x.DocumentId
        );
        promoDetails.forEach((d) => {
          let index = this.orderobj.OrderDetails.indexOf(d);
          if (index != -1) this.orderobj.OrderDetails.splice(index, 1);
        });
      }

      if (this.orderobj.OrderDetails.length == 0) {
        this.ClearOrderModel();
        this.clearSuggestions();
      }
      this.orderobj = this.recalculateOrderObject(this.orderobj);
      this.resetOrderDetailIndex();
    } else this.toastr.warning("can not delete product!");
  }
  resetOrderDetailIndex(forceReset = false) {
    this.orderobj.OrderDetails.forEach((d, index) => {
      if ((!d.DocumentId || forceReset) && !d.IsPromo) {
        if (d.IsParentPromo) {
          let promoDetails = this.orderobj.OrderDetails.filter(
            (x) => x.IsPromo && x.PromoProductName == d.ProductName && x.ProductIndex == d.ProductIndex && !x.DocumentId
          );
          promoDetails.forEach((p) => (p.ProductIndex = index));
        }
        d.ProductIndex = index;
      }
    });
  }
  DeleteOrderDetailSubItem(orderdetail: any, index: any) {
    orderdetail.OrderDetailSubItems.splice(index, 1);
    if (orderdetail.OrderDetailSubItems.length == 0) {
      orderdetail.ShowSideDishes = false;
    }

    this.closedClickedOk = true;
  }

  showUpdateNotesModal(orderdetail: any) {
    orderdetail = this.DropDownItem;
    // let comboProduct = this.comboProducts.filter((c) => c.ProductDocumentId == orderdetail.Product.DocumentId)[0];
    // if(orderdetail.Product.IsCombo && comboProduct)
    //   this.openNewComboProductsModel(comboProduct,false);
    // else{
    this.noteobj = new NoteModel();
    this.getAllNotes(orderdetail, true);
    this.orderdetailobj = this.deepCopy(orderdetail);
    if (orderdetail.OrderDetailNotes == undefined) {
      orderdetail.OrderDetailNotes = [];
    }

    this.orderdetailnotelist = orderdetail.OrderDetailNotes;

    this.orderdetailnotelisttemp = this.orderdetailnotelist.slice();
    // }
  }

  getAllNotes(orderdetail: any, showPopUp = false) {
    return new Promise((resolve) => {
      this.orderSer.GetFilteredNotes('').subscribe((res) => {
        this.noteslist = res as NoteModel[];
        if(orderdetail?.Product?.Notes?.length)
          this.noteslist = this.noteslist.filter(n=> !orderdetail.Product.Notes.some(pn=> pn.Id == n.Id));
        this.filterNotesList = this.deepCopy(this.noteslist).reverse().slice(0, 20);
        if (this.noteslist.length != 0 && orderdetail && orderdetail.OrderDetailNotes.length != 0) {
          this.noteslist.forEach((element) => {
            let checknoteexist = orderdetail.OrderDetailNotes.find((p) => p.NoteId == element.Id);
            if (checknoteexist != undefined) {
              element.NoteChecked = true;
            }
          });
        }
        if (showPopUp){
          this.showNotes = true ;
          $("#updatemodal-Notes").modal("show");
        } 
        resolve(res);
      });
    });
  }

  GetAllUnClosedOrders() {
    this.orderSer.GetAllUnClosedOrders().subscribe((res) => {
      this.unClosedOrders = res as any[];
      if (
        this.pointOfSale &&
        this.pointOfSale.IsHallPos &&
        (this.settingobj.CanNotEditOrderByAnother ||
          (this.validationList["CanNotEditOrderForAnotherUser"] && !this.isAdmin)) &&
        this.orderobj.CaptainDocumentId
      )
        this.unClosedOrders = this.unClosedOrders.filter((x) => x.CaptainDocumentId == this.orderobj.CaptainDocumentId);
      else if (
        this.pointOfSale &&
        !this.pointOfSale.IsHallPos &&
        this.appUserId &&
        this.settingobj &&
        (this.settingobj.CanNotEditOrderByAnother ||
          (this.validationList["CanNotEditOrderForAnotherUser"] && !this.isAdmin))
      )
        this.unClosedOrders = this.unClosedOrders.filter((x) => x.CreatorUserId == this.appUserId);

      this.unClosedOrders.forEach((o) => {
        o = this.mapOrderToOrderObject(o);
        o.Time = this.datepipe.transform(new Date(o.CreationTime), "yyyy-MM-dd HH:mm a");
        // o.Time = new Date(o.CreationTime).toLocaleTimeString();
        this.isOrderPreparationTimeFinished(o,true);
        o.AddressDescription = o.CustomerAddress?.Description;
      });

      this.filteredOrders = this.cloneList(this.unClosedOrders);
      //apply filtrtion of ordertype list linked with orders opened
      let ordertypeids = this.unClosedOrders.map((x) => x.OrderTypeDocumentId);
      this.ordertypelistfilterd = this.ordertypelist.filter((item) => ordertypeids.includes(item.DocumentId));
      this.returnedArray = this.filteredOrders?.slice(0, 10);
      this.radioModel = 0;
      setTimeout(() => {
        this.setFocusById("CardNumber");
      }, 400);
      $("#modal-78").modal("show");
    });
  }
  closeAllUnClosedOrdersPopup() {
    this.returnedArray = [];
      $("#modal-78").modal("hide");
  }
  mobileOrdersLength: number = 0;

  GetMobileOrders() {
    this.orderSer.GetMobileOrders().subscribe((res) => {
      this.mobileOrders = res as any[];
      if (this.mobileOrders?.length > this.mobileOrdersLength) {
        this.alertSound.play();
      }
      this.mobileOrdersLength = this.mobileOrders?.length;

      this.mobileOrders.forEach((o) => {
        o.OrderDetails?.forEach((d) => {
          if (d.VolumeDocumentId || d.VolumeFerpCode) {
            d.Product.VolumeDocumentId = d.VolumeDocumentId;
            d.Product.VolumeFerpCode = d.VolumeFerpCode;
          }
          d.Product.Tax = this.productTaxes.find((productTax: any) => productTax.ProductId === d.Product.Id);
          if(!o.IsDeliverectOrder)d.Product = this.assignProductPrice(d.Product, o, this.pointOfSale);
          if(o.IsDeliverectOrder)this.setProductPriceForMobileOrder(d,d.ProductPrice);
        });

        if ((o.OrderTypeDocumentId || o.OrderTypeFerpCode) && this.orderSer.allOrderTypes && o.TableId)
          o.OrderType = this.orderSer.allOrderTypes.filter(
            (t) => t.DocumentId == o.OrderTypeDocumentId || t.FerpCode == o.OrderTypeFerpCode
          )[0];

        o = this.mapOrderToOrderObject(o);

        o.Time = this.datepipe.transform(new Date(o.CreationTime), "yyyy-MM-dd HH:mm a");
        o.AddressDescription = o.CustomerAddress?.Description;
        o.ReferenceCode = o.DocumentId;
        o.ReferenceId = o.OrderNumber;
        o.DocumentId = "";
        o.User = undefined;
        o.OrderNumber = undefined;
        if (o.IsCallCenter) o.IntegrationName = "Call Center";
        else if (o.IsMobileOrder) o.IntegrationName = "Mobile";
      });
      this.filteredMobileOrders = this.cloneList(this.mobileOrders).filter((x) => !x.Reservation);
      this.reservationOrders = this.cloneList(this.mobileOrders).filter((x) => x.Reservation == true);
      $("#modal-MobileOrders").modal("show");
    });
  }

  GetAllCustomerOrders() {
    this.customerOrderSer.getTodaysCustomerOrders().subscribe((res) => {
      this.customrReservationOrders = res as any[];
      this.customrReservationOrders.forEach((o) => {
        // o = this.mapOrderToOrderObject(o);
        o.Date = this.datepipe.transform(new Date(o.ReceivedDate), "yyyy-MM-dd");
        o.Time = new Date(o.Date + " " + o.ReceivedTime).toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true
        });
        o.AddressDescription = o.CustomerAddress?.Description;
        o.Reservation = true;
        o.ReferenceCode = o.DocumentId;
        o.DocumentId = null;
      });
      this.filteredReservationOrders = this.cloneList(this.customrReservationOrders);
      this.returnedArray2 = this.filteredReservationOrders?.slice(0, 10);
      // this.radioModel = 0;
      $("#modal-ReservationOrders").modal("show");
    });
  }
  closingReservationOrdersPopup() {
    this.returnedArray2 = [];
    $("#modal-ReservationOrders").modal("hide");
  }
  pageChangedSearch(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;

    if (this.loadTypeNumber == null) {
      this.returnedArray = this.filteredOrders.slice(startItem, endItem);
    } else {
      this.returnedArray = this.domyreturned.slice(startItem, endItem);
    }
  }

  ReservedpageChangedSearch(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;

    if (this.loadTypeNumber == null) {
      this.returnedArray2 = this.filteredReservationOrders.slice(startItem, endItem);
    } else {
      this.returnedArray2 = this.domyreturned.slice(startItem, endItem);
    }
  }

  AllTypes() {
    this.radioModel = 0;
    this.loadTypeNumber = null;
    this.returnedArray = this.filteredOrders?.slice(0, 18);
  }

  getLenghtOfFilterData() {
    if (this.loadTypeNumber == null) {
      return this.filteredOrders?.length;
    } else {
      return this.domyreturned?.length;
    }
  }

  getLenghtOfFilterReservationOrders() {
    if (this.loadTypeNumber == null) {
      return this.filteredReservationOrders?.length;
    } else {
      return this.domyreturned?.length;
    }
  }

  mapOrderToOrderObject(order: OrderModel) {
    if (order) {
      if (
        order.DocumentId &&
        order.DeliveryPrice > 0 &&
        this.settingobj &&
        this.settingobj.ApplyTaxOnDeliveryPrice &&
        this.settingobj.TaxDocumentId &&
        this.settingobj.PriceIncludesTax &&
        order.OrderMasterTaxes &&
        order.OrderMasterTaxes.length > 0 &&
        !order.IsDeliveryNetPriceHandled
      ) {
        let tax = this.allTaxes.filter((x) => x.DocumentId == this.settingobj.TaxDocumentId)[0];
        if (tax) {
          order.DeliveryNetPrice = 0;
          let TaxAmount = 0;
          if (tax.ValueType == 1) TaxAmount = (order.DeliveryPrice * tax.Value) / 100;
          else if (tax.ValueType == 2) TaxAmount = tax.Value;
          order.DeliveryPrice = order.DeliveryPrice + TaxAmount;
          order.IsDeliveryNetPriceHandled = true;
        }
      }

      if (order.OrderDetails && order.OrderDetails.length > 0) {
        order.OrderDetails.forEach((d) => {
          d.Product = this.assignTaxToProduct(d.Product);
        });
      }

      order = this.recalculateOrderObject(order, false);
    }

    return order;
  }

  notesChecked(event: any, note: any) {
    this.orderdetailnotesobj = new OrderDetailNoteModel();
    if (this.checkedNte || event.target.checked) {
      let index = this.orderdetailnotelist.findIndex((p) => p.NoteName === note.Name);
      if (index == -1) {
        this.orderdetailnotesobj.NoteId = note.Id;
        this.orderdetailnotesobj.NoteDocumentId = note.DocumentId;
        this.orderdetailnotesobj.NoteName = note.Name;
        note.NoteChecked = true;

        this.orderdetailnotelist.push(this.orderdetailnotesobj);
      }
    } else {
      let index = this.orderdetailnotelist.findIndex((p) => p.NoteName === note.Name);
      this.orderdetailnotelist.splice(index, 1);
    }
  }

  DeleteOrderDetailNote(orderdetailnote: any, index: any) {
    this.noteslist.forEach((element) => {
      if (element.Name == orderdetailnote.NoteName) {
        element.NoteChecked = false;
      }
    });
    this.orderdetailnotelist.splice(index, 1);
  }

  DeleteOrderDetailNoteIcon(orderdetail: any, index: any) {
    orderdetail.OrderDetailNotes.splice(index, 1);
    if (orderdetail.OrderDetailNotes.length == 0) {
      orderdetail.ShowNotes = false;
    } else {
      orderdetail.ShowNotes = true;
    }
  }

  // filterNotes() {
  //   if (this.filterNotesTimer) clearTimeout(this.filterNotesTimer);
  //   this.filterNotesTimer = setTimeout(() => {
  //       this.orderSer.GetFilteredNotes(this.noteobj?.Name?.trim()).subscribe((res: any) => {
  //         this.noteslist = this.deepCopy(res || []).slice(0, 20);
  //         if(this.orderdetailobj?.Product?.Notes?.length)
  //           this.noteslist = this.noteslist.filter(n=> !this.orderdetailobj.Product.Notes.some(pn=> pn.Id == n.Id));
  //         this.filterNotesList = this.deepCopy(this.noteslist).reverse().slice(0, 20);
  //       });
  //   }, 500);
  // }
  filterNotes() {
  this.noteSub = this.noteInput$
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((name: string) => this.orderSer.GetFilteredNotes(name.trim()))
    )
    .subscribe((res:any[]) => {
      this.noteslist = (res || []).slice(0, 20);

      if (this.orderdetailobj?.Product?.Notes?.length)
        this.noteslist = this.noteslist.filter( n => !this.orderdetailobj.Product.Notes.some(pn => pn.Id == n.Id));

      this.filterNotesList = this.noteslist.reverse().slice(0, 20);
    });
}

  addNewNote(noteobj: NoteModel) {
    this.checkedNte = true;
    if (noteobj.Name == "" || noteobj.Name == undefined) {
      this.shownoteerror = true;
    } else {
      this.shownoteerror = false;
      if (this.noteslist.length != 0) {
        this.checknoteexist = false;
        let exist = this.deepCopy(this.noteslist.find((n) => n.Name == noteobj.Name));
        if (exist) {
          this.notesChecked("", exist);
          this.checknoteexist = true;
        }
      }

      if (!this.checknoteexist) {
        this.orderSer.PostNote(noteobj).subscribe(
          (res) => {
            if (res == 1) {
              this.toastr.success("Saved successfully");
              //noteobj.Name = "";
              this.notesChecked("", noteobj);
              noteobj.NoteChecked = true;
              this.orderdetailnotesobj = new OrderDetailNoteModel();
              this.getAllNotes(this.orderdetailobj);
            } else {
              this.toastr.error("Failed to complete the process");
            }
          },
          (err) => {
            this.toastr.error("Unexpected error");
          }
        );
      }
    }
  }

  updateNotes() {
    if (this.orderdetailnotelist.length == 0) {
      this.orderdetailobj.ShowNotes = false;
    } else {
      this.orderdetailobj.ShowNotes = true;
    }
    this.orderdetailobj = new OrderDetailModel();
    this.cancelNotes();
  }

  cancelNotes() {
    this.orderdetailobj.OrderDetailNotes = this.orderdetailnotelisttemp;
    this.orderdetailnotelist = this.orderdetailnotelisttemp;
    this.showNotes = false;
    $("#updatemodal-Notes").modal("hide");

    this.orderdetailobj = new OrderDetailModel();
  }

  showUpdateInsurancesModal(orderdetail: any) {
    this.getAllInsurances();
    $("#updatemodal-Insurances").modal("show");
    this.orderdetailobj = orderdetail;
    this.orderdetailinsurancelisttemp = this.orderdetailinsurancelist.slice();
  }

  getAllInsurances() {
    this.orderSer.GetAllInsurances().subscribe((res) => {
      this.insurancelist = res as InsuranceModel[];
    });
  }

  clearRelatedData() {
    this.orderobj.DeliveryPrice = 0;
    this.orderobj.DeliveryPersonDeliveryPrice = 0;
    this.orderobj.OrderInsurance = undefined;
    this.orderobj.OrderInsuranceItems = undefined;
  }

  cancelDetail(cancellationReason) {
    let CanceledDetails = this.orderobj.OrderDetails.filter((x) => x.IsCancelledFront);
    if (CanceledDetails && CanceledDetails.length > 0) {
      CanceledDetails.forEach((c) => {
        let cancelledOrderDetail = new OrderDetailCancellationModel();
        cancelledOrderDetail.OrderDetailId = c.DocumentId;
        cancelledOrderDetail.CancellationReasonId = cancellationReason.Id;
        cancelledOrderDetail.CancellationReasonDocumentId = cancellationReason.DocumentId;
        cancelledOrderDetail.CancellationReasonName = cancellationReason.Name;
        cancelledOrderDetail.ProductDocumentId = c.ProductDocumentId;
        cancelledOrderDetail.ProductId = c.ProductId;
        if (!c.ReturnedProductQuantity || c.ReturnedProductQuantity == 0) c.ReturnedProductQuantity = 1;
        cancelledOrderDetail.ProductQuantity = c.ReturnedProductQuantity;
        cancelledOrderDetail.Printed = false;
        c.ProductQuantity = c.ProductQuantity - c.ReturnedProductQuantity;
        if (c.ProductQuantity === 0) {
          c.IsCancelled = true;
          // whole orderDetail is cancelled -> // need to splice all related subitems
          if (c.OrderDetailSubItems && c.OrderDetailSubItems.length > 0)
            c.OrderDetailSubItems.splice(0, c.OrderDetailSubItems.length);
        } 
        // else {
        //   // Qty n is cancelled from orderDetail -> // need to update subItemQty like orderDetailQty
        //   if (c.OrderDetailSubItems && c.OrderDetailSubItems.length > 0) {
        //     c.OrderDetailSubItems.forEach((orderDetailSubItem) => {
        //       orderDetailSubItem.SingleQuantity = c.ProductQuantity;
        //     });
        //   }
        // }

        if (c.OrderDetailPromo.length > 0) {
          if (c.ProductQuantity === 0) c.OrderDetailPromo.splice(0, c.OrderDetailPromo.length);
        }

        if (!c.OrderDetailCancellations) {
          c.OrderDetailCancellations = [];
        }
        c.OrderDetailCancellations.push(cancelledOrderDetail);
      });
    }
    if (
      !this.orderobj.OrderDetails ||
      !this.orderobj.OrderDetails.length ||
      !this.orderobj.OrderDetails.filter((o) => o.ProductQuantity > 0)[0]
    ) {
      this.clearRelatedData();
    }
    this.orderobj = this.recalculateOrderObject(this.orderobj);
    this.checkAllCancel = false;

    let OrderDetailCancellations = this.orderobj.OrderDetails.map((x) => x.OrderDetailCancellations);
    if (OrderDetailCancellations && OrderDetailCancellations.length > 0) this.sendClicked();
    this.closeCancellationReasonsPopup();
  }
  addCancelReason(inputCancellationReason: string){
    if(!inputCancellationReason) return;
    const cancelReason = {Name: inputCancellationReason}
    this.cancelReasonService.Transactions(cancelReason,"Post").subscribe({
      next: (res:any) => {
        if(res.Result && res.Result.Name) {
          this.cancellationReasons.push(res.Result)
          this.cancelDetail(res.Result)
        }
        if(res == 16)  this.toastr.error(this.toastrMessage.GlobalMessages(res), "CancelReason");
        this.inputCancellationReason = undefined;
      }
    });
  }
  
  deleteOrderDetailInsuranceIcon(orderdetail: any, index: any) {
    this.insuranceval = 0;
    orderdetail.OrderDetailInsurances.splice(index, 1);
    if (orderdetail.OrderDetailInsurances.length == 0) {
      if (orderdetail.InsuranceValue == undefined) {
        orderdetail.InsuranceValue = 0;
      }
      this.orderdetailinsurancelist.forEach((element) => {
        this.insuranceval = this.insuranceval + element.Price * element.Quantity;
      });
      orderdetail.InsuranceValue = this.insuranceval;
      orderdetail.ShowInsurance = false;
    } else {
      if (orderdetail.InsuranceValue == undefined) {
        orderdetail.InsuranceValue = 0;
      }
      this.orderdetailinsurancelist.forEach((element) => {
        this.insuranceval = this.insuranceval + element.Price * element.Quantity;
      });
      orderdetail.InsuranceValue = this.insuranceval;
      orderdetail.ShowInsurance = true;
    }
    this.calculateTotals(this.orderobj, true);
  }

  insuranceQtyChange(event, orderdetailinsurance: any) {
    orderdetailinsurance.Quantity = event.target.value;
  }

  loadClassedProducts(productgroupclass: any) {
    this.productlist = [];
    if (this.currentproductgroup.Products.length != 0) {
      this.currentproductgroup.Products.forEach((element) => {
        if (element.ProductClassId == productgroupclass.ProductClassId) {
          this.productlist.push(element);
        }
      });
    }
    // sort products by customer past arrangment
    this.productlist.sort(function (a, b) {
      return a.IndexInGroup - b.IndexInGroup;
    });
  }

  hasProductsInProductType(PT: any): boolean {
    return PT.ProductGroups && 
           PT.ProductGroups.length > 0 && 
           PT.ProductGroups.some(group => group.Products && group.Products.length > 0);
  }
  loadProductGroupsDetails(Producttype: any) {
    this.productgrouplist = [];
    this.productgroupclasslist = [];
    this.productlist = [];
    if (Producttype.ProductGroups.length != 0) {
      Producttype.ProductGroups.forEach((element) => {
        this.productgrouplist.push(element);
      });
      if (Producttype.ProductGroups[0].ProductGroupClassModels.length != 0) {
        Producttype.ProductGroups[0].ProductGroupClassModels.forEach((element) => {
          this.productgroupclasslist.push(element);
        });
      }
      if (Producttype.HideProductGroupsInOrder) {
        // selectmany Products from groups
        this.productgrouplist = [];
        let products = Producttype.ProductGroups.map((g) => g.Products).reduce(function (a, b) {
          return a.concat(b);
        }, []);
        this.productlist.push.apply(this.productlist, products);
      } else if (Producttype.ProductGroups[0].Products.length != 0) {
        Producttype.ProductGroups[0].Products.forEach((element) => {
          this.productlist.push(element);
        });
      }
    }
    // sort products by customer past arrangment
    this.productlist.sort(function (a, b) {
      return a.IndexInGroup - b.IndexInGroup;
    });

    this.aciveTab = !this.aciveTab;
    if (Producttype.HideProductGroupsInOrder) {
      this.sortProducts();
    } else this.loadProductDetails(this.productgrouplist[0]);
  }

  selectedGroup: boolean = false;

  loadProductDetails(productgroup: any) {
    if(this.orderobj.FoodPlanProductFilterd == true) return;
    this.selectedGroup = !this.selectedGroup;
    this.selectedProdGroupList = this.deepCopy(this.productgrouplist);
    // this.selectedProdGroupName = productgroup.Name
    // this.selectedProdGroupId = productgroup.Id
    // this.selectedProdGroupList.filter((item: any) => {
    //   item.Id == productgroup.Id
    //   return this.itemActive = true
    // })

    this.clickedBtnCheck("");
    this.productgroupclasslist = [];
    this.productlist = [];
    this.finalProductList = [];
    this.currentproductgroup = productgroup;
    if (productgroup) {
      // get general products for groups
      let generalProductsProperities = this.productsProperties
        .filter((p) => p.GeneralGroups && p.GeneralGroups.includes(productgroup.DocumentId))
        ?.map((p) => p.ProductDocumentId);
      let generalProducts = this.allproductlist.filter((p) => generalProductsProperities.includes(p.DocumentId));
      if (generalProducts && generalProducts.length > 0) this.productlist.push.apply(this.productlist, generalProducts);

      // get ProductGroupClasses
      if (productgroup.ProductGroupClassModels.length != 0) {
        productgroup.ProductGroupClassModels.forEach((element) => {
          this.productgroupclasslist.push(element);
        });
      }

      // product from product groups
      if (productgroup.Products.length != 0) {
        productgroup.Products.forEach((element) => {
          this.productlist.push(element);
        });
        if (this.settingobj.ShowVolumeAsProduct == false) {
          this.productlist = this.distinct(this.productlist, "DocumentId") as ProductModel[];
        }
        this.sortProducts();
      }
    }
  }

  sortProducts() {
    // sort products by customer past arrangment
    this.productlist.sort(function (a, b) {
      return a.IndexInGroup - b.IndexInGroup;
    });
    if (!this.settingobj.DontUsePageinationInOrderScreen) {
      const items = this.getItemsPerPageForPagination();
      this.finalProductList = this.getFinalProductList(this.productlist, 0, items);
      this.NumberItems = items;
    } else {
      this.finalProductList = this.getFinalProductList(this.productlist, 0, 1000);
      this.NumberItems = 1000;
    }
  }

  /**
   * Compute items per page dynamically when pagination is enabled.
   * Tries DOM-based calculation first; falls back to existing NumberItems or a heuristic.
   */
  private getItemsPerPageForPagination(): number {
    try {
      const rootFontSizePx = parseFloat(getComputedStyle(this.document.documentElement).fontSize || '16');
      const cardW = Math.max(1, Math.round((this.width || 9) * rootFontSizePx));
      const cardH = Math.max(1, Math.round((this.height || 8) * rootFontSizePx));
      const usableW = Math.max(1, Math.floor(window.innerWidth * 0.55));
      const usableH = Math.max(1, Math.floor(window.innerHeight * 0.65));
      const cols = Math.max(1, Math.floor(usableW / cardW));
      let rows = Math.max(1, Math.floor(usableH / cardH));
      if(this.Fullscreen) rows += 1;
      const estimate = cols * rows;
      return estimate > 0 ? estimate : 15;
    } catch {
      // Last resort default
      return 15;
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 1600 && this.innerWidth > 1200) {
      // itemsPerPage = 30;
    }

    this.updateDynamicStyles();
  }

  private updateDynamicStyles() {
    const windowWidth = window.innerWidth;
    this.dynamicStyles = {
      height: windowWidth > 1250 ? "8%" : "7%",
      padding: windowWidth > 1250 ? "2px 12px" : "2px 3px"
    };
  }

  pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    // const startItem = event.page > 1 ? (event.page - 1) * event.itemsPerPage : event.page * event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.finalProductList = this.getFinalProductList(this.productlist, startItem, endItem);
  }

  openFullscreen() {
    if (document.fullscreenElement) {
      this.Fullscreen = false;
      document.exitFullscreen().catch((err) => console.error(err));
    } else {
      document.documentElement.requestFullscreen();
      this.Fullscreen = true;
    }
    this.sortProducts();
  }

  clickedcol8() {
    this.checkcol8Bayment = true;
    this.checkCol8 = false;
  }

  clickedMinus(orderdetail: OrderDetailModel) {
    if (!orderdetail.IsPromo) {
      let product = this.allproductlist.find(
        (p) =>
          (orderdetail.ProductId && p.Id === orderdetail.ProductId) || p.DocumentId === orderdetail.ProductDocumentId
      );
      if (orderdetail.ProductQuantity <= 0) {
        orderdetail.ProductQuantity = 1;
        return;
      }
      // if (
      //   this.orderobj.OrderDetails.filter((x) => x.Selected == true)[0] ||
      //   this.orderobj.OrderDetails.filter((x) => x.EditingSelected == true)[0]
      // ) {
      // }
      else if (orderdetail.ProductQuantity === 1) {
        // orderdetail.ProductQuantity = 1;
        return;
      } else {
        orderdetail.ProductQuantity--;
      }
      this.orderobj = this.recalculateOrderObject(this.orderobj);
      if (
        orderdetail.Product.Promos.length > 0 &&
        orderdetail.Product.Promos.filter((promo) => promo.PromoProducts.length > 0)
      ) {
        const promoProducts = orderdetail.Product.Promos.filter((promo) => promo.PromoProducts.length > 0);
        const promoProduct = promoProducts.find((product) => product.DocumentId === orderdetail.ProductDocumentId);
      }
    }
  }

  quantityChange(event, orderdetail: any) {
    //let product = this.productlist.find((p) => p.Id === orderdetail.ProductId);

    this.orderobj = this.recalculateOrderObject(this.orderobj);

    // orderdetail = this.handelProductDiscount(product,orderdetail,this.orderobj);
    // orderdetail = this.handelProductTax(product,orderdetail);

    // orderdetail = this.handlePromo(product,orderdetail);
    // orderdetail.Total=this.calculateOrderDetailTotal(orderdetail);
    // this.calculateTotals(this.orderobj);
  }

  checkQuantity(detail: OrderDetailModel) {
    if (!this.isNotMinusnumber(detail.ProductQuantity)) {
      detail.ProductQuantity = 1;
    }
    if (detail.ProductQuantity > 0 && !detail.Product.UseWeights) {
      detail.ProductQuantity = Math.trunc(detail.ProductQuantity);
      if (detail.ProductQuantity === 0) detail.ProductQuantity = 1;
    }
    if (typeof Number(detail.ProductQuantity) !== "number" || Number(detail.ProductQuantity) == 0) {
      detail.ProductQuantity = 1;
    }
    this.orderobj = this.recalculateOrderObject(this.orderobj);
  }

  onKeyUpQuantity(event, orderdetail: any) {
    if (!event.target.value.includes(event.key) && event.key === ".") {
      event.target.value = event.target.value + event.key;
    }
    if (!this.isNotMinusnumber(event.target.value)) event.target.value = 1;
    orderdetail.ProductQuantity = event.target.value;
    this.orderobj = this.recalculateOrderObject(this.orderobj);
  }

  clickedPlus(orderdetail: any) {
    if (!orderdetail.IsPromo) {
      orderdetail.ProductQuantity++;
      this.addLiStyle(orderdetail);
      this.orderobj = this.recalculateOrderObject(this.orderobj);
      if (
        orderdetail.Product.Promos.length > 0 &&
        orderdetail.Product.Promos.filter((promo) => promo.PromoProducts.length > 0)
      ) {
        this.handelCustomPromo(orderdetail.Product, orderdetail, this.orderobj);
      }
    }
  }

  increaseFreeQuantity(index: number) {

    // totalSelectedFreeProductsQuantity => to get the total quantity of all selected free products
    let totalSelectedFreeProductsQuantity = 0;
    this.freeOrderDetails.forEach((freeDetail: OrderDetailModel) => {
      totalSelectedFreeProductsQuantity += freeDetail.ProductQuantity;
    });
    if (
      this.freeOrderDetails.length === 1 &&
      this.freeOrderDetails[index].ProductQuantity < this.freeobj.promoProduct.GetProductQuantity
    ) {
      // if there is only 1 free product selected and its quantity is less than the promo limit
      this.freeOrderDetails[index].ProductQuantity++;
    } else if (
      this.freeOrderDetails.length > 1 &&
      this.freeOrderDetails[index].ProductQuantity < this.freeobj.promoProduct.GetProductQuantity &&
      totalSelectedFreeProductsQuantity < this.freeobj.promoProduct.GetProductQuantity
    ) {
      // if there are more than 1 free product selected and the sum of their quantityies is less than the promo limit
      this.freeOrderDetails[index].ProductQuantity++;
    } else {
      return;
    }
  }

  decreaseFreeQuantity(index: number) {
    if (this.freeOrderDetails[index].ProductQuantity > 1) {
      this.freeOrderDetails[index].ProductQuantity--;
    } else {
      this.freeOrderDetails.splice(index, 1);
      this.selectedFreeProducts[index].FreeChecked = false;
      this.selectedFreeProducts.splice(index, 1);
      if (this.freeOrderDetails.length === 1) {
        this.freeOrderDetails[0].ProductQuantity = this.freeobj.promoProduct.GetProductQuantity;
      } else if (this.freeOrderDetails.length > 1) {
        this.freeOrderDetails.forEach((freeDetail: OrderDetailModel) => {
          freeDetail.ProductQuantity = 1;
        });
      }
    }
  }

  onKeyUpCodeBar(event) {
    let codeBar = event.target.value;
    if (codeBar != undefined && codeBar != "" && this.allproductlist.length) {
      if (this.barcodesettobj && codeBar.toString().length == this.barcodesettobj.BarcodeLength)
        this.getOrderDetailFromBarcode(codeBar.toString());
      else {
        const findcond = (el) => el.ProductNumber == codeBar && el.Price;
        this.codebarproduct = this.deepCopy(this.allproductlist.find(findcond));
        if (this.codebarproduct) {
          this.checkcodebarexists = true;
          if (this.codebarproduct.DefaultQuantity) {
            this.focusOnQTY();
            this.codbarqty.nativeElement.value = parseFloat(this.codebarproduct.DefaultQuantity);
          }
        } else this.checkcodebarexists = false;
      }
    } else this.checkcodebarexists = false;
  }

  focusOnQTY() {
    if (this.codebarproduct) {
      this.checkcodebarexists = true;
      this.codbarqty.nativeElement.focus();
    }
  }

  async closeOrderWithPrint() {
    this.continueTransaction = false;
    const table = this.minimumCharges[0]?.Tables?.find(t=> t.DocumentId === this.orderobj.TableId);
    const tableHasMinCharge = !!(table && this.settingobj.UseMinimumCharge && table?.ValuePerPerson &&
      (table?.OrderTypesList?.length ? !!(table?.OrderTypesList?.includes(this.orderobj?.OrderTypeDocumentId)):true));
    if (tableHasMinCharge && (!this.orderobj.PersonsCount || this.orderobj.PersonsCount == 0)) {
      this.openPersonsPopUp();
      return false;
    }
    if (this.tableHasMinCharge(this.orderobj) && this.orderobj.SubTotal < this.orderobj.MinimumChargeValue ) {
      Swal.fire({
        title: this.translate.instant("Shared.Areyousure?"),
        text: `${this.translate.instant("messages.thistotal")}
        [${this.orderobj.SubTotal.toFixed(2)}] ${this.translate.instant("messages.islessthan")} [${
          this.orderobj.MinimumChargeValue
        }]
        ${this.translate.instant("messages.theminimumchargeamountareyousurethatyouwonttoaddmoreproducts")}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.translate.instant("messages.addmoreitems"),
        confirmButtonText: this.translate.instant("messages.yessure")
      }).then((result) => {
        if (result.isConfirmed) {
          this.orderobj.HasMinimumCharge = true;
          this.ApplySubTotalWithMinChargeValue(this.orderobj);
          this.continueTransaction = true;
          $("#elementS").tooltip("dispose");
        }
      });
      return this.continueTransaction;
    }
    
    if (!this.requestStarted) {
      this.requestStarted = true;
      const result = await this.closeOrder();
      this.requestStarted = false;
      if (result == "closePayment") {
        this.backtoproductsEvent({ value: undefined });
        return;
      } else if (result === true) {
        this.clearSearch();
        this.backtoproductsEvent({ value: "CloseOrder" });
        return;
      }
    }
    return;
  }

  closeOrder = async (IsNoPrint: boolean = false) => {
    if (this.settingobj.HideCloseOrderWithDineIn && this.orderobj.OrderType.Value == 4 && !this.orderobj.DocumentId) {
      this.toastr.warning("You can not close order befor send");
      return false;
    }
    //  if (!this.requestStarted) {
    if (!this.validateOrder(this.orderobj, IsNoPrint ,true)) {
      if (this.orderobj.OrderType.Value == 2) this.orderobj.Paid = false;
      else this.orderobj.Paid = true;
      // this.backtoproductsEvent({ value: "CloseOrder" });
      return "closePayment";
    }
    if (!this.validatePayment(this.orderobj, true)) {
      this.ValidationPay = true;
      return false;
    }

    //  this.requestStarted = true;
    if ((this.orderobj.settings?.UseDailyStock || this.orderobj.settings?.UseStocksAndPurchase) 
      && !(await this.checkAvailableQuantityBeforeSave(this.orderobj))) {
      // this.backtoproductsEvent({ value: "CloseOrder" });
      //this.requestStarted = false;
      return "closePayment";
    }
    if (this.orderobj.OrderType.Value == 2) this.orderobj.Paid = false;
    else this.orderobj.Paid = true;
    this.orderobj.NoPrinting = IsNoPrint;
    
    // this.orderobj = this.validateGame(this.orderobj);
    const visaPayTypesDocIds = this.orderPayTypelist?.filter(x=> x.PayType === 30)?.map(x=> x.DocumentId);
    let payType = this.orderobj.OrderPayments?.find((p) => visaPayTypesDocIds && visaPayTypesDocIds.includes(p.PayTypeDocumentId));
    if(payType){
      this.visaSameOrderPayTimeCount += 1;
      this.orderobj.VisaSameOrderPayTimeCount = this.visaSameOrderPayTimeCount;
    }

    await this.closeAsync(this.orderobj, this.checkIsOnlinePay(this.orderobj.pointOfSale, this.orderobj));

    this.savePendingOrders();
    //this.requestStarted = false;
    //   }
    if (this.orderobj.IsHallPos && !this.errorForPaymentDevice) {
      setTimeout(() => {
        this.routIfMissingData("");
      }, 200);
      return false;
    } else if (!this.errorForPaymentDevice) {
      if (!(this.errorInSaveOrder && this.orderobj.OtelPrimoRoomNo > 0)) {
        this.deliveryCustomerComponent.initFromParent();
        // this.backProduct("CloseOrder");
        return true;
      }
    }

    return false;
  };

  backtoproductsEvent(res: any) {
    this.showHideComponents("product");
    if (res) {
      if (res.isFromValidate && !res.isGeneral) {
        this.isWaiter = res.isWaiter;
        this.SearchEmployee(this.isWaiter);
        $("#modal-Waiter").modal("show");
      } else if (res.isGeneral && res.value != "PersonsCount") {
        this.deliveryCustomerComponent.initFromParent();
      }
      if (res.value == "customer")
        setTimeout(() => {
          this.showDeliveryModal();
        }, 200);
      if (res.value == "CloseOrder") {
        this.orderobj = new OrderModel();
        this.orderobj.OrderDetails = [];
        this.firstOpen();
        if (!this.pointOfSale.IsHallPos) this.showHideComponents(undefined);
      } else if (res.value == "PersonsCount") {
        setTimeout(() => {
          $("#modal-Persons").modal("show");
        }, 200);
      }
    }
  }

  ClearOrderModel(callFirestOpen = true) {
    this.errorInSaveOrder = false;
    this.orderobj = new OrderModel();
    this.orderobj.OrderDetails = [];
    this.deliveryCustomerComponent.model = new CustomerModel();
    if (this.pointOfSale && this.pointOfSale.IsTabletDevice) this.showHideComponents("product");
    this.clearSearch();
    if (!this.pointOfSale.IsHallPos) this.showHideComponents(undefined);

    if(callFirestOpen) this.firstOpen();

    if (this.orderobj.OrderType.Value === 2) {
      this.deliveryCustomerComponent.initFromParent();
    }
    this.PayTypeDocumentId = "";
    this.ClearPersonsCount();

    this.clearSuggestions();
    this.savePendingOrders();
  }
  checkShift() {
      this.dashboardSer.checkUnclosedShiftfromUser().subscribe((res) => {
        const checkModel = res["checkModel"];
        if(checkModel && !checkModel.IsOpenShift && !checkModel.IsClosedShift){
          this.routIfMissingData("workTime" , "Order.ShiftMissing");
        }
      });
    }
  newOrder() {
    if (this.orderobj.OrderDetails.length > 0) {
      Swal.fire({
        title: this.translate.instant("messages.Warning") + "!",
        text: this.translate.instant("messages.neworder"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.translate.instant("Shared.Cancel"),
        confirmButtonText: this.translate.instant("Shared.Yes?")
      }).then((result) => {
        if (result.isConfirmed) {
          this.ClearOrderModel();
        }
      });
    } else {
      this.ClearOrderModel();
    }
  }

  orderTypeClicked(ordertype: OrderTypeModel) {
    this.orderobj.orderTypeChangedAfterSave = false;
    if(this.orderSer.settings.ChangeOrderTypeAfterSave && this.orderobj.DocumentId && this.orderobj.OrderTypeDocumentId != ordertype.DocumentId)
      this.orderobj.orderTypeChangedAfterSave = true;
    if (ordertype && this.orderobj && (!this.orderobj.DocumentId || this.settingobj.ChangeOrderTypeAfterSave)) {
      //check if old order type has a discount
      if (
        !this.orderobj.DocumentId &&
        this.orderobj.OrderType?.Discount &&
        this.orderobj.Discount == this.orderobj.OrderType.Discount
      )
        this.orderobj.Discount = 0;

      this.orderobj.OrderTypeId = ordertype.Id;
      this.orderobj.OrderTypeDocumentId = ordertype.DocumentId;
      this.orderobj.OrderTypeName = ordertype.Name;
      this.orderobj.OrderType = ordertype;

      // set orderPayType For order Type
      this.checkOrderTypePayment(this.orderobj);

      if (ordertype.Value != 2 && (!this.orderobj.DocumentId  || this.settingobj.ChangeOrderTypeAfterSave)) {
        this.orderobj.DeliveryPersonDeliveryPrice = 0;
        this.orderobj.DeliveryPrice = 0;
        // this.orderobj = this.UnselectCustomer(this.orderobj);
      }
      if (ordertype.Value != 4) {
        this.orderobj.TableId = undefined;
        this.orderobj.TableName = "";
      }
      //this.orderobj.EmployeeId = undefined;
      if (ordertype.Value == 1) {
        $("#modal-OrderType").modal("hide");
      }
      if (this.orderobj.OrderType && this.orderobj.OrderType.Value == 2) {
        this.setDelivery(ordertype);
        $("#modal-OrderType").modal("hide");
      }
      //check if order type is ForStaff to open employee popup
      if (this.orderobj.OrderType && this.orderobj.OrderType.ForStaff) {
        this.orderobj = this.calculateOrderPayments(this.orderobj, true);
        this.isWaiter = "ShouldHaveMeal";
        this.SearchEmployee(this.isWaiter);
        $("#modal-Waiter").modal("show");
      }
      if (this.orderobj.OrderType && this.orderobj.OrderType.Value == 4) {
        this.showHideComponents("table");
      }
      this.orderobj = this.reassignPricesToAllProducts(this.orderobj);
      //check if order type has discount value to apply on order

      this.setOrderTypeOptions(this.orderobj);

      this.orderobj = this.recalculateOrderObject(this.orderobj);
    }
    this.setFocusById("CodeBarcodeId");

    this.clearSuggestions();
  }

  loadType(el) {
    this.radioModel = el;
    this.loadTypeNumber = el;
    this.returnedArray = this.filteredOrders;

    this.returnedArray = this.returnedArray.filter((x) => x.OrderType.DocumentId == el);
    this.domyreturned = this.returnedArray;
  }

  setDelivery(ordertype: OrderTypeModel) {
    if (this.settingobj && this.settingobj.DeliveryFromTime && this.settingobj.DeliveryToTime) {
      const todayDate = new Date();
      const todayCurrentTime = this.datepipe.transform(todayDate, "HH:mm");

      const settingsDeliveryFromTime = this.datepipe.transform(new Date(this.settingobj.DeliveryFromTime), "HH:mm");
      const settingsDeliveryToTime = this.datepipe.transform(new Date(this.settingobj.DeliveryToTime), "HH:mm");

      if (todayCurrentTime < settingsDeliveryFromTime || todayCurrentTime > settingsDeliveryToTime) {
        this.orderobj.OrderType = undefined;
        this.orderobj.OrderTypeId = undefined;
        this.orderobj.OrderTypeDocumentId = undefined;
        return this.toastr.error("Not Deliverytime");
      }
    }
    this.isDelivery = true;
    this.showCustomerPopUp(this.orderobj, this.validationList);
  }

  async sendClicked(order: any = {},fromSendBtn:boolean = false ,fromSavePendingOrders = false) {
    // Handle customer order
    if (Object.values(order).length > 1) {
      this.orderobj = order;
    }
    if (this.orderobj.IsCustomerOrder === true && !this.requestStarted) {
      const calculatedOrder = this.mapOrderToOrderObject(this.orderobj);
      const customerOrder = CustomerOrderModel.fromOrderModel(calculatedOrder); // Create customer order from order model
      if (this.orderobj.Reservation == true && this.orderobj.IsMobileOrder == true) {
        // in case from online Order
        customerOrder.ReceivedDate = this.orderobj?.ReceivedDate;
        customerOrder.ReceivedTime = this.orderobj?.ReservationToTime;
        customerOrder.ReservationFromTime = this.orderobj?.ReservationFromTime;
        customerOrder.PersonsCount = this.orderobj?.PersonsCount;
        customerOrder.NoteForOrder = this.orderobj?.NoteForOrder;
        customerOrder.IsMobileOrder = true;
      }
      this.requestStarted = true;
      this.customerOrderSer.Transactions(customerOrder, "Post").subscribe({
        next: (res) => {
          this.toastr.success(this.translate.instant("Order.CustomerOrderSaved"));
          if (this.orderobj.Reservation == true && this.orderobj.IsMobileOrder == true) {
            this.customerOrderSer.updateMobileOrder(this.orderobj.ReferenceCode).subscribe({
              error: (err) => {
                this.toastr.error(this.translate.instant("Order.CustomerOrderError"));
              },
              complete: () => {
                this.requestStarted = false;
              }
            });
          }
          this.ClearOrderModel(); // Clear order after saved
          this.clearSuggestions();
        },
        error: (err) => {
          // todo: handle error

          this.toastr.error(this.translate.instant("Order.CustomerOrderError"));
          this.ClearOrderModel();
          this.clearSuggestions();
        },
        complete: () => {
          this.requestStarted = false;
        }
      });
      return;
    }

    if (!this.requestStarted) {
      if(fromSendBtn || !this.orderobj.Paid) this.orderobj.Paid = false;
      if (!this.validateOrder(this.orderobj) && !fromSavePendingOrders) {
        return false;
      }
      if (!this.validatePayment(this.orderobj) && !fromSavePendingOrders) {
        return false;
      }
      if (this.orderobj.OrderType && this.orderobj.OrderType.UseCard && !this.orderobj.CardNumber && !fromSavePendingOrders) {
        this.openCardModel();
        return false;
      }
      this.requestStarted = true;
      if (!fromSavePendingOrders && (this.orderobj.settings?.UseDailyStock || this.orderobj.settings?.UseStocksAndPurchase)
        && !(await this.checkAvailableQuantityBeforeSave(this.orderobj)) ) {
        this.requestStarted = false;
        return false;
      }
      if (this.orderobj?.OrderType?.VerifiedOrderByPinBeforeSave == true) {
        this.orderobj.NoPrinting = this.IsNoPrint;
      }
      await this.closeAsync(this.orderobj, this.checkIsOnlinePay(this.pointOfSale, this.orderobj));
      this.requestStarted = false;
      this.IsNoPrint = false;
    }

    if (this.pointOfSale && this.pointOfSale.IsHallPos) {
      setTimeout(() => {
        this.routIfMissingData("");
      }, 200);
    } else {
      this.ClearOrderModel();
      this.clearSuggestions();
    }
    $("#modal-CallCenterOrders").modal("hide");
  }
  async sendClickedFromCallCenter(order: any = {},fromSendBtn:boolean = false) {
    // Handle customer order
    // if (Object.values(order).length > 1) {
    //   order = order;
    // }
    if (order.IsCustomerOrder === true && !this.requestStarted) {
      const calculatedOrder = this.mapOrderToOrderObject(order);
      const customerOrder = CustomerOrderModel.fromOrderModel(calculatedOrder); // Create customer order from order model
      if (order.Reservation == true && order.IsMobileOrder == true) {
        // in case from online Order
        customerOrder.ReceivedDate = order?.ReceivedDate;
        customerOrder.ReceivedTime = order?.ReservationToTime;
        customerOrder.ReservationFromTime = order?.ReservationFromTime;
        customerOrder.PersonsCount = order?.PersonsCount;
        customerOrder.NoteForOrder = order?.NoteForOrder;
        customerOrder.IsMobileOrder = true;
      }
      //this.requestStarted = true;
      this.sendClickedFromCallCenterStarted = true;
      this.customerOrderSer.Transactions(customerOrder, "Post").subscribe({
        next: (res) => {
          this.sendClickedFromCallCenterStarted = false;
          this.toastr.success(this.translate.instant("Order.CustomerOrderSaved"));
          if (order.Reservation == true && order.IsMobileOrder == true) {
            this.customerOrderSer.updateMobileOrder(order.ReferenceCode).subscribe({
              error: (err) => {
                this.sendClickedFromCallCenterStarted = false;
                this.toastr.error(this.translate.instant("Order.CustomerOrderError"));
              },
              complete: () => {
                this.sendClickedFromCallCenterStarted = false;
              }
            });
          }
          // this.ClearOrderModel(); // Clear order after saved
          // this.clearSuggestions();
        },
        error: (err) => {
          this.sendClickedFromCallCenterStarted = false;
          this.toastr.error(this.translate.instant("Order.CustomerOrderError"));
          // this.ClearOrderModel();
          //this.clearSuggestions();
        },
        complete: () => {
          // this.requestStarted = false;
        }
      });
      return;
    }

    if (!this.requestStartedCallCenter) {
      if(fromSendBtn || !order.Paid) order.Paid = false;
      if (!this.validateOrder(order) && !this.pointOfSale?.ReceiveAutomaticCallCenter) {
        return false;
      }
      if (!this.validatePayment(order) && !this.pointOfSale?.ReceiveAutomaticCallCenter) {
        return false;
      }
      if (order.OrderType && order.OrderType.UseCard && !order.CardNumber && !this.pointOfSale?.ReceiveAutomaticCallCenter) {
        this.openCardModel();
        return false;
      }
      if ((order.settings?.UseDailyStock || order.settings?.UseStocksAndPurchase) 
        && !(await this.checkAvailableQuantityBeforeSave(order)) && !this.pointOfSale?.ReceiveAutomaticCallCenter) {
        return false;
      }
      if (order.OrderType?.VerifiedOrderByPinBeforeSave == true && !this.pointOfSale?.ReceiveAutomaticCallCenter) {
        order.NoPrinting = this.IsNoPrint;
      }
      this.requestStartedCallCenter = true;
      try {
        await this.closeAsync(order, this.checkIsOnlinePay(this.pointOfSale, order));
      } finally {
        this.requestStartedCallCenter = false;
        $("#modal-CallCenterOrders").modal("hide");
      }
      this.IsNoPrint = false;
    }
    $("#modal-CallCenterOrders").modal("hide");

    // if (this.pointOfSale && this.pointOfSale.IsHallPos) {
    //   setTimeout(() => {
    //     this.routIfMissingData("");
    //   }, 200);
    // } else {
    //   // this.ClearOrderModel();
    //   // this.clearSuggestions();
    // }
    // $("#modal-CallCenterOrders").modal("hide");
  }

  shouldHasTax(orderobj: OrderModel){
    let dontHasTax = false;
    orderobj.OrderDetails.forEach(d => {
      const product = this.allproductlist.find(x=> (d.ProductId && d.ProductId == x.Id ) || (d.ProductDocumentId && d.ProductDocumentId == x.DocumentId ));
      if(product?.ProductTaxes?.length && product.ProductTaxes?.some(pt=>pt.Value) && d.ProductQuantity  && d.ProductPrice && orderobj.SubTotal && !orderobj.TotalTaxAmount)
        dontHasTax = true;
    });
    return dontHasTax;
  }

  validateOrder(orderobj: OrderModel, IsNoPrint: boolean = false ,fromClose = false) {
    if (orderobj?.OrderType?.VerifiedOrderByPinBeforeSave == true && !this.pinUserAccepted && !orderobj?.isAdmin) {
      this.IsNoPrint = IsNoPrint;
      this.enterPinForUser("VerifiedOrderByPinBeforeSave");
      return false;
    }
    //validate if order has paymen of credit must select customer
    if (this.checkCreditPayment(orderobj)) {
      if (orderobj.CustomerDocumentId && orderobj.Customer && !orderobj.Customer.UseCredit) {
        orderobj.CustomerDocumentId = undefined;
        orderobj.Customer = new CustomerModel();
        this.toastr.info("This customer is not use credit!");
      }
      /// priority for employee if theres an employee no need for customer
      if (!orderobj.EmployeeId && !orderobj.EmployeeDocumentId) {
        if (
          !((orderobj.CustomerDocumentId || (orderobj.CustomerId && orderobj.IsMobileOrder) )&& orderobj.Customer) &&
          !orderobj.EmployeeId &&
          !orderobj.EmployeeDocumentId
        ) {
          this.deliveryCustomerComponent.initFromParent();
          this.toastr.info(this.translate.instant("messages.MustSelectEmployeeOrCustomer"), "Order");
          if (typeof this.backProduct === "function") this.backProduct("", true, this.isWaiter, true);
          return false;
        }
      }
    }
    //validate if order is has insurance must select customer
    if (
      orderobj.OrderInsurance &&
      orderobj.OrderInsurance.OrderInsuranceDetails &&
      orderobj.OrderInsurance.OrderInsuranceDetails.length &&
      !(orderobj.CustomerDocumentId && orderobj.Customer) &&
      !orderobj.EmployeeId &&
      !orderobj.EmployeeDocumentId
    ) {
      this.toastr.info(this.translate.instant("messages.MustSelectEmployeeOrCustomer"), "Order");
      this.showCustomerPopUp(this.orderobj, this.validationList);
      if (typeof this.backProduct === "function") this.backProduct("customer", true, this.isWaiter, true);
      return false;
    }
    //validate if order is has insurance must select customer
    if (this.settingobj.UseMyPoints && !this.orderobj?.OrderType?.ForStaff && !this.orderobj.CustomerDocumentId && !this.orderobj.CustomerId) {
      this.toastr.info(this.translate.instant("messages.MustSelectEmployeeOrCustomer"), "Order");
      this.showCustomerPopUp(this.orderobj, this.validationList);
      if (typeof this.backProduct === "function") this.backProduct("customer", true, this.isWaiter, true);
      return false;
    }

    //validate that order must has order type
    if (orderobj.OrderTypeDocumentId && this.orderSer.allOrderTypes)
      orderobj.OrderType = this.orderSer.allOrderTypes.filter((t) => t.DocumentId == orderobj.OrderTypeDocumentId)[0];
    if (!orderobj.OrderTypeDocumentId || !orderobj.OrderType || !orderobj.OrderType.DocumentId) {
      this.toastr.info("Please Select Order Type", "Order");
      $("#modal-OrderType").modal("show");
      return false;
    }
    //validate if order type must assign waiter
    if (
      orderobj.OrderType &&
      orderobj.OrderType.SelectWaiterInOrder &&
      !orderobj.WaiterId &&
      !orderobj.WaiterDocumentId
    ) {
      this.toastr.info(this.translate.instant("messages.PleaseSelectWaiter"));
      this.isWaiter = true;
      if (typeof this.backProduct === "function") this.backProduct("", true, this.isWaiter);

      this.SearchEmployee(this.isWaiter);
      $("#modal-Waiter").modal("show");
      return false;
    }
    const settings: SettingModel = orderobj.settings || this.settingobj;
    //validate if setting must assign captin

    if(orderobj.pointOfSale?.IsHallPos && !orderobj.CaptainDocumentId && this.HallCaptain){
      orderobj.CaptainId = this.HallCaptain.Id;
      orderobj.CaptainDocumentId = this.HallCaptain.DocumentId;
      orderobj.CaptainName = this.HallCaptain.FullName || this.HallCaptain.FirstName;
    }

    else if (settings && settings.MustAssignCaptain && !orderobj.CaptainDocumentId) {
      if(settings?.AssignCaptainToOrderTypes?.length &&
         !settings?.AssignCaptainToOrderTypes?.includes(orderobj?.OrderTypeDocumentId)){
          // continue 
      }
      else{
        this.toastr.info("Please Select Captain", "Order");
        this.isWaiter = false;
        if (typeof this.backProduct === "function") this.backProduct("", true, this.isWaiter);

        this.SearchEmployee(this.isWaiter);
        $("#modal-Waiter").modal("show");
        return false;
      }
    }
    //validate all order detail must have qty
    if (!orderobj.OrderDetails || orderobj.OrderDetails.length == 0) {
      this.toastr.info("Please Add Products First", "Order");
      return false;
    }
    //validate if order type is deliver the subtotal must be bigger than the settings of delivery total and must select customer and if must to select driver before close

    if (orderobj.OrderType.Value == 2) {
      if (this.handleDeliveryPriceOptions(orderobj, false)) {
        this.toastr.info("Order Total Greater or less than Settings", "Order");
        return false;
      }
      if (!orderobj.IsCallCenter && !orderobj.IsMobileOrder) {
        if (!orderobj.CustomerDocumentId && !orderobj.CustomerAddressDocumentId) {
          this.showDeliveryModal();
          this.toastr.info(this.translate.instant("messages.MustSelectCustomer"), "Order");
          return false;
        }
      } else {
        if (
          !orderobj.CustomerId &&
          !orderobj.CustomerAddressId &&
          !orderobj.CustomerDocumentId &&
          !orderobj.CustomerAddressDocumentId
        ) {
          this.showDeliveryModal();
          this.toastr.info(this.translate.instant("messages.MustSelectCustomer"), "Order");
          return false;
        }
      }
      if (settings && settings.MustSelectDriverBeforeSave && (!orderobj.DriverDocumentId || !orderobj.Driver)) {
        orderobj.IsDriver = true;
        if (typeof this.backProduct === "function") this.backProduct("customer", true, this.isWaiter, true);
        this.toastr.info(this.translate.instant("messages.MustSelectDriver"), "Order");
        this.showDeliveryModal();
        this.deliveryCustomerComponent.onShowCustomer();
        return false;
      }
    }

    //validate if order type is MustHaveCustomer must assign customer
    //validate if customer can use Points
    //validate if customer can use Coupons
    if (orderobj.OrderType && orderobj.OrderType.MustHaveCustomer && !orderobj.CustomerDocumentId) {
      if (typeof this.backProduct === "function") this.backProduct("customer", true, this.isWaiter, true);
      this.toastr.info(this.translate.instant("messages.MustSelectCustomer"), "Order");
      this.showDeliveryModal();
      return false;
    }

    //validate if order type is NoteIsRequired must insert note
    if (orderobj.OrderType.NoteIsRequired && (!orderobj.NoteForOrder || !orderobj.NoteForOrder.trim())) {
      this.toastr.info("Please add note for this order", "Order");
      return false;
    }

    //validate if order type is for staff must select employee
    if (orderobj.OrderType.ForStaff && !orderobj.EmployeeId && !orderobj.EmployeeDocumentId) {
      this.toastr.info(this.translate.instant("messages.MustSelectEmployee"), "Order");
      if (typeof this.backProduct === "function") this.backProduct("", true, "General");
      this.isWaiter = "ShouldHaveMeal";
      this.SearchEmployee(this.isWaiter);
      $("#modal-Waiter").modal("show");
      return false;
    }
    //validate if order type is is dine in must select table
    if (orderobj.OrderType.Value == 4 && !orderobj.TableId) {
      this.selectDineIn = true;
      this.ProductShowing = false;
      this.paymentShow = false;
      this.toastr.info("Please Select Table First", "Order");
      return false;
    }

    if (orderobj.OrderType.MustHavePersons && !orderobj.PersonsCount) {
      this.toastr.info(this.translate.instant("messages.MustEnterPersonsCount"));
      if (typeof this.backProduct === "function") this.backProduct("PersonsCount", true, false, true);
      else this.openPersonsPopUp();
      return false;
    }

    if (settings?.MustSelectSideDishesInOrders) {
      const detailsShouldHaveSideDishes = orderobj.OrderDetails.filter(x=>x.Product?.ProductSubItems?.length);
      if(detailsShouldHaveSideDishes?.some(d=>!d.OrderDetailSubItems?.length && d.ProductQuantity > 0)){
        this.toastr.info(this.translate.instant("PosSettings.MustSelectSideDishesInOrders"));
        return false;
      }
    }

    let validateQuantity = true;
    orderobj.OrderDetails.forEach((value) => {
      if (value.VolumeId || value.VolumeDocumentId) {
        const volume = this.volumes?.find(
          (x) =>
            (value.VolumeFerpCode && x.VolumeFerpCode == value.VolumeFerpCode) ||
            (value.VolumeId && x.Id == value.VolumeId) ||
            (value.VolumeDocumentId && x.DocumentId == value.VolumeDocumentId)
        );
        if (volume) value.ProductVolumName = volume.Name;
      }
      if (!value.ProductGroupId && !value.ProductGroupDocumentId) {
        let nProduct = this.allproductlist.find(
          (x) => (value.ProductId && x.Id == value.ProductId) || x.DocumentId == value.ProductDocumentId
        );
        value.ProductGroupId = nProduct.ProductGroupId;
        value.ProductGroupDocumentId = nProduct.ProductGroupDocumentId;
        value.ProductGroupName = nProduct.ProductGroupName;
      }
      if (value.ProductQuantity <= 0 && !value.IsTransferd && !value.IsCancelled) {
        validateQuantity = false;
        return false;
      }
      return true;
    });

    if (!validateQuantity) {
      this.toastr.info("Invalid Product Quantity", "Order");
      return false;
    }
    if (orderobj.DeliveryNetPrice && orderobj.DeliveryNetPrice > 0) orderobj.DeliveryPrice = orderobj.DeliveryNetPrice;

    if(this.shouldHasTax(orderobj))
    {
      this.toastr.info("Invalid Tax");
      orderobj = this.recalculateOrderObject(orderobj);
      return false;
    }

    if(!orderobj.Discount && orderobj.DiscountAmount){
      this.toastr.warning("Invalid Discount");
      orderobj = this.recalculateOrderObject(orderobj);
      return false;
    }
    if(!this.validateProductLimit(orderobj))
      return false;

    if(orderobj.OrderDetails.some(x=>x.StartTime && !x.EndTime) && fromClose){
      this.toastr.warning(this.translate.instant("messages.PleaseCloseOpendGame"));
      return false;
    }
    if(!this.validateFoodPlanDate(orderobj))
      return false;
    
    return true;
  }
  validateProductLimit(order:OrderModel){
    let valid = true;
    const productDocIds = order.OrderDetails.map(x=>x.ProductDocumentId);
    productDocIds.forEach((docId) => {
      const product = this.orderSer.originalProductList.find(x=>x.DocumentId == docId);
      const limit = product?.RequestLimit;
      if(limit && sumByKey(order.OrderDetails.filter(x=>x.ProductDocumentId == docId), 'ProductQuantity') > limit){
        this.toastr.warning(this.translate.instant("messages.RequestLimit").replace('{0}', product.Name).replace('{1}', limit));
        valid = false;
      }
    });
    return valid;
  }
  // validateGame(orderobj: OrderModel) {
  //   if (orderobj.Paid && orderobj.OrderDetails?.some(x => x.StartTime && !x.EndTime)) {
  //     orderobj.OrderDetails.forEach(detail => {
  //       if (detail.StartTime && !detail.EndTime)
  //         detail.EndTime = new Date().toLocaleTimeString();
  //     });
  //     this.setProductQuantityForGame(orderobj);
  //     orderobj = this.recalculateOrderObject(orderobj);
  //   }
  //   return orderobj;
  // }

  openCardModel() {
    setTimeout(() => {
      this.setFocusById("CardNumber_Id");
    }, 400);
    $("#modal-CardNumber").modal("show");
  }

  setCardNumber() {
    this.sendClicked();
    $("#modal-CardNumber").modal("hide");
  }

  checkUseCard() {
    let use = this.ordertypelist && this.ordertypelist.filter((x) => x.UseCard)[0] ? true : false;
    return use;
  }

  onSelect(i) {
    var element = document.getElementsByClassName("LiOrderS")[i];
    element.classList.toggle("selectedbg");
  }

  paymentClicked() {
    if (!this.orderobj.OrderTypeDocumentId || !this.orderobj.OrderType || !this.orderobj.OrderType.DocumentId) {
      this.toastr.info("Please Select Order Type", "Order");
      $("#modal-OrderType").modal("show");
      return false;
    }
    if (!this.orderobj.OrderDetails || this.orderobj.OrderDetails.length <= 0) {
      this.toastr.info("Please Add Products First", "Order");
      return false;
    }
    ////this methode used for checking if it use minimum charge and if there is persons count
    ////if not show the pop up to select the number of persons table.OrderTypesList?.includes(orderobj.OrderTypeDocumentId)
    const table = this.minimumCharges[0]?.Tables?.find(t=> t.DocumentId === this.orderobj.TableId);
    const tableHasMinCharge = !!(table && this.settingobj.UseMinimumCharge && table?.ValuePerPerson &&
      (table?.OrderTypesList?.length ? !!(table?.OrderTypesList?.includes(this.orderobj?.OrderTypeDocumentId)):true));
    if (tableHasMinCharge && (!this.orderobj.PersonsCount || this.orderobj.PersonsCount == 0)) {
      this.openPersonsPopUp();
      return false;
    }
    /////Showing the popup to whether continue to payment or else .if yes fire ApplySubTotalWithMinChargeValue method
    if (this.tableHasMinCharge(this.orderobj) && this.orderobj.SubTotal < this.orderobj.MinimumChargeValue ) {
      Swal.fire({
        title: this.translate.instant("Shared.Areyousure?"),
        text: `${this.translate.instant("messages.thistotal")}
        [${this.orderobj.SubTotal.toFixed(2)}] ${this.translate.instant("messages.islessthan")} [${
          this.orderobj.MinimumChargeValue
        }]
        ${this.translate.instant("messages.theminimumchargeamountareyousurethatyouwonttoaddmoreproducts")}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.translate.instant("messages.addmoreitems"),
        confirmButtonText: this.translate.instant("messages.yessure")
      }).then((result) => {
        if (result.isConfirmed) {
          this.orderobj.HasMinimumCharge = true;
          this.ApplySubTotalWithMinChargeValue(this.orderobj);
          this.goToPayment = true;
          ///this two lines that show the payment part
          this.showHideComponents("payment");
          $("#elementS").tooltip("dispose");
          ///
        }
      });
      return this.goToPayment;
    } else if (
      this.settingobj.UseMinimumCharge &&
      this.orderobj.HasMinimumCharge == true &&
      this.orderobj.SubTotal == this.orderobj.MinimumChargeValue
    ) {
      ///this is for letting the (this.orderobj.MinimumChargeDifferance) has the same value and not declare it as 0
    } else {
      this.orderobj = this.recalculateOrderObject(this.orderobj);
    }
    this.isDelivery = true;
    // this.addTaxToOrderMasterTaxes(this.orderobj)
    this.showHideComponents("payment");
    $("#elementS").tooltip("dispose");
  }

  destoryTooltip() {
    $("#elementS").tooltip("dispose");
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
    // let panels =document.querySelectorAll('.panel');
    // panels.forEach((panel)=>{
    // panel.addEventListener('click' ,() =>{
    //     this.removeActiveClasses()
    //    panel.classList.add('active')
    // })
    // })
  }

  removeActiveClasses() {
    this.panels.forEach((panel) => {
      panel.classList.remove("active");
    });
  }

  //     ClickedDropDown(e){
  //
  //           let a = e.currentTarget;
  //           if(a?.children[1]?.classList?.contains('show')){
  //             a?.children[1]?.classList?.remove('show');
  //              this.dropUl= false;
  //           }else{
  //             a?.children[1]?.classList?.add('show');
  //              this.dropUl= true;
  //           }

  // }

  ngAfterViewInit() {
    try {
      this.Keyboardnum = new Keyboard(".numberKeyboard", {
        onChange: (input) => this.onChangeNum(input),
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
    } catch (error) {}

    try {
      this.Keyboardnum2 = new Keyboard(".numberKeyboard2", {
        onChange: (input) => this.changeProductPrice(Number(input), true),
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
    } catch (error) {}

    try {
      this.Keyboardnum3 = new Keyboard(".numberKeyboard3", {
        onChange: (input) => (this.orderobj.Pin = this.deepCopy(input)),
        onKeyPress: (button) => this.onKeyPressNum(button),
        layout: { default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"] },
        theme: "hg-theme-default hg-layout-numeric numeric-theme",
        display: { "{bksp}": '<i class="fas fa-backspace"></i>' },
        preventMouseDownDefault: true
      });
    } catch (error) {}

    try {
      this.Keyboardnum4 = new Keyboard(".numberKeyboard4", {
        onChange: (input) => (this.applyKeyboard(input)),
        onKeyPress: (button) => this.onKeyPressNum(button),
        layout: { default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"] },
        theme: "hg-theme-default hg-layout-numeric numeric-theme",
        display: { "{bksp}": '<i class="fas fa-backspace"></i>' },
        preventMouseDownDefault: true
      });
    } catch (error) {}

    try {
      this.openkeyboard5("DiscountPercentage11");
      this.openkeyboard6();
      this.openKeyboardLock();
      this.openKeyboardCardNumber();
    } catch (error) {}

    //this.cdref.detectChanges();
  }

  openkeyboard5(type: string) {
    // this.DiscountKeyBoard = type;
    this.Keyboardnum5 = new Keyboard(".numberKeyboard5", {
      onChange: (input) => this.onChangeKeyBoardValue(type, input),
      // onKeyPress: (button) => this.onKeyPressNum(button),
      layout: { default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"] },
      theme: "hg-theme-default hg-layout-numeric numeric-theme",
      display: { "{bksp}": '<i class="fas fa-backspace"></i>' },
      preventMouseDownDefault: true
    });
    this.Keyboardnum5.setInput("", "");
  }

  openkeyboard6() {
    this.Keyboardnum6 = new Keyboard(".numberKeyboard6", {
      onChange: (input) => (this.orderobj.Pin = this.deepCopy(input)),
      // onKeyPress: (button) => this.onKeyPressNum(button),
      layout: { default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"] },
      theme: "hg-theme-default hg-layout-numeric numeric-theme",
      display: { "{bksp}": '<i class="fas fa-backspace"></i>' },
      preventMouseDownDefault: true
    });
    this.Keyboardnum6.setInput("", "");
  }

  openKeyboardLock() {
    this.KeyboardnumLock = new Keyboard(".numberKeyboardLock", {
      onChange: (input) => (this.orderobj.Pin = this.deepCopy(input)),
      // onKeyPress: (button) => this.onKeyPressNum(button),
      layout: { default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"] },
      theme: "hg-theme-default hg-layout-numeric numeric-theme",
      display: { "{bksp}": '<i class="fas fa-backspace"></i>' },
      preventMouseDownDefault: true
    });
    this.KeyboardnumLock.setInput("", "");
  }

  openKeyboardCardNumber() {
    this.KeyboardnumCardNumber = new Keyboard(".numberKeyboardCardNumber", {
      onChange: (input) => (this.orderobj.CardNumber = this.deepCopy(input)),
      // onKeyPress: (button) => this.onKeyPressNum(button),
      layout: { default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"] },
      theme: "hg-theme-default hg-layout-numeric numeric-theme",
      display: { "{bksp}": '<i class="fas fa-backspace"></i>' },
      preventMouseDownDefault: true
    });
    this.KeyboardnumCardNumber.setInput("", "");
  }
  checkDetailDiscountPermmisonValidation(detail: OrderDetailModel){
      if(this.isAdmin) this.orderobj.isAdmin  = this.isAdmin
      let userPermmisions = this.userPermissions2 ? this.userPermissions2 : this.userPermissions;
      let permission = "CanAddDiscountForDetail";
      let option: any;
      userPermmisions?.forEach((userOption: any) => {
        option = userOption?.POSUserRoleOptions?.find((option: any) => option.Name === "CanAddDiscountForDetail");
      });

      if (!this.orderobj.isAdmin && (option?.MaxDiscountValue ?? 0) < detail.DiscountPercentage) {
        $("#modal-DetailDiscount").modal("hide");
        this.enterPinForUser(permission,detail.DiscountPercentage);
        return false;
      }
      return true;
  }
  onChangeKeyBoardValue(type: string, input) {
    if (this.orderobj.OrderDetails[this.indexItem] )
    {
      switch (type) {
        case "DiscountPercentage11":
            this.orderobj.OrderDetails[this.indexItem].DiscountPercentage = Number(this.deepCopy(input));
            this.orderobj.OrderDetails[this.indexItem].DiscountAmount =0;

          break;
        case "DiscountAmount11":
            this.orderobj.OrderDetails[this.indexItem].DiscountAmount = Number(this.deepCopy(input));
            this.orderobj.OrderDetails[this.indexItem].DiscountPercentage = 0;
          break;
      }
    }
  }

  ClearKeyboardLock() {
    this.KeyboardnumLock.setInput("", "");
    this.orderobj.Pin = undefined;
  }

  ClearPersonsCount() {
    this.Keyboardnum4.setInput("", "");
    this.orderobj.PersonsCount = undefined;
  }

  ClearMinimumChargeNewPerPerson() {
    this.Keyboardnum4.setInput("", "");
    this.orderobj.MinimumChargeNewPerPerson = undefined;
  }

  ClearPin() {
    this.Keyboardnum3.setInput("", "");
    (document.getElementById("NewPin") as any).value = "";
    this.orderobj.Pin = "";
  }

  changePrice(e) {}

  EditingPrice(orderDetail: OrderDetailModel) {
    orderDetail = this.DropDownItem;
    this.ngAfterViewInit();
    this.orderDetailForEditPrice = new OrderDetailModel();
    this.orderDetailForEditPrice = orderDetail;
    this.orderDetailForEditPrice.EditedPrice = this.orderDetailForEditPrice.Product.Price;
    this.Keyboardnum2.setOptions({
      inputName: this.orderDetailForEditPrice.Product.Price
    });
    $("#modal-161").modal("show");
  }

  changeProductPrice(EditedPrice: number, isFromKeyBoard = false) {
    if (this.orderDetailForEditPrice.ProductPrice != EditedPrice) {
      this.orderDetailForEditPrice.ShowEditIconPrice = true;
    }
    if (EditedPrice || EditedPrice === 0) {
      this.orderDetailForEditPrice.EditedPrice = Number(EditedPrice);
      this.orderDetailForEditPrice.ProductPrice = Number(EditedPrice);
      this.orderDetailForEditPrice.Product.Price = Number(EditedPrice);
      this.orderDetailForEditPrice.Product.PriceChanged = true;
      let product = this.allproductlist.find((x) => x.DocumentId == this.orderDetailForEditPrice.Product.DocumentId);
      if (product) {
        product.PriceChanged = true;
        product.Price = Number(EditedPrice);
      }
      this.orderobj = this.recalculateOrderObject(this.orderobj);
    }

    if (!isFromKeyBoard) $("#modal-161").modal("hide");
  }

  // Start : Keyboard Num Functions
  openkeyboardNum() {
    this.Showingkeyboard = true;
  }

  closekeyboardNum() {
    this.Showingkeyboard = false;
  }

  onInputFocusNum = (event: any, index: string) => {
    this.ngAfterViewInit();
    this.openkeyboardNum();
    this.Keyboardnum.setInput("1", "qty" + index);
    if (this.selectedNumInput != index) {
      this.onInputChangeNum(event);
    }
    this.selectedNumInput = index;
    this.selectedInput = event.target.id;
    this.selectValue = event.target.value;
    this.Keyboardnum.setOptions({
      inputName: event.target.id
    });
    this.selectText(index);

  };
selectText(index: string) {
  const inputElement:any = document.getElementById('qty'+index)
  if(!inputElement) return
    // Delay is sometimes needed if the input is not focused yet
    setTimeout(() => {
      inputElement.focus();
      inputElement.setSelectionRange(0, inputElement.value.length);
    });
  }

  onChangeNum = (input: string) => {
    if (this.selectedInput) {
      this.orderobj.OrderDetails[this.selectedNumInput].ProductQuantity = input;
    }
    this.orderobj = this.recalculateOrderObject(this.orderobj);
  };
  onKeyPressNum = (button: string) => {
    if (button === "{shift}" || button === "{lock}") this.handleShiftNum();
  };
  handleShiftNum = () => {
    let currentLayout = this.Keyboardnum.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";
    this.Keyboardnum.setOptions({
      layoutName: shiftToggle
    });
  };

  addItem(e: string) {}

  isNotMinusnumber(number) {
    const dotCount = (number.toString().match(/\./g) || []).length;
    if (
      number.toString().includes("-") ||
      dotCount > 1 ||
      Number.isNaN(Number(number)) ||
      typeof Number(number) !== "number" ||
      number < 0
    ) {
      return false;
    }
    return true;
  }

  onInputChangeNum = (event: any) => {
    if (!this.isNotMinusnumber(event.target.value)) event.target.value = 0;
    this.Keyboardnum.setInput(event.target.value, event.target.id);
  };

  // End : Keyboard Num Functions

  showOrderTypeModal() {
    if (
      this.orderobj &&
      this.orderobj.OrderType &&
      this.orderobj.DocumentId &&
      !this.settingobj.ChangeOrderTypeAfterSave
    ) {
      if (this.orderobj.OrderType.Value == 1) {
        this.toastr.warning("Can not change order type ! order already saved");
        $("#modal-OrderType").modal("hide");
      }
      if (this.orderobj.OrderType.Value == 2) {
        this.setDelivery(this.orderobj.OrderType);
        $("#modal-OrderType").modal("hide");
      }
      if (this.orderobj.OrderType.Value == 4) {
        this.showHideComponents("table");
        $("#modal-OrderType").modal("hide");
      }
    } else $("#modal-OrderType").modal("show");
  }

  //      callkeyboard()
  // {
  //   this.orderSer.openkeyboard().subscribe(
  //     (res: any) => {
  //     },
  //     (err) => {
  //       this.toastr.error(this.toastrMessage.LoginMessages(err), "order");
  //     }
  //   );
  // }
  cancelDininAndAddGame(game){
    this.cancelDinin(game?.table , true,game);
    
  }
  continueCancelDininAndAddGame(game){
    // setTimeout(() => {
      game?.gameDetails?.forEach(detail => {
        const product = this.allproductlist.find(x=> x.DocumentId === detail.ProductDocumentId);
        if(product){
          let orderDetail:OrderDetailModel;
          if(!detail.DocumentId){
            this.addToOrderDetailList(product);
            orderDetail = this.orderobj.OrderDetails[this.orderobj.OrderDetails.length -1];
          }
          else
            orderDetail = this.orderobj.OrderDetails.find(x=> x.DocumentId === detail.DocumentId);

          if(orderDetail && orderDetail.ProductDocumentId === detail.ProductDocumentId){
            orderDetail.StartTime = detail.StartTime;
            orderDetail.EndTime = detail.EndTime;
          }
        }
        
      });
      if(game?.gameDetails?.length){
        this.setProductQuantityForGame(this.orderobj);
        this.orderobj = this.orderobj;
        this.orderobj = this.recalculateOrderObject(this.orderobj);
        this.sendClicked(this.orderobj);
      }
      
    // }, 500);
  }
  cancelDinin(table ,saveGame = false ,game= null) {
    this.selectDineIn = false;
    // this.orderobj.HasMinimumCharge = false;
    // this.orderobj.OrderDetails = [] ;
    setTimeout(() => {
      if (table && table.DocumentId) {
        // check if split order to new table
        if (this.orderobj.IsSplitOrder) {
          this.showHideComponents("product");
          if (table.Count > 1 || table.DocumentId == this.orderobj.TableId) {
            this.orderobj.IsSplitOrder = false;
            return;
          }
          if (table.Count == 1) {
            this.orderSer.GetOrderForTabel(table.DocumentId).subscribe((res) => {
              let orders = res as OrderModel[];
              if (orders && orders.length > 0) table.orders = orders;
              this.tableForSplit = table;
              $("#modal-1001").modal("show");
            });
          } else {
            this.tableForSplit = table;
            $("#modal-1001").modal("show");
          }
        } else {
          if(!this.orderobj.orderTypeChangedAfterSave){
            if (!this.orderobj.IsChangeTable && this.orderobj.DocumentId && !table.count && !saveGame) {
              let orderType = this.ordertypelist.find((x) => x.DocumentId == this.orderobj.OrderTypeDocumentId);
              this.ClearOrderModel(false);
              if (orderType) this.setOrderType(orderType);
            }
            if (!this.orderobj.IsChangeTable || !this.orderobj.DocumentId) {
              //if the table has already order saved and it cahnge table only from table pop up we create a new order we prevent change table except ony from change table button
              //and if the order is not saved yet and the order is take away for example and change it to dine in we don't clear the order details
              let orderDetails = [];
              if (
                !this.orderobj.DocumentId ||
                (this.orderobj.DocumentId == "" &&
                  this.orderobj.DocumentId == undefined &&
                  this.orderobj.OrderDetails &&
                  this.orderobj.OrderDetails.length > 0)
              )
                orderDetails = this.orderobj.OrderDetails;
              this.mapOrder(this.orderobj);
              this.orderobj.DocumentId = "";
              this.orderobj.OrderDetails = orderDetails;
              this.orderobj.PersonsCount = table.Chairs;
            }
          }
          this.orderobj.OrderTable = table;
          this.orderobj.TableId = table.DocumentId;
          this.orderobj.TableName = table.Name;
          this.orderobj = this.reassignPricesToAllProducts(this.orderobj);
          /////////if choose the table and the table has the order type that define in the minimum charge then
          ///it will fire the popup and send the data to the handelMinimumCharge
          if (this.settingobj.UseMinimumCharge && table?.ValuePerPerson && !saveGame) {
            const tableCanUseMin = table?.OrderTypesList?.length ?
              table?.OrderTypesList?.includes(this.orderobj.OrderTypeDocumentId) : this.orderobj?.OrderType?.Value == 4;
            if(tableCanUseMin){
              if(!this.orderobj.PersonsCount)this.openPersonsPopUp();
              this.handelMinimumCharge(table, this.orderobj);
            }
          }
          /////////
          if (table.Count == 0) {
            if (this.orderobj.OrderType && this.orderobj.OrderType.MustHavePersons && !this.orderobj.IsChangeTable && !saveGame)
              this.openPersonsPopUp();
            this.orderobj = this.recalculateOrderObject(this.orderobj, false);
            this.showHideComponents("product");
            if(saveGame && game) this.continueCancelDininAndAddGame(game);
            if (this.orderobj.IsChangeTable) this.sendClicked();
            return;
          }

          // Handle customer scheduled orders
          if (this.orderobj.IsCustomerOrder) {
            this.showHideComponents("product");
            if(saveGame && game) this.continueCancelDininAndAddGame(game);
            return;
          }

          this.orderSer.GetOrderForTabel(table.DocumentId).subscribe(
            (res) => {
              let orders = res as OrderModel[];
              if (orders && orders.length > 0) {
                if (this.orderobj && this.orderobj.OrderDetails && this.orderobj.OrderDetails.length > 0) {
                  let newOrderDetails = this.orderobj.OrderDetails.filter((x) => !x.DocumentId && !x.OrderId);
                  newOrderDetails.forEach((x) => {
                    x.OrderId = orders[0].DocumentId;
                    orders[0].OrderDetails.push(x);
                  });
                }
                this.CheckOrderTable(orders);
              } else this.orderobj.TableId = undefined;
              this.showHideComponents("product");
              if(saveGame && game) this.continueCancelDininAndAddGame(game);
            },
            (err) => {
              this.orderobj.TableId = undefined;
              this.showHideComponents("product");
              if(saveGame && game) this.continueCancelDininAndAddGame(game);
            }
          );
        }
      } else this.showHideComponents("product");
    }, 200);
  }

  routerOnDeactivate() {
    this.clearAllIntervals();
  }

  ngOnDestroy() {
    if (this.noteSub) this.noteSub.unsubscribe();
    this.clearAllIntervals();

    if (this.interv) {
      clearInterval(this.interv);
    }

    if (this.interv2) {
      clearInterval(this.interv2);
    }

    $('[data-toggle="tooltip"]').tooltip("dispose");
    let modalBackDropAll = document.querySelectorAll(".modal-backdrop");
    modalBackDropAll.forEach((el) => {
      if (el.classList.contains("show")) {
        el.classList.remove("show");
        el.setAttribute("style", "z-index:-1;");
      }
    });
  }

  public onScrollEvent(event: any): void {}

  selectedOrder(e, i) {
    let count = +50;
    this.indexItem = i;
    // this.DropDownItem = e?.DocumentId ? undefined : e;
    this.DropDownItem = e;
    this.orderobj.OrderDetails.forEach((x) => {
      x.EditingSelected = false;
    });
    this.orderobj.OrderDetails.forEach((x) => {
      x.Selected = false;
    });
    e.EditingSelected = !e.EditingSelected;

    let index = this.orderobj.OrderDetails.indexOf(e);

    window.addEventListener("keydown", (event) => {
      if (event.keyCode == 40) {
        e.EditingSelected = false;
        this.orderobj.OrderDetails.forEach((x) => {
          x.Selected = false;
        });

        if (index < this.orderobj.OrderDetails.length - 1) {
          index += 1;
          this.orderobj.OrderDetails[index].Selected = true;
        } else {
          index = this.orderobj.OrderDetails.length - 1;
          this.orderobj.OrderDetails[index].Selected = true;
        }
      } else if (event.keyCode == 38) {
        count += 70;
        e.EditingSelected = false;
        this.orderobj.OrderDetails.forEach((x) => {
          x.Selected = false;
        });

        if (index > 0) {
          // this.perfectScroll.directiveRef.update(); //for update scroll
          //  this.perfectScroll.directiveRef.scrollToBottom(count, 70); //for update scroll
          index -= 1;
          this.orderobj.OrderDetails[index].Selected = true;
        } else {
          index = 0;
          this.orderobj.OrderDetails[index].Selected = true;
          //  this.perfectScroll.directiveRef.update(); //for update scroll
          //  this.perfectScroll.directiveRef.scrollToBottom(count,70); //for update scroll
        }
      }
    });

    this.ShowDropDown = true;
  }

  CheckOrderTable(orders: OrderModel[]) {
    if (orders.length == 1) {
      let table = this.orderobj.OrderTable;
      const order = orders[0];
      for (let index = 0; index < this.promos.length; index++) {
        const promo = this.promos[index];
        if (promo.OrderTypesList.includes(order.OrderType.DocumentId)) {
          order.OrderType.IsPromo = true;
        }
      }
      if (order.OrderDetails.length > 0) {
        this.orderobj = this.mapOrderToOrderObject(order);
        this.orderobj.OrderTable = table;
      } else {
        this.toastr.error("No order Details to Show");
      }
      $("#modal-1021").modal("hide");
    } else if (orders.length > 1) {
      // More than one order
      this.allTableOrders = orders;
      $("#modal-1021").modal("show");
    }
    this.orderobj = this.recalculateOrderObject(this.orderobj, true);
  }

  clickedSearch() {
    this.okSearch = !this.okSearch;
  }

  clickedBtnCheck(e) {
    if (this.finalProductList && e) {
      e = e.toLowerCase();
      this.productlisFilterd = this.cloneList(
        this.productlist.filter((prod) => this.getName(prod).toLowerCase().startsWith(e)).filter(x=> !x.EntertainmentService)
      );
      this.productlisFilterd = this.hideZeroProducts(this.productlisFilterd);
    } else this.productlisFilterd = [];
    // this.searchTerm =e;
  }

  EditProducts() {
    this.showPencile = !this.showPencile;
  }

  clickedEditProduct(e) {
    $("#modal-181").modal("show");
    if (e.ProductProperties && e.ProductProperties.Name) {
      this.EditImgName = e.ProductProperties.Name;
      this.EditImg = e.ProductProperties;
    } else {
      this.EditImgName = e.Name;
      this.EditImg = { Name: e.Name, ImgPath: "", ChangeNameAfterSync: false };
      // this.EditImg = {Name :e.Name ,ImgPath:'',ChangeNameAfterSync:false,IsTempStop : false};
    }
    this.EditImg.ProductDocumentId = e.DocumentId;
    this.EditImg.ProductId = e.Id;
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      let v = this.currentInput;
      this.EditFile = event.target.files[0];
    }
  }

  uploadeImg() {
    if (this.EditImg) {
      if (this.EditFile) {
        const formData = new FormData();
        formData.append("file", this.EditFile, this.EditFile.name);
        this.orderSer.uploadImage(formData).subscribe((res) => {
          let obj = res as any;
          if (res && obj.dbPath) {
            this.saveProductProperties(obj);
          } else this.toastr.error(this.toastrMessage.GlobalMessages(res), "Order");
        });
      } else this.saveProductProperties({ dbPath: "" });
    } else $("#modal-181").modal("hide");
  }

  saveProductProperties(obj) {
    this.EditImg.ImgPath = obj.dbPath;
    this.orderSer.saveProductProperties(this.EditImg).subscribe(async (res) => {
      if (res == 1) {
        let p = this.allproductlist.find(
          (x) =>
            (this.EditImg.ProductId && x.Id == this.EditImg.ProductId) ||
            (this.EditImg.ProductDocumentId && x.DocumentId == this.EditImg.ProductDocumentId)
        );
        if (p) {
          p.PicturePath = this.EditImg.ImgPath;
          p.ProductProperties = this.EditImg;
        }
        this.toastr.success(this.toastrMessage.GlobalMessages(res), "Order");
        $("#modal-181").modal("hide");
      } else this.toastr.error(this.toastrMessage.GlobalMessages(res), "Order");
    });
  }

  listSorted(arrangedList) {
    var model = [];
    if (arrangedList?.length) arrangedList = arrangedList.filter(x=> !x.VolumeDocumentId && !x.VolumeId);
    if (arrangedList?.length) {
      arrangedList.forEach((e) => {
        let productProperties = {} as any;
        if (!e.ProductProperties || !e.ProductProperties.Name) {
          productProperties = {
            Name: e.Name,
            ImgPath: "",
            ChangeNameAfterSync: false
          };
        } else {
          productProperties = e.ProductProperties;
        }
        productProperties.IndexInGroup = arrangedList.indexOf(e);
        productProperties.ProductDocumentId = e.DocumentId;
        productProperties.ProductId = e.Id;
        model.push(productProperties);
      });
      if (model.length > 0 && !this.requestStarted) {
        this.requestStarted = true;
        this.orderSer.saveListProductProperties(model).subscribe(async (res) => {
          if (res == 1) {
            this.toastr.success(this.toastrMessage.GlobalMessages(res), "Order");
          } else {
            this.toastr.error(this.toastrMessage.GlobalMessages(res), "Order");
          }
          this.requestStarted = false;
        });
      }
    }
  }

  getFirstchar() {
    let names = [];
    this.productlist.forEach((n) => {
      names.push(this.getName(n));
    });
    let l = names
      .map((item) => (item??"").charAt(0).toLowerCase())
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    return l;
  }

  isCheckAllCancel(event : any) {
    this.orderobj.OrderDetails.filter((x) => !x.IsCancelled && x.DocumentId && x.DocumentId != "").forEach((x) => {
      x.IsCancelledFront = event.target?.checked;
      if (x.IsCancelledFront) x.ReturnedProductQuantity = x.ProductQuantity;
      else x.ReturnedProductQuantity = undefined;
    });
  }

  closeCancelDetails() {
    this.checkAllCancel = false;
    this.orderobj.OrderDetails.forEach((e) => {
      e.IsCancelledFront = false;
      e.ReturnedProductQuantity = undefined;
    });
    this.closeCancelPopup();
  }

  selectOrder(orderId: string) {
    let order = this.unClosedOrders.find((x) => x.DocumentId == orderId);
    if(this.settingobj?.CannotUpdateAfterAssignDriver && order?.DriverDocumentId){
      this.toastr.warning(this.translate.instant("setting.CannotUpdateAfterAssignDriver"));
      return;
    }

    for (let index = 0; index < this.promos.length; index++) {
      const promo = this.promos[index];
      if (promo.OrderTypesList.includes(order.OrderType.DocumentId)) {
        order.OrderType.IsPromo = true;
      }
    }
    order.pointOfSale = this.pointOfSale;
    this.mapOrder(order);
    this.hideOrdersModelList();
  }

  selectAnyOrder(order: any) {
    order.pointOfSale = this.pointOfSale;
    if (this.pointOfSale && this.pointOfSale.IsCallCenter) {
      order.Status = 0;
      order.CallCenterBranch = "";
      order.NoteForOrder = "";
    }
    this.orderInsuranceService.getByCustomerOrderDocumentID(order.ReferenceCode).subscribe((res) => {
      if(res) 
        order.OrderInsurance = res as any;
    });
    
    if (order.IsCallCenter) {
      this.orderSer.isCallCenterOrder.next(true);
      this.deliveryCustomerComponent.customerAddressList = [order.CustomerAddress];
      this.deliveryCustomerComponent.custAddress(order.CustomerAddress);
    }
    order.OrderDetails?.forEach(p => {
      if((p.VolumeId || p.VolumeDocumentId ) && p.Product?.Name?.includes('/')) p.Product.Name = p.Product.Name.split('/')[0];
    });
    this.mapOrder(order);

    if(this.orderobj.OrderDetails?.some(d=> d.ProductIndex == undefined)) this.resetOrderDetailIndex(true);

    this.orderobj = this.recalculateOrderObject(this.orderobj, true); // We need to calculate products payment amount

    this.hideOrdersModelList();
  }

  selectMobileOrder(order: any) {
    // let order = orderlist.find((x) => x.ReferenceCode == ReferenceCode);
    if (order.TableId) {
      this.orderSer.GetOrderForTabel(order.TableId).subscribe((res) => {
        let orders = res as OrderModel[];
        this.recalculateOrderObject(order);
        if (orders && orders.length > 0) {
          this.tableHasMobileOrder(orders, order);
        } else {
          // this.mapOrder(order);
          this.swalCallCenterOrderSendToKitchen(order);
        }
      });
    } else {
      // this.mapOrder(order);
      this.swalCallCenterOrderSendToKitchen(order);
      // this.hideOrdersModelList();
    }
  }

  tableHasMobileOrder(orders, order) {
    Swal.fire({
      title: this.translate.instant("messages.Warning") + "!",
      text: this.translate.instant("messages.tableHasOrder"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("Shared.Cancel"),
      confirmButtonText: this.translate.instant("Shared.Yes?")
    }).then((result) => {
      if (result.isConfirmed) {
        if (order && order.OrderDetails && order.OrderDetails.length > 0) {
          let newOrderDetails = order.OrderDetails;
          newOrderDetails.forEach((x) => {
            orders[0].OrderDetails.push(x);
            orders[0].ReferenceCode = order.ReferenceCode;
            orders[0].IsMobileOrder = order.IsMobileOrder;
          });
        }
        this.CheckOrderTable(orders);
        this.hideOrdersModelList();
      }
    });
  }

  hideOrdersModelList() {
    this.closeAllUnClosedOrdersPopup();
    this.closingReservationOrdersPopup();
    $("#modal-MobileOrders").modal("hide");
    $("#modal-CallCenterOrders").modal("hide");
    $("#modal-NotPrintedOrders").modal("hide");
  }

  rejectMobileOrder(ReferenceCode: string) {
    this.hideOrdersModelList();
    Swal.fire({
      title: this.translate.instant("messages.Warning") + "!",
      text: this.translate.instant("messages.Wouldyouliketorejectthisorder"),
      input: "text",
      inputPlaceholder: this.translate.instant("Reports.CancellationReason"),
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("Shared.Cancel"),
      confirmButtonText: this.translate.instant("Shared.Yes?")
    }).then((result) => {
      if (result.isConfirmed) {
        // this.orderSer.DeleteMobileOrder(ReferenceCode).subscribe(async (res) => {
        //   this.toastr.success(this.toastrMessage.GlobalMessages(res), "Order");
        //   this.hideOrdersModelList();
        // });
        this.UpdateMobileOrderRejectedStatus(ReferenceCode, 9, result.value);
      }
    });
  }

  mapOrder(order: OrderModel) {
    if (order) {
      this.orderobj = new OrderModel();
      this.orderobj.Discount = order.Discount;
      this.orderobj.ReferenceCode = order.ReferenceCode;
      this.orderobj.IntegrationSystem = order.IntegrationSystem;
      this.orderobj.DiscountType = order.DiscountType;
      this.orderobj.DiscountAmount = order.DiscountAmount;
      this.orderobj.WaiterId = order.WaiterId;
      this.orderobj.WaiterDocumentId = order.WaiterDocumentId;
      this.orderobj.WaiterName = order.WaiterName;
      this.orderobj.EmployeeId = order.EmployeeId;
      this.orderobj.EmployeeDocumentId = order.EmployeeDocumentId;
      this.orderobj.EmployeeName = order.EmployeeName;
      this.orderobj.CaptainId = order.CaptainId;
      this.orderobj.CaptainDocumentId = order.CaptainDocumentId;
      this.orderobj.CaptainName = order.CaptainName;
      this.orderobj.CustomerId = order.CustomerId;
      this.orderobj.Customer = order.Customer;
      this.orderobj.CustomerAddress = order.CustomerAddress;
      this.orderobj.CustomerAddressDocumentId = order.CustomerAddressDocumentId;
      this.orderobj.CustomerAddressId = order.CustomerAddressId;
      this.orderobj.CustomerDocumentId = order.CustomerDocumentId;
      this.orderobj.CustomerName = order.CustomerName;
      this.orderobj.DocumentId = order.DocumentId;
      this.orderobj.DriverId = order.DriverId;
      this.orderobj.DriverDocumentId = order.DriverDocumentId;
      this.orderobj.DriverName = order.DriverName;
      this.orderobj.OrderNumber = order.OrderNumber;
      this.orderobj.OrderPayments = order.OrderPayments;
      this.orderobj.PrintCount = order.PrintCount;
      this.orderobj.Serial = order.Serial;
      this.orderobj.WorkTimeId = order.WorkTimeId;
      this.orderobj.WorkTimeDocumentId = order.WorkTimeDocumentId;
      this.orderobj.Status = order.Status;
      if (order.IsCallCenter || order.IsMobileOrder) {
        this.orderobj.OrderDetails = order.OrderDetails;
        this.orderobj.TotalTaxAmount = order.TotalTaxAmount;
        this.orderobj.NetTotal = order.NetTotal;
        this.orderobj.SubTotal = order.SubTotal;
        this.orderobj.Total = order.Total;
        this.orderobj.IsCallCenter = order.IsCallCenter;
        this.orderobj.IsMobileOrder = order.IsMobileOrder;
      }

      if (order.OrderType) {
        this.orderobj.OrderTypeId = order.OrderType.Id;
        this.orderobj.OrderTypeDocumentId = order.OrderType.DocumentId;
        this.orderobj.OrderTypeName = order.OrderType.Name;
        this.orderobj.OrderType = order.OrderType;
      }
      this.orderobj = this.recalculateOrderObject(this.orderobj, false);
      this.orderobj = this.mapOrderToOrderObject(order);
      this.orderobj = this.reassignPricesToAllProducts(this.orderobj);
    }
    this.DropDownItem = undefined;
  }

  selectCustomer() {
    $('[data-toggle="tooltip"]').tooltip("dispose");
  }
  canPrintOrder(order: OrderModel) {
    const permitted = this.permittedPrint(order);
    if(permitted) return true;
    this.enterPinForUser(order.PrintCount > 0 ? "CanPrintMoreThanOne" : "CanPrint");
    return false;
  }
  printOrderAndClearObject(orderobj: OrderModel) {
    $('[data-toggle="tooltip"]').tooltip("dispose");
    if(orderobj.OrderDetails.some(x=>x.StartTime && !x.EndTime)){
      this.toastr.warning(this.translate.instant("messages.PleaseCloseOpendGame"));
      return;
    }
    if(!this.canPrintOrder(orderobj)) return;
    this.printOrder(orderobj);
    this.ClearOrderModel();
    this.clearSuggestions();
  }

  addLiStyle(orderDetail) {
    this.orderobj.OrderDetails.forEach((x) => {
      x.Selected = false;
    });
    this.orderobj.OrderDetails.forEach((x) => {
      x.EditingSelected = false;
    });
    orderDetail.Selected = true;
    orderDetail.EditingSelected = false;
    let index = this.orderobj.OrderDetails.indexOf(orderDetail);
    setTimeout(() => {
      let el = document.getElementById("liDetails" + index);
      if (el) el.scrollIntoView();
    }, 50);
    this.selectedOrder(orderDetail, index);
  }

  cahierOperation() {
    $('[data-toggle="tooltip"]').tooltip("dispose");
  }

  splitOrChangeOrder(IsSplit) {
    let valName = '';
    let permited = this.isAdmin;
    if(!permited){
      if(IsSplit){
        if(this.orderobj.PrintCount > 0) valName = 'CanSplitOrderAfterPrint';
        else{
          valName = 'CanSplitOrder';
          permited = this.validationList[valName] || this.validationList['CanSplitOrderAfterPrint'];
        }
      }
      else valName = 'CanChangeTable';
      if(!permited) permited = this.validationList[valName];
    }
    if (!permited) permited = this.CheckISGrantedTo(valName, this.userPermissions);
    if (!permited) this.enterPinForUser(valName);
    else {
      $('[data-toggle="tooltip"]').tooltip("dispose");
      if (
        this.orderobj.DocumentId &&
        this.orderobj.DocumentId != "" &&
        this.orderobj.OrderType?.Value &&
        this.orderobj.OrderType?.Value == 4
      ) {
        if (IsSplit) this.orderobj.IsSplitOrder = true;
        else this.orderobj.IsChangeTable = true;
        this.orderobj.IsDevidOrder = false;
        this.showHideComponents("table");
      }
    }
  }

  checkQntyToSplit(orderDetail:OrderDetailModel) {
    orderDetail.checkedSplit = !orderDetail.checkedSplit;
    if (orderDetail.checkedSplit)
      orderDetail.QntyToSplit = orderDetail.ProductQuantity;
    else orderDetail.QntyToSplit = undefined;
  }

  async splitNewOrder() {
    if (
      this.orderobj.OrderDetails.filter((x) => x.checkedSplit)[0] &&
      this.orderobj.OrderDetails.filter((x) => x.checkedSplit).length > 0 &&
      this.tableForSplit
    ) {
      // if (
      //   this.orderobj.OrderDetails.length > 1 ||
      //   (this.orderobj.OrderDetails.length === 1 &&
      //     this.orderobj.OrderDetails[0]["ProductQuantity"] > this.orderobj.OrderDetails[0]["QntyToSplit"])
      // ) {
        if (!this.requestStarted) {
          let newSplitedOrder = new OrderModel();
          let IsMerge = false;
          if (this.tableForSplit.orders && this.tableForSplit.orders.length > 0) {
            //#region  MergeTable
            IsMerge = true;
            newSplitedOrder = this.tableForSplit.orders[0];
            this.orderobj.OrderDetails.filter((x) => x.checkedSplit).forEach((d) => {
              let detail = this.deepCopy(d) as OrderDetailModel;
              detail.TransferdOrderId = detail.OrderId;
              detail.DocumentId = undefined;
              detail.OrderId = undefined;
              detail.checkedSplit = undefined;
              // detail.TransferdQty = 0;
              detail.ProductQuantity = detail.QntyToSplit;
              detail.OriginalProductQuantity = 0;
              newSplitedOrder.OrderDetails.push(detail);
            });
            newSplitedOrder = this.recalculateOrderObject(newSplitedOrder);
            //#endregion
          } else {
            //#region  create the new splited order
            newSplitedOrder.OrderDetails = [];
            newSplitedOrder.OrderType = this.orderobj.OrderType;
            newSplitedOrder.OrderTypeId = this.orderobj.OrderTypeId;
            newSplitedOrder.OrderTypeName = this.orderobj.OrderTypeName;
            newSplitedOrder.OrderTypeDocumentId = this.orderobj.OrderTypeDocumentId;
            newSplitedOrder.TableId = this.tableForSplit.DocumentId;
            newSplitedOrder.TableName = this.tableForSplit.Name;
            newSplitedOrder.WaiterId = this.orderobj.WaiterId;
            newSplitedOrder.WaiterDocumentId = this.orderobj.WaiterDocumentId;
            newSplitedOrder.WaiterName = this.orderobj.WaiterName;
            newSplitedOrder.CaptainId = this.orderobj.CaptainId;
            newSplitedOrder.CaptainDocumentId = this.orderobj.CaptainDocumentId;
            newSplitedOrder.CaptainName = this.orderobj.CaptainName;
            newSplitedOrder.PersonsCount = this.orderobj.PersonsCount;
            newSplitedOrder.Paid = false;
            if(this.orderobj.MinimumChargeValue){
              const oldTable = this.minimumCharges[0]?.Tables?.find(t=> t.DocumentId === this.orderobj.TableId);
              newSplitedOrder.MinimumChargeNewPerPerson = this.tableForSplit?.ValuePerPerson;
              newSplitedOrder.MinimumChargeValue = this.tableForSplit?.ValuePerPerson;
              const tableHasMinCharge = this.tableHasMinCharge(newSplitedOrder);
              newSplitedOrder.PersonsCount = 0;
              if(tableHasMinCharge){
                this.orderobj.PersonsCount = 0;
                if(oldTable?.ValuePerPerson)
                  this.orderobj.MinimumChargeNewPerPerson = oldTable.ValuePerPerson;
              }
              else{
                newSplitedOrder.MinimumChargeValue = undefined;
                newSplitedOrder.MinimumChargeNewPerPerson = undefined;
              }

            } 

            this.orderobj.OrderDetails.filter((x) => x.checkedSplit).forEach((d) => {
              let detail = this.deepCopy(d) as OrderDetailModel;
              detail.TransferdOrderId = detail.OrderId;
              detail.DocumentId = undefined;
              detail.OrderId = undefined;
              detail.checkedSplit = undefined;
              detail.ProductQuantity = detail.QntyToSplit;
              // detail.TransferdQty = 0;
              detail.OriginalProductQuantity = 0;
              newSplitedOrder.OrderDetails.push(detail);
            });
            newSplitedOrder = this.recalculateOrderObject(newSplitedOrder);
            if (!this.validateOrder(newSplitedOrder)) {
              return false;
            }
            //#endregion
          }
          if(newSplitedOrder) newSplitedOrder.SplitName = this.SplitName;
          this.SplitName = '';
          //#region  update old tabelOrder

          // //full quantity splited deatil
          // let fullsplitedDetails = this.orderobj.OrderDetails.filter(
          //   (x) => x.checkedSplit && x.ProductQuantity == x.QntyToSplit
          // );
          // fullsplitedDetails.forEach((x) => {
          //   let index = this.orderobj.OrderDetails.indexOf(x);
          //   if (index != -1) this.orderobj.OrderDetails.splice(index, 1);
          // });

          let splitedDetails = this.orderobj.OrderDetails.filter(x => x.checkedSplit);
          splitedDetails.forEach((x) => {
            let index = this.orderobj.OrderDetails.indexOf(x);
            if (index != -1 && this.orderobj.OrderDetails[index].QntyToSplit > 0) {
              if(!this.orderobj.OrderDetails[index].OriginalProductQuantity)
                this.orderobj.OrderDetails[index].OriginalProductQuantity = this.orderobj.OrderDetails[index].ProductQuantity;
              this.orderobj.OrderDetails[index].ProductQuantity -= this.orderobj.OrderDetails[index].QntyToSplit;    

              // if(!this.orderobj.OrderDetails[index].TransferdQty) this.orderobj.OrderDetails[index].TransferdQty = 0;
              // this.orderobj.OrderDetails[index].TransferdQty = this.orderobj.OrderDetails[index].QntyToSplit;   
              if(this.orderobj.OrderDetails[index].ProductQuantity <= 0){
                this.orderobj.OrderDetails[index].ProductQuantity = 0;
                this.orderobj.OrderDetails[index].IsTransferd = true;
              }
            }
          });
          this.orderobj = this.recalculateOrderObject(this.orderobj);
          //#endregion
          if(this.orderobj.OrderDetails.length == 0) this.orderobj.IsTransferd = true;

          let model = {
            NewOrder: newSplitedOrder,
            OldOrder: this.orderobj,
            IsMerge: IsMerge
          };
          this.requestStarted = true;
          this.orderSer.SplitOrder(model).subscribe(
            async (res: any) => {
              if (res.Item1 == 1) this.toastr.success(this.toastrMessage.GlobalMessages(1), "Order");
              else this.toastr.error(this.toastrMessage.GlobalMessages(res), "Order");
              this.requestStarted = false;
              this.ClearOrderModel();
              $("#modal-1001").modal("hide");
            },
            (err) => {
              this.requestStarted = false;
              this.ClearOrderModel();
              $("#modal-1001").modal("hide");
              this.toastr.error(err.message, "Order");
            }
          );
        }
      // } else {
      //   this.toastr.error(this.translate.instant("Shared.splitOrderError"));
      // }
    }
  }

  minusBtn(orderDetail: OrderDetailModel) {
    if (!orderDetail.QntyToSplit) orderDetail.QntyToSplit = 0;
    if (orderDetail.QntyToSplit - 1 >= 1) orderDetail.QntyToSplit -= 1;
  }

  plusBtn(orderDetail: OrderDetailModel) {
    if (!orderDetail.QntyToSplit) orderDetail.QntyToSplit = 0;
    if (orderDetail.QntyToSplit + 1 <= orderDetail.ProductQuantity) orderDetail.QntyToSplit += 1;
  }
  qtySplitChanged(orderDetail: OrderDetailModel) {
    if (!orderDetail.QntyToSplit || orderDetail.QntyToSplit < 0) orderDetail.QntyToSplit = 0;
    if (orderDetail.QntyToSplit > orderDetail.ProductQuantity) 
      orderDetail.QntyToSplit = orderDetail.ProductQuantity ;
  }

  splitReceipt() {
    let permited = this.validationList["CanSplitReceipt"];
    if (!permited) permited = this.CheckISGrantedTo("CanSplitReceipt", this.userPermissions);
    if (!permited) this.enterPinForUser("CanSplitReceipt");
    else {
      $('[data-toggle="tooltip"]').tooltip("dispose");
      this.tableForSplit = this.orderobj.OrderTable || 
                this.halls?.flatMap(x=> x.Tables)?.find(x=> x.DocumentId == this.orderobj.TableId);
      this.SplitName = '';
      this.orderobj.IsDevidOrder = true;
      $("#modal-1001").modal("show");
    }
  }

  checkCanCancellOrder() {
    let newDetail = this.orderobj.OrderDetails.filter((l) => l.DocumentId)[0];
    if (newDetail) {
      return true;
    } else {
      return false;
    }
    // if(this.orderobj.DocumentId && this.orderobj.DocumentId !='' && this.validationList['CanCancelOrder'])
    //   return true;
    // else return false;
  }

  getAllSalesCount() {
    this.orderSer.getAllSalesCount().subscribe(async (res) => {
      this.salesCount = res as any;
      if (this.salesCount) {
        this.salesCount.AllOrderSale = this.salesCount.SalesCount + this.salesCount.NotPaidCount;
        $("#modal-77").modal("show");
      }
    });
  }

  openKeyboard() {
    this.LoginSer.openkeyboard().subscribe(
      (res: any) => {
        //
      },
      (err) => {}
    );
  }

  openCancellationReason() {
    this.closeCancelPopup();
    this.showCancellationReasons = true;
    $("#modal-cancellationReason").modal("show");
  }
  closeCancellationReasonsPopup(){
    this.showCancellationReasons = false;
    $("#modal-cancellationReason").modal("hide");
  }
  SearchEmployee(isWaiter) {
    let name = this.employeeName ? this.employeeName : ("" as string);
    this.orderSer.GetEmployeeByName(name).subscribe((res) => {
      this.employeeList = res as [];
      if (isWaiter == true) this.employeeList = this.employeeList.filter((x) => x.UserType == 5);
      else if (isWaiter == "General") this.employeeList = this.employeeList;
      else if (isWaiter == "ShouldHaveMeal")
        this.employeeList = this.employeeList.filter((x) => x.ShouldHaveMeal == true);
      else if (this.pointOfSale.ShowPinAfterPayment === true) this.employeeList = this.employeeList;
      else this.employeeList = this.employeeList.filter((x) => x.UserType == 7);
    });
  }

  SelectWaiter(Waiter: any, isSelect: boolean) {
    if (isSelect) {
      this.orderobj.WaiterId = Waiter.Id;
      this.orderobj.WaiterDocumentId = Waiter.DocumentId;
      this.orderobj.WaiterName = Waiter.FullName || Waiter.FirstName;
      $("#modal-Waiter").modal("hide");
      if(this.ShortCutKey != "F4"){
        setTimeout(() => {
          this.sendClicked();
        }, 500);
      }
      this.ShortCutKey = undefined;
    } else {
      this.orderobj.WaiterId = undefined;
      this.orderobj.WaiterDocumentId = undefined;
      this.orderobj.WaiterName = "";
      $("#modal-Waiter").modal("hide");
    }
  }

  SelectCaptain(Captain: any, isSelect: boolean) {
    if (isSelect) {
      this.orderobj.CaptainId = Captain.Id;
      this.orderobj.CaptainDocumentId = Captain.DocumentId;
      this.orderobj.CaptainName = Captain.FullName || Captain.FirstName;
      $("#modal-Waiter").modal("hide");
      this.sendClicked();
    } else {
      this.orderobj.CaptainDocumentId = undefined;
      this.orderobj.CaptainId = undefined;
      this.orderobj.CaptainName = "";
      $("#modal-Waiter").modal("hide");
    }
  }

  SelectEmployee(Employee: any, isSelect: boolean) {
    if (isSelect) {
      this.orderobj.EmployeeId = Employee.Id;
      this.orderobj.EmployeeDocumentId = Employee.DocumentId;
      this.orderobj.EmployeeName = Employee.FullName || Employee.FirstName;

      this.orderobj = this.UnselectCustomer(this.orderobj);
    } else {
      this.orderobj.EmployeeId = undefined;
      this.orderobj.EmployeeDocumentId = undefined;
      this.orderobj.EmployeeName = "";
    }
    this.setFoodPlanOptions();
    $("#modal-Waiter").modal("hide");
  }

  setFoodPlanOptions(){
    const plan = this.orderSer.foodPlans.find(x=>
        x.FoodPlanEmployees.some(y=>y?.EmployeeDocumentId == this.orderobj.EmployeeDocumentId));

    if(plan){
      if(plan.POSFoodPlanProducts?.length > 0){
        const productIds = plan.POSFoodPlanProducts.map(x=>x.ProductDocumentId);
        this.productlisFilterd = this.allproductlist?.filter(p=>
          productIds.includes(p.DocumentId) && !p.EntertainmentService);
          this.productlisFilterd = this.hideZeroProducts(this.productlisFilterd);
  
        this.orderobj.FoodPlanProductFilterd = true;
      }
      else this.loadProductDetails(this.productgrouplist[0]);

      this.getFoodPlanDataForEmployee(this.orderobj);
    }
    else if(this.orderSer.foodPlans?.length){
      this.orderobj.FoodPlanProductFilterd = false;
      this.loadProductDetails(this.productgrouplist[0]);
    }
  }
  getFoodPlanDataForEmployee(orderobj:OrderModel){
    if(!orderobj.EmployeeDocumentId) return;
    if(orderobj.FoodPlanData && orderobj.FoodPlanData.EmployeeDocumentId == orderobj.EmployeeDocumentId 
      && this.validateFoodPlanDate(orderobj))
        this.handelFoodPlan(orderobj);
    else{
      this.orderSer.getFoodPlanDataForEmployee(orderobj).subscribe((res:any)=>{
        orderobj.FoodPlanData = res;
        orderobj.FoodPlanData.EmployeeDocumentId = orderobj.EmployeeDocumentId;
        if(this.validateFoodPlanDate(orderobj))
          this.handelFoodPlan(orderobj);
      })
    }
    
  }
  validateFoodPlanDate(orderobj:OrderModel){
    if(!orderobj.EmployeeDocumentId && !orderobj.FoodPlanData) 
      return true;
    if(orderobj.FoodPlanData?.remainingMeals <= 0){
      this.toastr.warning(this.translate.instant("messages.foodplanover"));
      return false;
    }
    if(orderobj.FoodPlanData?.remainingProducts < sumByKey(orderobj.OrderDetails,'ProductQuantity')){
      this.toastr.warning(this.translate.instant("messages.productcountshouldbe")+ orderobj.FoodPlanData.remainingProducts);
      return false;
    }
    return true;
  }

  searchInOrders(searchOrders) {
    this.returnedArray = this.filterList(this.unClosedOrders, searchOrders);
  }

  getOrderForCardNumber(CardNumber) {
    this.returnedArray = this.unClosedOrders?.filter((x) => x.CardNumber == CardNumber);
    if (this.returnedArray && this.returnedArray[0]) {
      this.CardNumber = "";
      this.selectOrder(this.returnedArray[0].DocumentId);
    }
    if (!CardNumber && (!this.returnedArray || !this.returnedArray[0]))
      this.returnedArray = this.deepCopy(this.unClosedOrders?.slice(0, 10));
  }

  searchInReservationOrders(searchOrders) {
    this.returnedArray2 = this.filterList(this.customrReservationOrders, searchOrders);
  }

  @HostListener("document:keyup", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {

    const popUp = this.document.getElementsByClassName("fade modal show")[0];

    if (event.key == "Enter" && !this.checkcodebarexists) {
      let el = document.activeElement;

      if (!this.QtyFocused && el && el.localName.toLowerCase() != "input" && !this.popUpFired && !popUp)
        this.paymentClicked();
      else this.QtyFocused = false;
    } else if (event.key == "F2") {
      if (this.orderobj.OrderType && this.orderobj.OrderType.Value != 2 && !this.orderobj.OrderType?.PaymentByAnotherUser) this.orderobj.Paid = true;
      this.sendClicked();
    } else if (event.key == "F4") {
      this.ShortCutKey = event.key;
      this.showOrderTypeModal();
    } else if (event.key == "F3") {
      this.ShortCutKey = event.key;
      this.showCustomerPopUp(this.orderobj, this.validationList);
    } else if (event.key == "F6") {
      this.ShortCutKey = event.key;
      if(this.pointOfSale?.PaymentButtonDirectly && this.validationList['CanViewPayment']) this.payTypeButtonClicked();
    }
    else {
      let selectedOD = this.orderobj.OrderDetails.find((d) => d.EditingSelected);
      if (selectedOD && this.ProductShowing && !popUp) {
        if (event.key == "+") this.clickedPlus(selectedOD);
        if (event.key == "-") this.clickedMinus(selectedOD);
      }
    }
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyboardDounEvent(event: KeyboardEvent) {
    if (event.key == "F4") event.preventDefault();
    if (event.key == "F3") event.preventDefault();
    if (event.key == "F6") event.preventDefault();
  }

  onQtyFocus(ifFocus) {
    this.QtyFocused = ifFocus && ifFocus.toLowerCase() === "true";
  }

  routToReturnOrder(){
    if(this.hasSecreenPermission('ReturnOrder'))
      this.router.navigate([`/returnorder`]);
    else this.enterPinForUser('ReturnOrder');
  }
  hasSecreenPermission(screenName) {
    if (this.isAdmin) return true;
    else {
      if (!this.userPermissions || !this.userPermissions.find((x) => x.POSScreenPermissions)) return false;
      else {
        let screenNames = this.userPermissions
          .map(function (p) {
            return p.POSScreenPermissions;
          })
          .reduce(function (a, b) {
            return a.concat(b);
          }, []);

        if (screenName) {
          let exsist = screenNames.find((s) => s.ScreenName == screenName && s.View);
          if (exsist) return true;
          else return false;
        } else {
          let exsist = screenNames.filter(
            (s) => (s.ScreenName == "ReturnOrder" || s.ScreenName == "FollowOrders") && s.View
          )[0];
          if (exsist) return true;
          else return false;
        }
      }
    }
  }

  openCancelOrder() {
    if(!this.checkCanCancelOrderAfterPreparationTime()) return;
    let permName = '';
    let permited = this.isAdmin;
    if(!permited){
      if(this.orderobj.PrintCount > 0) {
        permName = 'CanCancelOrderAfterPrint';
        permited = this.validationList[permName];
      }
      else{
        permName = 'CanCancelOrder';
        permited = this.validationList[permName] || this.validationList['CanCancelOrderAfterPrint'];
      }
    }

    if (!permited) permited = this.CheckISGrantedTo(permName, this.userPermissions);
    if (!permited) this.enterPinForUser(permName);
    else this.openCancelPopup();
  }
  openCancelPopup(){
    this.showCancelPopup = true;
    $("#modal-Cancel").modal("show");
  }
  closeCancelPopup() {
    this.showCancelPopup = false;
    $("#modal-Cancel").modal("hide");
  }
  checkCanCancelOrderAfterPreparationTime(){
    const permName = 'CanCancelOrderAfterOrderPreparationTime'
    let permited = this.isAdmin || this.validationList[permName];
    if(!permited)
      permited = this.CheckISGrantedTo(permName, this.userPermissions);
    if(permited) return permited;
    const finished = this.isOrderPreparationTimeFinished(this.orderobj);
    if(finished){
      this.enterPinForUser(permName);
      return false;
    }
    return true;
  }
  enterPinForUser(permission: string,discountValue: number = 0) {
    this.popUpFired = true;
    Swal.fire({
      title: "You Do not have Permission",
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
          this.orderobj.Pin = value;
          let model = { Pin: value, Option: permission, DiscountValue: discountValue };
          this.orderSer.checkUserWithOption(model).subscribe(
            (res) => {
              this.validationList[permission] = res;
              if (res == true) {
                if (this.users && this.users.length) {
                  let user = this.users.filter((u) => u.Pin == this.orderobj.Pin)[0];
                  if (user) {
                    this.orderobj.PinUserId = user.AppUserId;
                    if (permission === "VerifiedOrderByPinBeforeSave") {
                      this.orderobj.VerifiedByUserId = user.AppUserId;
                      this.orderobj.NoPrinting = this.IsNoPrint;
                      this.pinUserAccepted = true;
                      this.sendClicked();
                      this.pinUserAccepted = false;
                    }
                    if (permission === "CanAddDiscountForDetail") {
                      this.orderobj.VerifiedByUserId = user.AppUserId;
                      this.pinHasValidation = true;
                      this.SaveDetailDiscount();
                    }
                  }
                }
                this.popUpFired = false;
                this.continueAfterPin(permission , this);
              } else {
                if(permission === "CanAddDiscountForDetail"){
                  this.orderobj.OrderDetails[this.indexItem].DiscountAmount = 0 ;
                  this.orderobj.OrderDetails[this.indexItem].DiscountPercentage = 0 ;
                  this.recalculateOrderObject(this.orderobj);
                }
                this.toastr.warning(this.translate.instant("messages.userHasNoPermission"));
              }
            },
            (error) => {
              this.toastr.error(error.message, "Order");
              this.validationList[permission] = false;
            }
          );
          return "";
        }
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        if(permission === "CanAddDiscountForDetail"){
          this.orderobj.OrderDetails[this.indexItem].DiscountAmount = 0 ;
          this.orderobj.OrderDetails[this.indexItem].DiscountPercentage = 0 ;
          this.recalculateOrderObject(this.orderobj);
        }
      }
    });
  }

  GetMobileOrdersCount(fromFirstOpen = false) {
    if (!this.ProductShowing || this.getMobileOrdersCountStarted) return;
    this.pointOfSale.CaptainDocumentId = this.orderobj.CaptainDocumentId;
    this.pointOfSale.appUserId = this.appUserId;
    if (!this.isAdmin)
      this.pointOfSale.CanNotEditOrderForAnotherUser = this.validationList["CanNotEditOrderForAnotherUser"];
    this.getMobileOrdersCountStarted = true;
    this.orderSer.GetMobileOrdersCount(this.pointOfSale).subscribe({
      next: (res) => {
        this.getMobileOrdersCountStarted = false;
        this.unClosedOrdersCount = res["Item1"];
        this.mobileOrdersCount = res["Item2"];
        this.callCenterOrdersCount = res["Item3"];
        this.tableStatuses = res["Item6"];
        this.notPrintedOrdersCount = res["Item7"];
        this.ReservationsCount = res["Rest"]?.Item1;
        this.intervalInputsChangedIn = res["Rest"]?.Item2;
        this.notPrintedKotCount= fromFirstOpen ? this.notPrintedKotCount : res["Rest"]?.Item3;
        this.hasLateOrders = res["Rest"]?.Item4;
        this.tableStatusesCount = this.tableStatuses.length;
        if (this.mobileOrdersCount > 0) {
          this.alertSound.play();
        }
        if (this.tableStatuses.length > 0) {
          this.alertSound.play();
        }
        if (this.callCenterOrdersCount > 0) {
          if(this.pointOfSale?.ReceiveAutomaticCallCenter){
          // if(this.pointOfSale?.ReceiveAutomaticCallCenter && !this.stopReceivingOrdersFromCallCenterAutomatically){
            this.GetBranchCallCenterOrdersFromOnlineOrderCallCenter();
          }
          else
            this.alertSound.play();
        }

        // this.reAssignItemQuantitiesToPoducts(res["Item4"]);
        // this.reAssignDailyStocQtyToPoducts(res["Item5"]);
      },
      error(err) {
        this.getMobileOrdersCountStarted = false;
      }
    });
  }

  // // if using stocks
  // reAssignItemQuantitiesToPoducts(allItemsQuantity) {
  //   if (!this.settingobj.UseDailyStock) {
  //     if (allItemsQuantity && allItemsQuantity.length) {
  //       allItemsQuantity.forEach((x) => {
  //         let product = this.allproductlist.filter((p) => p.DocumentId == x.ProductDocumentId)[0];
  //         if (product && product.ProductItems) {
  //           product.AvailableQuantity = x.AvailableQuantity;
  //         }
  //       });
  //     }
  //   }
  // }

  // //if using daily stock
  // reAssignDailyStocQtyToPoducts(dailystockqty) {
  //   if (this.settingobj.UseDailyStock) {
  //     if (dailystockqty && dailystockqty.length) {
  //       dailystockqty.forEach((x) => {
  //         let product = this.allproductlist.filter((p) => p.DocumentId == x.ProductDocumentId)[0];
  //         if (product && product.ProductItems) {
  //           product.AvailableQuantity = x.AvailableQuantity;
  //         }
  //       });
  //     }
  //   }
  // }

  /**
   * This method will check if order needs to be assigned to a delivery driver
   * It will simply return false if assignment failed.
   * Otherwise, it will return true if assignment successful or no need to assign
   */
  async checkDriverAssignment(OrderStates: number, Order: OrderModel) {
    if (
      OrderStates == 4 &&
      !Order.DriverDocumentId &&
      Order.IsSendToKitchen == true &&
      !Order.IsIntegrationCourier &&
      Order.RemoteStatus == 1
    ) {
      const assignDriverModalRef = this.modalService.show(AssignDriverComponent, {
        class: "modal-sm",
        initialState: {
          order: Order
        }
      });

      const modalResult = await assignDriverModalRef.onHide
        .pipe(
          take(1),
          map((res) => {
            const result = assignDriverModalRef.content.modalResult;

            if (result && result.role == "save") {
              return true;
            }

            return false;
          })
        )
        .toPromise();

      if (!modalResult) {
        return false;
      }
    }

    return true;
  }

  async checkDeliveredOrder(OrderStates: number, Order: OrderModel) {
    if (
      OrderStates == 5 &&
      Order.IsSendToKitchen == true &&
      (Order.RemoteStatus == 11 || Order.RemoteStatus == 6 || Order.RemoteStatus == 7)
    ) {
      Order.Paid = true;
      const result = await this.closeAsync(Order, false);
    }
  }

  /**
   * Show integration orders dialog
   */
  showIntegrationOrders() {
    $("#modal-YemekSepeti").modal("show");
  }

  /**
   * This is wrapper for Orderhelper.Updateorderstatus
   * The goal of this method is being able to control before and after changing status
   */
  async changeIntegrationOrderStatus(OrderStates: number, OrderId, Reason, Order: OrderModel = null) {
    // Check if this order has to be assigned to a driver
    const checkAssign = await this.checkDriverAssignment(OrderStates, Order);
    if (!checkAssign) {
      this.toastr.warning(this.translate.instant("integration.mustAssignDriver"));
      return;
    }

    const result = await this.updateOrderStatus(OrderStates, OrderId, Reason, Order);

    if (result == true) {
      // If order has marked as delivered we should close order
      await this.checkDeliveredOrder(OrderStates, Order);

      // If updating successful then reload integration orders
      this.GetYemekSepetiOrders();
    }

    return result;
  }

  //#region Yemek Sepeti Integration
  GetYemekSepetiOrders(isShow = false) {
    // if (this.allYemekOrders && this.allYemekOrders.length > 0 && this.allYemekOrders.filter((x) => x.IsCollapsed)[0])
    //   return;
    this.refreshingIntegrationOrders = true;
    this.integrationSer.GetAllMessages().subscribe({
      next: (res: OrderModel[]) => {
        this.allYemekOrders = res;

        if (!this.allYemekOrdersLength) this.allYemekOrdersLength = 0;
        const hasNewOrder = res.some((order) => order.RemoteStatus == 0);
        if (hasNewOrder) {
          this.alertSound.play();
        }
        this.allYemekOrdersLength = res.length;

        // Mapping orders and calculate prices
        this.allYemekOrders.forEach((o) => {
          const noProductExist = o.OrderDetails.find((dd) => !dd.ProductDocumentId || !dd.Product);
          if (!noProductExist) {
            o = this.mapOrderToOrderObject(o);
            o.AddressDescription = o.CustomerAddress?.Description;
            o.Time = this.datepipe.transform(new Date(o.CreationTime), "yyyy-MM-dd HH:mm a");
          }

          o.OrderDetails?.forEach((d) => {
            d.SelectedDocumentId = d.ProductDocumentId;
          });

          switch (o.IntegrationSystem) {
            case 1:
              o.IntegrationName = "Yemek Sepeti";
              break;
            case 2:
              o.IntegrationName = "Getir Yemek";
              break;
            case 3:
              o.IntegrationName = "TrendYol Yemek";
              break;
          }
        });
      },
      error: (err: any) => {
        this.refreshingIntegrationOrders = false;
        this.toastr.error(err?.error?.Message);
      },
      complete: () => {
        this.refreshingIntegrationOrders = false;
      }
    });
  }
  async orderHasNewDetailFormOO(orders, order) {
    let result : any = {};
    if(this.pointOfSale?.ReceiveAutomaticCallCenter) 
      result.isConfirmed = true;
    else
      result = await Swal.fire({
      title: this.translate.instant("messages.Warning") + "!",
      text: this.translate.instant("messages.orderhasnewdetail"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("Shared.Cancel"),
      confirmButtonText: this.translate.instant("Shared.Yes?")
    });

    if (result.isConfirmed && !this.updateCallCenterOrderStarted) {
      if (order && order.OrderDetails && order.OrderDetails.length > 0) {
        let newOrderDetails = order.OrderDetails;
        if (newOrderDetails && newOrderDetails.length > 0 && orders.length > 0) {
          newOrderDetails.forEach((x: OrderDetailModel) => {
            let detailExist = orders[0].OrderDetails.find((d) => d.Id == x.Id);
            if(x.ProductIndex == null || x.ProductIndex == undefined){
              if(detailExist && (detailExist.ProductIndex != null || detailExist.ProductIndex != undefined)){
                x.ProductIndex = detailExist.ProductIndex;
                if(x.OrderDetailNotes?.length > detailExist.OrderDetailNotes?.length){
                  orders[0].OrderDetails.find((d) => d.Id == x.Id).OrderDetailNotes = x.OrderDetailNotes;
                }
              }else{
                const orderDetails = orders[0]?.OrderDetails || [];
                // Filter out null/undefined ProductIndex values
                const validIndices = orderDetails.map(d => d.ProductIndex).filter(index => index != null);
                const maxProductIndex = validIndices?.length > 0? Math.max(...validIndices): -1;
                x.ProductIndex = maxProductIndex + 1;
              }
            }
            const oldDetail:OrderDetailModel = orders[0].OrderDetails?.find((d) => d.Id == x.Id);
            const newCancellation = !oldDetail || oldDetail.OrderDetailCancellations?.length != x.OrderDetailCancellations?.length;
            if (x.NewlyInserted === true || newCancellation) {
              // let detailExist = orders[0].OrderDetails.find((d) => d.Id == x.Id);
              x.NewlyInserted = true;
              let detailExistIndex = orders[0].OrderDetails.findIndex((d) => d.Id == x.Id);
              if (detailExist && detailExistIndex >= 0) {
                x.Printed = detailExist.Printed;
                x.DocumentId = detailExist.DocumentId;
                orders[0].OrderDetails.splice(detailExistIndex, 1);
                orders[0].OrderDetails.push(x);
              } else {
                orders[0].OrderDetails.push(x);
              }
            }
            orders[0].ReferenceCode = order.ReferenceCode;
          });
          let detailNotCancelled = orders[0].OrderDetails.find((x) => x.IsCancelled === false);
          if (!detailNotCancelled) {
            orders[0].DeliveryPrice = 0;
            orders[0].SubTotal = 0;
          }
          orders[0].Discount = order.Discount;
          orders[0].DiscountAmount = order.DiscountAmount;
          orders[0].DiscountType = order.DiscountType;
          const ordertype = this.ordertypelist?.find((x) =>(order.OrderTypeDocumentId && x.DocumentId == order.OrderTypeDocumentId) || (order.OrderTypeId && x.Id == order.OrderTypeId));
          if(ordertype){
            orders[0].OrderType = ordertype;
            orders[0].OrderTypeDocumentId = ordertype.DocumentId;
            orders[0].OrderTypeId = ordertype.Id;
            orders[0].OrderTypeName = ordertype.Name;
          }
          orders[0].DeliveryPrice = order.DeliveryPrice;
          orders[0].NoteForOrder = order.NoteForOrder;
          this.recalculateOrderObject(orders[0]);
        }
        this.updateCallCenterOrderStarted = true;
        this.orderSer.UpdateOrder(orders[0]).subscribe((res) => {
          this.updateCallCenterOrderStarted = false;
          this.toastr.success("Saved successfully");
          // this.stopReceivingOrdersFromCallCenterAutomatically = false;
        },error=>{
          this.updateCallCenterOrderStarted = false;
        });
        this.hideOrdersModelList();
      }
      this.GetMobileOrdersCount();
    }
  }

  acceptCallCenterOrder(order: OrderModel) {
    if (order.Id && order.UpdatedNewDetails === true ) {
      if(this.updateOrderId == order.Id && this.startedAcceptCallCenterOrderTime && this.startedAcceptCallCenterOrderTime.getTime() + 5000 > new Date().getTime()) return;
      this.updateOrderId = order.Id;
      this.startedAcceptCallCenterOrderTime = new Date();
      this.orderSer.GetOldOrderToEdit(order).subscribe((res) => {
        let orders = res as OrderModel[];
        if (orders && orders.length > 0) {
          this.orderHasNewDetailFormOO(orders, order);
        } else {
          this.swalCallCenterOrderSendToKitchen(order);
        }
      });
    } else {
      this.swalCallCenterOrderSendToKitchen(order);
    }
  }

  swalCallCenterOrderSendToKitchen(order: OrderModel) {
    if(!this.pointOfSale?.ReceiveAutomaticCallCenter){
      Swal.fire({
        title: this.translate.instant("messages.Wouldyouliketoacceptthisorder"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText:
          order?.IsSuspended == false && order?.IsMobileOrder && order?.IsScheduled == true
            ? this.translate.instant("Shared.PreAccept")
            : order?.Reservation == true && order?.IsMobileOrder == true
            ? this.translate.instant("Order.reservationConfirm")
            : this.translate.instant("Order.SendTokitchen"),
        cancelButtonText: this.translate.instant("Shared.Cancel")
      }).then((result) => {
        if (result.isConfirmed) {
          this.swalCallCenterOrderSendToKitchenConfirmation(order)
        }
      });
    }
    else
      this.swalCallCenterOrderSendToKitchenConfirmation(order)
    
  }
  swalCallCenterOrderSendToKitchenConfirmation(order: OrderModel){
    try{
      if (
        order?.IsSuspended == false &&
        order?.IsScheduled == true &&
        order?.IsMobileOrder &&
        order?.IntegrationSystem == 0
      ) {
        order.IsSuspended = true;
        this.orderSer.updateMobileOrderAsync(order).subscribe((res) => {
          if (res) {
            this.toastr.success(this.toastrMessage.GlobalMessages(res));
          }
        });
        this.hideOrdersModelList();
        return;
      }
      if (order?.Reservation == true && order?.IsMobileOrder == true) {
        order.IsCustomerOrder = true;
        this.UpdateMobileOrderRejectedStatus(order?.ReferenceCode, 15, null);
      }
      this.sendClickedFromCallCenter(order);
      if (order?.IsMobileOrder) {
        this.mobileOrdersCount = this.mobileOrdersCount && this.mobileOrdersCount > 0 ? this.mobileOrdersCount - 1 : 0;
        this.hideOrdersModelList();
      }
    this.GetMobileOrdersCount();
    }
    catch(err){
      // this.stopReceivingOrdersFromCallCenterAutomatically = true;
      if(err?.error)
        this.toastr?.error(err.error + err?.error?.Message);
    }
  }

  acceptIntegrationOrder(index, orderDetailCollapse: HTMLDivElement) {
    const order: OrderModel = this.allYemekOrders[index];

    const productNotExist = order.OrderDetails.find((x) => !x.ProductDocumentId);
    if (productNotExist) {
      this.toastr.info(this.translate.instant("messages.SelectProductFirst"));
      if (orderDetailCollapse) {
        orderDetailCollapse.classList.toggle("show");
      }
      return false;
    }

    // Check payment matching only for Getir yemek
    if (order.IntegrationSystem == 2) {
      const hasOrderPayments = order.OrderPayments && order.OrderPayments.length > 0;
      if (!hasOrderPayments) {
        // We have payment matches only for Getir Integration for now.
        const integrationSystem = this.integrationSettings.find((is) => is.Integration == 2);

        if (integrationSystem) {
          return this.showMatchPaymentsDialog(integrationSystem.DocumentId);
        }
      }
    }

    Swal.fire({
      title: this.translate.instant("messages.Wouldyouliketoacceptthisorder"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it?"
    })
      .then((result) => {
        if (result.isConfirmed) {
          const order = this.allYemekOrders[index];

          return this.changeIntegrationOrderStatus(1, order.ReferenceCode, "", order);
        } else {
          return Promise.resolve(false);
        }
      })
      .then((changeResult: boolean) => {
        if (!changeResult) return Promise.resolve(false);

        const order = this.allYemekOrders[index];
        // return Promise.resolve(true);
        // After updating status we directly send to kitchen
        if (order.IsScheduled) {
          return Promise.resolve(true);
        }

        return this.sendToKitchen(index);
      })
      .then((sendToKitchenResult: boolean) => {
        if (sendToKitchenResult == true) {
          this.GetYemekSepetiOrders();
        }
      });
  }

  /**
   * This method calculate integration order prices and sends to kitchen
   */
  async sendToKitchen(index: number, reloadOrders = false) {
    if (this.requestStarted == true) return;

    let order = this.allYemekOrders[index];

    if (!order.IsSendToKitchen) {
      order.DocumentId = null;
      order.IsSendToKitchen = true;
    }
    // return true;

    order = this.mapOrderToOrderObject(order);

    if (!order.Paid) order.Paid = false;
    if (!this.validateOrder(order)) {
      return false;
    }
    if (!this.validatePayment(order)) {
      return false;
    }
    if (order.OrderType && order.OrderType.UseCard && !order.CardNumber) {
      this.openCardModel();
      return false;
    }

    this.requestStarted = true;
    if ((order.settings?.UseDailyStock || order.settings?.UseStocksAndPurchase) 
      && !(await this.checkAvailableQuantityBeforeSave(order))) {
      this.requestStarted = false;
      return false;
    }

    await this.closeAsync(order, this.checkIsOnlinePay(this.pointOfSale, order));
    this.requestStarted = false;

    if (reloadOrders) this.GetYemekSepetiOrders();

    return true;
  }

  closeYemekPopUp() {
    if (this.allYemekOrders && this.allYemekOrders.length > 0)
      this.allYemekOrders.forEach((o) => (o.IsCollapsed = false));
    $("#modal-YemekSepeti").modal("hide");
  }

  collapseIndex(order) {
    if (order.IsCollapsed) order.IsCollapsed = false;
    else {
      order.OrderDetails?.forEach((d) => {
        d.SelectedDocumentId = d.ProductDocumentId;
      });
      order.IsCollapsed = true;
    }
  }

  updateIntegrationProduct(detail, order) {
    if (detail.SelectedDocumentId) {
      var model = {
        ProductDocumentId: detail.SelectedDocumentId,
        ReferenceCode: detail.DocumentSerial,
        Integration: order.IntegrationSystem
      };
      this.orderSer.updateIntegrationProduct(model).subscribe((res) => {
        this.toastr.success(this.toastrMessage.GlobalMessages(1));
        detail.Product = this.allproductlist.filter((x) => x.DocumentId == detail.SelectedDocumentId)[0];
        detail.ProductDocumentId = detail.SelectedDocumentId;
        detail.ProductGroupDocumentId = detail.Product?.ProductGroupDocumentId;
        detail.ProductGroupId = detail.Product?.ProductGroupId;

        order = this.mapOrderToOrderObject(order);
        order.AddressDescription = order.CustomerAddress?.Description;
        order.Time = this.datepipe.transform(new Date(order.CreationTime), "yyyy-MM-dd HH:mm a");

        // this.closeYemekPopUp();
      });
    } else {
      this.toastr.info(this.translate.instant("messages.SelectProductFirst"));
    }
  }

  selectAllTrendyolDetails() {
    let checked = this.selectAllTrendyolDetail ? false : true;
    this.trendyolOrder.OrderDetails.forEach((x) => (x.SelectedToCancel = checked));
  }

  rejectTrendyolOrder() {
    if (!this.trendyolOrder.OrderDetails.filter((d) => d.SelectedToCancel)[0]) {
      this.toastr.warning("Please select products to cancel!");
      return;
    }
    if (!this.trendyolOrder.CancelReasonId) {
      this.toastr.warning("Please select cancel reason!");
      return;
    }
    if (this.trendyolOrder) {
      let order = this.allYemekOrders.filter((o) => o.ReferenceCode == this.trendyolOrder.ReferenceCode)[0];
      let cancellationReason = this.IntegrationCancellationReasons.filter(
        (c) => c.Id == this.trendyolOrder.CancelReasonId
      )[0];
      var Products = this.trendyolOrder.OrderDetails.filter((d) => d.SelectedToCancel).map((x) => x.Product);
      cancellationReason.ItemIdList = Products.map((x) => x.DocumentId);
      this.changeIntegrationOrderStatus(2, this.trendyolOrder.ReferenceCode, cancellationReason, order);
      $("#modal-TrendyolcancellationReason").modal("hide");
    }
  }

  openYemekCancellationReason(rejectedReferenceCode: string) {
    this.rejectedReferenceCode = rejectedReferenceCode;
    let order = this.allYemekOrders.filter((o) => o.ReferenceCode == this.rejectedReferenceCode)[0];
    if (this.rejectedReferenceCode) {
      this.IntegrationCancellationReasons = [];
      if (order.IntegrationSystem == 2) {
        this.orderSer.getGetirYemekCancelOptions(this.rejectedReferenceCode).subscribe((res: any) => {
          if (res) {
            res.forEach((r) => {
              this.IntegrationCancellationReasons.push({
                Id: r.id,
                Name: r.message
              });
            });
            $("#modal-YemekcancellationReason").modal("show");
            this.closeYemekPopUp();
          }
        });
      } else if (order.IntegrationSystem == 3) {
        this.orderSer.getTrendyolCancelOptions().subscribe((res: any) => {
          if (res) {
            this.trendyolOrder = this.deepCopy(order);
            this.trendyolOrder.CancelReasonId = undefined;
            this.IntegrationCancellationReasons = this.deepCopy(res);
            $("#modal-TrendyolcancellationReason").modal("show");
            this.closeYemekPopUp();
          }
        });
      } else {
        this.IntegrationCancellationReasons = this.deepCopy(this.cancellationReasons);
        $("#modal-YemekcancellationReason").modal("show");
        this.closeYemekPopUp();
      }
    }
  }

  rejectYemekOrder(cancellationReason) {
    if (this.rejectedReferenceCode) {
      let order = this.allYemekOrders.filter((o) => o.ReferenceCode == this.rejectedReferenceCode)[0];
      this.changeIntegrationOrderStatus(2, this.rejectedReferenceCode, cancellationReason, order);
    }
    $("#modal-YemekcancellationReason").modal("hide");
    $("#modal-TrendyolcancellationReason").modal("hide");
  }

  getMobileIntegration(fromFirstOpen = false) {
    if (this.integrationSettings && this.integrationSettings.length > 0) {
      this.GetYemekSepetiOrders();
      this.interv = setInterval(() => {
        this.GetYemekSepetiOrders();
      }, 10000);
    }

    this.GetMobileOrdersCount(fromFirstOpen);
    if(!this.interv2){
      this.interv2 = setInterval(() => {
        this.GetMobileOrdersCount();
      }, 30000);
    }
   
  }

  //#endregion

  cancelCustomer(data) {
    this.orderobj = this.recalculateOrderObject(data, false);
  }

  //#region
  showInsurancesModal() {
    // if (!this.orderobj.CustomerDocumentId) {
    //   this.toastr.info(this.translate.instant("messages.MustSelectCustomer"), "Order");
    //   return false;
    // } else
    $("#modal-Insurances").modal("show");
  }

  SetOrderInsurance() {
    this.orderobj.OrderInsurance.CustomerName = this.orderobj.Customer.Name;
    this.orderobj.OrderInsurance.CustomerPhone = this.orderobj.Customer.Phone;
    this.orderobj.OrderInsurance.CustomerDocumentId = this.orderobj.Customer.DocumentId;
    // this.orderobj.OrderInsurance.Amount = this.orderobj.OrderInsurance.OrderInsuranceDetails.map(
    //   (x) => Number(x.Quantity) * Number(x.Price)
    // ).reduce((next, current) => next + current, 0);

    this.orderobj.OrderInsurance.Amount = this.orderobj.OrderInsurance.OrderInsuranceDetails.reduce(
      (total, x) => total + Number(x.Quantity) * Number(x.Price),
      0
    );

    if (this.PayTypeDocumentId) {
      let payType = this.orderPayTypelist.find((p) => p.DocumentId == this.PayTypeDocumentId);
      this.orderobj.OrderInsurance.PayTypeName = payType.Name;
      this.orderobj.OrderInsurance.PayTypeDocumentId = payType.DocumentId;
      this.orderobj.OrderInsurance.PayTypeId = payType.Id;
    }
    this.orderobj = this.recalculateOrderObject(this.orderobj);
  }

  addToInsuranceList(I: InsuranceModel, detail: OrderDetailModel) {
    // if (!this.orderobj.CustomerDocumentId) {
    //   this.toastr.info(this.translate.instant("messages.MustSelectCustomer"), "Order");
    //   return false;
    // } else {
    if(!this.PayTypeDocumentId && this.orderPayTypelist?.length){
      if (this.defaultSelectedPayType?.DocumentId)
        this.PayTypeDocumentId = this.defaultSelectedPayType?.DocumentId;
      else if(this.orderPayTypelist.length == 1) 
        this.PayTypeDocumentId = this.orderPayTypelist[0].DocumentId;
    } 
    if (this.PayTypeDocumentId) {
      if (
        !this.orderobj?.OrderInsurance?.OrderInsuranceDetails ||
        this.orderobj?.OrderInsurance?.OrderInsuranceDetails.length == 0
      ) {
        this.orderobj.OrderInsurance = {};
        this.orderobj.OrderInsurance.OrderInsuranceDetails = [];
      }
      let exist = this.orderobj.OrderInsurance.OrderInsuranceDetails.find(
        (x) => x.InsuranceDocumentId == I.DocumentId && x.ProductDocumentId == detail.Product?.DocumentId
      );
      if (!exist) {
        this.orderobj.OrderInsurance.OrderInsuranceDetails.push({
          InsuranceDocumentId: I.DocumentId,
          InsuranceId: I.Id,
          InsuranceName: I.Name,
          Price: I.Price,
          Quantity: 1,
          ProductDocumentId: detail.Product?.DocumentId,
          ProductId: detail.Product?.Id,
          ProductName: detail.Product?.Name
        });
      } else {
        let index = this.orderobj.OrderInsurance.OrderInsuranceDetails.indexOf(exist);
        this.orderobj.OrderInsurance.OrderInsuranceDetails[index].Quantity += 1;
      }
      this.SetOrderInsurance();
    } else this.toastr.info(this.translate.instant("messages.SelectPayType"));
    // }
  }

  deleteInsurance(inedx) {
    this.orderobj.OrderInsurance.OrderInsuranceDetails.splice(inedx, 1);
    this.SetOrderInsurance();
  }

  PlusInsuranceItems(inedx) {
    if (this.orderobj.OrderInsurance.OrderInsuranceDetails[inedx]) {
      this.orderobj.OrderInsurance.OrderInsuranceDetails[inedx].Quantity =
        Number(this.orderobj.OrderInsurance.OrderInsuranceDetails[inedx].Quantity) + 1;
      this.SetOrderInsurance();
    }
  }

  MinusInsuranceItems(inedx) {
    if (
      this.orderobj.OrderInsurance.OrderInsuranceDetails[inedx] &&
      this.orderobj.OrderInsurance.OrderInsuranceDetails[inedx].Quantity > 1
    ) {
      this.orderobj.OrderInsurance.OrderInsuranceDetails[inedx].Quantity =
        Number(this.orderobj.OrderInsurance.OrderInsuranceDetails[inedx].Quantity) - 1;
      this.SetOrderInsurance();
    }
  }

  calculateTotalInsuranceAmount() {
    //   if(this._orderobj?.OrderInsuranceItems && this._orderobj?.OrderInsuranceItems?.length > 0){
    //     this._orderobj.TotalInsuranceAmount = this._orderobj.OrderInsuranceItems.map(x=>Number(x.Quantity) * Number(x.Price)).reduce((next, current) => next + current, 0);
    //     // this.calculateRemainingAmount(this._orderobj);
    //  }
    if (this.orderobj?.OrderInsuranceItems?.length > 0) {
      this.orderobj.TotalInsuranceAmount = this.orderobj.OrderInsuranceItems.reduce(
        (total, x) => total + Number(x.Quantity) * Number(x.Price),
        0
      );
      // this.calculateRemainingAmount(this.orderobj);
    }

    this.orderobj = this.recalculateOrderObject(this.orderobj);
  }

  searchInsurance(SearchInsurance: string) {
    this.insurancelist = this.cloneList(
      this.allinsurancelist.filter((x) => x.Name.toLowerCase().includes(SearchInsurance.toLowerCase()))
    );
  }

  //#endregion

  onProductRightClick(event, product: ProductModel) {
    event.preventDefault();
    let productProperties = this.productsProperties.filter(
      (x) =>
        (product.Id && x.ProductId == product.Id) || (product.DocumentId && x.ProductDocumentId == product.DocumentId)
    )[0];
    if (productProperties) this.productToStop = productProperties;
    else {
      this.productToStop = {
        Name: product.Name,
        ProductDocumentId: product.DocumentId,
        ProductId: product.Id
      };
    }
    event.preventDefault();
    setTimeout(() => {
      $("#modal-StopProduct").modal("show");
    }, 20);
  }

  StopProduct(productToStop) {
    this.orderSer.stopProductForAwhile(productToStop).subscribe((res) => {
      this.toastr.success(this.toastrMessage.GlobalMessages(res));

      this.orderSer.getAllProductProperties().subscribe((res: any) => {
        if (res && res.length > 0) this.productsProperties = res;
        $("#modal-StopProduct").modal("hide");
      });
    });
  }

  checkIsProductTempStopped(product) {
    let productProperties = this.productsProperties.filter(
      (x) =>
        (product.Id && x.ProductId == product.Id) || (product.DocumentId && x.ProductDocumentId == product.DocumentId)
    )[0];
    let stoppedDate = new Date(productProperties?.StopeDate);
    if (
      productProperties &&
      productProperties.IsTempStop &&
      stoppedDate instanceof Date &&
      !isNaN(stoppedDate.valueOf()) &&
      productProperties.StopDurationType &&
      productProperties.StopDuration
    ) {
      let currentDate = new Date();
      if (productProperties.StopDurationType == "1") {
        let difMinutes = (currentDate.getTime() - stoppedDate.getTime()) / (1000 * 60);
        if (difMinutes < Number(productProperties.StopDuration)) {
          this.toastr.info(
            this.translate.instant("messages.StopProduct") +
              Math.ceil(Number(productProperties.StopDuration) - difMinutes) +
              " " +
              this.translate.instant("Shared.Minutes")
          );
          return true;
        } else {
          productProperties.IsTempStop = false;
          this.StopProduct(productProperties);
        }
      } else if (productProperties.StopDurationType == "2") {
        let difHouers = (currentDate.getTime() - stoppedDate.getTime()) / (1000 * 60 * 60);
        if (difHouers < Number(productProperties.StopDuration)) {
          this.toastr.info(
            this.translate.instant("messages.StopProduct") +
              Math.ceil(Number(productProperties.StopDuration) - difHouers) +
              " " +
              this.translate.instant("setting.Hours")
          );
          return true;
        } else {
          productProperties.IsTempStop = false;
          this.StopProduct(productProperties);
        }
      } else if (productProperties.StopDurationType == "3") {
        let difDays = (currentDate.getTime() - stoppedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (difDays < Number(productProperties.StopDuration)) {
          this.toastr.info(
            this.translate.instant("messages.StopProduct") +
              Math.ceil(Number(productProperties.StopDuration) - difDays) +
              " " +
              this.translate.instant("setting.Days")
          );
          return true;
        } else {
          productProperties.IsTempStop = false;
          this.StopProduct(productProperties);
        }
      }
    }
    return false;
  }

  //#region Call center
  oldCallCenterOrders: number = 0;

  GetBranchCallCenterOrders() {
    this.orderSer.GetBranchCallCenterOrders().subscribe((res) => {
      this.CallCenterOrders = res as any[];
      if (this.CallCenterOrders?.length > this.oldCallCenterOrders) {
        this.alertSound.play();
      }
      this.oldCallCenterOrders = this.CallCenterOrders?.length;
      this.continueHandleCallCenterOrders();
      if(!this.pointOfSale?.ReceiveAutomaticCallCenter) $("#modal-CallCenterOrders").modal("show");
    });
  }

  newCallCenterOrders: number = 0;

  GetBranchCallCenterOrdersFromOnlineOrderCallCenter() {
    this.BranchDocumentId = this.pointOfSaleD.BranchDocumentId;
    if (this.BranchDocumentId && !this.getGetBranchCallCenterOrdersStarted) {
      this.getGetBranchCallCenterOrdersStarted = true;
      this.orderSer.GetBranchCallCenterOrdersFromOnlineOrderCallCenter(this.BranchDocumentId).subscribe((res) => {
        this.CallCenterOrders = res as unknown as any[];
        if (this.CallCenterOrders?.length > this.newCallCenterOrders && !this.pointOfSale?.ReceiveAutomaticCallCenter) {
          this.alertSound?.play();
        }
        this.newCallCenterOrders = this.CallCenterOrders?.length;
        this.CallCenterOrders?.forEach((o) => {
          o.OrderDetails?.forEach((d) => {
            d.Product = this.assignProductPrice(d?.Product, o, this.pointOfSale, d);
          });

          const orderType = this.ordertypelist?.find((x) => x.DocumentId == o.OrderTypeDocumentId);
          if (orderType){
            this.setOrderType(orderType,false);
          } 
          o = this.mapOrderToOrderObject(o);

          o.Time = this.datepipe.transform(new Date(o.CreationTime), "yyyy-MM-dd HH:mm a");
          o.AddressDescription = o.CustomerAddress?.Description;
          o.ReferenceCode = o.DocumentId;
          o.ReferenceId = o.OrderNumber;
          o.DocumentId = "";
          o.User = undefined;
          o.OrderNumber = undefined;
          if (o.IsCallCenter) o.IntegrationName = "Call Center";
          else if (o.IsMobileOrder) o.IntegrationName = "Mobile";
        });
        this.filteredCallCenterOrders = this.cloneList(this.CallCenterOrders);
        // const editOnOrder = this.filteredCallCenterOrders.find(oldOrder => oldOrder.Id && oldOrder.UpdatedNewDetails === true);
        // if(!editOnOrder  && !this.orderobj?.OrderDetails?.length && this.filteredCallCenterOrders?.length && this.pointOfSale?.ReceiveAutomaticCallCenter){
        this.getGetBranchCallCenterOrdersStarted = false;
        if(this.filteredCallCenterOrders?.length && this.pointOfSale?.ReceiveAutomaticCallCenter){
          this.filteredCallCenterOrders?.forEach(callOrder => {
            this.acceptCallCenterOrder(callOrder)
          }); 
        }
        else if(!this.pointOfSale?.ReceiveAutomaticCallCenter){
          // this.stopReceivingOrdersFromCallCenterAutomatically = true;
          $("#modal-CallCenterOrders").modal("show");
        }
      },error=>{
        this.getGetBranchCallCenterOrdersStarted = false;
      });
    }
  }

  UpdateCallCenterOrderStatus(ReferenceCode: string, status: number, cancellationReason: string) {
    let m = this.CallCenterOrders.filter((x) => x.ReferenceCode == ReferenceCode)[0];
    if (m) {
      m.Status = status;
      if (cancellationReason) m.NoteForOrder = cancellationReason;
      this.orderSer.UpdateCallCenterOrderStatus(m).subscribe((res) => {
        this.hideOrdersModelList();
        this.toastr.success(this.toastrMessage.GlobalMessages(3), "Order");
      });
    }
  }

  UpdateMobileOrderRejectedStatus(ReferenceCode: string, status: number, cancellationReason: string) {
    let m = this.mobileOrders.filter((x) => x.ReferenceCode == ReferenceCode)[0];
    if (m) {
      m.Status = status;
      if (cancellationReason) m.NoteForOrder = cancellationReason;
      this.orderSer.UpdateCallCenterOrderStatus(m).subscribe((res) => {
        this.hideOrdersModelList();
        this.toastr.success(this.toastrMessage.GlobalMessages(3), "Order");
        this.mobileOrdersCount = this.mobileOrdersCount && this.mobileOrdersCount > 0 ? this.mobileOrdersCount - 1 : 0;
      });
    }
  }

  rejectCallCenterOrder(ReferenceCode: string, order: OrderModel = new OrderModel()) {
    this.hideOrdersModelList();

    Swal.fire({
      title: this.translate.instant("messages.Warning") + "!",
      text: this.translate.instant("messages.Wouldyouliketorejectthisorder"),
      input: "text",
      inputPlaceholder: this.translate.instant("Reports.CancellationReason"),
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("Shared.Cancel"),
      confirmButtonText: this.translate.instant("Shared.Yes?")
    }).then((result) => {
      if (result.isConfirmed && order.UpdatedNewDetails === true) {
        this.UpdateCallCenterOrderStatus(ReferenceCode, 13, result.value);
      }
      if (result.isConfirmed && order.UpdatedNewDetails === false) {
        this.UpdateCallCenterOrderStatus(ReferenceCode, 9, result.value);
      }
    });
  }

  GetAllCallCenterOrders() {
    this.orderSer.GetAllCallCenterOrders().subscribe((res) => {
      this.CallCenterOrders = res as any[];
      this.continueHandleCallCenterOrders();
      if(!this.pointOfSale?.ReceiveAutomaticCallCenter) $("#modal-CallCenterOrders").modal("show");
    });
  }

  continueHandleCallCenterOrders() {
    this.CallCenterOrders.forEach((o) => {
      o = this.mapOrderToOrderObject(o);
      o.Time = this.datepipe.transform(new Date(o.CreationTime), "yyyy-MM-dd HH:mm a");
      o.AddressDescription = o.CustomerAddress?.Description;
      o.ReferenceCode = o.DocumentId;
      o.ReferenceId = o.OrderNumber;
      o.DocumentId = "";
      o.User = undefined;
      o.OrderNumber = undefined;
      if (o.IsCallCenter) o.IntegrationName = "Call Center";
      else if (o.IsMobileOrder) o.IntegrationName = "Mobile";
    });
    this.filteredCallCenterOrders = this.cloneList(this.CallCenterOrders);
  }

  //#endregion
  openNotPrintedOrders() {
    this.orderSer.GetNotPrintedOrders().subscribe((res) => {
      this.notPrintedOrders = res;
      this.notPrintedOrders.forEach((o) => {
        o = this.mapOrderToOrderObject(o);
        o.Time = this.datepipe.transform(new Date(o.CreationTime), "yyyy-MM-dd HH:mm a");
        o.AddressDescription = o.CustomerAddress?.Description;
      });
      this.filteredNotPrintedOrders = this.cloneList(this.notPrintedOrders);
      $("#modal-NotPrintedOrders").modal("show");
    });
  }

  // #region newSideDish
  async openNewSideDish(product, isNew: boolean) {
    // Get combo product
    let comboProduct = this.comboProducts.filter((c) => c.ProductDocumentId == product.DocumentId)[0];

    // Open combo dialog
    if (product.IsCombo && comboProduct) {
      this.openNewComboProductsModel(comboProduct, isNew);
      return;
    }

    if (!product || !product.ProductSubItems || product.ProductSubItems.length == 0) {
      // Product not found cancel opening modal
      return;
    }

    this.productWithSub = this.deepCopy(product);

    // set images for subitems
    if (this.productWithSub.ProductSubItems && this.productWithSub.ProductSubItems.length) {
      this.productWithSub.ProductSubItems.forEach((s) => {
        let product = this.deepCopy(
          this.allproductlist.find(
            (p) => (s.SubItemId && p.Id == s.SubItemId) || (s.SubItemDocumentId && p.DocumentId == s.SubItemDocumentId)
          )
        );
        if (product) {
          s.PicturePath = product.PicturePath;
          s.Name = product.Name;
          s.ForeignName = product.ForiegnName;
          s.SubItemDocumentId = product.DocumentId;
        }
      });
    }

    this.productWithSub.isNew = isNew;

    // Patch values to view if it is not new
    if (!isNew && (this.indexItem || this.indexItem == 0)) {
      this.productWithSub.OrderDetailSubItems = this.deepCopy(
        this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems
      );
      if (this.productWithSub.OrderDetailSubItems && this.productWithSub.OrderDetailSubItems.length) {
        this.productWithSub.OrderDetailSubItems.forEach((s) => {
          let ps = this.productWithSub.ProductSubItems.find(
            (p) =>
              (s.ProductSubItemId && p.SubItemId == s.ProductSubItemId) ||
              (s.ProductSubItemDocumentId && p.SubItemDocumentId == s.ProductSubItemDocumentId)
          );
          if (ps) ps.SideChecked = true;
        });
      }
    }
    else if(isNew && this.productWithSub.ProductSubItems.some(x=> x.IsMandatory)){
      this.productWithSub.ProductSubItems.forEach((s ,i) => {
        if(s.IsMandatory) this.newSideDishesChecked(true, s, i);
      });
    }

   await $("#modal-NewSideDishes").modal("show");
  }

  getSideNames() {
    if (
      this.productWithSub &&
      this.productWithSub.OrderDetailSubItems &&
      this.productWithSub.OrderDetailSubItems.length
    ) {
      let names = "(";
      let index = 0;
      this.productWithSub.OrderDetailSubItems.forEach((s) => {
        names += s.Name ? this.getTypeName(s) + " -" : s.ProductSubItemName + " -";
        index = this.productWithSub.OrderDetailSubItems.indexOf(s);
        // s.ProductSubItemName ? this.newSideDishesChecked(true,s, index) : '';
      });
      names += ")";
      return names;
    }

    return "";
  }

  newSideDishesChecked(value: boolean, productsubitem: ProductSubItemModel, i) {
    productsubitem.SideChecked = value;

    if (!this.productWithSub.OrderDetailSubItems) this.productWithSub.OrderDetailSubItems = [];

    let index = this.productWithSub.OrderDetailSubItems.findIndex(
      (p) =>
        (productsubitem.SubItemId && p.ProductSubItemId === productsubitem.SubItemId) ||
        (productsubitem.SubItemDocumentId && p.ProductSubItemDocumentId === productsubitem.SubItemDocumentId)
    );

    if (!productsubitem.SideChecked && index != -1) {
      // productsubitem.SideChecked = false;
      this.productWithSub.OrderDetailSubItems.splice(index, 1);
    } else if(productsubitem.SideChecked) {
      // productsubitem.SideChecked = true;
      if (
        this.checkNumberOfNewSideDishesAllowed(
          this.productWithSub,
          this.productWithSub.OrderDetailSubItems.reduce((acc, cur) => acc + Number(cur.SingleQuantity), 0)
        )
      ) {
        let orderdetailsubitemobj = new OrderDetailSubItemModel();

        orderdetailsubitemobj.ProductSubItemId = productsubitem.SubItemId;
        if (!productsubitem.SubItemDocumentId && productsubitem.SubItemId > 0) {
          productsubitem.SubItemDocumentId = this.allproductlist.filter(
            (x) => x.Id == productsubitem.SubItemId
          )[0]?.DocumentId;
        }
        orderdetailsubitemobj.ProductSubItemDocumentId = productsubitem.SubItemDocumentId;
        orderdetailsubitemobj.ProductSubItemName =this.getName(productsubitem);
        orderdetailsubitemobj.Name = productsubitem.Name;
        orderdetailsubitemobj.ForeignName = productsubitem.ForeignName;
        orderdetailsubitemobj.Price = productsubitem.NewPrice;
        orderdetailsubitemobj.SingleQuantity = 1;
        orderdetailsubitemobj.IsMandatory = productsubitem.IsMandatory;
        orderdetailsubitemobj.Total = orderdetailsubitemobj.Price;

        this.productWithSub.OrderDetailSubItems.push(orderdetailsubitemobj);
      } else {
        if (i != -1) {
          this.productWithSub.ProductSubItems[i].SideChecked = false;
        }
      }
    }
  }

  getSideQuantity(PSI: ProductSubItemModel) {
    if (
      PSI.SideChecked &&
      this.productWithSub &&
      this.productWithSub.OrderDetailSubItems &&
      this.productWithSub.OrderDetailSubItems.length
    ) {
      let exist = this.productWithSub.OrderDetailSubItems.find(
        (x) =>
          (PSI.SubItemDocumentId && x.ProductSubItemDocumentId == PSI.SubItemDocumentId) ||
          (PSI.SubItemId && x.ProductSubItemId == PSI.SubItemId)
      );

      return exist ? exist.SingleQuantity : 0;
    } else return 0;
  }

  plusOrMinusNewSideDishes(PSI: ProductSubItemModel, isPlus: boolean, index: number) {
    if (!this.productWithSub.OrderDetailSubItems) {
      this.productWithSub.OrderDetailSubItems = [];
    }

    let orderdetailsubitem = this.productWithSub.OrderDetailSubItems.find(
      (x) =>
        (PSI.SubItemDocumentId && x.ProductSubItemDocumentId == PSI.SubItemDocumentId) ||
        (PSI.SubItemId && x.ProductSubItemId == PSI.SubItemId)
    );

    // If we cant find orderdetailsubitem we should mark checked first
    if (!orderdetailsubitem && isPlus) {
      this.newSideDishesChecked(true, PSI, index);
      // After checked there is no need to continue because we already added 1 to singlequantity
      return;
    }

    // If order subitem doesnt exist and user want to decrease the quantity we dont do any thing further
    if (!orderdetailsubitem && !isPlus) {
      return;
    }

    if (isPlus) {
      if (
        this.checkNumberOfNewSideDishesAllowed(
          this.productWithSub,
          this.productWithSub.OrderDetailSubItems.reduce((acc, cur) => acc + Number(cur.SingleQuantity), 0)
        )
      ) {
        // If order detail subitem exist but user clicked on another element
        // then it checks the new item clicked only
        if (!PSI.SideChecked) PSI.SideChecked = true;
        if (orderdetailsubitem.Total && orderdetailsubitem.SingleQuantity)
          orderdetailsubitem.Total =
            orderdetailsubitem.Total + orderdetailsubitem.Total / orderdetailsubitem.SingleQuantity;
        orderdetailsubitem.SingleQuantity += 1;
      }
    } else if (!isPlus && orderdetailsubitem.SingleQuantity > 1) {
      if (orderdetailsubitem.Total)
        orderdetailsubitem.Total =
          orderdetailsubitem.Total - orderdetailsubitem.Total / orderdetailsubitem.SingleQuantity;
      orderdetailsubitem.SingleQuantity -= 1;
    } else if (!isPlus && orderdetailsubitem.SingleQuantity == 1) {
      //if mandatory subitem dont remove it
      if(orderdetailsubitem.IsMandatory) return;

      // deletedItem refers to the index of the item selected only because we're deleting an object from array of objects
      // the object is orderdetailsubitem and the array contains it is this.productWithSub.OrderDetailSubItems
      // index received as an argument in the function, doesn't refer to the index of this object inside this array
      // instead it refers to the index of element itself in another array which causes the error
      // so we created local variable (deletedItem) to get the index of the selected item and remove the correct one without
      // affecting any other items
      let deletedItem =
        orderdetailsubitem.ProductSubItemId === PSI.SubItemId
          ? this.productWithSub.OrderDetailSubItems.indexOf(orderdetailsubitem)
          : "";
      this.productWithSub.OrderDetailSubItems.splice(deletedItem, 1);
      PSI.SideChecked = false;
    }
  }

  checkNumberOfNewSideDishesAllowed(product, quantity) {
    if (product) {
      if (product.NumberOfSideDishesAllowed && product.NumberOfSideDishesAllowed <= quantity) {
        this.toastr.warning(this.translate.instant("Shared.maxAllowedSideDishIs") + product.NumberOfSideDishesAllowed);
        return false;
      }
      else return true;
    }
    return true;
  }

  closeNewSideDish() {
    this.productWithSub = {};
    $("#modal-NewSideDishes").modal("hide");

    const detalWithCustomPromo = this.orderobj.OrderDetails[this.orderobj.OrderDetails.length - 1];
    // const detalWithCustomPromo = this.orderobj.OrderDetails.find((d) =>
    //   // d.EditingSelected == true &&
    //   d.Product?.Promos.find(
    //     (p) => p.ValueType == 3 && p?.OrderTypesList?.includes(this.orderobj?.OrderType?.DocumentId)
    //   )
    // );
    if (detalWithCustomPromo && detalWithCustomPromo.Product && this.orderobj && this.orderobj.OrderType.IsPromo) {
      this.handelCustomPromo(detalWithCustomPromo.Product, detalWithCustomPromo, this.orderobj);
    }
  }
  checkMinNumberOfSideDishesAllowed(product, quantity) {
    if(product?.MinNumberOfSideDishesAllowed && product?.MinNumberOfSideDishesAllowed > (quantity ?? 0)){
      this.toastr.warning(this.translate.instant("Shared.minAllowedSideDishIs") + product.MinNumberOfSideDishesAllowed);
      return false;
    }
    return true;
  }

  setSideDishesForFetail() {
    if(!this.checkMinNumberOfSideDishesAllowed(this.productWithSub , 
      this.productWithSub?.OrderDetailSubItems?.reduce((acc, cur) => acc + Number(cur.SingleQuantity), 0))) return;
    
    if (!this.productWithSub.isNew && (this.indexItem || this.indexItem == 0)) {
      //here we check if there is sub item deleted to delete it's tax from detail taxes
      let SubItemDocumentId = this.productWithSub.OrderDetailSubItems?.map((x) => x.ProductSubItemDocumentId);
      // let ProductDocumentId=this.orderobj.OrderDetails[this.indexItem].OrderDetailTaxes.map(x=> x.ProductDocumentId);
      if(SubItemDocumentId) SubItemDocumentId.push(this.productWithSub.DocumentId);
      // let found: any;
      let found = this.orderobj.OrderDetails[this.indexItem]?.OrderDetailTaxes?.filter(
        (x) => SubItemDocumentId && !SubItemDocumentId.some((s) => x.ProductDocumentId === s)
      );
      if(found){
        found.forEach((f) => {
          this.orderobj.OrderDetails[this.indexItem]?.OrderDetailTaxes.splice(
            this.orderobj.OrderDetails[this.indexItem]?.OrderDetailTaxes.indexOf(f),
            1
          );
        });
      }

      this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems = this.deepCopy(
        this.productWithSub.OrderDetailSubItems
      );

      this.orderobj.OrderDetails[this.indexItem].SideDishesValue = 0;
      if (
        this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems &&
        this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems.length
      ) {
        this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems.forEach((obj) => {
          this.orderobj.OrderDetails[this.indexItem].SideDishesValue += obj.Total;
        });
      }
      this.addLiStyle(this.orderobj.OrderDetails[this.indexItem]);
    } else {
      let orderdetail = new OrderDetailModel();
      orderdetail.OrderDetailSubItems = [];
      // if producwithsubitem is volume don't assign new price we leave it with it's own price assigned from firstopen
      if (!this.productWithSub.IsVolume) {
        let nProduct = this.allproductlist.find(
          (x) =>
            (this.productWithSub.Id && x.Id == this.productWithSub.Id) || x.DocumentId == this.productWithSub.DocumentId
        );
        orderdetail.Product = this.deepCopy(nProduct);
        orderdetail.ProductGroupId = nProduct.ProductGroupId;
        orderdetail.ProductGroupDocumentId = nProduct.ProductGroupDocumentId;
        orderdetail.ProductGroupName = nProduct.ProductGroupName;
      } else {
        orderdetail.Product = this.deepCopy(this.productWithSub);
        orderdetail.ProductGroupId = this.productWithSub.ProductGroupId;
        orderdetail.ProductGroupDocumentId = this.productWithSub.ProductGroupDocumentId;
        orderdetail.ProductGroupName = this.productWithSub.ProductGroupName;
      }

      orderdetail.ProductId = this.productWithSub.Id;
      orderdetail.ProductDocumentId = this.productWithSub.DocumentId;
      orderdetail.ProductPrice = this.productWithSub.Price;
      orderdetail.ProductName = this.productWithSub.Name;
      if (this.settingobj.ShowVolumeAsProduct == true) {
        orderdetail.ProductVolumName = this.productWithSub.ProductVolumeName;
        orderdetail.VolumeDocumentId = this.productWithSub.VolumeDocumentId;
        orderdetail.VolumeId = this.productWithSub.VolumeId;
      }
      orderdetail.OrderDetailPromo = [];
      orderdetail.ProductQuantity = 1;

      if (this.productWithSub.OrderDetailSubItems && this.productWithSub.OrderDetailSubItems.length)
        orderdetail.OrderDetailSubItems = this.deepCopy(this.productWithSub.OrderDetailSubItems);
      if (orderdetail.OrderDetailSubItems && orderdetail.OrderDetailSubItems.length) {
        if (!orderdetail.SideDishesValue) orderdetail.SideDishesValue = 0;

        orderdetail.OrderDetailSubItems.forEach((obj) => {
          orderdetail.SideDishesValue = orderdetail.SideDishesValue + obj.Total;
        });
      }

      if (!orderdetail.ProductIndex && orderdetail.ProductIndex != 0)
        orderdetail.ProductIndex = this.orderobj.OrderDetails.length;

      this.orderobj.OrderDetails.push(orderdetail);
      this.addLiStyle(orderdetail);
    }

    this.closeNewSideDish();
    this.orderobj = this.recalculateOrderObject(this.orderobj);
  }

  //#endregion
  //#region ComboProducts
  async openNewComboProductsModel(comboProduct, isNew: boolean) {
    this.comboProduct = this.deepCopy(comboProduct);
    this.comboProduct.isNew = isNew;
    // hide combo product if MandatoryLoadingOfSideDishes checked
    if (this.comboProduct.MandatoryLoadingOfSideDishes) {
      if (isNew) {
        this.loadingOfSideDishes();
      }
    } else {
      this.comboProduct.ComboDetails.forEach((cd) => {
        cd.ComboDetailDetails.forEach((side) => (side.Quantity = 0));
      });
      if (!this.noteslist || !this.noteslist.length) await this.getAllNotes(null);
      if (!isNew && (this.indexItem || this.indexItem == 0)) {
        this.comboProduct.OrderDetailSubItems = this.deepCopy(
          this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems
        );
        if (this.comboProduct.OrderDetailSubItems && this.comboProduct.OrderDetailSubItems.length) {
          this.comboProduct.OrderDetailSubItems.forEach((s) => {
            this.comboProduct.ComboDetails.forEach((cd, levelIndex) => {
              if (cd.Type == 1 && s.levelIndex == levelIndex) {
                let ps = cd.ComboDetailDetails.find(
                  (p) => s.ProductSubItemDocumentId && p.DetailDocumntId == s.ProductSubItemDocumentId
                );
                if (ps) {
                  ps.Quantity = s.SingleQuantity;
                  if (ps.Quantity) ps.Selected = true;
                }
              }
            });
          });
        }

        this.comboProduct.OrderDetailNotes = this.deepCopy(this.orderobj.OrderDetails[this.indexItem].OrderDetailNotes);
        if (this.comboProduct.OrderDetailNotes && this.comboProduct.OrderDetailNotes.length) {
          this.comboProduct.OrderDetailNotes.forEach((s) => {
            this.comboProduct.ComboDetails.forEach((cd) => {
              if (cd.Type == 2) {
                let ps = cd.ComboDetailDetails.find((p) => s.NoteDocumentId && p.DetailDocumntId == s.NoteDocumentId);
                if (ps) ps.Selected = true;
              }
            });
          });
        }
      }
      this.comboProduct.ComboDetails[0].isOpen = true;
      $("#modal-ComboProducts").modal("show");
    }
  }

  loadingOfSideDishes() {
    this.comboProduct.ComboDetails.filter((c) => c.Type == 1).forEach((level) => {
      level.ComboDetailDetails.forEach((detail, i: number) => {
        detail.Quantity = Number(detail.Quantity) - 1;
        if (detail.Quantity < 0) detail.Quantity = 0;
        this.selectComboDetail(level, i);
      });
    });
    this.saveComboDetail(true);
  }

  saveComboDetail(isSave: boolean) {
    if (isSave) {
      if (this.comboProduct.ComboDetails && this.comboProduct.ComboDetails.length) {
        this.comboProduct.ComboDetails.forEach(function (ComboDetail, detailIndex) {
          if (ComboDetail && ComboDetail.ComboDetailDetails && ComboDetail.ComboDetailDetails.length) {
            ComboDetail.ComboDetailDetails.forEach(function (ComboDetailDetail, detailDetailIndex) {
              if (ComboDetail.Type == 1) {
                this.newSideDishesFromComboDetail(ComboDetailDetail, detailIndex, detailDetailIndex);
              } else if (ComboDetail.Type == 2) {
                this.newNoteFromComboDetail(ComboDetailDetail);
              }
            }, this);
          }
        }, this);
      }
      this.setComboOrderDetail();
    }
    this.comboProduct = undefined;
    $("#modal-ComboProducts").modal("hide");
  }

  newSideDishesFromComboDetail = function (detailsubitem, detailIndex, detailDetailIndex) {
    if (!this.comboProduct.OrderDetailSubItems) this.comboProduct.OrderDetailSubItems = [];
    let index = this.comboProduct.OrderDetailSubItems.findIndex(
      (p) => p.ProductSubItemDocumentId === detailsubitem.DetailDocumntId && p.levelIndex == detailIndex
    );
    if (!detailsubitem.Quantity) {
      if (index != -1) this.comboProduct.OrderDetailSubItems.splice(index, 1);
    } else if (index == -1) {
      if (this.checkNumberOfComboDetailAllowed(this.comboProduct, detailIndex, detailDetailIndex)) {
        let orderdetailsubitemobj = new OrderDetailSubItemModel();
        let product = this.deepCopy(
          this.allproductlist.filter((p) => p.DocumentId == detailsubitem.DetailDocumntId)[0]
        );
        orderdetailsubitemobj.ProductSubItemId = product.Id;
        orderdetailsubitemobj.ProductSubItemDocumentId = detailsubitem.DetailDocumntId;
        orderdetailsubitemobj.ProductSubItemName = detailsubitem.DetailName;
        orderdetailsubitemobj.Name = detailsubitem.DetailName;
        orderdetailsubitemobj.Price = detailsubitem.Price;
        orderdetailsubitemobj.SingleQuantity = detailsubitem.Quantity;
        orderdetailsubitemobj.Total = orderdetailsubitemobj.Price * orderdetailsubitemobj.SingleQuantity;
        orderdetailsubitemobj.levelIndex = detailIndex;
        this.comboProduct.OrderDetailSubItems.push(orderdetailsubitemobj);
      } else {
        if (detailIndex != -1 && detailDetailIndex != -1) {
          this.comboProduct.ComboDetails[detailIndex].ComboDetailDetails[detailDetailIndex].Quantity = 0;
        }
      }
    } else {
      this.checkNumberOfComboDetailAllowed(this.comboProduct, detailIndex, detailDetailIndex);
      if (index != -1)
        this.comboProduct.OrderDetailSubItems[index].SingleQuantity =
          this.comboProduct.ComboDetails[detailIndex].ComboDetailDetails[detailDetailIndex].Quantity;
    }
  };
  newNoteFromComboDetail = function (detailNote) {
    if (!this.comboProduct.OrderDetailNotes) this.comboProduct.OrderDetailNotes = [];
    let index = this.comboProduct.OrderDetailNotes.findIndex((p) => p.NoteDocumentId === detailNote.DetailDocumntId);
    if (!detailNote.Selected) {
      if (index != -1) this.comboProduct.OrderDetailNotes.splice(index, 1);
    } else if (index == -1) {
      let note = this.deepCopy(this.noteslist.filter((p) => p.DocumentId == detailNote.DetailDocumntId)[0]);
      let orderdetailnotesobj = new OrderDetailNoteModel();
      orderdetailnotesobj.NoteId = note.Id;
      orderdetailnotesobj.NoteDocumentId = note.DocumentId;
      orderdetailnotesobj.NoteName = note.Name;
      this.comboProduct.OrderDetailNotes.push(orderdetailnotesobj);
    }
  };

  checkNumberOfComboDetailAllowed(comboProduct, detailIndex, detailDetailIndex) {
    if (
      comboProduct &&
      comboProduct.ComboDetails[detailIndex] &&
      comboProduct.ComboDetails[detailIndex].ComboDetailDetails &&
      comboProduct.ComboDetails[detailIndex].ComboDetailDetails[detailDetailIndex]
    ) {
      let quantity = this.getLevelQuantity(comboProduct , detailIndex);
      if (
        quantity >= 0 &&
        comboProduct.ComboDetails[detailIndex].Quantity &&
        comboProduct.ComboDetails[detailIndex].Quantity < quantity
      ) {
        this.toastr.warning(
          this.translate.instant("Shared.max_combos") +
            comboProduct.ComboDetails[detailIndex].Name +
            "" +
            this.translate.instant("Shared.is") +
            "" +
            comboProduct.ComboDetails[detailIndex].Quantity
        );
        throw new Error();
      } else return true;
    }
    return true;
  }

  getLevelQuantity(comboProduct , detailIndex){
    return comboProduct.ComboDetails[detailIndex].ComboDetailDetails.filter((x) => x.Quantity > 0)
    .map((x) => Number(x.Quantity))
    .reduce((next, current) => next + current, 0);
  }
  setComboOrderDetail() {
    if (!this.comboProduct.isNew && (this.indexItem || this.indexItem == 0)) {
      this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems = this.deepCopy(
        this.comboProduct.OrderDetailSubItems
      );
      this.orderobj.OrderDetails[this.indexItem].OrderDetailNotes = this.deepCopy(this.comboProduct.OrderDetailNotes);

      this.orderobj.OrderDetails[this.indexItem].SideDishesValue = 0;
      if (
        this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems &&
        this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems.length
      ) {
        this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems.forEach((obj) => {
          this.orderobj.OrderDetails[this.indexItem].SideDishesValue += obj.Total;
        });
      }
      this.addLiStyle(this.orderobj.OrderDetails[this.indexItem]);
    } else {
      let orderdetail = new OrderDetailModel();
      orderdetail.OrderDetailSubItems = [];
      orderdetail.OrderDetailNotes = [];

      let nProduct = this.allproductlist.find((x) => x.DocumentId == this.comboProduct.ProductDocumentId);
      orderdetail.Product = this.deepCopy(nProduct);
      orderdetail.ProductGroupId = nProduct.ProductGroupId;
      orderdetail.ProductGroupDocumentId = nProduct.ProductGroupDocumentId;
      orderdetail.ProductGroupName = nProduct.ProductGroupName;

      orderdetail.ProductId = nProduct.Id;
      orderdetail.ProductDocumentId = nProduct.DocumentId;
      orderdetail.ProductPrice = nProduct.Price;
      orderdetail.ProductName = nProduct.Name;

      orderdetail.OrderDetailPromo = [];
      orderdetail.ProductQuantity = 1;

      if (this.comboProduct.OrderDetailSubItems && this.comboProduct.OrderDetailSubItems.length)
        orderdetail.OrderDetailSubItems = this.deepCopy(this.comboProduct.OrderDetailSubItems);
      if (orderdetail.OrderDetailSubItems && orderdetail.OrderDetailSubItems.length) {
        if (!orderdetail.SideDishesValue) orderdetail.SideDishesValue = 0;
        orderdetail.OrderDetailSubItems.forEach((obj) => {
          orderdetail.SideDishesValue = orderdetail.SideDishesValue + obj.Total;
        });
      }

      if (this.comboProduct.OrderDetailNotes && this.comboProduct.OrderDetailNotes.length)
        orderdetail.OrderDetailNotes = this.deepCopy(this.comboProduct.OrderDetailNotes);

      if (!orderdetail.ProductIndex && orderdetail.ProductIndex != 0)
        orderdetail.ProductIndex = this.orderobj.OrderDetails.length;

      this.orderobj.OrderDetails.push(orderdetail);
      this.addLiStyle(orderdetail);
    }

    this.orderobj = this.recalculateOrderObject(this.orderobj);
  }

  checkCanChangeSideDish(orderDetail: OrderDetailModel) {
    if (orderDetail && !orderDetail.DocumentId && orderDetail.Product) {
      let comboProduct = this.comboProducts.filter((c) => c.ProductDocumentId == orderDetail.Product.DocumentId)[0];
      if (orderDetail.Product.IsCombo && comboProduct) {
        if (comboProduct && comboProduct.ComboDetails && comboProduct.ComboDetails.length) {
          let sideDishExist = comboProduct.ComboDetails.filter((cd) => cd.Type == 1)[0];
          if (sideDishExist) return false;
        }
      } else if (orderDetail.Product.ProductSubItems?.length > 0) return false;
    }
    return true;
  }
  isChangeVolumeDisabled(orderDetail: OrderDetailModel) {
    //if order is promo and price is 0 then disable change volume
    if(orderDetail?.IsPromo && orderDetail.ProductPrice == 0) return true;

    return !orderDetail || orderDetail?.DocumentId || !orderDetail?.Product?.ProductVolumes?.length || 
    orderDetail?.OrderDetailSubItems?.length ||orderDetail?.OrderDetailNotes?.length || orderDetail?.ProductQuantity > 1;
  }
  isEditingPriceDisabled(orderDetail: OrderDetailModel) {
    //if order is promo and price is 0 then disable change volume
    if(orderDetail?.IsPromo && orderDetail.ProductPrice == 0) return true;
    
    return !orderDetail || orderDetail?.DocumentId ||(orderDetail?.Product && !orderDetail?.Product.AllowChangePrice);
  }

  selectComboDetail(level, i, FromPopup = false) {
    if (level.Type == 2) {
      if (level.ComboDetailDetails[i].Selected) level.ComboDetailDetails[i].Selected = false;
      else level.ComboDetailDetails[i].Selected = true;
    } else {
      if (!FromPopup || level.ComboDetailDetails[i].Selected)
        level.ComboDetailDetails[i].Quantity = Number(level.ComboDetailDetails[i].Quantity) + 1;
    }
  }

  checkComboDetailFromName(level, i) {
    if(level.ComboDetailDetails[i].Selected) {
      level.ComboDetailDetails[i].Selected = false;
      level.ComboDetailDetails[i].Quantity = 0;
    }
    else {
      level.ComboDetailDetails[i].Selected = true;
      level.ComboDetailDetails[i].Quantity = Number(level.ComboDetailDetails[i].Quantity) + 1;
    }
  }

  checkComboDetail(level, i) {
    if (level.Type == 2) {
      if (level.ComboDetailDetails[i].Selected) level.ComboDetailDetails[i].Selected = false;
      else level.ComboDetailDetails[i].Selected = true;
    } else {
      if (!level.ComboDetailDetails[i].Selected)
        level.ComboDetailDetails[i].Quantity = Number(level.ComboDetailDetails[i].Quantity) + 1;
      else level.ComboDetailDetails[i].Quantity = 0;
    }
  }

  // minusComboDetail(level, i) {
  //   if (Number(level.ComboDetailDetails[i].Quantity) > 1)
  //     level.ComboDetailDetails[i].Quantity = Number(level.ComboDetailDetails[i].Quantity) - 1;
  // }

  // for plus or minus combo details in order type combo
  plusOrMinusComboDetails(level: any, comboDetail: any, isPlus: boolean) {
    if (isPlus) {
      if (level.Type === 1) {
        if (comboDetail.Selected === false || comboDetail.Selected === undefined || comboDetail.Selected === null) {
          comboDetail.Selected = true;
          comboDetail.Quantity = comboDetail.Quantity + 1;
        } else if (comboDetail.Selected === true) {
          comboDetail.Quantity = comboDetail.Quantity + 1;
        } else {
          if (!comboDetail.Selected) comboDetail.Quantity = comboDetail.Quantity + 1;
          else comboDetail.Quantity = 0;
        }
      }
    } else {
      if (level.Type === 1) {
        if (comboDetail.Selected === false && comboDetail.Quantity > 0) {
          comboDetail.Quantity = comboDetail.Quantity - 1;
        } else if (comboDetail.Selected === true && comboDetail.Quantity > 0) {
          comboDetail.Quantity = comboDetail.Quantity - 1;
          comboDetail.Selected = comboDetail.Quantity === 0 ? false : true;
        }
      }
    }
  }
  comboOpenChanged(i){
    this.comboProduct.ComboDetails?.forEach((level , index) => {
     setTimeout(() => {
       if(index === i) level.isOpen = level.isOpen ? false : true;
       else level.isOpen = false;
     }, 30);
    });
  }
  //#endregion

  //#region DiscountForDetail
  openAddDiscountForDetailPopUp() {
    this.Keyboardnum5.setInput("", "");
    this.pinHasValidation = false;
    
    if (this.indexItem >= 0 && this.orderobj.OrderDetails[this.indexItem]) {
      // if (
      //   !this.isAdmin &&
      //   !this.CheckISGrantedTo(
      //     "CanAddDiscountForDetail",
      //     this.userPermissions2 ? this.userPermissions2 : this.userPermissions
      //   ) &&
      //   !this.validationList["CanAddDiscountForDetail"]
      // ) {
      //   this.validationList["CanAddDiscountForDetailOriginal"] = this.validationList["CanAddDiscountForDetail"];
      //   this.validationList["pinenterd"] = true;
      //   this.orderobj.Pin = "";
      //   this.openkeyboard6();
      //   $("#modal-PinPermission").modal("show");
      //   setTimeout(() => {
      //     this.setFocusById("NewPin2");
      //   }, 400);

      // } else 
        $("#modal-DetailDiscount").modal("show");
    }
  }

  pinAdded: boolean = false;

  SaveDetailDiscount() {
    if (this.indexItem >= 0 && this.orderobj.OrderDetails[this.indexItem]) {
      if (this.orderobj.OrderDetails[this.indexItem].DiscountAmount > 0 ) {
        let product = this.orderobj.OrderDetails[this.indexItem].Product;
        let sideDishesPrices = 0;
        if (
          this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems &&
          this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems.length
        )
          sideDishesPrices = this.orderobj.OrderDetails[this.indexItem].OrderDetailSubItems.map((x) => x.Price).reduce(
            (a: number, b: number) => {
              return a + b;
            }
          );

        let per =
          (Number(this.orderobj.OrderDetails[this.indexItem].DiscountAmount) / (product.Price + sideDishesPrices)) *
          100;

        // let per =
        //   (Number(this.orderobj.OrderDetails[this.indexItem].DiscountAmount) /
        //     (product.Price + this.orderobj.OrderDetails[this.indexItem].SideDishesValue)) *
        //   100;

        this.orderobj.OrderDetails[this.indexItem].DiscountAmount = 0;
        this.orderobj.OrderDetails[this.indexItem].DiscountPercentage = per;
      }
      if(!this.pinHasValidation && !this.checkDetailDiscountPermmisonValidation(this.orderobj.OrderDetails[this.indexItem])) return;

      //#region Check Max Discount
       if(!this.pinHasValidation){
        let MaxDiscountValue = this.getMaxDiscountForUser(
          this.isAdmin,
          "CanAddDiscountForDetail",
          this.userPermissions2 ? this.userPermissions2 : this.userPermissions,
          this.validationList
        );

        if (this.orderobj.OrderDetails[this.indexItem].DiscountPercentage > MaxDiscountValue) {
          this.orderobj.OrderDetails[this.indexItem].DiscountPercentage = MaxDiscountValue;
        }

        // if (this.orderobj.OrderDetails[this.indexItem].DiscountPercentage > MaxDiscountValue && !this.pinAdded) {
        //   this.orderobj.OrderDetails[this.indexItem].DiscountPercentage = 0;
        //   this.orderobj.OrderDetails[this.indexItem].DiscountAmount = 0;
        //   this.orderobj.Pin = "";
        //   this.openkeyboard6();
        //   $("#modal-PinPermission").modal("show");
        //   setTimeout(() => {
        //     this.setFocusById("NewPin2");
        //   }, 400);
        //   // this.toastr.warning(this.translate.instant("messages.MaximumDiscount") + MaxDiscountValue + " %");
        //   // this.Keyboardnum5.setInput("", "");
        //   // throw new Error();
        // }
        // //#region
        // if (this.validationList["pinenterd"] == true) {
        //   this.validationList["CanAddDiscountForDetail"] = this.validationList["CanAddDiscountForDetailOriginal"];
        //   this.validationList["pinenterd"] = false;
        // }
       }
      
      this.userPermissions2 = undefined;

      this.orderobj = this.recalculateOrderObject(this.orderobj);
    }

    $("#modal-DetailDiscount").modal("hide");
  }

  checkPinPermission(permission: string) {
    if (Number(this.orderobj.Pin) >= 0) {
      // let model={Pin:this.orderobj.Pin ,Option :permission}
      //  this.orderSer.checkUserWithOption(model).subscribe( (res) => {
      //
      //   this.validationList[permission] = res;
      //   if(this.users && this.users.length){
      //      let user = this.users.filter(u=>u.Pin == this.orderobj.Pin)[0];
      //      if(user) this.orderobj.PinUserId = user.AppUserId;
      //   }
      //   $("#modal-PinPermission").modal("hide");
      //   this.openAddDiscountForDetailPopUp();
      // }, error=>{
      //
      //   this.toastr.error(error.message, "Order");
      //   this.validationList[permission] = false;
      // });

      this.orderSer.CheckPinUserWithPermission(this.orderobj.Pin).subscribe(
        (res) => {
          if (res["Item1"] == true) this.validationList[permission] = true;
          else this.userPermissions2 = res["Item2"];

          if (this.users && this.users.length) {
            let user = this.users.filter((u) => u.Pin == this.orderobj.Pin)[0];
            if (user) this.orderobj.PinUserId = user.AppUserId;
          }
          this.pinAdded = true;
          $("#modal-PinPermission").modal("hide");
          this.openAddDiscountForDetailPopUp();
        },
        (error) => {
          this.toastr.error(error.message, "Order");
          this.validationList[permission] = false;
          this.userPermissions2 = undefined;
        }
      );
    }
  }

  //#endregion
  openPersonsPopUp() {
    const CanEditPersonsCountAfterSave = 'CanEditPersonsCountAfterSave';
    if(this.orderobj.DocumentId && !this.validationList[CanEditPersonsCountAfterSave])
      this.enterPinForPermission(CanEditPersonsCountAfterSave);
    else
      $("#modal-Persons").modal("show");
  }

  enterPinForPermission(permission: string) {
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
          this.orderobj.Pin = value;
          let model = { Pin: value, Option: permission };
          this.orderSer.checkUserWithOption(model).subscribe(
            (res) => {
              if (this.orderobj.allUsers && this.orderobj.allUsers.length) {
                let user = this.orderobj.allUsers.filter((u) => u.Pin == this.orderobj.Pin)[0];
                if (user) this.orderobj.PinUserId = user.AppUserId;
              }
              this.validationList[permission] = res;
              if(!this.validationList[permission])
                this.toastr.info(this.translate.instant("messages.userHasNoPermission"));

              this.ContinueAfterPin(permission);
            },
            (error) => {
              this.toastr.error(error.message, "Order");
              this.validationList[permission] = false;
            }
          );
          return "";
        } 
      }
    })
  }
  ContinueAfterPin(permission) {
    if (permission == "CanEditPersonsCountAfterSave" && this.validationList[permission]) {
      $("#modal-Persons").modal("show");
    }
  }
  openLastOrder() {
    this.isLastOrder = 1;
    this.getDayOrders(1);
    const modalElement = document.getElementById("modal-LastOrder");
    if (modalElement) $(modalElement).modal("show");
  }

  getDayOrders(type: number) {
    this.dayOrders = [];
    if (type == 0) {
      this.orderSer.GetAllDayOrders().subscribe((res) => {
        this.dayOrders = res;
        this.dayOrdersFiltered = this.deepCopy(this.dayOrders);
        this.setFocusById('search_LastOrders');
      });
    } else {
      this.orderSer.getLastOrder().subscribe((res) => {
        this.lastOrder = res;
        if(this.lastOrder) this.dayOrders.push(this.lastOrder);
        this.dayOrdersFiltered = this.deepCopy(this.dayOrders);
        this.setFocusById('search_LastOrders');
      });
    }
  }

  searchInLastOrders(searchOrders) {
    this.dayOrdersFiltered = this.filterListByKeys(this.dayOrders,['OrderNumber','OrderTypeName','OrderPayTypeName','CustomerName'], searchOrders);
  }

  ClosePersonsCount() {
    if (!this.orderobj.PersonsCount) this.orderobj.PersonsCount = 0;
    $("#modal-Persons").modal("hide");
    if (this.settingobj.UseMinimumCharge) {
      this.handelMinimumCharge(this.orderobj.OrderTable, this.orderobj);
    }
    if(this.orderobj.OrderType?.Taxes?.some(t=> t.Tax.ValueType == 2 && t.Tax.ForOnePerson ) || this.tableHasMinCharge(this.orderobj))
      this.orderobj = this.recalculateOrderObject(this.orderobj);
  }

  getSubItemsName(OrderDetailSubItems: OrderDetailSubItemModel[]): string {
    let subItems = "";
    // ForeignName
    OrderDetailSubItems.forEach((s) => {
      const typeName = this.getTypeName(s)
      subItems +=  (typeName ? typeName : s.ProductSubItemName )+ " ,"
    });
    subItems = subItems.substring(0, subItems.length - 1);
    return subItems;
  }

  getNotesName(OrderDetailNotes: OrderDetailNoteModel[]): string {
    let notesName = "";
    OrderDetailNotes.forEach((s) => (notesName += s.NoteName + " ,"));
    notesName = notesName.substring(0, notesName.length - 1);
    return notesName;
  }

  showProductItems(product: ProductModel) {
    this.productTOShow = this.deepCopy(product);
    this.orderSer.GetAllItems().subscribe((allItems: any) => {
      if (
        allItems &&
        allItems.length &&
        this.productTOShow &&
        this.productTOShow.ProductItems &&
        this.productTOShow.ProductItems.length
      ) {
        this.productTOShow.ProductItems.forEach((i) => {
          let item = allItems.filter(
            (f) => (f.DocumentId && f.DocumentId == i.ItemDocumentId) || (f.Id && f.Id == i.ItemId)
          )[0];
          if (item) i.ItemName = item.Name;
        });
        $("#modal-ProductItems").modal("show");
      }
    });
  }

  //#region handel barcode settings
  getOrderDetailFromBarcode(productBarcode) {
    if (productBarcode) {
      if (productBarcode.length !== this.barcodesettobj.BarcodeLength)
        return this.toastr.error("Invalid Barcode Length");
      else {
        // 1- Remove Additional Number
        var productBarcodeAfterRemovingAdditionals = this.removeAdditionalNumber(productBarcode);

        switch (this.barcodesettobj.StartDirection) {
          //Right
          case 1:
            this.handleBarcodeWithRightStart(productBarcodeAfterRemovingAdditionals);
            break;

          //Left
          case 2:
            this.handleBarcodeWithLeftStart(productBarcodeAfterRemovingAdditionals);
            break;

          //Left
          default:
            this.handleBarcodeWithLeftStart(productBarcodeAfterRemovingAdditionals);
            break;
        }
      }
    }
  }

  //Remove Additional Number from barcode
  removeAdditionalNumber(productBarcode) {
    switch (this.barcodesettobj.AdditionalNumberStart) {
      //Right
      case 1: {
        let endPosition = productBarcode.length - this.barcodesettobj.AdditionalNumberLength;
        let barcodeAfterRemoveRightAdditional = productBarcode.slice(0, endPosition);
        return barcodeAfterRemoveRightAdditional;
      }
      //Left
      case 2: {
        let startPosition = this.barcodesettobj.AdditionalNumberLength;
        let barcodeAfterRemoveLeftAdditional = productBarcode.slice(startPosition, productBarcode.length);
        return barcodeAfterRemoveLeftAdditional;
      }
      //Right
      default: {
        let endPosition = productBarcode.length - this.barcodesettobj.AdditionalNumberLength;
        let barcodeAfterRemoveRightAdditional = productBarcode.slice(0, endPosition);
        return barcodeAfterRemoveRightAdditional;
      }
    }
  }

  //handle barcode with right start
  handleBarcodeWithRightStart(productBarcode) {
    // 2- Remove Start
    let endPosition = productBarcode.length - this.barcodesettobj.StartOfWeightedProduct.length;
    let barcodeAfterRemoveFormRight = productBarcode.slice(0, endPosition);

    // 3- get Product Barcode
    let prodBarcode = barcodeAfterRemoveFormRight.slice(0, this.barcodesettobj.ProductBarcodeLength);
    let codebarproduct = this.deepCopy(this.allproductlist.filter((p) => p.Barcode === prodBarcode && p.Price))[0];
    if (codebarproduct) {
      // 4- get weight
      let productWeight = barcodeAfterRemoveFormRight.slice(
        this.barcodesettobj.ProductBarcodeLength,
        barcodeAfterRemoveFormRight.length
      );
      //prepare orderDetail to be inserted

      // 5- get OrderDetail
      this.codebarproduct = codebarproduct;
      this.focusOnQTY();
      this.codbarqty.nativeElement.value = parseFloat(productWeight) / this.barcodesettobj.WeightCoefficient;

      // this.addToOrderDetailListFromSearch(codebarproduct);
    } else this.checkcodebarexists = false;
  }

  //handle barcode with left start
  handleBarcodeWithLeftStart(productBarcode) {
    // 2- Remove Start
    let barcodeAfterRemoveFormLeft = productBarcode.slice(
      this.barcodesettobj.StartOfWeightedProduct.length,
      productBarcode.length
    );

    // 3- get Product Barcode
    let prodBarcode = barcodeAfterRemoveFormLeft.slice(0, this.barcodesettobj.ProductBarcodeLength);
    let codebarproduct = this.deepCopy(this.allproductlist.filter((p) => p.Barcode === prodBarcode && p.Price))[0];
    if (codebarproduct) {
      // 4- get weight
      let productWeight = barcodeAfterRemoveFormLeft.slice(
        this.barcodesettobj.ProductBarcodeLength,
        barcodeAfterRemoveFormLeft.length
      );

      // 5- get OrderDetail
      this.codebarproduct = codebarproduct;
      this.focusOnQTY();
      this.codbarqty.nativeElement.value = parseFloat(productWeight) / this.barcodesettobj.WeightCoefficient;

      // this.addToOrderDetailListFromSearch(codebarproduct);
    } else this.checkcodebarexists = false;
  }

  //#endregion
  openDrawer() {
    this.orderSer.OpenDrawer().subscribe();
  }

  LockScreen(isInit = false) {
    if (!isInit) {
      this.ClearKeyboardLock();
      this.openKeyboardLock();
    }
    this.LockedScreen = true;
    localStorage.setItem("LockedScreen", this.LockedScreen);
    setTimeout(
      () => {
        this.setFocusById("PinPassword");
      },
      isInit ? 1000 : 400
    );
  }

  unLockScreen() {
    this.orderSer.CheckPinOrPassword(this.orderobj.Pin).subscribe((res) => {
      if (res == true) {
        this.LockedScreen = false;
        localStorage.setItem("LockedScreen", this.LockedScreen);
      } else {
        this.toastr.info(this.translate.instant("messages.WrongPassOrPin"));
      }
    });
  }

  resetConectedScreens() {
    if (this.settingobj.IsUsingCustomerPriceDisplay) {
      this.orderobj.DispalyMode = 1;
      this.orderSer.VFDDisplay(this.orderobj).subscribe();
    }
    localStorage.setItem("orderobj", JSON.stringify({}));
  }

  DeliveryCustomer() {
    this.isDelivery = true;
    this.showCustomerPopUp(this.orderobj, this.validationList);
  }

  trackByReferenceCode(index: number, order: any) {
    return order.ReferenceCode ? order.ReferenceCode : order.DocumentId;
  }

  /**
   * Getir payment matching dialog for unmatched.
   *
   * @author yyasinaslan
   */
  showMatchPaymentsDialog(integrationDocumentId = "") {
    // Show customer order form
    const reservationModalRef = this.modalService.show(MatchPaymentsComponent, {
      class: "modal-sm",
      initialState: {
        integrationDocumentId
      }
    });

    reservationModalRef.onHide.pipe(take(1)).subscribe((reason: any) => {
      const result = reservationModalRef.content.modalResult;

      if (result && result.role == "save") {
        this.GetYemekSepetiOrders();
      }
    });
  }

  // Product card style

  openProductCardStyle() {
    this.productStyle = !this.productStyle;
  }

  styleObject(product: ProductModel) {
    // function to return styles for product card
    if (product?.PicturePath?.length > 1) {
      const styles = {
        height: this.height + "rem",
        width: this.width + "rem",
        cursor: "pointer",
        "background-image": "url(" + this.imgURL + product?.PicturePath + ")",
        color: "black"
      };
      return styles;
    }
    if (product?.ProductProperties?.ImgPath?.length > 1 && !product?.Color) {
      const styles = {
        height: this.height + "rem",
        width: this.width + "rem",
        cursor: "pointer",
        "background-image": "url(" + this.imgURL + product?.ProductProperties?.ImgPath + ")",
        color: this.getContrastColor(this.settingobj.ProductBGColor)
      };
      return styles;
    }

    if (!product?.ProductProperties?.ImgPath?.length && product?.Color) {
      const styles = {
        height: this.height + "rem",
        width: this.width + "rem",
        cursor: "pointer",
        backgroundColor: product?.Color,
        color: this.getContrastColor(this.settingobj.ProductBGColor)
      };
      return styles;
    }

    if (
      !product?.ProductProperties?.ImgPath?.length &&
      !product?.Color &&
      this.settingobj.ProductBGColor &&
      this.settingobj.ProductBGColor !== ""
    ) {
      const styles = {
        height: this.height + "rem",
        width: this.width + "rem",
        cursor: "pointer",
        backgroundColor: this.settingobj.ProductBGColor,
        color: this.getContrastColor(this.settingobj.ProductBGColor)
      };
      return styles;
    }

    if (
      !product?.ProductProperties?.ImgPath?.length &&
      !product?.Color &&
      (!this.settingobj.ProductBGColor || this.settingobj.ProductBGColor === "")
    ) {
      const styles = {
        height: this.height + "rem",
        width: this.width + "rem",
        cursor: "pointer",
        "background-image": "url(assets/images/v10.jpg)",
        color: this.getContrastColor(this.settingobj.ProductBGColor)
      };
      return styles;
    }
  }

  returnDynamicStyles(product: ProductModel) {
    if (product?.PicturePath) {
      const styles = {
        cursor: "pointer",
        "background-image": "url(" + this.imgURL + product?.PicturePath + ")",
        color: this.getContrastColor(this.settingobj.ProductBGColor)
      };
      return styles;
    }

    if (product?.ProductProperties?.ImgPath?.length > 1 && !product?.Color) {
      const styles = {
        cursor: "pointer",
        "background-image": "url(" + this.imgURL + product?.ProductProperties?.ImgPath + ")",
        color: this.getContrastColor(this.settingobj.ProductBGColor)
      };
      return styles;
    }

    if (!product?.ProductProperties?.ImgPath?.length && product?.Color) {
      const styles = {
        cursor: "pointer",
        backgroundColor: product?.Color,
        color: this.getContrastColor(this.settingobj.ProductBGColor)
      };
      return styles;
    }

    if (
      !product?.ProductProperties?.ImgPath?.length &&
      !product?.Color &&
      this.settingobj.ProductBGColor &&
      this.settingobj.ProductBGColor !== ""
    ) {
      const styles = {
        cursor: "pointer",
        backgroundColor: this.settingobj.ProductBGColor,
        color: this.getContrastColor(this.settingobj.ProductBGColor)
      };
      return styles;
    }

    if (
      !product?.ProductProperties?.ImgPath?.length &&
      !product?.Color &&
      (!this.settingobj.ProductBGColor || this.settingobj.ProductBGColor === "")
    ) {
      const styles = {
        cursor: "pointer",
        "background-image": "url(assets/images/v10.jpg)",
        color: this.getContrastColor(this.settingobj.ProductBGColor)
      };
      return styles;
    }
  }

  changeProductCardDimensions(sign: string = "", type: string = "") {
    if (sign === "-") {
      if (type === "Width") {
        this.width--;
      }
      if (type === "Height") {
        this.height--;
      }
    }

    if (sign === "+") {
      if (type === "Width") {
        this.width++;
      }
      if (type === "Height") {
        this.height++;
      }
    }
    this.width = Number(this.width.toFixed(0));
    this.height = Number(this.height.toFixed(0));

    // items per page handling (pagination)
    if (!this.dimensionsChanged) {
      const parentRects = this.document
        .getElementsByClassName("product-card")[0]
        .parentElement.parentElement.getBoundingClientRect();
      this.parentRectsHeight = parentRects.height;
      this.parentRectsWidth = parentRects.width;
      this.dimensionsChanged = true;
    }
    const childRects = this.document.getElementsByClassName("product-card")[0].children[0].getBoundingClientRect();

    let maxCols = Math.floor((this.parentRectsWidth - childRects.width / 1.5) / childRects.width);
    let maxRows = Math.floor((this.parentRectsHeight - childRects.height) / childRects.height);
    this.NumberItems = maxRows * maxCols;
    let pageChangedEvent: PageChangedEvent = {
      itemsPerPage: this.NumberItems,
      page: this.currentPage
    };
    if (!this.settingobj.DontUsePageinationInOrderScreen) {
      this.pageChanged(pageChangedEvent);
    }
  }

  updateProductNameFontSize(operator: string) {
    if (operator === "+") {
      if (this.settingobj.ProductNameFontSize === 32) return;
      this.settingobj.ProductNameFontSize += 1;
    }

    if (operator === "-") {
      if (this.settingobj.ProductNameFontSize === 14) return;
      this.settingobj.ProductNameFontSize -= 1;
    }
  }

  updateCartItemsWidth(operator: string) {
    if (operator === "+") 
      this.setCartWidthPercentage((this.settingobj.DetailCartWidth ?? 33.33) + 5);
    if (operator === "-")
      this.setCartWidthPercentage((this.settingobj.DetailCartWidth ?? 33.33) - 5);
  }

  setCartWidthPercentage(percentage: number) {
    const DetailCartWidth = Number(percentage.toFixed(0));
    this.settingobj.DetailCartWidth = clamp(DetailCartWidth, 33.33, 75);
    this.settingobj.ProductCartWidth = 100 - this.settingobj.DetailCartWidth;
  }
  saveWidthAndHeight() {
    this.settingobj.ProductHeight = this.height;
    this.settingobj.ProductWidth = this.width;
    this.setCartWidthPercentage(this.settingobj.DetailCartWidth ?? 33.33);

    this.settingServ.SaveSettings(this.settingobj).subscribe({
      next: () => {
        this.productStyle = false;
      },
      error: () => {
        this.productStyle = true;
      }
    });
  }
  resetWidthAndHeight() {
    this.settingobj.ProductHeight = 8;
    this.height = 8;
    this.settingobj.ProductWidth = 9;
    this.setCartWidthPercentage(33.33);
    this.width = 9;
    this.settingobj.ProductNameFontSize = 14;
    this.settingobj.AutoHeight = false;
    this.settingobj.DontUsePageinationInOrderScreen = false;
    this.settingobj.ProductBGColor = undefined;
    this.settingServ.SaveSettings(this.settingobj).subscribe({
      next: () => {
        this.productStyle = false;
      },
      error: () => {
        this.productStyle = true;
      }
    });
  }

  // Handling PayType selection from pay types pop-up in case POS PaymentButtonDirectly is true
  payTypeButtonClicked() {
    $("#modal-payTypesList").modal("show");
  }

  payTypeSelected(payType: OrderPayTypeModel) {
    this.orderobj.OrderPayments = [];
    if (payType.PayType === 20) {
      $("#modal-payTypesList").modal("hide");
      this.showCustomerPopUp(this.orderobj, this.validationList);
    }
    $("#modal-payTypesList").modal("hide");
    this.setOrderPayType(payType, this.orderobj, null);
  }

  // drag & drop behavior
  drop(event: CdkDragDrop<any>) {
    this.finalProductList[event.previousContainer.data.index] = event.container.data.item;
    this.finalProductList[event.container.data.index] = event.previousContainer.data.item;
    this.listSorted(this.finalProductList);
  }
  checkOrderTypeWithPromo(product: any, order: any) {
    let hasPromoInSameOrderType = false;
    if (product?.Promos?.length && order && order.OrderType) {
      product.Promos.forEach((x) => {
        if (x?.OrderTypesList.length) {
          if (x?.OrderTypesList?.includes(order?.OrderType?.DocumentId)) {
            hasPromoInSameOrderType = true;
            return true;
          }
        } else {
          hasPromoInSameOrderType = true;
          return true;
        }
      });
    }
    return hasPromoInSameOrderType;
  }

  disablePrint(order: OrderModel,isKot :boolean = false,checkPerm:boolean = true) {
    const permitted = checkPerm ? this.permittedPrint(order) : true;
    let disable = !permitted || !order?.DocumentId || order.OrderDetails?.some(x=>!x.DocumentId) || (order.MinimumChargeValue && order.MinimumChargeValue > order.SubTotal);
    if(!isKot) return disable;
    return disable || order.OrderDetails.every(x=> x.Printed);
  }
  // new boolean to allow user to either use pagination in Order screen or not
  // allowPaginationInOrderScreen(event: any) {
  //   this.settingobj.DontUsePageinationInOrderScreen.next(event);
  // }

  // Function to calculate contrast based on the background color
  getContrastColor(hexColor: string) {
    // Extract RGB components
    if (hexColor) {
      const rgb = parseInt(hexColor.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      // Calculate Luminance (Y value in YIQ color space)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      return luminance > 0.5 ? "black" : "white";
    } else {
      return "black";
    }
  }

  // Function to reset background-color set in settingobj.ProductBGColor
  resetBGColor() {
    if (this.settingobj.ProductBGColor) {
      this.settingobj.ProductBGColor = "";
    } else {
      return;
    }
  }

  
  holdOrder(order:OrderModel){
    $('[data-toggle="tooltip"]').tooltip("dispose");
    if(order.DocumentId || !order.OrderDetails?.length) return;

    Swal.fire({
      title: this.translate.instant("messages.EnterNote"),
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        autocomplete: 'off'
      },
      showCancelButton: true,
      confirmButtonText: this.translate.instant('Order.Hold'),
      cancelButtonText:this.translate.instant('Shared.Cancel'),
      showLoaderOnConfirm: true,
      preConfirm: (noteForOrder) => {
        // Process the input value
        order.NoteForOrder = noteForOrder;
        this.holdedOrders = this.LocalstorgeService.get(this.holdedOrdersKey);
        if(!this.holdedOrders)  this.holdedOrders = [];
        this.holdedOrders.push(order);
        this.LocalstorgeService.set(this.holdedOrdersKey,  this.holdedOrders);
        this.ClearOrderModel();
      }
    });
  }
  openHoldedOrders(){
    this.holdedOrders = this.LocalstorgeService.get(this.holdedOrdersKey);
    $("#modal-HoldedOrders").modal("show");
  }
  selectHoldedOrder(order:OrderModel , index:number,isSelect = true){
    order.NoteForOrder = '';
    if(isSelect) this.orderobj = order;
    this.holdedOrders.splice(index,1);
    this.LocalstorgeService.set(this.holdedOrdersKey , this.holdedOrders);
    if(isSelect) $("#modal-HoldedOrders").modal("hide");
  }
  orderDetailsWithQuantity(){
    return this.orderobj.OrderDetails.filter(x=>x.ProductQuantity > 0);
  }
  cancelledQuantityChanged(orderDetial:OrderDetailModel) {
    if (orderDetial.ReturnedProductQuantity < 0) orderDetial.ReturnedProductQuantity = 0;
    else if (orderDetial.ReturnedProductQuantity > orderDetial.ProductQuantity)
      orderDetial.ReturnedProductQuantity = orderDetial.ProductQuantity
    // if(orderDetial.IsCancelledFront && !orderDetial.ReturnedProductQuantity)
    //   orderDetial.ReturnedProductQuantity = orderDetial.ProductQuantity
  }
  cancelDetailChecked(orderDetial:OrderDetailModel){
    if (orderDetial.IsCancelledFront) orderDetial.ReturnedProductQuantity = orderDetial.ProductQuantity;
    else orderDetial.ReturnedProductQuantity = undefined;
  }
  showProductsAvalQty(product:ProductModel){
    if(this.settingobj.ShowVolumeAsProduct && (product.VolumeDocumentId || product.VolumeId)){

      const orignalProduct = this.allproductlist.find(x=>x.DocumentId === product.DocumentId);
      if(orignalProduct){
        const productVolume = orignalProduct.ProductVolumes.find(x =>
          (product.VolumeFerpCode && x.VolumeFerpCode == product.VolumeFerpCode) ||
          (product.VolumeId && x.VolumeId == product.VolumeId) ||
          (product.VolumeDocumentId && x.VolumeDocumentId == product.VolumeDocumentId)
          );

          if(productVolume && productVolume.SizeFromMainUnit) return product.AvailableQuantity / productVolume.SizeFromMainUnit;
        }
     
    }
    return product.AvailableQuantity;
  }
  get allFirePrintChecked() {
    return this.orderobj.OrderDetails.filter(d=> !d.Printed).every(d=>d.FirePrint);
  }
  checkAllFirePrintRows(event){
    this.orderobj.OrderDetails.filter(d=> !d.Printed).forEach(d=>{
      d.FirePrint = event.target?.checked;
    })
  }
  toggleAll(event : any) {
    this.orderDetailsWithQuantity()?.forEach((orderDetail:OrderDetailModel) => {
      orderDetail.checkedSplit = !event.target?.checked;
      this.checkQntyToSplit(orderDetail);
    });
  }
  get checkAllSplit(){
    return this.orderDetailsWithQuantity()?.every((item:any) => item.checkedSplit);
  }
  get disableSendBtn(){
    const disableFoodPlan = this.orderobj.OrderType?.ForStaff == true && this.orderobj.FoodPlanData?.EmployeeDocumentId?.length > 0;
    return this.orderobj.OrderType &&
     ((this.orderobj.OrderType.Value == 1 && !this.orderobj.OrderType.PaymentByAnotherUser && !this.orderobj.OrderType.UseCard)
          || this.orderobj.OrderType.DirectPayment || disableFoodPlan)
  }
  closeSplitedOrders(){
    this.orderobj.TableId = '';
    this.orderobj.TableName = '';
    $("#modal-1021").modal("hide");
  }
  getNameOfTableWithMultiReceipts(order:OrderModel){
    return order?.TableName?.includes('/') ? order?.TableName?.split('/')[1] : order?.CustomerName;
  }
  enterTotalProductPrice(detailIndex:number){
    if(!this.orderobj.OrderDetails[detailIndex]?.Product?.UseWeights) return;
    Swal.fire({
      title: this.translate.instant("messages.enterTotalProductPrice"),
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off',
        autocomplete: 'off'
      },
      inputValue:this.orderobj.OrderDetails[detailIndex].Total,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('Shared.Save'),
      cancelButtonText:this.translate.instant('Shared.Cancel'),
      showLoaderOnConfirm: true,
      preConfirm: (newTot:number) => {
        const newTotal = Number(newTot);
        if(newTotal > 0){
          const pricePerUnite = this.orderobj.OrderDetails[detailIndex].Total / this.orderobj.OrderDetails[detailIndex].ProductQuantity;
          this.orderobj.OrderDetails[detailIndex].ProductQuantity = newTotal / pricePerUnite;
          this.orderobj = this.recalculateOrderObject(this.orderobj);
        }
      }
    });
  }
  PrintKOT(order:OrderModel){
    if(!order.LanguageOptions) this.getReportTranslationObj(order);
    this.orderSer.PrintKOT(order).subscribe(
      (res) => {
        if(res == true){
          this.toastr.success(this.translate.instant("Shared.printed"));
          this.notPrintedKotCount -= 1;
        }
        this.getDayOrders(this.isLastOrder);
      },
      error=>{
        this.GetMobileOrdersCount();
      }

    );
  }

  changeQuantityAfterSave(product:ProductModel){
    if(!product.UseWeights) return;
    let details = this.orderobj.OrderDetails.filter(x=>x.ProductDocumentId == product.DocumentId);
    // detail already exist
    if(details?.length == 1 && details[0].DocumentId){

      // if first update then update directly
      if(!details[0].QuantityChangedTimes){
        details[0].ProductQuantity = Number(this.codbarqty.nativeElement.value);
        this.clearCodeBarData();
      }
      // if second time to update show confirm you want to update exist record or add new
      else{
        Swal.fire({
        title: this.translate.instant("messages.ProductExists"),
        text: this.translate.instant("messages.doyouwant"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        allowEscapeKey:false,
        backdrop:false,
        cancelButtonText: this.translate.instant("messages.addnew"),
        confirmButtonText: this.translate.instant("messages.editquantity")
        }).then((result) => {
          if (result.isConfirmed)
            details[0].ProductQuantity = Number(this.codbarqty.nativeElement.value);
          else
            this.addToOrderDetailListFromSearch(product,true);
          
          this.clearCodeBarData();
        });
      }
    }
    // add new detail
    else{
      this.addToOrderDetailListFromSearch(product);
      this.clearCodeBarData();
    }
    
  }
  async savePendingOrders() {
    if(this.orderSer.pendingOrdersStarted) return;
    try {
      this.orderSer.pendingOrdersStarted = true;
      const pendingOrders = LocalstorgeService.getByKey(this.pendingOrdersKey) || [];
      const count = pendingOrders.length;
      for (let i = 0; i < count; i++) {
        const order = pendingOrders[i];
        this.requestStarted = false;
        if(order?.OrderDetails?.length)
          await this.sendClicked(order, true, true);
      }
      LocalstorgeService.addOrUpdate(this.pendingOrdersKey, []);
      this.pendingOrdersCount = 0;
      this.orderSer.pendingOrdersStarted = false;
    } catch (error) {
      this.orderSer.pendingOrdersStarted = false;
    }
    
  }
  setActiveField(field: 'minCharge'|'persons') {
    this.activeField = field;
  
    // sync the keyboard’s visible input with the focused field’s current value
    const current =
      field === 'minCharge'
        ? (this.orderobj?.MinimumChargeNewPerPerson)
        : (this.orderobj?.PersonsCount);
    this.Keyboardnum4?.setInput(current);
  }
  private applyKeyboard(input: string) {
    // coerce to number, ignore lone "."
    const val = (input === '' || input === '.') ? null : Number(input);
  
    if (this.activeField === 'minCharge') {
      this.orderobj.MinimumChargeNewPerPerson = val ?? 0; // or null if you prefer
    } else {
      this.orderobj.PersonsCount = val ?? 0;
    }
  }

  // Group meal popup state
  groupMealParent?: ProductModel;
  // Open popup with combos names and prices if product is a group meal
  isGroupMealProduct(product: ProductModel): boolean {
    try {
      // Determine if product is a group meal parent
      const isGroup = product.AsGroupMeal;
      if (!isGroup || !product.Combos?.length) return false;

      product.Combos?.forEach(c =>{
        const comboProduct = (this.allproductlist || []).find(p =>
          (c.ComboProductDocumentId && p.DocumentId === c.ComboProductDocumentId) ||
          (c.ComboProductId && p.Id === c.ComboProductId)
        );
        if(comboProduct){
          c.ComboProductName = this.getNameForProduct(comboProduct);
          c.ComboProductPrice = comboProduct.Price;
        }
      });
      
      this.groupMealParent = deepCopy(product);
      this.groupMealParent.Combos = this.groupMealParent.Combos?.filter(c => c.ComboProductName); 
      // Show modal only if we have something to show
      setTimeout(() => {
        $("#modal-GroupMealCombos").modal("show");
      },10);
      return true;
    } catch {
      return false;
    }
  }
  closeGroupMealModal(){
    try { 
      this.groupMealParent = undefined;
      this.fromGroupMealPopup = false;
      $("#modal-GroupMealCombos").modal("hide");
     } 
    catch {}
  }
  getProductsForGroupMeal(groupMealParent : ProductModel){
    this.fromGroupMealPopup = true;
    let groupMeal: ProductModel = (this.allproductlist || []).find(p => p.DocumentId === groupMealParent.DocumentId);
    if(!groupMeal) return [];

    let products = [groupMeal];
    if(!groupMealParent?.Combos?.length) 
      return products;
    const Ids = groupMealParent.Combos.map(c => c.ComboProductDocumentId );
    products = [...products , ...(this.allproductlist || []).filter(p => Ids.includes(p.DocumentId))];
    return this.hideZeroProducts(products,false);
  }
  
}
