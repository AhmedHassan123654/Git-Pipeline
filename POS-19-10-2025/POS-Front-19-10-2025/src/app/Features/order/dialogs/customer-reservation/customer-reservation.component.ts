import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DetailsCustomerComponent } from "../details-customer/details-customer.component";
import { ToastrService } from "ngx-toastr";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { CustomerModel } from "../../../../core/Models/Transactions/CustomerModel";
import * as imp from "../../../customer-order/customerorderimport";
import { OrderService } from "../../../../core/Services/Transactions/order.service";
import { OrderPaymentModel } from "../../../../core/Models/order/OrderPaymentModel";
import { ModalResult } from "../../../../core/Models/Shared/modal-result.interface";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs-compat/Subject";
import { debounceTime, tap } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";
import { OrderModel } from "../../../../core/Models/order/orderModel";
import { CustomerOrderModel } from "../../../../core/Models/order/customer-order.model";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-customer-reservation",
  templateUrl: "./customer-reservation.component.html",
  styleUrls: ["./customer-reservation.component.scss"]
})
export class CustomerReservationComponent implements OnInit, OnDestroy {
  language: string;

  [key: string]: any;

  modalResult: ModalResult = {
    role: undefined,
    data: {}
  };

  @ViewChild("frmRef") frmRef;

  customerData?: Observable<any>;
  // Delayed search
  searchDebounce = new Subject<string>();
  searchDebounceSub?: Subscription;

  orderObj: OrderModel;
  table: any;

  formatString = "HH:mm";
  interval = 10;
  searchCustomer: string;


  constructor(
    private modalService: BsModalService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    public customerOrderSer: imp.CustomerOrderService,
    public orderSer: OrderService,
    private router: imp.Router,
    public SettingSer: imp.SettingService,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages,
    public datepipe: DatePipe,
    public modalRef: BsModalRef
  ) {
    this.initializeobjects();
    this.orderHelper = new imp.OrderHelper(SettingSer, orderSer, toastr, toastrMessage, router, translate);
  }

  ngOnDestroy(): void {
    if (this.searchDebounceSub) this.searchDebounceSub.unsubscribe();
  }

  ngOnInit(): void {
    console.warn("Got order type", this.orderObj);
    this.FLG = { text: "Name", value: "DocumentId" };
    this.initObj();

    this.searchDebounceSub = this.searchDebounce.pipe(debounceTime(500)).subscribe((searchText) => {
      this.getCustomers(searchText);
    });
  }

  initObj() {
    this.responseobj = {};

    if (!this.modalResult.data) this.modalResult.data = {};
    this.getCustomers(this.modalResult.data.CustomerName);
    if (!this.noteobj) this.noteobj = {};
    if (!this.modalResult.data.CreationTime) this.modalResult.data.CreationTime = new Date();
    if (!this.modalResult.data.ReceivedDate) this.modalResult.data.ReceivedDate = new Date();
    if (!this.modalResult.data.ReceivedTime) this.modalResult.data.ReceivedTime = new Date();
    if (this.orderHelper) this.orderPayTypelist = this.orderHelper.orderPayTypelist;
    if (this.modalResult.data && this.modalResult.data.OrderPayments && this.modalResult.data.OrderPayments.length > 0)
      this.modalResult.data.PayTypeDocumentId = this.modalResult.data.OrderPayments[0].PayTypeDocumentId;

    if (this.productgrouplist && this.productgrouplist.length > 0) {
      this.productgrouplist.forEach((element2) => {
        if (element2.Products.length > 0) {
          element2.Products.forEach((element3) => {
            if (!element3.Price) element3.Price = 0;
            if (
              element3.ProductVolumes &&
              element3.ProductVolumes.length > 0 &&
              this.volumes &&
              this.volumes.length > 0
            ) {
              element3.ProductVolumes.forEach((pv) => {
                pv.VolumeName = this.volumes.find(
                  (v) =>
                    (pv.VolumeId && v.Id == pv.VolumeId) || (pv.VolumeDocumentId && v.DocumentId == pv.VolumeDocumentId)
                )?.Name;
              });
            }
            element3 = this.assignTaxToProduct(element3);
            element3 = this.assignProductPrice(element3, this.pointOfSale);

            element3.ProductGroupName = element2.Name;
            this.allproductlist.push(element3);
          });
        }
      });

      this.allproductlist = this.distinct(this.allproductlist, "DocumentId");
    }
  }

