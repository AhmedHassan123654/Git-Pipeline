import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { CustomerAddressModel } from "src/app/core/Models/Transactions/CustomerAddressModel";
import { CustomerModel } from "src/app/core/Models/Transactions/CustomerModel";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { OrderHelper } from "../OrderHelper";
import { SettingService } from "../../point-of-sale/pointofsaleimports";
import { Router } from "@angular/router";
import { DriverService } from "src/app/core/Services/Transactions/driver.service";
import { DriverModel } from "../../driver/driverimport";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { debounceTime } from "rxjs/operators";
import { Subject } from "rxjs-compat/Subject";
import { Subscription } from "rxjs";
import { OrderDetailModel } from "src/app/core/Models/Transactions/order-detail-model";
import { CustomerGroupService } from "../../customer-group/imports-customer-group";
import { CashreceiptService } from "../../cash-receipt/cash-receiptimport";
import { CustomerOrderService } from "../../customer-order/customerorderimport";
import { DatePipe } from "@angular/common";

declare var $: any;

@Component({
  selector: "app-deliverycustomer",
  templateUrl: "./deliverycustomer.component.html",
  styleUrls: ["./deliverycustomer.component.css"]
})
export class DeliveryCustomerComponent extends OrderHelper implements OnInit, OnDestroy {
  model: CustomerModel = new CustomerModel();
  // regionList:RegionModel[];
  config: any;
  comboboxRegionFields = { text: "Name", value: "Id" };
  RegionFieldsDocumentId = { text: "Name", value: "DocumentId" };
  // customerList: CustomerModel[];
  customerAddress: CustomerAddressModel = new CustomerAddressModel();
  selectCustomer: CustomerModel = new CustomerModel();
  // customerAddressList: CustomerAddressModel[];
  isReadonyPrice: boolean = true;
  PinCode: string;
  toggleStyle: boolean = false;
  customerBalance = 0;
  /**
   * This will be main observable for input changes
   */
  inputChange = new Subject();

  /**
   * Input change subscribed onInit and must be unsubscribed onDestroy
   */
  inputChangeSub: Subscription;

  [key: string]: any;

  @Input("orderobj") _orderobj: OrderModel;
  @Input("isDelivery") _isDelivery: boolean;
  @Input() selectedCustomer: CustomerModel = new CustomerModel();
  @Output() cancelCustomer = new EventEmitter<any>();

  constructor(
    public orderSer: OrderService,
    public customerOrderSer: CustomerOrderService,
    public cashreceiptSer: CashreceiptService,
    public toastr: ToastrService,
    public settingServ: SettingService,
    public router: Router,
    public driverser: DriverService,
    public translate: TranslateService,
    public toastrMessage: HandlingBackMessages,
    private languageSerService: LanguageSerService,
    public customerGroupService: CustomerGroupService,
    public datepipe: DatePipe,
  ) {
    super(settingServ, orderSer, toastr, toastrMessage, router, translate);
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    // if (this.orderSer.isCallCenterOrder.getValue() === true) {
    //   debugger
    //   this.custAddress(this._orderobj.CustomerAddress);
    // }
  }

  inputChanged(inputType: string) {
    this.inputChange.next();
  }

  onShowCustomer() {
    if (this._orderobj.IsDriver) this.getDrivers();
  }

  selectDriver(driver) {
    if (driver.IsSelected) {
      driver.IsSelected = false;
      this._orderobj.DriverDocumentId = undefined;
      this._orderobj.DriverId = undefined;
      this._orderobj.Driver = new DriverModel();
    } else {
      this.driverList.forEach((d) => {
        d.IsSelected = false;
      });
      driver.IsSelected = true;
      this._orderobj.DriverDocumentId = driver.DocumentId;
      this._orderobj.DriverId = driver.Id;
      this._orderobj.Driver = driver;
      this.recalculateOrderObject(this._orderobj, true);
      
      this.hideDeliveryModal();
    }
  }

