import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../customerorderimport";
import { ToastrService, HandlingBackMessages } from "../../manage-order/manageorderimport";
import { DatePipe } from "@angular/common";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { ProductTypeModel } from "src/app/core/Models/Transactions/product-type-model";
import { ProductPricingClassModel } from "../../pricing-class/pricing-classes-import";
import { ProductPricingClassVolumeModel } from "src/app/core/Models/Transactions/ProductPricingClassVolumeModel";
import { ProductModel } from "src/app/core/Models/Transactions/product-model";
import { OrderDetailModel } from "src/app/core/Models/Transactions/order-detail-model";
import { CustomerModel } from "../../customer/customerimport";
import { OrderPayTypeModel } from "../../pay-type/pay-type-import";
import { OrderPaymentModel } from "src/app/core/Models/order/OrderPaymentModel";
import { NoteModel } from "src/app/core/Models/Transactions/note-model";
import { OrderDetailNoteModel } from "src/app/core/Models/Transactions/order-detail-note-model";

@Component({
  selector: "app-customer-order-reservation",
  templateUrl: "./customer-order-reservation.component.html",
  styleUrls: ["./customer-order-reservation.component.scss"]
})
export class CustomerOrderReservationComponent implements OnInit {
  language: string;
  [key: string]: any;
  @ViewChild("frmRef") frmRef;

  constructor(
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public datepipe: DatePipe,
    public customerOrderSer: imp.CustomerOrderService,
    public orderSer: OrderService,
    private router: imp.Router,
    public SettingSer: imp.SettingService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages
  ) {
    //super();
    this.initializeobjects();
    this.orderHelper = new imp.OrderHelper(SettingSer, orderSer, toastr, toastrMessage, router, translate);
  }
  initObj() {
    if (!this.responseobj) this.responseobj = {};
    this.getCustomers(this.responseobj.CustomerName);
    if (!this.noteobj) this.noteobj = {};
    if (!this.responseobj.CreationTime) this.responseobj.CreationTime = new Date();
    if (!this.responseobj.ReceivedDate) this.responseobj.ReceivedDate = new Date();
    if (this.orderHelper) this.orderPayTypelist = this.orderHelper.orderPayTypelist;
    if (this.responseobj && this.responseobj.OrderPayments && this.responseobj.OrderPayments.length > 0)
      this.responseobj.PayTypeDocumentId = this.responseobj.OrderPayments[0].PayTypeDocumentId;

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

  ngOnInit(): void {
    this.FLG = { text: "Name", value: "DocumentId" };
  }
  initializeobjects(): void {
    this.printDetailobj = {};
    this.responseobj = {};
    this.noteobj = {};
    this.service = this.customerOrderSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  setCustomer(CustomerDocumentId) {
    if (!this.customers) this.customers = [];
    let customer = this.customers.filter((c) => c.DocumentId == CustomerDocumentId)[0];
    // if(!customer) customer = new CustomerModel();
    if (customer) {
      this.responseobj.Customer = customer;
      this.responseobj.CustomerId = customer.Id;
      this.responseobj.CustomerDocumentId = customer.DocumentId;
      this.responseobj.CustomerName = customer.Name;
      this.responseobj.CustomerPhone = customer.Phone;
    }
  }

  getCustomers(CustomerName) {
    let model: CustomerModel = new CustomerModel();
    if (!CustomerName) model.Phone = "0";
    model.Name = CustomerName;
    model.UseCredit = true;
    this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
      this.customers = res as CustomerModel[];
    });
  }
}