  initializeobjects(): void {
    this.modalResult.data = {};
    this.noteobj = {};
    this.service = this.customerOrderSer;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  setCustomer(CustomerDocumentId) {
    if (!this.customers) this.customers = [];
    const customer = this.customers.filter((c) => c.DocumentId == CustomerDocumentId)[0];
    if (customer) {
      this.modalResult.data.Customer = customer;
      this.modalResult.data.CustomerId = customer.Id;
      this.modalResult.data.CustomerDocumentId = customer.DocumentId;
      this.modalResult.data.CustomerName = customer.Name;
      this.modalResult.data.CustomerPhone = customer.Phone;
    }
  }

  getCustomers(CustomerName) {
    const model: CustomerModel = new CustomerModel();
    if (!CustomerName) model.Phone = "0";
    model.Name = CustomerName;
    model.UseCredit = true;
    this.customerData = this.orderSer.GetCustomerByMobileOrName(model).pipe(
      tap((res) => {
        this.customers = res as CustomerModel[];
      })
    );
    // this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
    //   this.customers = res as CustomerModel[];
    // });
  }

  onFiltering(e) {
    this.searchDebounce.next(e.text);
  }

  recalculateOrderObject(orderobj) {
    orderobj = this.orderHelper.recalculateOrderObject(orderobj);
    orderobj.OrderPayments = [];
    const payment: OrderPaymentModel = new OrderPaymentModel();
    const payType = this.orderPayTypelist.filter((x) => x.DocumentId == orderobj.PayTypeDocumentId)[0];
    payment.PayTypeDocumentId = orderobj.PayTypeDocumentId;
    payment.PayTypeName = payType?.Name;
    payment.PayTypeId = payType?.Id;
    orderobj.OrderPayments.push(payment);
    /*    orderobj.OrderDetails.forEach((d) => {
          if (d.ProductPrice) d.ProductPrice = d.ProductPrice.toFixed(this.round);
        });*/
    return orderobj;
  }

  addCustomer() {
    const customerInfoModalRef = this.modalService.show(DetailsCustomerComponent, { class: "second" });

    customerInfoModalRef.onHide.subscribe((reason: any) => {
      const result = customerInfoModalRef.content.modalResult;
      if (result && result.role == "save") {
        this.getCustomers("");
      }
    });
  }

  saveCustomerOrder(form, event) {
    if (form.form.invalid) return;

    // Getting which button clicked
    const submitType = event.submitter.value;
    let role = "save";
    if (submitType && submitType == "noProducts") {
      // Submit without products
      role = "saveWithoutProducts";
    }

    const orderTypeData: Partial<CustomerOrderModel> = {
      OrderType: this.orderObj.OrderType,
      OrderTypeId: this.orderObj.OrderTypeId,
      OrderTypeDocumentId: this.orderObj.OrderTypeDocumentId,
      OrderTypeName: this.orderObj.OrderTypeName,
      Table: this.table,
      TableId: this.table.DocumentId,
      TableName: this.table.Name
    };

  // format change for ReceivedTime
  const numberFormatter = new Intl.NumberFormat([], {minimumIntegerDigits: 2});
  const selectedTime = form.form.value.ReceivedTime as Date;
  const hour = selectedTime.getHours();
  const minute = selectedTime.getMinutes();
  const receivedTime = `${numberFormatter.format(hour)}:${numberFormatter.format(minute)}`;
  const formattedData = {
    ReceivedTime :receivedTime
  };

  this.modalResult = { role, data: { ...this.modalResult.data, ...orderTypeData, ...form.form.value, ...formattedData } };


    if (this.modalResult.role == "saveWithoutProducts") {
      this.saveWithoutProducts();
      return; // don't close dialog now
    }

    this.closeModal();
  }

  closeModal() {
    this.modalRef.hide();
  }

  saveWithoutProducts() {
    const customerOrder = new CustomerOrderModel(this.modalResult.data);

    this.customerOrderSer.Transactions(customerOrder, "Post").subscribe({
      next: (res) => {
        this.toastr.success(this.translate.instant("Order.CustomerOrderSaved"));
        this.closeModal();
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Order.CustomerOrderError"));
      }
    });
  }

  filterCustomers(searchterm: any) {
    let model: CustomerModel = new CustomerModel();
    if (searchterm.target.value.length >= 3) {
      if (Number(searchterm.target.value) > 0) {
        //search by phone
        model.Phone=searchterm.target.value;
      }else{
        //search by name
        model.Name=searchterm.target.value;
      }
      this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
        this.customers = res as CustomerModel[];
        //assign first customer of the search result
        this.responseobj.CustomerDocumentId = this.customers[0]?.DocumentId;
        this.setCustomer(this.customers[0]?.DocumentId);
      });
    }
  }

  GetAllCustomerOrders() {
    this.customerOrderSer.getTodaysCustomerOrders(this.table.DocumentId).subscribe((res) => {
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
    });
  }

}