  ngOnInit() {
    // if (this._orderobjIsCallCenter) {
    //   this.custAddress(this._orderobj.CustomerAddress);
    // }
    this.orderSer.GetAllRegions().subscribe((res) => {
      this.regionList = res as [];
    });

    this.validationList = this.getValidationOptions();
    if (this.isAdmin == undefined || !this.userPermissions || this.userPermissions.length == 0) {
      this.orderSer.GetUserWithPermission().subscribe((res) => {
        this.isAdmin = res["Item1"] as boolean;
        this.userPermissions = res["Item2"] as any;
        this.validationList = this.grantOptionsForUser(this.isAdmin, this.validationList, this.userPermissions);
      });
    } else this.validationList = this.grantOptionsForUser(this.isAdmin, this.validationList, this.userPermissions);

    // this.comboboxRegionFields = { text: "Name", value: "Id" };
    // this.RegionFieldsDocumentId = { text: "Name", value: "DocumentId" };

    this.inputChangeSub = this.inputChange.pipe(debounceTime(500)).subscribe(() => {
      this.getCustomers();
    });
  }

  ngOnDestroy() {
    if (this.inputChangeSub) {
      this.inputChangeSub.unsubscribe();
    }
  }

  initFromParent() {
    this.Flds = { text: "Name", value: "DocumentId" };
    this._orderobj.Customer = new CustomerModel();
    this._orderobj.CustomerAddress = new CustomerAddressModel();
    if (this.orderSer.customerList)
      this.orderSer.customerList.forEach((x) => {
        x.isCollapse = false;
      });
    if (this.driverList)
      this.driverList.forEach((d) => {
        d.IsSelected = false;
      });
    this._orderobj.DriverDocumentId = undefined;
    this._orderobj.DriverId = undefined;
    this._orderobj.Driver = new DriverModel();
    this.model = new CustomerModel();
    this.CustomerOrders = [];
    this.SelctedOrderDetails = [];
    this.getCustomers();
  }

  getDrivers() {
    let name = this.driverName ? this.driverName : ("" as string);
    this.driverser.getDriversByName(name).subscribe((res) => {
      this.driverList = res as DriverModel[];
      if (this._orderobj && (this._orderobj.DriverDocumentId || this._orderobj.DriverId)) {
        let driver = this.driverList.filter(
          (x) =>
            (this._orderobj.DriverDocumentId && x.DocumentId == this._orderobj.DriverDocumentId) ||
            (this._orderobj.DriverId && x.Id == this._orderobj.DriverId)
        )[0];
        if (driver) driver.IsSelected = true;
      }
    });
  }

  /**
   * This is triggered by input event
   */
  getCustomers() {
    if (this.model != null) {
      /**
       * Check char length of search models
       */
      if (!this.model.Phone && !this.model.Name && !this.model.CustomerBarcode) return;

      /**
       * Phone must be more than 3 characters
       */
      if (this.model.Phone && this.model.Phone.toString().length <= 3) return;

      /**
       * Name must be more than 3 characters
       */
      if (this.model.Name && this.model.Name.toString().length <= 2) return;
      /**
       * CustomerBarcode must be more than 3 characters
       */
      // if (this.model.CustomerBarcode && this.model.CustomerBarcode.toString().length <= 3) return; brcause the code might be only one or two num only

      if (this._isDelivery) this.model.TypeOfCustomer = "Delivery";
      else this.model.TypeOfCustomer = "Credit";
      if(this._orderobj?.settings?.FinancialSystem != 4) 
        this.model.UseCredit = this.checkCreditPayment(this._orderobj);
      // if (this._orderobj.IsCallCenter && this._orderobj.OrderType.Value === 2) {
      //   // this.orderSer.customerList = this._orderobj.Customer;
      // } else {
      this.orderSer.GetCustomerByMobileOrName(this.model as CustomerModel).subscribe((res) => {
        this.orderSer.customerList = res as CustomerModel[];

        const oldCustomerAddress = this.deepCopy(this._orderobj.CustomerAddress);
        const oldDeliveryPrice = this._orderobj.DeliveryPrice;
        
        this.UnselectCustomer(this._orderobj);
        if (this.model.Phone) {
          var customer = this.orderSer.customerList.find((x) => x.Phone === this.model.Phone);
          if(customer && this.orderSer.customerList.length == 1 && customer.DocumentId){
            var customerIndex = this.orderSer.customerList.findIndex((x) =>  x.DocumentId == customer.DocumentId);
            this.getCustomerAddress(customer, customerIndex);
          }
        }

        this.setOldCustomerAddressForOrder(oldCustomerAddress ,true, oldDeliveryPrice);

        // if(this.orderSer.customerList && this.orderSer.customerList.length == 1){
        //   this._orderobj.Customer = this.orderSer.customerList[0];
        //   this._orderobj.CustomerAddress = new CustomerAddressModel();
        //   this.getCustomerAddress(this.orderSer.customerList[0] , '0');
        // }
      });
      // }
      if (this.orderSer.customerList == null) {
        this.clearSearch();
      }
    } else {
      this.clearSearch();
    }
  }

