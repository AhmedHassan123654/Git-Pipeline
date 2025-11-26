import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../customerorderimport";
import { ToastrService, HandlingBackMessages } from "../../manage-order/manageorderimport";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { DatePipe } from "@angular/common";
// import { OrderHelper } from '../../order/OrderHelper';
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { ProductTypeModel } from "src/app/core/Models/Transactions/product-type-model";
import { ProductPricingClassModel } from "../../pricing-class/pricing-classes-import";
import { ProductPricingClassVolumeModel } from "src/app/core/Models/Transactions/ProductPricingClassVolumeModel";
import { ProductModel } from "src/app/core/Models/Transactions/product-model";
import { OrderDetailModel } from "src/app/core/Models/Transactions/order-detail-model";
import { CustomerModel } from "../../customer/customerimport";
import { OrderPaymentModel } from "src/app/core/Models/order/OrderPaymentModel";
import { NoteModel } from "src/app/core/Models/Transactions/note-model";
import { OrderDetailNoteModel } from "src/app/core/Models/Transactions/order-detail-note-model";
import { OrderDetailSubItemModel } from "src/app/core/Models/Transactions/order-detail-sub-item-model";
import { OrderInsuranceService } from "../../order-insurance/orderInsuranceimport";
import { Guid } from "guid-typescript";
import { ProductSubItemModel } from "src/app/core/Models/Transactions/product-sub-item-model";
import { sumByKey } from "src/app/core/Helper/objectHelper";
import { CustomerOrderModel } from "src/app/core/Models/order/customer-order.model";

declare var Stimulsoft: any;
declare let $: any;

@Component({
  selector: "app-customer-order",
  templateUrl: "./customer-order.component.html",
  styleUrls: ["./customer-order.component.scss"]
})
export class CustomerOrderComponent extends imp.general implements OnInit {
  language: string;

  [key: string]: any;
  private filterNotesTimer: any;
  orderPayTypelist = [];
  allproductlist = [];
  @ViewChild("frmRef") frmRef;
  loading: boolean = true;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  orderHelper:imp.OrderHelper;
  constructor(
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public datepipe: DatePipe,
    public customerOrderSer: imp.CustomerOrderService,
    public orderSer: OrderService,
    private router: imp.Router,
    public SettingSer: imp.SettingService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    public orderInsuranceSer:OrderInsuranceService
  ) {
    super();
    this.initializeobjects();
    this.orderHelper = new imp.OrderHelper(SettingSer, orderSer, toastr, toastrMessage, router, translate);
  }

  searchCustomer: string;

  initObj() {
    if (!this.responseobj) this.responseobj = {};
    this.getCustomers(this.responseobj.CustomerName);
    if(this.responseobj.CustomerDocumentId) this.setCustomer(this.responseobj.CustomerDocumentId);
    if (!this.noteobj) this.noteobj = {};
    if (!this.responseobj.CreationTime) this.responseobj.CreationTime = new Date();
    if (!this.responseobj.ReceivedDate) this.responseobj.ReceivedDate = new Date();
    if (this.orderHelper)
      this.orderPayTypelist = this.orderHelper.orderPayTypelist.filter((x) => x.PayType != 20);
    if (this.responseobj && this.responseobj.OrderPayments && this.responseobj.OrderPayments.length > 0)
      this.responseobj.PayTypeDocumentId = this.responseobj.OrderPayments[0].PayTypeDocumentId;

    this.allproductlist = [];
    if (this.productgrouplist && this.productgrouplist.length > 0) {
      this.productgrouplist.forEach((element2) => {
        if (element2.Products.length > 0) {
          element2.Products.forEach((element3) => {
            if (!element3.Price) element3.Price = 0;
            element3 = this.assignTaxToProduct(element3);
            element3 = this.assignProductPrice(element3, this.pointOfSale);
            const hasVolumes = this.setVolumeAsProduct(element3, element2);
            element3.ProductGroupName = element2.Name;

            if(!hasVolumes){
              if (!element3.UUID) element3.UUID = Guid.create().toString();
              this.allproductlist.push(element3);
            }
          });
        }
      });

      this.allproductlist = this.distinct(this.allproductlist, "UUID");
    }

    this.setUUIDForOrderDetails();
    this.setOrderType(this.responseobj?.OrderTypeDocumentId);
  }