  onSubmit(event) {
    //alert("SUCCESS!! :-)\n\n" + JSON.stringify(this.model, null, 4));
    if (event.submitter.name == "AddCustomer") {
      let customer = this.model as CustomerModel;
      this.orderSer.GetCustomerByPhone(customer.Phone).subscribe((res) => {
        if ((res as boolean) == true) {
          this.toastr.warning("this Customer already exist", "Customer");
        } else {
          this.orderSer.PostCustomer(customer).subscribe((res) => {
            this.toastr.success(this.toastrMessage.GlobalMessages(res), "Customer");
            this.getCustomers();
          });
        }
      });
    }
  }

  insertCustomer() {
    this.orderSer.GetCustomerByPhone(this._orderobj.Customer.Phone).subscribe((res) => {
      if ((res as boolean) == true) {
        this.toastr.warning("this Customer already exist", "Customer");
      } else {
        if (
          this._orderobj.Customer.OneAddress &&
          (this._orderobj.Customer.OneAddress.Apartment ||
            this._orderobj.Customer.OneAddress.BuildingNumber ||
            this._orderobj.Customer.OneAddress.Description || 
            this._orderobj.Customer.OneAddress.GpsLocation|| 
            this._orderobj.Customer.OneAddress.Floor ||
            this._orderobj.Customer.OneAddress.RegionId ||
            this._orderobj.Customer.OneAddress.StreetNumber)
        ) {
          this._orderobj.Customer.Addresses = [];
          this._orderobj.Customer.Addresses.push(this.deepCopy(this._orderobj.Customer.OneAddress));
        }
        this.orderSer.PostCustomer(this._orderobj.Customer).subscribe((res) => {
          if (res == 1) {
            this.toastr.success(this.toastrMessage.GlobalMessages(res), "Customer");
            this.getCustomerForOnePhone();
          } else {
            this.toastr.warning(this.toastrMessage.GlobalMessages(res), "Customer");
          }
        });
      }
    });
  }

  submitCustomer(form) {
    if (!form.form.valid) return false;
    if (this._orderobj.CustomerDocumentId) {
      this.orderSer.UpdateCustomerFromOrder(this._orderobj.Customer).subscribe((res) => {
        if (res == 200 || res == 2) {
          this.toastr.info(this.toastrMessage.GlobalMessages(2), "Customer");
          this.customerChanged = false;
          this.getCustomerForOnePhone();
        } else {
          this.toastr.warning(this.toastrMessage.GlobalMessages(res), "Customer");
        }
      });
    } else {
      this.insertCustomer();
    }
  }

  getCustomerForOnePhone() {
    $("#DetailsCustomer").modal("hide");

    this.model = new CustomerModel();
    this.model.Phone = this._orderobj.Customer.Phone;
    this.getCustomers();
  }

  submitAddress(event) {
    if (event.submitter.name == "AddAddress") {
      this.customerAddress.CustomerId = this.selectCustomer.Id;
      this.customerAddress.CustomerDocumentId = this.selectCustomer.DocumentId;
      this.orderSer.PostCustomerAddress(this.customerAddress).subscribe((res) => {
        if (res == 200) {
          this.toastr.success(this.toastrMessage.GlobalMessages(1), "CustomerAddress");
          let i = this.orderSer.customerList.findIndex((c) => c.DocumentId == this.selectCustomer.DocumentId);
          if (i == -1) i = null;
          this.getCustomerAddress(this.selectCustomer, i);
          //this.orderSer.customerAddressList.push(this.customerAddress);
          $("#modal-40404").modal("hide");
        }
      });
    }
  }

  submitPinCode(event) {
    if (event.submitter.name == "CheckPinCode") {
      this.orderSer.GetUserByPinCode(this.PinCode).subscribe((res) => {
        if ((res as boolean) == true) {
          this.isReadonyPrice = false;
        } else {
          this.isReadonyPrice = true;
        }
        $("#modal-PinCode").modal("hide");
      });
    }
  }

  clearPinCode() {
    this.PinCode = "";
  }

  openAddress(Customer) {
    this.selectCustomer = Customer;
    this.customerAddress = new CustomerAddressModel();

    //location.reload();
  }

  checkRegion(RegionId: number) {
    if (RegionId) {
      if (this.regionList != null && this.regionList.findIndex((x) => x.Id == RegionId) != -1) return true;
    }
    if (this.customerAddress != null && this.customerAddress.RegionId == RegionId) {
      this.customerAddress.RegionId = null;
    }
    if (this._orderobj.CustomerAddress != null && this._orderobj.CustomerAddress.RegionId == RegionId) {
      this._orderobj.CustomerAddress.RegionId = null;
    }
    RegionId = null;
    return false;
    //this._orderobj.DeliveryPrice=this.regionList.find(x=>x.Id==this.customerAddress.RegionId).Id;
  }

  selectRegion(RegionId: number) {
    let reCalculateOrderPayment = false;

    if (!this.checkRegion(RegionId)) {
      RegionId = null;
      this._orderobj.CustomerAddress.RegionId = null;
      this._orderobj.CustomerAddress.Region = null;
    }
    if (RegionId != null) {
      if (this.regionList != null && this.regionList.findIndex((x) => x.Id == RegionId) != -1) {
        let region = this.regionList.find((x) => x.Id == RegionId);
        this._orderobj.CustomerAddress.RegionId = RegionId;
        this._orderobj.CustomerAddress.Region = region;
        reCalculateOrderPayment = true;
      }

      let RegionsDeliveryPrice;
      this.orderSer.GetRegionsDeliveryPrice(RegionId).subscribe((res) => {
        RegionsDeliveryPrice = res;
        if(this.stoppGetRegionPrice) return;
        if (RegionsDeliveryPrice == null) {
          let region: any = this.regionList.find((x) => x.Id == RegionId);
          RegionsDeliveryPrice = region.RegionsDeliveryPrices[0];
        }
        if (RegionsDeliveryPrice && this._orderobj.OrderType?.Value == 2) {
          this._orderobj.DeliveryPrice = RegionsDeliveryPrice.Price;
          this._orderobj.DeliveryPersonDeliveryPrice = RegionsDeliveryPrice.PersonPrice;
        } else {
          if (!this._orderobj.IsCallCenter || !this._orderobj.IsMobileOrder) {
            this._orderobj.DeliveryPrice = 0;
            this._orderobj.DeliveryPersonDeliveryPrice = 0;
          }
        }
        this._orderobj = this.recalculateOrderObject(this._orderobj, true);
      });
    } else {
      this._orderobj.DeliveryPrice = 0;
      this._orderobj.DeliveryPersonDeliveryPrice = 0;
    }
    this._orderobj = this.recalculateOrderObject(this._orderobj, reCalculateOrderPayment);
  }