  setUUIDForOrderDetails(){
    if(!this.responseobj?.OrderDetails?.length || !this.allproductlist?.length) return;

    setTimeout(() => {
      this.responseobj.OrderDetails.forEach(detail=>{
        if(detail.VolumeDocumentId || detail.VolumeId)
          detail.UUID = this.allproductlist.find(p=> p.DocumentId == detail.ProductDocumentId && 
            ((detail.VolumeDocumentId && p.VolumeDocumentId == detail.VolumeDocumentId) || (detail.VolumeId && p.VolumeId == detail.VolumeId)))?.UUID;
        else
          detail.UUID = this.allproductlist.find(p=> p.DocumentId == detail.ProductDocumentId)?.UUID;
      });
    }, 100);
    
  }

  ngOnInit(): void {
    this.FLG = { text: "Name", value: "DocumentId" };
    this.FLGUUID = { text: "Name", value: "UUID" };
    this.scrFirstOpen().subscribe(() => {
      // this.getCustomers(this.responseobj.CustomerName);
      this.OrderfirstOpen();
      // this.HelperFirstOpen();
      if (this.request && (this.request.currentAction == "Edit" || this.request.currentAction == "Add"))
        this.enableChiled = true;
      else this.enableChiled = false;
      this.setOrderType(this.responseobj?.OrderTypeDocumentId);
    });
  }

  initializeobjects(): void {
    this.printDetailobj = {};
    this.responseobj = {};
    this.noteobj = {};
    this.service = this.customerOrderSer;
    this.request = this.router.getCurrentNavigation()?.extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.Flds = { text: "Name", value: "DocumentId" };
  }