  getCustomerAddress(Customer: CustomerModel, i: number) {
    const oldCustomerAddress = this.deepCopy(this._orderobj.CustomerAddress);
    const oldDeliveryPrice = this._orderobj.DeliveryPrice;
        
    if (this.orderSer.isCallCenterOrder.getValue() === false) {
      if (i != null || i == 0) {
        this.iscollaps = this.orderSer.customerList[i].isCollapse;
        this.orderSer.customerList.forEach((x) => {
          x.isCollapse = false;
        });
        if (!this.iscollaps) this.orderSer.customerList[i].isCollapse = true;
        this.clearAdrress(false);
      }
    }
    let addressList: CustomerAddressModel[];
    this.orderSer.GetCustomerAddress(Customer.DocumentId).subscribe((res) => {
      addressList = res as CustomerAddressModel[];
      this.orderSer.customerAddressList = [];
      if (addressList?.length) {
        addressList.forEach((element) => {
          if (
            this.orderSer.customerAddressList.findIndex(
              (a) => a.DocumentId == element.DocumentId || a.DocumentId == null
            ) == -1 ||
            this.orderSer.customerAddressList.length == 0
          ) {
            this.orderSer.customerAddressList.push(element);
            this.custAddress(element);
          }
        });
      }
      this._orderobj.Customer = Customer;
      this.SelectedCustomer();
      this.setOldCustomerAddressForOrder(oldCustomerAddress ,true, oldDeliveryPrice);
    });
  }

  // clearSearch() {
  //   this.orderSer.customerList = [];
  //   this.orderSer.customerAddressList = [];
  // }

  clear() {
    this.model = new CustomerModel();
    this._orderobj.Customer = new CustomerModel();
    this._orderobj.CustomerAddress = new CustomerAddressModel();
    this.orderSer.customerList = [];
    this.orderSer.customerAddressList = [];
    this._orderobj.DeliveryPrice = null;
    this._orderobj.DeliveryPersonDeliveryPrice = null;
  }

  clearAdrress(recalculatePayment = true) {
    this._orderobj.CustomerAddress = new CustomerAddressModel();
    this._orderobj.DeliveryPrice = null;
    this._orderobj.DeliveryPersonDeliveryPrice = null;
    this._orderobj = this.recalculateOrderObject(this._orderobj, recalculatePayment);
  }

  EditAddress() {
    if(!this._orderobj.CustomerAddress.CustomerDocumentId){
      //we had issue of insert an address it doesn't has customer document id 
      //so we updated our insert method and we add this condition to handle already data exist for the customer so he can update the address with no conflicts..
      this._orderobj.CustomerAddress.CustomerDocumentId =this._orderobj.Customer.DocumentId;
    }
    this.orderSer.PutCustomerAddress(this._orderobj.CustomerAddress).subscribe((res) => {
      if (res == 200) {
        this.toastr.info(this.toastrMessage.GlobalMessages(2), "CustomerAddress");
      }
    });
    if (this.customerChanged == true) {
      this.orderSer.UpdateCustomerFromOrder(this._orderobj.Customer).subscribe((res) => {
        if (res == 200 || res == 2) {
          this.toastr.info(this.toastrMessage.GlobalMessages(2), "Customer");
          this.customerChanged = false;
        } else {
          this.toastr.warning(this.toastrMessage.GlobalMessages(res), "Customer");
        }
      });
    }
  }

  checkIfOldCustomerHasDiscount(newCustomerDocumentId?:string , oldCustomerDocumentId ?:string){
    if(oldCustomerDocumentId && this.customerPromos?.length && oldCustomerDocumentId != newCustomerDocumentId){
      const customerPromo = this.customerPromos?.find((x) => x.CustomersList && x.CustomersList.includes(oldCustomerDocumentId));
      if(customerPromo?.DocumentId){
        if(customerPromo.IsAppliedToProducts){
          this._orderobj.OrderDetails.forEach((detail: OrderDetailModel) => {
            detail.DiscountPercentage = 0;
          });
        }
        else if(!customerPromo.IsAppliedToProducts){
          this._orderobj.Discount = 0;
          this._orderobj.DiscountAmount = 0;
          // this._orderobj.DiscountType = "0";
        }
        this._orderobj.CustomerDocumentId = newCustomerDocumentId;
        this._orderobj = this.recalculateOrderObject(this._orderobj, true);
      }
    }
  }
  SelectedCustomer() {
    if (this.iscollaps) {
      this._orderobj.Customer = new CustomerModel();
      if (this._orderobj.CustomerDocumentId) {
        this._orderobj.Discount = 0;
        this._orderobj.DiscountType = "0";
        if (this._orderobj.OrderDetails.length > 0) {
          this._orderobj.OrderDetails.forEach((detail: OrderDetailModel) => {
            detail.DiscountPercentage = 0;
          });
        }
      }
    }
    if (this._orderobj.CustomerAddress.DocumentId) {
      //this.clear();
      this._orderobj.CustomerAddressId = this._orderobj.CustomerAddress.Id;
      this._orderobj.CustomerAddressDocumentId = this._orderobj.CustomerAddress.DocumentId;
      this._orderobj.CustomerAddress = this._orderobj.CustomerAddress;
    }
    this.checkIfOldCustomerHasDiscount(this._orderobj.Customer.DocumentId,this._orderobj.CustomerDocumentId)
    this._orderobj.CustomerId = this._orderobj.Customer.Id;
    this._orderobj.CustomerDocumentId = this._orderobj.Customer.DocumentId;
    this._orderobj.CustomerName = this._orderobj.Customer.Name;
    this._orderobj.CustomerPhone = this._orderobj.Customer.Phone;
    if (this._orderobj.EmployeeId || this._orderobj.EmployeeDocumentId) {
      this._orderobj.EmployeeId = undefined;
      this._orderobj.EmployeeDocumentId = undefined;
      this._orderobj.EmployeeName = undefined;
    }
    this.PrintOrderWithDataSet(this._orderobj);
    this.GetCustomersOrders(this._orderobj.CustomerDocumentId);
    this.handelCustomerPromos(this._orderobj, true);
    this.setUseTaxNo();
  }

  cancel() {
    this.hideDeliveryModal();
    this._orderobj = this.recalculateOrderObject(this._orderobj, false);
    let modalBackDropAll = document.querySelectorAll(".modal-backdrop");
    modalBackDropAll.forEach((el) => {
      if (el.classList.contains("show")) {
        el.classList.remove("show");
        el.setAttribute("style", "z-index:-1;");
      }
    });
    this._orderobj.IsDriver = false;
  }

  custAddress(CustomerAddress: CustomerAddressModel) {
    this.orderSer.customerAddressList.forEach((x) => {
      x.IsSelected = false;
    });
    this._orderobj.CustomerAddress = CustomerAddress;
    this.selectRegion(CustomerAddress.RegionId);
    let index = this.orderSer.customerAddressList.findIndex((x) => x.DocumentId == CustomerAddress.DocumentId);
    if (index != -1) {
      this.orderSer.customerAddressList[index].IsSelected = true;
    }
    this.SelectedCustomer();
    this.PrintOrderWithDataSet(this._orderobj);
  }