  OrderfirstOpen() {
    this.orderSer.FirstOpen().subscribe((res) => {
      if (!res) this.routIfMissingData("pointofsale");
      this.producttypelist = res["productTypes"] as ProductTypeModel[];
      if (!this.producttypelist || this.producttypelist.length == 0) this.routIfMissingData("producttype");
      this.settingobj = res["settingModel"];
      if (!this.settingobj) this.routIfMissingData("setting");
      this.volumes = res["volumes"];
      this.pointOfSale = res["pointOfSale"];
      this.promos = res["promos"];
      this.productTaxes = res["productTaxes"];
      this.taxes = res["taxes"];
      const halls = res["halls"];
      this.tablelist = halls?.flatMap(x=>x.Tables);
      this.orderTypeList = res["ordertypes"];
      this.productPricingClasses = res["productPricingClasses"] as ProductPricingClassModel[];
      this.productPricingClasseVolumes = res["productPricingClasseVolumes"] as ProductPricingClassVolumeModel[];
      this.productgrouplist = [];
      this.productlist = [];
      this.allproductlist = [];
      this.producttypelist.forEach((t) => {
        if (t.ProductGroups.length != 0) {
          t.ProductGroups.forEach((element) => {
            this.productgrouplist.push(element);
          });
        }
      });

      // this.loadProductDetails(this.productgrouplist[0]);
      this.round = this.settingobj.Round;
      if (this.settingobj) this.fraction = "." + this.settingobj.Round + "-" + this.settingobj.Round;
      this.initObj();
    });
  }
  setVolumeAsProduct(product:any , productGroup:any):boolean{
    if (product.ProductVolumes?.length && this.volumes?.length) {
      product.ProductVolumes.forEach((pv) => {
        let volumeShowAsAproduct:any = new ProductModel();
        this.assignPriceToVolumes(product);
        const ee =  this.volumes.find((v) => (pv.VolumeId && v.Id == pv.VolumeId) || (pv.VolumeDocumentId && v.DocumentId == pv.VolumeDocumentId) );
        
        pv.VolumeName = ee?.Name;
        volumeShowAsAproduct = this.deepCopy(product);
        // volumeShowAsAproduct.ProductVolumes = [];
        volumeShowAsAproduct.Price = pv.Price;
        volumeShowAsAproduct.VolumeDocumentId = pv.VolumeDocumentId;
        volumeShowAsAproduct.VolumeId = pv.VolumeId;
        volumeShowAsAproduct.Name = product.Name + " " + "/ " + pv.VolumeName;
        volumeShowAsAproduct.IsVolume = true;
        volumeShowAsAproduct.ProductVolumeName = pv.VolumeName;
        // productGroup.Products.push(volumeShowAsAproduct);
        if (!volumeShowAsAproduct.UUID) volumeShowAsAproduct.UUID = Guid.create().toString();
        this.allproductlist.push(volumeShowAsAproduct);
      });
      return true;
    }
    return false;
  }
  // HelperFirstOpen (){
  //   this.orderSer.HelperFirstOpen().subscribe((res) => {
  //     this.orderPayTypelist = res['Item2'] as OrderPayTypeModel[];
  //   });
  // }
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
      // let val : string = this.responseobj.CustomerDocumentId;
      // this.responseobj.CustomerDocumentId = null;
      // this.responseobj.CustomerDocumentId = val;
    });
  }

  onFiltering = (e) => {
    this.getCustomers(e?.text);
    let model: CustomerModel = new CustomerModel();
    model.UseCredit = true;
    if (!e?.text) model.Phone = "0";
    model.Name = e?.text;
    this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
      this.customers = res as CustomerModel[];
      e.updateData(this.customers, "");
    });
  }

  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
    this.initObj();
  }

  quickEvents(event: imp.quickAction): void {
    // debugger
    if(this.responseobj.CustomerDocumentId) this.setCustomer(this.responseobj.CustomerDocumentId);
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({});
        this.initObj();
        this.enableChiled = true;
        // if(this.responseobj && this.responseobj.screenPermission)this.responseobj.screenPermission.Print=false;
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        this.initObj();
        this.enableChiled = false;
        //if(this.responseobj && this.responseobj.screenPermission)this.responseobj.screenPermission.Print=false;
        this.PrintAfterAdd();
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        this.initObj();
        this.enableChiled = true;
        // if(this.responseobj && this.responseobj.screenPermission)this.responseobj.screenPermission.Print=false;
        break;
      case imp.quickAction.afterUpdate:
        this.checkRequiredFeildsBeforeSave();
        this.enableChiled = false;
        break;
      case imp.quickAction.beforeUpdate:
        this.checkRequiredFeildsBeforeSave();
        break;
      case imp.quickAction.beforeAdd:
        this.checkRequiredFeildsBeforeSave();
        break;
      case imp.quickAction.afterUndo:
        this.initObj();
        this.enableChiled = false;
        break;
    }
  }
  checkRequiredFeildsBeforeSave() {
    // Mark all form controls as touched to show validation messages
    Object.keys(this.frmRef.controls).forEach(key => {
      const control = this.frmRef.controls[key];
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    const order:CustomerOrderModel = this.responseobj;
    if(!this.frmRef.form.invalid && order.OrderDetails?.some(x=>x.OrderDetailSubItems?.length > 0)) {
      const orderDetails:OrderDetailModel[] = order.OrderDetails.filter(x=>x.OrderDetailSubItems?.length > 0);
      orderDetails.forEach(orderDetail => {
        const sideQuantity = sumByKey(orderDetail.OrderDetailSubItems, 'SingleQuantity');
        if(sideQuantity > orderDetail.Product?.NumberOfSideDishesAllowed) {
          this.toastr.info(orderDetail.ProductName + " - " + this.translate.instant("products.NumberOfSideDishesAllowed") + " : " + orderDetail.Product?.NumberOfSideDishesAllowed);
          this.frmRef.form.setErrors({ 'invalid': true });
        }
        if(sideQuantity < orderDetail.Product?.MinNumberOfSideDishesAllowed) {
          this.toastr.info(orderDetail.ProductName + " - " + this.translate.instant("products.MinNumberOfSideDishesAllowed") + " : " + orderDetail.Product?.MinNumberOfSideDishesAllowed);
          this.frmRef.form.setErrors({ 'invalid': true });
        }
      });
    }
  }
  //#region
  addToOrderDetailList() {
    if (!this.responseobj.OrderDetails) this.responseobj.OrderDetails = [];
    let detail = new OrderDetailModel();
    detail.UUID = '';
    this.responseobj.OrderDetails.push(detail);
  }

  setOrderDetail(index:number ,event:any) {
    if(!this.allproductlist?.length) return;
    let product = event?.itemData;

    if (product) {
      this.responseobj.OrderDetails[index] = {};
      this.responseobj.OrderDetails[index].UUID = product.UUID;
      this.responseobj.OrderDetails[index].ProductId = product.Id;
      this.responseobj.OrderDetails[index].ProductDocumentId = product.DocumentId;
      this.responseobj.OrderDetails[index].ProductPrice = product.Price;
      this.responseobj.OrderDetails[index].ProductName = product.Name;
      this.responseobj.OrderDetails[index].Product = this.deepCopy(product);
      this.responseobj.OrderDetails[index].VolumeDocumentId = product.VolumeDocumentId;
      this.responseobj.OrderDetails[index].VolumeId = product.VolumeId;
      this.responseobj.OrderDetails[index].ProductVolumName = product.ProductVolumeName;
      if (!this.responseobj.OrderDetails[index].ProductQuantity)
        this.responseobj.OrderDetails[index].ProductQuantity = 1;

      let group = this.productgrouplist.find((g) => g.DocumentId == product.ProductGroupDocumentId);
      if (group) {
        this.responseobj.OrderDetails[index].ProductGroupId = group.Id;
        this.responseobj.OrderDetails[index].ProductGroupDocumentId = group.DocumentId;
        this.responseobj.OrderDetails[index].ProductGroupName = group.Name;
      }
      this.responseobj = this.recalculateOrderObject(this.responseobj);
    }
  }

  recalculateOrderObject(orderobj) {
    orderobj.Discount = 0;
    if (!orderobj.OrderDetails) orderobj.OrderDetails = [];
    orderobj.OrderDetails.forEach((d) => {
      if (!d.Discount) d.Discount = 0;
      if (!d.OrderDiscountValue) d.OrderDiscountValue = 0;

      if (d.Discount > 0) {
        if (d.Discount > 100) d.Discount = 100;
        d.OrderDiscountValue = d.ProductPrice * d.ProductQuantity * (d.Discount / 100);
      }
      // else if(d.OrderDiscountValue > 0){
      //   if(d.OrderDiscountValue > (d.ProductPrice * d.ProductQuantity) )
      //     d.OrderDiscountValue  = (d.ProductPrice * d.ProductQuantity);
      //   100*50/100
      // }
      // orderobj.Discount += d.OrderDiscountValue;
      orderobj.Discount += d.Discount;
      orderobj.DiscountType = 1;
      if(!d.UUID) d.UUID = Guid.create().toString();
    });

    orderobj = this.orderHelper.recalculateOrderObject(orderobj);
    orderobj.OrderPayments = [];
    let payment: OrderPaymentModel = new OrderPaymentModel();
    let payType = this.orderPayTypelist.filter((x) => x.DocumentId == orderobj.PayTypeDocumentId)[0];
    payment.Amount = orderobj?.SubTotal;
    payment.PayTypeDocumentId = payType?.DocumentId;
    orderobj.OrderPayTypeName = payType?.Name ? payType?.Name : orderobj?.OrderPayTypeName;
    orderobj.OrderPayTypeId = payType?.Id ? payType?.Id : orderobj?.OrderPayTypeId;
    orderobj.OrderPayTypeDocumentId = payType?.DocumentId ? payType?.DocumentId : orderobj?.OrderPayTypeDocumentId;
    payment.PayTypeName = payType?.Name;
    payment.PayTypeId = payType?.Id;
    orderobj.OrderPayments.push(payment);
    orderobj.OrderDetails.forEach((d) => {
      if (d.ProductPrice) d.ProductPrice = Number(d.ProductPrice).toFixed(this.round);
    });

    return orderobj;
  }

  Plus(i) {
    this.responseobj.OrderDetails[i].ProductQuantity += 1;
    this.responseobj = this.recalculateOrderObject(this.responseobj);
  }

  Minus(i) {
    if (this.responseobj.OrderDetails[i].ProductQuantity > 1) {
      this.responseobj.OrderDetails[i].ProductQuantity -= 1;
      this.responseobj = this.recalculateOrderObject(this.responseobj);
    }
  }

  delete(i) {
    this.responseobj.OrderDetails.splice(i, 1);
    this.responseobj = this.recalculateOrderObject(this.responseobj);
  }

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

    // this.orderInsuranceSer.printAfterAdd(this.model).subscribe((data: Response) => {

    //   this.loading = false;
    //   this.report.loadDocument(data);
    //   this.viewer.report = this.report;
    //   this.viewer.renderHtml("myviewer");
    //   $("#modal-5").modal("show");
    // });
    this.ifPerview = false;

    return false;
  }

  assignTaxToProduct(element3: ProductModel) {
    if (this.productTaxes && this.productTaxes.length > 0 && this.taxes && this.taxes.length > 0) {
      let productWithTaxesIds = this.productTaxes.map((x) => x.ProductId);
      let productWithTaxesDocumentIds = this.productTaxes.map((x) => x.ProductDocumentId);
      if (
        (productWithTaxesIds || productWithTaxesDocumentIds) &&
        (productWithTaxesIds.includes(element3.Id) || productWithTaxesDocumentIds.includes(element3.DocumentId))
      ) {
        let pt = this.productTaxes.find(
          (x) => (element3.Id && x.ProductId == element3.Id) || x.ProductDocumentId == element3.DocumentId
        );
        let tx = pt
          ? this.taxes.find((t) => (pt.TaxId && t.Id == pt.TaxId) || t.DocumentId == pt.TaxDocumentId)
          : undefined;
        if (tx) {
          element3.Tax = tx;
          element3.TaxId = tx.Id;
          element3.TaxDocumentId = tx.DocumentId;
        } else {
          element3.Tax = undefined;
          element3.TaxId = undefined;
          element3.TaxDocumentId = undefined;
        }
      } else {
        element3.Tax = undefined;
        element3.TaxId = undefined;
        element3.TaxDocumentId = undefined;
      }
    } else {
      element3.Tax = undefined;
      element3.TaxId = undefined;
      element3.TaxDocumentId = undefined;
    }
    return element3;
  }

  assignProductPrice(product: ProductModel, pos) {
    let productPricingClass = product.ProductPricingClasses[0];
    let changed = false;
    if (this.productPricingClasses && this.productPricingClasses.length > 0) {
      if (pos && pos.PricingClassId && !changed) {
        changed = true;
        let pPClass = this.productPricingClasses.find(
          (pp) => pp.ProductDocumentId == product.DocumentId && pp.PricingClassDocumentId == pos.PricingClassId
        );
        if (pPClass) {
          productPricingClass = pPClass;
        }
      }
    }
    product.Price = productPricingClass ? productPricingClass.Price : 0;
    if (product.ProductVolumes && product.ProductVolumes.length > 0) {
      product = this.assignPriceToVolumes(product);
      if (!product.Price) product.Price = product.ProductVolumes.filter((x) => x.MainUnit)[0]?.Price;
    }
    return product;
  }

  assignPriceToVolumes(product: ProductModel) {
    let productPricingClassVolumes = this.getProductPricingClasseVolumes(this.deepCopy(product), this.pointOfSale);
    if (productPricingClassVolumes && productPricingClassVolumes.length > 0) {
      productPricingClassVolumes.forEach((pp) => {
        let index = product.ProductVolumes.findIndex(
          (x) =>
            (pp.VolumeId && x.VolumeId == pp.VolumeId) ||
            (pp.VolumeDocumentId && x.VolumeDocumentId == pp.VolumeDocumentId)
        );
        if (index != -1) product.ProductVolumes[index].Price = pp.Price;
      });
    }
    return product;
  }

  getProductPricingClasseVolumes(product: ProductModel, pos) {
    let productPricingClasseVolumes = product.ProductPricingClasses[0]?.ProductPricingClassVolumes;
    let changed = false;
    if (this.productPricingClasseVolumes && this.productPricingClasseVolumes.length > 0) {
      if (pos && pos.PricingClassId && !changed) {
        changed = true;
        let ppcv = this.productPricingClasseVolumes.filter(
          (x) => x.PricingClassDocumentId == pos.PricingClassId && x.ProductDocumentId == product.DocumentId
        );
        if (ppcv && ppcv.length > 0) {
          productPricingClasseVolumes = ppcv;
        }
      }
    }
    return productPricingClasseVolumes;
  }

  openNoteModel(i: number) {
    if(!this.enableChiled) return;
    this.index = i;
    if (!this.responseobj.OrderDetails[this.index].OrderDetailNotes)
      this.responseobj.OrderDetails[this.index].OrderDetailNotes = [];
    this.getAllNotes(this.responseobj.OrderDetails[i]);
    $("#updatemodal-Notes").modal("show");
  }
  index: number;
  currentOrderDetail?:OrderDetailModel;
  openSideDishes(i: number) {
    if(!this.enableChiled) return;
    this.index = i;
    this.currentOrderDetail = this.responseobj.OrderDetails[this.index];
    
    // Initialize if not exists
    if (!this.currentOrderDetail?.OrderDetailSubItems) {
      this.currentOrderDetail.OrderDetailSubItems = [];
    }
    
    // Initialize selected side dishes
    if (this.currentOrderDetail?.Product?.ProductSubItems?.length > 0 && this.currentOrderDetail?.OrderDetailSubItems?.length > 0) {
      this.currentOrderDetail.Product?.ProductSubItems.forEach((subItem) => {
        subItem.selected = false;
        let orderDetailSubItem = this.currentOrderDetail.OrderDetailSubItems.find((orderDetailSubItem) => orderDetailSubItem.ProductSubItemDocumentId === subItem.SubItemDocumentId);
        if (orderDetailSubItem) {
          subItem.selected = true;
          subItem.Quantity = orderDetailSubItem.SingleQuantity;
        }
      });
    }
    else{
      this.currentOrderDetail?.Product?.ProductSubItems?.forEach((subItem) => {
        subItem.selected = false;
      });
    }
    
    $("#modal-SideDishes").modal("show");
  }

  isSideDishSelected(subItemDocumentId: string): boolean {
    return this.currentOrderDetail && this.currentOrderDetail?.Product?.ProductSubItems.some(item => item.SubItemDocumentId === subItemDocumentId && item.selected);
  }

  isAllSideDishSelected(): boolean {
    return this.currentOrderDetail && this.currentOrderDetail?.Product?.ProductSubItems.every(item => item.selected);
  }
  toggleAllSideDishs(event: any) {
    if (!event.target.checked)
      this.currentOrderDetail?.Product?.ProductSubItems.forEach(item => item.selected = false);
    else
      this.currentOrderDetail?.Product?.ProductSubItems.forEach(item => item.selected = true);
  }

  toggleSideDish(subItem: ProductSubItemModel) {
    const index = this.currentOrderDetail?.Product?.ProductSubItems.findIndex(
      item => item.SubItemDocumentId === subItem.SubItemDocumentId
    );

    if (index != -1)
      this.currentOrderDetail.Product.ProductSubItems[index].selected = !this.currentOrderDetail?.Product?.ProductSubItems[index].selected;
    
  }

  saveSideDishes() {
    if (this.currentOrderDetail?.Product?.ProductSubItems) {
      // Update the OrderDetailSubItems with selected side dishes
      this.currentOrderDetail.OrderDetailSubItems = this.currentOrderDetail.Product.ProductSubItems
        .filter(item => item.selected)
        .map(item => {
          const orderDetailSubItem = new OrderDetailSubItemModel();
          orderDetailSubItem.OrderDetailId = ' ';
          orderDetailSubItem.ProductSubItemId = item.SubItemId || 0;
          orderDetailSubItem.ProductSubItemDocumentId = item.SubItemDocumentId || '';
          orderDetailSubItem.ProductSubItemName = item.Name || '';
          orderDetailSubItem.Price = item.NewPrice || 0;
          orderDetailSubItem.RealPrice = 0;
          orderDetailSubItem.SingleQuantity = item.Quantity || 1;
          orderDetailSubItem.Quantity = orderDetailSubItem.SingleQuantity * this.currentOrderDetail?.ProductQuantity;
          return orderDetailSubItem;
        });
      
      // Recalculate order totals if needed
      this.responseobj = this.recalculateOrderObject(this.responseobj);
      
      // Close the modal
      $("#modal-SideDishes").modal("hide");
      this.currentOrderDetail = undefined;
    }
  }
  getAllNotes(orderdetail: any, isFromAdd = false) {
    this.orderSer.GetAllNotes().subscribe((res) => {
      this.noteslist = res as NoteModel[];
      this.filterNotesList = this.noteslist;
      if (this.noteslist.length != 0 && orderdetail.OrderDetailNotes && orderdetail.OrderDetailNotes.length != 0) {
        this.noteslist.forEach((element) => {
          let checknoteexist = orderdetail.OrderDetailNotes.find((p) => p.NoteId == element.Id);
          if (checknoteexist) element.NoteChecked = true;
        });
      }
      if (isFromAdd) {
        let note = this.noteslist.find((n) => n.Name.toLowerCase() == this.noteobj.Name.toLowerCase());
        note.NoteChecked = true;
        if (note) this.notesChecked("", note);
      }
    });
  }

  addNewNote(noteobj: NoteModel) {
    if (noteobj.Name == "" || noteobj.Name == undefined) this.shownoteerror = true;
    else {
      this.shownoteerror = false;
      if (this.noteslist.length != 0) {
        this.checknoteexist = false;
        this.noteslist.forEach((element) => {
          if (element.Name == noteobj.Name) this.checknoteexist = true;
        });
      }
      if (this.checknoteexist == true) {
        this.toastr.error("Note already exist");
      } else {
        this.orderSer.PostNote(noteobj).subscribe(
          (res) => {
            if (res == 1) {
              this.toastr.success("Saved successfully");
              //noteobj.Name = "";
              this.getAllNotes(this.responseobj.OrderDetails[this.index], true);
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

  notesChecked(event: any, note: any) {
    if (event) {
      if (note.NoteChecked) note.NoteChecked = false;
      else note.NoteChecked = true;
    }
    this.orderdetailnotesobj = new OrderDetailNoteModel();
    if (!this.responseobj.OrderDetails[this.index].OrderDetailNotes)
      this.responseobj.OrderDetails[this.index].OrderDetailNotes = [];
    if (note.NoteChecked) {
      this.orderdetailnotesobj.NoteId = note.Id;
      this.orderdetailnotesobj.NoteDocumentId = note.DocumentId;
      this.orderdetailnotesobj.NoteName = note.Name;
      note.NoteChecked = true;
      this.responseobj.OrderDetails[this.index].OrderDetailNotes.push(this.orderdetailnotesobj);
    } else {
      let index = this.responseobj.OrderDetails[this.index].OrderDetailNotes.findIndex((p) => p.NoteName === note.Name);
      this.responseobj.OrderDetails[this.index].OrderDetailNotes.splice(index, 1);
    }
  }

  DeleteOrderDetailNote(orderdetailnote: any, index: any) {
    if (!this.responseobj.OrderDetails[this.index].OrderDetailNotes)
      this.responseobj.OrderDetails[this.index].OrderDetailNotes = [];
    this.noteslist.forEach((element) => {
      if (element.Name == orderdetailnote.NoteName) element.NoteChecked = false;
    });
    this.responseobj.OrderDetails[this.index].OrderDetailNotes.splice(index, 1);
  }

  filterNotes() {
    if (this.filterNotesTimer) clearTimeout(this.filterNotesTimer);
    this.filterNotesTimer = setTimeout(() => {
      const key = (this.noteobj?.Name || '').toString();
      if (key && key.trim().length > 0) {
        this.orderSer.GetFilteredNotes(key.trim()).subscribe((res: any) => {
          this.filterNotesList = res || [];
        });
      } else {
        this.filterNotesList = this.noteslist;
      }
    }, 500);
  }

  changeProductPrice(orderdetail: OrderDetailModel) {
    orderdetail.EditedPrice = Number(orderdetail.ProductPrice);
    orderdetail.ProductPrice = Number(orderdetail.ProductPrice);
    orderdetail.Product.Price = orderdetail.ProductPrice;
    orderdetail.Product.PriceChanged = true;
    let product = this.allproductlist.find((x) => x.DocumentId == orderdetail.Product.DocumentId);
    if (product) {
      product.PriceChanged = true;
      product.Price = Number(orderdetail.ProductPrice);
    }
    this.responseobj = this.recalculateOrderObject(this.responseobj);
  }

  OpenCustomerPOPUp() {
    this.customerToAdd = {};
    $("#DetailsCustomer").modal("show");
  }

  submitCustomer(form) {
    if (!form.form.valid) return false;
    this.orderSer.GetCustomerByPhone(this.customerToAdd.Phone).subscribe((res) => {
      if ((res as boolean) == true) {
        this.toastr.warning("this Customer already exist", "Customer");
      } else {
        this.customerToAdd.UseCredit = true;
        this.orderSer.PostCustomer(this.customerToAdd).subscribe((res) => {
          if (res == 1) this.toastr.success(this.toastrMessage.GlobalMessages(res));
          else this.toastr.warning(this.toastrMessage.GlobalMessages(res));
          $("#DetailsCustomer").modal("hide");
          this.filterCustomers({text:this.customerToAdd.Phone});
        });
      }
    });
  }

  //#endregion

  filterCustomers(searchterm: any) {
    let model: CustomerModel = new CustomerModel();
    model.UseCredit = true;
    if (searchterm.text.length >= 3) {
      if (Number(searchterm.text) > 0) {
        //search by phone
        model.Phone = searchterm.text;
      } else {
        //search by name
        model.Name = searchterm.text;
      }
      this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
        this.customers = res as CustomerModel[];
        //assign first customer of the search result
        // this.setCustomer(this.customers[0]?.DocumentId);
      });
    }
  }
  setOrderType(orderTypeDocumentId){
    if(orderTypeDocumentId && this.orderTypeList?.length){
      this.responseobj.OrderType = this.orderTypeList?.find(x=>x.DocumentId == orderTypeDocumentId);
      this.responseobj.OrderTypeId = this.responseobj.OrderType?.Id; 
      this.responseobj.OrderTypeDocumentId = this.responseobj.OrderType?.DocumentId; 
      this.responseobj.OrderTypeName = this.responseobj.OrderType?.Name; 
      this.responseobj = this.recalculateOrderObject(this.responseobj);
    }
  }
  setTable(){
    const table = this.tablelist?.find(x=>this.responseobj.TableId && x.DocumentId == this.responseobj.TableId);
    this.responseobj.OrderTable = table;
    this.responseobj.TableId = table?.DocumentId;
    this.responseobj.TableName = table?.Name;
    this.responseobj = this.recalculateOrderObject(this.responseobj);

  }
}