  unSelectAddress(CustomerAddress: CustomerAddressModel) {
    this.clearAdrress();
    let index = this.orderSer.customerAddressList.findIndex((x) => x.DocumentId == CustomerAddress.DocumentId);
    if (index != -1) {
      this.orderSer.customerAddressList[index].IsSelected = false;
    }
  }
  setOldCustomerAddressForOrder(oldCustomerAddress: CustomerAddressModel,recalculatePayment :boolean , oldDeliveryPrice?:number){
    this.stoppGetRegionPrice = false;
    if(!this._orderobj.DocumentId || !oldCustomerAddress?.DocumentId || !oldDeliveryPrice) return;
    

    if(!this.orderSer.customerAddressList.length && 
      (!this._orderobj.CustomerAddressDocumentId || this._orderobj.CustomerAddressDocumentId == oldCustomerAddress.DocumentId)) {
      this._orderobj.CustomerAddress = oldCustomerAddress;
      this.selectRegion(oldCustomerAddress.RegionId);
      let index = this.orderSer.customerAddressList.findIndex((x) => x.DocumentId == oldCustomerAddress.DocumentId);
      if (index != -1) {
        this.orderSer.customerAddressList[index].IsSelected = true;
      }
    }
    this._orderobj.DeliveryPrice = oldDeliveryPrice;
    this.stoppGetRegionPrice = true;

    this._orderobj = this.recalculateOrderObject(this._orderobj, recalculatePayment);
    this.PrintOrderWithDataSet(this._orderobj);
  }
  GetCustomersOrders(CustomerId: any) {
    if (CustomerId) {
      this.orderSer.GetOrdersCustomer(CustomerId).subscribe((res) => {
        this.data = res as any;
        this.CustomerOrders = this.data.Result;
      });
    }
  }
  getCustomersBalance(){
    if (!this.fraction && this._orderobj?.settings) 
      this.fraction = "." + this._orderobj?.settings.Round + "-" + this._orderobj?.settings.Round;

    if(!this._orderobj.CustomerDocumentId) {
      this.customerBalance = 0;
      return;
    }
    this.cashreceiptSer.getCustomerBalance(this._orderobj.CustomerDocumentId).subscribe(
      (res:any) => {
        this.customerBalance = res;
      }
    );
  }
  showOrderDetailOfCustomer(Order: any) {
    this.SelectedCustomerOrder = Order;
    this.SelctedOrderDetails = this.SelectedCustomerOrder.OrderDetails;
  }

  SelectOrder() {
    if (this.SelectedCustomerOrder) {
      let order: any;
      // let order:OrderModel;
      order = this.clone(this.SelectedCustomerOrder);
      order.DocumentId = "";
      order.IsSync = false;
      order.CloseDate = undefined;
      order.CreationTime = undefined;
      order.WorkTimeDocumentId = undefined;
      order.WorkTimeId = undefined;
      order.Discount = 0;
      order.DiscountAmount = 0;
      order.OrderNumber = 0;
      order.OrderDetails.forEach((d) => {
        d.DocumentId = "";
        d.Printed = false;
        d.OrderDetailCancellations = [];
      });
      this.SelectedCustomerOrder = null;
      this.cancel();
      this.cancelCustomer.emit(order);
    }
  }

  openAddCustomer() {
    this.getCustomerGroupList();
    $("#DetailsCustomer").modal("show");
    this._orderobj.Customer = new CustomerModel();
    if (this.model && (!this._orderobj.Customer || !this._orderobj.Customer.Name)){
      if (!this.isAdmin && !this.validationList['CanAddCreditCustomer'])
        this.model.UseCredit = false;
      this._orderobj.Customer = this.deepCopy(this.model);
    }
    this._orderobj.Customer.OneAddress = new CustomerAddressModel();
  }
  setUseTaxNo(){
    if(this._orderobj?.Customer?.TaxNo)
      this._orderobj.Customer.UseTaxNumber = true;
  }
  getCustomerGroupList(){
    this.setUseTaxNo();
    this.customerGroupService.getLockups().subscribe((res : any) => {
      this.CustomerGroupList = res;
      if(!this._orderobj.Customer?.CustomerGroupDocumentId)
        this._orderobj.Customer.CustomerGroupDocumentId = OrderHelper.getDefaultCustomerGroup(this.CustomerGroupList)?.DocumentId;
    });
  }
  // setReservationOrder(){
  //   if(this._orderobj.IsCustomerOrder)
  //     this._orderobj.ReservationInfo.ReceivedDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
  //   else
  //     this._orderobj.ReservationInfo.ReceivedDate = undefined;
  // }

  getCustomerOrdersByCustomerId() {
    this.setOrderTypeForGrid(2);
    this.customrReservationOrders = [];
    if(!this._orderobj.CustomerDocumentId) return;
    this.customerOrderSer.getCustomerOrdersByCustomerId(this._orderobj.CustomerDocumentId).subscribe((res) => {
      this.customrReservationOrders = res;
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
    });
  }
  setOrderTypeForGrid(type:number){
    this.SelctedOrderDetails = [];
    this.orderTypeForGrid = type;
  }
}
