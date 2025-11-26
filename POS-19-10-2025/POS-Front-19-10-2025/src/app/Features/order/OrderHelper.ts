import { OrderDetailModel } from "src/app/core/Models/Transactions/order-detail-model";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
import { Directive, OnInit } from "@angular/core";
import { SettingService } from "src/app/core/Services/Settings/SettingService";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { OrderDetailPromoModel } from "src/app/core/Models/Transactions/order-detail-promo-model";
import { ProductModel } from "src/app/core/Models/Transactions/product-model";
import { OrderPayTypeModel } from "src/app/core/Models/Transactions/order-pay-type-model";
import { OrderPaymentModel } from "src/app/core/Models/order/OrderPaymentModel";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { ToastrService } from "ngx-toastr";
import { WorkDayModel } from "src/app/core/Models/Transactions/WorkDayModel";
import { GenericHelper } from "../GenericHelper";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { CustomerModel } from "../customer/customerimport";
import { TranslateService } from "@ngx-translate/core";
import { CategoryModel } from "src/app/core/Models/Transactions/category-model";
import { CustomerAddressModel } from "src/app/core/Models/Transactions/CustomerAddressModel";
import { TaxModel } from "src/app/core/Models/order/TaxModel";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { InsuranceModel } from "src/app/core/Models/Transactions/insurance-model";
import { Guid } from "guid-typescript";
import { OrderDetailSubItemModel } from "src/app/core/Models/Transactions/order-detail-sub-item-model";
import { MyPointDetailModel } from "src/app/core/Models/order/MyPointDetail.Model";
import { MyPointModel } from "src/app/core/Models/order/MyPoint.Model";
import { getDecimalPlaces, getOnlyDateString, getTimeDifferenceInSeconds } from "src/app/core/Helper/objectHelper";
import { LocalstorgeService } from "src/app/localstorge.service";
import { OrderComponent } from "./order/order.component";
import { ProductPricingClassVolumeModel } from "src/app/core/Models/Transactions/ProductPricingClassVolumeModel";

declare var $: any;
declare var Stimulsoft: any;

@Directive()
export class OrderHelper extends GenericHelper implements OnInit {
  orderdetailobj: OrderDetailModel = new OrderDetailModel();
  orderPayTypelist: OrderPayTypeModel[] = [];
  cashBackPayType: OrderPayTypeModel;
  turkyPaymentSystems: any[] = [];
  settingobj: SettingModel = new SettingModel();
  totalOrderPayment: number;
  defaultLanguage: string;
  currentUserLanguage: string;
  days: string[];
  currentMachineDayTime: Date;
  currentMachineDate: Date;
  currentMachineTime: string;
  currentMachineDay: string;
  pos: any;
  allproductlist: ProductModel[] = [];
  userPermissions: any = [];
  user: any;
  Flds = { text: "Name", value: "DocumentId" };
  DiscountFlds = { text: "Value", value: "Id" };
  // DiscountKeyBoard:string = 'DiscountPercentage11'
  FldsWithId = { text: "Name", value: "Id" };
  discountCategories: any = [];
  isPaymentPrintBtn: boolean = false;
  IsCustomerHasPromo: boolean = false;
  selectedPointsCard: MyPointDetailModel;
  myPoint: MyPointModel;
  freeProductsSelectionLimit?: number;
  checkedProducts?: number;
  freeProducts: any = [];
  freeOrderDetail = new OrderDetailModel();
  freeOrderDetails: OrderDetailModel[] = [];
  selectedFreeProducts = [];

  [key: string]: any;

  integrationSettings: any[] = [];
  interv: any;

  orderdetailpromoobj: OrderDetailPromoModel = new OrderDetailPromoModel();
  report: any = new Stimulsoft.Report.StiReport();
  // IsOrderDiscount: boolean = false;
  
  counter: number = 0;
  holdedOrdersKey ='holdedOrders';
  pendingOrdersKey ='pendingOrders';
  pendingOrders: OrderModel[] = [];
  pendingOrdersCount: number = 0;
  constructor(
    public settingSer: SettingService,
    public orderSer: OrderService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    public router: Router,
    public translate: TranslateService
  ) {
    super();
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
    this.GetSettings();
    this.HelperFirstOpen();
    this.currentUserLanguage = JSON.parse(localStorage.getItem("langs"))?.toLowerCase();
    this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.refreshDateAndTime();
  }

  refreshDateAndTime() {
    this.currentMachineDayTime = new Date();
    this.currentMachineTime = this.getTimeString(this.currentMachineDayTime);
    this.currentMachineDay = this.days[this.currentMachineDayTime.getDay()].toLowerCase();
    this.currentMachineDate = this.getOnlyDate(this.currentMachineDayTime);
  }

  isWeekDayIncluded(workDays: WorkDayModel[], day: string) {
    let result = workDays.filter((x) => x.Name.toLowerCase() == day.toLowerCase() && x.IsWork)[0];
    return result;
  }

  getTimeString(date: Date) {
    let res = date.toTimeString().split(" ")[0];
    return res;
  }

  getOnlyDate(date: Date) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let newDate = new Date(year, month, day);
    return newDate;
  }

  ngOnInit() {}

  GetSettings() {
    this.settingSer.GetSetting().subscribe((res) => {
      const settingobj = res as SettingModel;
      this.settingobj = settingobj;
      this.orderSer.settings = settingobj;
    });
  }

  defaultSelectedPayType: any;

  HelperFirstOpen() {
    this.discountCategories = [
      { Value: 5, Id: 1 },
      { Value: 10, Id: 2 },
      { Value: 15, Id: 3 },
      { Value: 20, Id: 4 },
      { Value: 25, Id: 5 },
      { Value: 30, Id: 6 },
      { Value: 40, Id: 7 },
      { Value: 50, Id: 8 },
    ];
    this.orderSer.HelperFirstOpen().subscribe((res) => {
      this.categories = res["Item1"] as CategoryModel[];
      if(this.categories?.length) this.categories = this.distinct(this.categories,'Value');
      this.allorderPayTypelist = res["Item2"] as OrderPayTypeModel[];
      this.allorderPayTypelist.forEach((o)=>{
        o.Name=this.getTypeName(o);
      }
      );
      this.orderPayTypelist = this.deepCopy(this.allorderPayTypelist);
      this.cashBackPayType = this.orderPayTypelist.find((payment) => payment.PayType === 70);
      this.defaultSelectedPayType = this.orderPayTypelist[0];
      //console.log("order payment type list : ", this.orderPayTypelist);
      this.checkOrderTypePayment(this._orderobj);
      if (!this.orderPayTypelist || this.orderPayTypelist.length == 0) this.routIfMissingData("orderpaytype");
      this.defaultLanguage = res["Item3"].toLowerCase();
      this.userPermissions = res["Item4"];
      this.isAdmin = res["Item5"];
      this.allTaxes = res["Item6"];
      this.allinsurancelist = res["Item7"] as InsuranceModel[];
      this.turkyPaymentSystems = res["Rest"]?.["Item1"];
      this.customerPromos = res["Rest"]?.["Item2"];
      this.minimumCharges = res["Rest"]?.["Item3"];
      this.myPoint = res["Rest"]?.["Item4"] as MyPointModel;

      this.insurancelist = this.cloneList(this.allinsurancelist);
    });
  }

  checkOrderTypePayment(_orderobj: OrderModel) {
    // check if payment component
    if (
      _orderobj &&
      _orderobj.OrderType &&
      _orderobj.OrderType.MandatoryToSelectThisType == true &&
      (_orderobj.OrderType.OrderPayTypeDocumentId || _orderobj.OrderType.OrderPayTypeId)
    ) {
      this.orderPayTypelist = this.deepCopy(
        this.allorderPayTypelist.filter(
          (o) =>
            (_orderobj.OrderType.OrderPayTypeId && o.Id == _orderobj.OrderType.OrderPayTypeId) ||
            (_orderobj.OrderType.OrderPayTypeDocumentId && o.DocumentId == _orderobj.OrderType.OrderPayTypeDocumentId)
        )
      );

      if (
        this.orderPayTypelist &&
        this.orderPayTypelist.length == 1 &&
        this.orderPayTypelist[0].PayType == 20 &&
        (!_orderobj.CustomerDocumentId || (!_orderobj.EmployeeId && !_orderobj.EmployeeDocumentId))
      )
        this.showDeliveryModal();
    } else {
      this.orderPayTypelist = this.deepCopy(this.allorderPayTypelist);
      if (_orderobj && _orderobj.OrderType && _orderobj.OrderType.MustHaveCustomer && !_orderobj.CustomerDocumentId)
        this.showDeliveryModal();
    }
  }

  setFocusById(elemId) {
    window.setTimeout(function () {
      let elem = document.getElementById(elemId);
      if (elem) elem.focus();
    }, 200);
  }

  getNetPrice(product: any, originalProduct: ProductModel = null ,orderDetail:OrderDetailModel= null) {
    let netPrice = 0;
    let productPrice = orderDetail?.EditedPrice ? orderDetail?.EditedPrice : product.Price;
    // originalProduct not null when from product is subitem
    if (!originalProduct) originalProduct = product;

    if (!originalProduct.ProductTaxes) originalProduct.ProductTaxes = [];

    // assign product price to voluem  
    productPrice = this.getProductVolumePriceForDetail(orderDetail, product, productPrice);
    
    let productTaxes = originalProduct.ProductTaxes.filter((x) => x.Tax && !x.Tax.ExtraTax);

    if (productTaxes && productTaxes.length && this.settingobj.PriceIncludesTax) {
      const valueType = productTaxes[0].Tax?.ValueType;
      const taxesValue = productTaxes
        .map((x) => x.Tax.Value)
        .reduce((a, b) => {
          return Number(a) + Number(b);
        });
      if (valueType == 1) netPrice = productPrice / (1 + taxesValue / 100);
      else netPrice = productPrice - taxesValue;
    } else netPrice = productPrice;

    return netPrice;
  }

  private getProductVolumePriceForDetail(orderDetail: OrderDetailModel, product: ProductModel, productPrice: any) {

    let realProduct: ProductModel = this.deepCopy(product);
    if (this.allproductlist?.length){
      if(product.VolumeId || product.VolumeDocumentId || product.VolumeFerpCode)
        realProduct = this.deepCopy(product);
      else 
        realProduct = this.deepCopy(this.allproductlist.find(p => p.DocumentId == product.DocumentId ));

      if(!realProduct) realProduct = this.deepCopy(product);
    }
    
    // in case of detail hase volume
    if (orderDetail && orderDetail.DocumentId &&
      (orderDetail.VolumeId || orderDetail.VolumeDocumentId || orderDetail.VolumeFerpCode)) {
      let productVolumes = product.ProductVolumes;
      if (!product.ProductVolumes?.length)
        productVolumes = realProduct?.ProductVolumes;

      const productVolume = productVolumes?.find(
        (x) => (orderDetail.VolumeId && x.VolumeId === orderDetail.VolumeId) ||
          (orderDetail.VolumeDocumentId && x.VolumeDocumentId === orderDetail.VolumeDocumentId) ||
          (orderDetail.VolumeFerpCode && x.VolumeFerpCode === orderDetail.VolumeFerpCode)
      );
      if (productVolume && productVolume.Price && productVolume.Price != productPrice)
        productPrice = productVolume.Price;
    }
    // not has volume
    else if(orderDetail && !orderDetail.IsPromo && !orderDetail.DocumentId && !(orderDetail.VolumeId || orderDetail.VolumeDocumentId || orderDetail.VolumeFerpCode)){
      productPrice = orderDetail.EditedPrice? orderDetail.EditedPrice: realProduct.Price;
      orderDetail.ProductPrice = productPrice;
    }
    return productPrice;
  }

  getDeliveryNetPrice(Tax: TaxModel, priceUsed) {
    let netPrice = 0;
    if (Tax.ValueType == 1) {
      netPrice = priceUsed / (1 + Tax.Value / 100);
    } else netPrice = priceUsed - Tax.Value;

    return netPrice;
  }

  addProductTaxToOrderDetailTaxes(dataNeededToAddTax) {
    if (!dataNeededToAddTax.TaxForAnotherTax) dataNeededToAddTax.TaxForAnotherTax = false;
    if (dataNeededToAddTax.taxAmount < 0) dataNeededToAddTax.taxAmount = 0;
    if (!dataNeededToAddTax.orderDetail.OrderDetailTaxes) dataNeededToAddTax.orderDetail.OrderDetailTaxes = [];

    if (dataNeededToAddTax.productTaxe.Tax.IncludeOtherTaxes) {
      // calculate taxAmount -> add them to orderDetailTaxes
      dataNeededToAddTax.productTaxe.Tax.IncludedVATTaxes?.forEach((includeTax) => {
        let tax = this.allTaxes.find(
          (t) =>
            (includeTax.Id && t.Id == includeTax.Id) || (includeTax.DocumentId && t.DocumentId == includeTax.DocumentId)
        );
        if (!tax) tax = includeTax;
        let includeTaxAmount = dataNeededToAddTax.productPrice * (includeTax.Value / 100);
        let taxToAdd = {
          OrderDetailId: 0,
          TaxId: tax.Id,
          TaxDocumentId: tax.DocumentId,
          TaxPercentage: includeTax.Value,
          TaxValue: includeTaxAmount,
          ProductDocumentId: dataNeededToAddTax.orderDetail.ProductDocumentId,
          ProductId: dataNeededToAddTax.orderDetail.ProductId ?? null,
          TaxForAnotherTax: dataNeededToAddTax.TaxForAnotherTax
        };
        let taxFoundIndex = dataNeededToAddTax.orderDetail.OrderDetailTaxes.findIndex(
          (x) =>
            dataNeededToAddTax.TaxForAnotherTax == x.TaxForAnotherTax &&
            dataNeededToAddTax.orderDetail.ProductDocumentId == x.ProductDocumentId &&
            ((includeTax.Id && x.TaxId == includeTax.Id) ||
              (includeTax.DocumentId && x.TaxDocumentId == includeTax.DocumentId))
        );
        if (taxFoundIndex == -1) {
          dataNeededToAddTax.orderDetail.OrderDetailTaxes.push(taxToAdd);
        } else {
          // update
          if (taxFoundIndex != -1) dataNeededToAddTax.orderDetail.OrderDetailTaxes[taxFoundIndex] = taxToAdd;
        }
      });
    } else {
      // add current tax to orderDetailTaxes
      let taxToAdd = {
        OrderDetailId: 0,
        TaxId: dataNeededToAddTax.productTaxe.Tax.Id,
        TaxDocumentId: dataNeededToAddTax.productTaxe.Tax.DocumentId,
        TaxPercentage: dataNeededToAddTax.productTaxe.Tax.Value,
        TaxValue: dataNeededToAddTax.taxAmount,
        ProductDocumentId: dataNeededToAddTax.orderDetail.ProductDocumentId,
        ProductId: dataNeededToAddTax.orderDetail.ProductId ?? null,
        TaxForAnotherTax: dataNeededToAddTax.TaxForAnotherTax
      };
      // check first if tax already existed
      let taxFoundIndex = dataNeededToAddTax.orderDetail.OrderDetailTaxes.findIndex(
        (x) =>
          dataNeededToAddTax.TaxForAnotherTax == x.TaxForAnotherTax &&
          dataNeededToAddTax.orderDetail.ProductDocumentId == x.ProductDocumentId &&
          ((dataNeededToAddTax.productTaxe.Tax.Id && x.TaxId == dataNeededToAddTax.productTaxe.Tax.Id) ||
            (dataNeededToAddTax.productTaxe.Tax.DocumentId &&
              x.TaxDocumentId == dataNeededToAddTax.productTaxe.Tax.DocumentId))
      );

      if (taxFoundIndex == -1) {
        dataNeededToAddTax.orderDetail.OrderDetailTaxes.push(taxToAdd);
      } else {
        // update
        if (taxFoundIndex != -1) dataNeededToAddTax.orderDetail.OrderDetailTaxes[taxFoundIndex] = taxToAdd;
      }
    }
  }

  addSubItemTaxToOrderDetailTaxes(dataNeededToAddTax) {
    //IF orderdetail has sub items
    // if (dataNeededToAddTax?.orderDetail?.OrderDetailSubItems?.length > 0) {
    // for (let i = 0; i < dataNeededToAddTax.orderDetail.OrderDetailSubItems.length; i++) {

    const subItem = dataNeededToAddTax.subItem;
    const productTax = dataNeededToAddTax.productTax;
    if (!dataNeededToAddTax.TaxForAnotherTax) dataNeededToAddTax.TaxForAnotherTax = false;

    if (!dataNeededToAddTax.orderDetail.OrderDetailTaxes) dataNeededToAddTax.orderDetail.OrderDetailTaxes = [];

    if (productTax.Tax.IncludeOtherTaxes) {
      // calculate taxAmount -> add them to orderDetailTaxes
      productTax.Tax.IncludedVATTaxes?.forEach((includeTax) => {
        let tax = this.allTaxes.find(
          (t) =>
            (includeTax.Id && t.Id == includeTax.Id) || (includeTax.DocumentId && t.DocumentId == includeTax.DocumentId)
        );
        if (!tax) tax = includeTax;
        let includeTaxAmount = dataNeededToAddTax.productPrice * (includeTax.Value / 100);
        let taxToAdd = {
          OrderDetailId: 0,
          TaxId: tax.Id,
          TaxDocumentId: tax.DocumentId,
          TaxPercentage: includeTax.Value,
          TaxValue: includeTaxAmount,
          ProductDocumentId: subItem.ProductSubItemDocumentId,
          ProductId: subItem.ProductSubItemId ?? null,
          TaxForAnotherTax: dataNeededToAddTax.TaxForAnotherTax
        };
        let taxsubitemFoundIndex = dataNeededToAddTax.orderDetail.OrderDetailTaxes.findIndex(
          (x) =>
            dataNeededToAddTax.TaxForAnotherTax == x.TaxForAnotherTax &&
            subItem.ProductSubItemDocumentId == x.ProductDocumentId &&
            ((includeTax.Id && x.TaxId == includeTax.Id) ||
              (includeTax.DocumentId && x.TaxDocumentId == includeTax.DocumentId))
        );
        if (taxsubitemFoundIndex == -1) {
          dataNeededToAddTax.orderDetail.OrderDetailTaxes.push(taxToAdd);
        } else {
          // update
          if (taxsubitemFoundIndex != -1)
            dataNeededToAddTax.orderDetail.OrderDetailTaxes[taxsubitemFoundIndex] = taxToAdd;
        }
      });
    } else {
      let taxToAdd = {
        OrderDetailId: 0,
        TaxId: productTax.Tax.Id,
        TaxDocumentId: productTax.Tax.DocumentId,
        TaxPercentage: productTax.Tax.Value,
        TaxValue: dataNeededToAddTax.taxAmount,
        ProductDocumentId: subItem.ProductSubItemDocumentId,
        ProductId: subItem.ProductSubItemId ?? null,
        TaxForAnotherTax: dataNeededToAddTax.TaxForAnotherTax
      };

      //if the tax is alreaady exist always update it's value withsub item taxamount because taxamount reflected with if side dish has discount
      let taxsubitemFoundIndex = dataNeededToAddTax.orderDetail.OrderDetailTaxes.findIndex(
        (x) =>
          dataNeededToAddTax.TaxForAnotherTax == x.TaxForAnotherTax &&
          subItem.ProductSubItemDocumentId == x.ProductDocumentId &&
          ((productTax.Tax?.Id && x.TaxId == productTax.Tax.Id) ||
            (productTax.Tax.DocumentId && x.TaxDocumentId == productTax.Tax.DocumentId))
      );

      if (taxsubitemFoundIndex != -1) {
        dataNeededToAddTax.orderDetail.OrderDetailTaxes[taxsubitemFoundIndex] = taxToAdd;
      } //else push new one
      else {
        dataNeededToAddTax.orderDetail.OrderDetailTaxes.push(taxToAdd);
      }
    }

    // }
    // }
  }
  ///method for inserting MinimumCharge Master Tax to order master taxes
  addMinChargeTaxToOrderMasterTaxes(order: OrderModel, taxFound) {
    let minimumChargeTaxFound = order.OrderMasterTaxes.filter((tax) => tax.ServiceTaxType == 2)[0];
    if (!this.minimumCharges || !this.minimumCharges.length) return;
    let minimumChargeTax = this.minimumCharges[0].Tax[0];
    if (
      this.minimumCharges &&
      this.minimumCharges.length &&
      this.settingobj.UseMinimumCharge &&
      order.MinimumChargeDifferance > 0
    ) {
      if (taxFound && minimumChargeTax) {
        if (minimumChargeTaxFound) {
          minimumChargeTaxFound.TaxAmount =
            order.MinimumChargeDifferance - order.MinimumChargeDifferance / (minimumChargeTax.Value / 100 + 1);
        } else {
          order.OrderMasterTaxes.push({
            Id: taxFound.Id + 1,
            TaxId: minimumChargeTax.Id,
            TaxDocumentId: minimumChargeTax.DocumentId,
            TaxAmount:
              order.MinimumChargeDifferance - order.MinimumChargeDifferance / (minimumChargeTax.Value / 100 + 1),
            TaxPercentage: minimumChargeTax.Value,
            DocumentId: taxFound.DocumentId,
            IsDeleted: false,
            IsSync: false,
            OrderId: taxFound.OrderId,
            ServiceTaxType: 2
          });
        }
      }
    }
    if (taxFound && minimumChargeTax && minimumChargeTaxFound && order.MinimumChargeDifferance == 0) {
      let minimumChargeMasterTaxIndex = order.OrderMasterTaxes.indexOf(minimumChargeTaxFound);
      order.OrderMasterTaxes.splice(minimumChargeMasterTaxIndex);
    }
  }

  addTaxToOrderMasterTaxes(order: OrderModel, TaxDetails: any = {}) {
    if (!order.OrderMasterTaxes) order.OrderMasterTaxes = [];
    this.taxFound = order.OrderMasterTaxes.filter(
      (tax) => (TaxDetails.TaxId && tax.TaxId == TaxDetails.TaxId) || tax.TaxDocumentId == TaxDetails.TaxDocumentId
    )[0];
    ///insert MinimumCharge Master Tax to order master taxes
    if (
      this.settingobj.UseMinimumCharge &&
      order.HasMinimumCharge == true &&
      order.MinimumChargeDifferance > 0 &&
      this.minimumCharges?.length&&
      this.minimumCharges[0]?.Tax?.length&&
      this.minimumCharges[0]?.Tax[0]?.DocumentId
    ) {
      ///////new taxfound incase if using minimum caharge
      this.taxFound = this.allTaxes.filter((x) => x.DocumentId == this.minimumCharges[0].Tax[0].DocumentId)[0];
      this.addMinChargeTaxToOrderMasterTaxes(order, this.taxFound);
    }

    if (!this.taxFound) {
      // insert to order master taxes
      order.OrderMasterTaxes.push({
        Id: 0,
        TaxId: TaxDetails.TaxId,
        TaxDocumentId: TaxDetails.TaxDocumentId,
        TaxAmount: TaxDetails.TaxAmount,
        TaxPercentage: TaxDetails.TaxPercentage,
        DocumentId: "",
        IsDeleted: false,
        IsSync: false,
        OrderId: "",
        ServiceTaxType: TaxDetails.ServiceTaxType
      });
    } else {
      // update values
      let total_amount = Number(TaxDetails.TaxAmount);
      let total_percentage = Number(TaxDetails.TaxPercentage);
      let taxInedx = order.OrderMasterTaxes.findIndex(
        (tax) => (TaxDetails.TaxId && tax.TaxId == TaxDetails.TaxId) || tax.TaxDocumentId == TaxDetails.TaxDocumentId
      );
      if (taxInedx != -1) {
        let updatedTax = {
          Id: this.taxFound.Id,
          TaxId: TaxDetails.TaxId,
          TaxDocumentId: TaxDetails.TaxDocumentId,
          TaxAmount: total_amount,
          TaxPercentage: total_percentage,
          DocumentId: this.taxFound.DocumentId,
          IsDeleted: false,
          IsSync: false,
          OrderId: this.taxFound.OrderId,
          ServiceTaxType: this.taxFound.ServiceTaxType
        };
        order.OrderMasterTaxes[taxInedx] = updatedTax;
      }
    }
  }

  handleWhenPriceIncludesTax(
    product: ProductModel,
    orderDetail: OrderDetailModel,
    orderobj: OrderModel = new OrderModel()
  ) {
    let productNetPrice = 0;
    orderDetail.TaxPercentage = 0;
    orderDetail.TaxAmount = 0;
    orderDetail.TaxName = "";
    let sideDishesValues = { SideDishTaxAmount: 0, SideDishNetPrice: 0 };

    this.calculateSideDishTaxAmount(orderDetail, sideDishesValues);
    let SideDishTaxAmount = sideDishesValues.SideDishTaxAmount;
    let SideDishNetPrice = sideDishesValues.SideDishNetPrice;

    product.ProductTaxes.forEach((productTaxe) => {
      let taxPercentage = 0;
      let taxAmount = 0;

      taxPercentage = productTaxe.Tax.Value;
      if (productTaxe.Tax) orderDetail.TaxName += "+ " + this.getTypeName(productTaxe.Tax);
      // if (productTaxe.Tax?.Name) orderDetail.TaxName += "+ " + productTaxe.Tax.Name;
      orderDetail.TaxId = productTaxe.Tax.Id;
      orderDetail.TaxDocumentId = productTaxe.Tax.DocumentId;

      // We skip calculate final price for integration orders
      // because we will accept incoming price from integration system
      if (!orderobj.IntegrationSystem || Number(orderobj.IntegrationSystem) < 1) {
        productNetPrice = this.getNetPrice(product,null,orderDetail);
        orderDetail.ProductPrice = productNetPrice;
      }
      //TODO
      else {
        // Real price is coming from integration controller
        productNetPrice = orderDetail.RealPrice / (1 + taxPercentage / 100);
        orderDetail.ProductPrice = productNetPrice;
      }

      // Discount First
      if (
        this.settingobj.CalculateTaxBeforeDiscount === false &&
        (product.DiscountValue !== 0 || orderDetail.DiscountPercentage > 0 || orderDetail.OrderDiscountValue > 0)
      ) {
        productNetPrice = productNetPrice - Number(orderDetail.OrderDiscountValue) - Number(orderDetail.DiscountAmount);
      }

      taxAmount = taxPercentage > 0 ? productNetPrice * (taxPercentage / 100) : 0;

      if (
        productNetPrice &&
        productTaxe.Tax &&
        productTaxe.Tax.ExtraTax &&
        productTaxe.Tax.MinimumValue &&
        taxAmount < productTaxe.Tax.MinimumValue
      ) {
        orderDetail.TaxDifferenceValue = productTaxe.Tax.MinimumValue - taxAmount;
        taxAmount = productTaxe.Tax.MinimumValue;
      }

      if (
        (orderobj.Discount === 100 && orderobj.DiscountType === "1") ||
        (orderobj.Discount === orderobj.NetTotal && orderobj.DiscountType === "2")
      ) {
        SideDishTaxAmount = 0;
        taxAmount = 0;
        orderDetail.Product.TaxValue = 0;
        orderDetail.SideDishTaxAmount = 0;
        orderobj.RemainigAmount = 0;
      }

      if (taxAmount < 0) taxAmount = 0;

      orderDetail.Product.TaxValue = taxAmount;
      orderDetail.SideDishTaxAmount = SideDishTaxAmount;
      orderDetail.SideDishNetPrice = SideDishNetPrice;
      if (orderobj.Discount === 0)
        orderDetail.SideDishesValue = orderDetail.SideDishNetPrice + orderDetail.SideDishTaxAmount;

      let dataNeededToAddTax = {
        product: product,
        orderDetail: orderDetail,
        taxAmount: taxAmount,
        productPrice: productNetPrice,
        productTaxe: productTaxe
      };
      this.addProductTaxToOrderDetailTaxes(dataNeededToAddTax);

      taxAmount = this.calculateTaxHasVatTax(productTaxe, taxAmount, product, orderDetail);

      orderDetail.TaxAmount += taxAmount;
      orderDetail.TaxPercentage += taxPercentage;
    });

    return orderDetail;
  }

  handleWhenPriceNotIncludesTax(product: ProductModel, orderDetail: OrderDetailModel) {
    orderDetail.TaxPercentage = 0;
    orderDetail.TaxAmount = 0;
    orderDetail.TaxName = "";

    let sideDishesValues = { SideDishTaxAmount: 0, SideDishNetPrice: 0 };

    this.calculateSideDishTaxAmount(orderDetail, sideDishesValues);
    let SideDishTaxAmount = sideDishesValues.SideDishTaxAmount;
    let SideDishNetPrice = sideDishesValues.SideDishNetPrice;

    product.ProductTaxes.forEach((productTaxe) => {
      let taxPercentage = 0;
      let taxAmount = 0;

      taxPercentage += productTaxe.Tax.Value;

      if (productTaxe.Tax) orderDetail.TaxName += "+ " + this.getTypeName(productTaxe.Tax);
      // if (productTaxe.Tax?.Name) orderDetail.TaxName += "+ " + productTaxe.Tax.Name;
      orderDetail.TaxId = productTaxe.Tax.Id;
      orderDetail.TaxDocumentId = productTaxe.Tax.DocumentId;

      ////Discount First
      if (
        this.settingobj.CalculateTaxBeforeDiscount === false &&
        (orderDetail.DiscountPercentage != 0 || product.DiscountValue != 0 || orderDetail.OrderDiscountValue > 0)
      ) {
        let DiscountPercentage = product.DiscountValue || orderDetail.DiscountPercentage;
        let ProductPricePriceAfterDiscount = 0;

        ProductPricePriceAfterDiscount =
          orderDetail.RealPrice - orderDetail.OrderDiscountValue - orderDetail.DiscountAmount;

        if (ProductPricePriceAfterDiscount < 0) ProductPricePriceAfterDiscount = 0;
        taxAmount = ProductPricePriceAfterDiscount * (taxPercentage / 100);
        if (!taxAmount) taxAmount = 0;

        if (
          ProductPricePriceAfterDiscount &&
          productTaxe.Tax &&
          productTaxe.Tax.ExtraTax &&
          productTaxe.Tax.MinimumValue &&
          taxAmount < productTaxe.Tax.MinimumValue
        ) {
          orderDetail.TaxDifferenceValue = productTaxe.Tax.MinimumValue - taxAmount;
          taxAmount = productTaxe.Tax.MinimumValue;
        }

        orderDetail.Product.TaxValue = taxAmount;
        if (ProductPricePriceAfterDiscount <= 0) orderDetail.SideDishTaxAmount = 0;
        let dataNeededToAddTax = {
          product: product,
          orderDetail: orderDetail,
          taxAmount: taxAmount,
          productPrice: ProductPricePriceAfterDiscount,
          productTaxe: productTaxe
        };
        this.addProductTaxToOrderDetailTaxes(dataNeededToAddTax);
      }
      // Tax First
      else {
        taxAmount = taxPercentage > 0 ? orderDetail.ProductPrice * (taxPercentage / 100) : 0;

        if (
          productTaxe.Tax &&
          productTaxe.Tax.ExtraTax &&
          productTaxe.Tax.MinimumValue &&
          taxAmount < productTaxe.Tax.MinimumValue
        ) {
          orderDetail.TaxDifferenceValue = productTaxe.Tax.MinimumValue - taxAmount;
          taxAmount = productTaxe.Tax.MinimumValue;
        }

        let dataNeededToAddTax = {
          product: product,
          orderDetail: orderDetail,
          taxAmount: taxAmount,
          productPrice: product.Price,
          productTaxe: productTaxe
        };
        this.addProductTaxToOrderDetailTaxes(dataNeededToAddTax);
      }

      taxAmount = this.calculateTaxHasVatTax(productTaxe, taxAmount, product, orderDetail);

      orderDetail.TaxAmount += taxAmount;
      orderDetail.TaxPercentage += taxPercentage;
    });
    orderDetail.SideDishTaxAmount = SideDishTaxAmount;
    orderDetail.SideDishNetPrice = SideDishNetPrice;
    orderDetail.SideDishesValue = orderDetail.SideDishNetPrice + orderDetail.SideDishTaxAmount;

    return orderDetail;
  }
  calculateTaxHasVatTax(productTaxe, taxAmount: number, product, orderDetail: OrderDetailModel, isSide = false) {
    // check if tax has vat tax so calculate its amount
    if (productTaxe.Tax && productTaxe.Tax.HasVATTax && productTaxe.Tax.VATTax) {
      let vatTax = this.allTaxes.find(
        (t) =>
          (productTaxe.Tax.VATTax.Id && t.Id == productTaxe.Tax.VATTax.Id) ||
          (productTaxe.Tax.VATTax.DocumentId && t.DocumentId == productTaxe.Tax.VATTax.DocumentId)
      );

      if (!vatTax) vatTax = productTaxe.Tax.VATTax;
      const vatTaxAmount = vatTax.Value > 0 ? taxAmount * (vatTax.Value / 100) : 0;
      const vatProductTax = {
        Tax: vatTax,
        TaxId: vatTax.Id,
        TaxDocumentId: vatTax.DocumentId,
        ProductId: product.Id,
        ProductDocumentId: product.DocumentId
      };

      if (isSide) {
        let dataNeededToAddTax = {
          orderDetail: orderDetail,
          subItem: product,
          productTax: vatProductTax,
          taxAmount: vatTaxAmount,
          productPrice: taxAmount,
          TaxForAnotherTax: true
        };
        this.addSubItemTaxToOrderDetailTaxes(dataNeededToAddTax);
      } else {
        const dataNeededToAddTax = {
          product: product,
          orderDetail: orderDetail,
          taxAmount: vatTaxAmount,
          productPrice: taxAmount,
          productTaxe: vatProductTax,
          TaxForAnotherTax: true
        };
        this.addProductTaxToOrderDetailTaxes(dataNeededToAddTax);
      }

      taxAmount += taxAmount * (productTaxe.Tax.VATTax.Value / 100);
    }
    return taxAmount;
  }

  getSubItemOriginalProduct(subItem) {
    let productSubitem = subItem.productSubitem;
    if (this.allproductlist && this.allproductlist.length) {
      productSubitem = this.allproductlist.find(
        (x) =>
          (subItem.ProductSubItemId && x.Id == subItem.ProductSubItemId) ||
          x.DocumentId == subItem.ProductSubItemDocumentId
      );
      subItem.productSubitem = this.deepCopy(productSubitem);
    }
    return productSubitem;
  }

  calculateSideDishTaxAmount(orderDetail: OrderDetailModel, sideDishesValues) {
    if (orderDetail?.OrderDetailSubItems?.length > 0) {
      orderDetail.OrderDetailSubItems.forEach((subItem: any) => {
        let productSubitem = this.getSubItemOriginalProduct(subItem);

        subItem.TaxPercentage = 0;
        subItem.TaxAmount = 0;
        if (!subItem.OrderDiscountValue) subItem.OrderDiscountValue = 0;

        subItem.RealPrice = subItem.Price;
        let subItemProductNetPrice = this.getNetPrice(subItem, productSubitem);
        subItem.ProductPrice = subItemProductNetPrice;
        let subItemProductNetPriceAfterDiscount = subItemProductNetPrice;
        // Discount First
        if (
          this.settingobj.CalculateTaxBeforeDiscount === false &&
          (subItem.OrderDiscountValue > 0 || subItem.DiscountAmount > 0)
        )
          subItemProductNetPriceAfterDiscount =
            subItemProductNetPriceAfterDiscount - subItem.OrderDiscountValue - subItem.DiscountAmount;

        productSubitem?.ProductTaxes?.forEach((productTaxe) => {
          subItem.Tax = productTaxe.Tax;
          subItem.TaxDocumentId = productTaxe.Tax.DocumentId;
          subItem.TaxId = productTaxe.Tax.Id;
          subItem.TaxPercentage += subItem.Tax.Value;

          let taxAmount = subItem.Tax.Value > 0 ? subItemProductNetPriceAfterDiscount * (subItem.Tax.Value / 100) : 0;

          if (
            subItemProductNetPriceAfterDiscount &&
            productTaxe.Tax &&
            productTaxe.Tax.ExtraTax &&
            productTaxe.Tax.MinimumValue &&
            taxAmount < productTaxe.Tax.MinimumValue
          ) {
            subItem.TaxDifferenceValue = productTaxe.Tax.MinimumValue - taxAmount;
            taxAmount = productTaxe.Tax.MinimumValue;
          }

          let dataNeededToAddTax = {
            orderDetail: orderDetail,
            subItem: subItem,
            productTax: productTaxe,
            taxAmount: taxAmount,
            productPrice: subItemProductNetPrice
          };
          this.addSubItemTaxToOrderDetailTaxes(dataNeededToAddTax);

          taxAmount = this.calculateTaxHasVatTax(productTaxe, taxAmount, subItem, orderDetail, true);
          subItem.TaxAmount += taxAmount;
        });
        subItem.ProductFinalPrice = subItemProductNetPrice + subItem.TaxAmount;
        sideDishesValues.SideDishTaxAmount += subItem.TaxAmount * subItem.Quantity;
        sideDishesValues.SideDishNetPrice += subItemProductNetPrice * subItem.Quantity;
      });

      // for (let i = 0; i < orderDetail.OrderDetailSubItems.length; i++) {
      //   let subItemProductNetPrice = 0;
      //   let subItem = orderDetail.OrderDetailSubItems[i];
      //   // let subItemNewTaxAmoount = 0;
      //   if (!subItem.OrderDiscountValue) subItem.OrderDiscountValue = 0;

      //   if (subItem.OrderDiscountValue > 0) {
      //     subItemProductNetPrice = subItem.ProductPrice - subItem.OrderDiscountValue;
      //     // subItemNewTaxAmoount = subItemProductNetPrice * (taxPercentage / 100);
      //     subItem.TaxAmount = subItem.TaxPercentage > 0 ? subItemProductNetPrice * (subItem.TaxPercentage / 100) : 0;
      //     if (subItem.TaxAmount < 0) subItem.TaxAmount = 0;
      //   }

      //   if (orderobj && orderobj.Discount === 0)
      //     subItem.TaxAmount = subItem.RealPrice - subItem.ProductPrice;

      //   subItem.ProductFinalPrice = subItem.OrderDiscountValue > 0 ? subItemProductNetPrice + subItem.TaxAmount
      //         : subItem.ProductPrice + subItem.TaxAmount;

      //   if (subItem.ProductFinalPrice < 0) subItem.ProductFinalPrice = 0;

      //   sideDishesValues.SideDishTaxAmount +=  subItem.TaxAmount * subItem.SingleQuantity;

      //   sideDishesValues.SideDishNetPrice += subItem.ProductPrice * subItem.SingleQuantity;
      // }

      // orderDetail?.OrderDetailSubItems?.forEach((side: OrderDetailSubItemModel) => {
      //   if (orderDetail.TaxPercentage > 0) {
      //     side.TaxAmount =
      //       side.OrderDiscountValue > 0 || side.OrderDiscountValue !== undefined
      //         ? (side.ProductPrice - side.OrderDiscountValue) * (orderDetail.TaxPercentage / 100)
      //         : side.ProductPrice * (orderDetail.TaxPercentage / 100);
      //   } else {
      //     side.TaxAmount = 0;
      //   }
      //   SideDishTaxAmount += side.TaxAmount;

      //   if (orderDetail.TaxPercentage > 0) {
      //     side.ProductFinalPrice =
      //       side.OrderDiscountValue > 0 || side.OrderDiscountValue !== undefined
      //         ? side.ProductPrice + (side.ProductPrice - side.OrderDiscountValue) * (orderDetail.TaxPercentage / 100)
      //         : side.ProductPrice + side.ProductPrice * (orderDetail.TaxPercentage / 100);
      //   } else {
      //     side.ProductFinalPrice =
      //       side.OrderDiscountValue > 0 || side.OrderDiscountValue !== undefined
      //         ? side.ProductPrice - side.OrderDiscountValue
      //         : side.ProductPrice;
      //   }

      //   if (side.ProductFinalPrice < 0) side.ProductFinalPrice = 0;
      //   if (side.TaxAmount < 0) side.TaxAmount = 0;
      // });
    }
  }

  handelProductDiscount(product: ProductModel, orderDetail: OrderDetailModel, orderobj: OrderModel) {
    if (!product.DiscountValue) product.DiscountValue = 0;
    if (!orderDetail.DiscountPercentage) orderDetail.DiscountPercentage = 0;
    if (!orderobj.Discount) orderobj.Discount = 0;
    // if (!orderobj.DiscountVal && orderobj.Discount > 0) orderobj.DiscountVal = orderobj.Discount;
    if (!orderobj.DiscountAmount) orderobj.DiscountAmount = 0;
    if (!orderDetail.ProductFinalPrice) orderDetail.ProductFinalPrice = 0;
    if (!orderDetail.OrderDiscountValueToShow) orderDetail.OrderDiscountValueToShow = 0;
    orderDetail.SubItemDiscountValue = 0;
    orderDetail.TotalSubItemDisountAmount = 0;
    if (!orderDetail.SideDishesValue || typeof orderDetail.SideDishesValue != "number") orderDetail.SideDishesValue = 0;
    if (!orderDetail.DiscountAmount) orderDetail.DiscountAmount = 0;

    // if (orderobj.IsCustsomerPromo && orderDetail.DiscountPercentage > 0) {
    //   orderobj.Discount = 0;
    //   orderobj.DiscountAmount = 0;
    //   orderobj.IsCustsomerPromo = false;
    // }

    // Real price already comes from integration as price with tax
    if ((!orderobj.IntegrationSystem || Number(orderobj.IntegrationSystem) < 1) && !orderobj.IsCallCenter && !orderobj.IsMobileOrder) {
      product.Price = this.getProductVolumePriceForDetail(orderDetail, product, product.Price);

      orderDetail.RealPrice = product.Price;
    }

    let DiscountPercentage = product.DiscountValue || orderDetail.DiscountPercentage;
    let price = product.Price;
    if (this.settingobj.PriceIncludesTax) {
      price = this.getNetPrice(product,null,orderDetail);
    }

    // Discount Amount => To calculate discount amount from net price for only the OrderDetail
    // ONLY APPLIED IN CASE PRODUCT INCLUDES PROMO
    // ONLY APPLIED IN CASE DISCOUNT ON OrderDetail
    let DiscountAmount = 0;
    if (DiscountPercentage) DiscountAmount = (price * DiscountPercentage) / 100;
    if (orderDetail.DiscountAmount === 0 || product.AllowChangePrice) {
      orderDetail.DiscountAmount = DiscountAmount;
    }

    if (DiscountPercentage && !orderobj.DiscountType) orderobj.DiscountType = "1";

    // ORDER DISCOUNT ===========================================================================================
    // ==> Percentage
    // Calculating the percentage of the order multiplied by the price (if it includes or doesn't include the tax)
    // to find out the amount of OrderDiscountValue in each OrderDetail
    if (orderobj.DiscountType == "1") {
      orderDetail.OrderDiscountValue = (Number(orderobj.Discount) / 100) * (price - DiscountAmount);
      if (orderDetail?.OrderDetailSubItems?.length > 0) {
        orderDetail.OrderDetailSubItems.forEach((subItem: OrderDetailSubItemModel) => {
          let productSubitem = this.getSubItemOriginalProduct(subItem);

          let subItemProductNetPrice = this.getNetPrice(subItem, productSubitem);
          subItem.DiscountAmount = (Number(DiscountPercentage) / 100) * subItemProductNetPrice;

          subItem.OrderDiscountValue =
            (Number(orderobj.Discount) / 100) * (subItemProductNetPrice - subItem.DiscountAmount);

          orderDetail.OrderDiscountValueToShow = subItem.OrderDiscountValue;
          orderDetail.SubItemDiscountValue += subItem.OrderDiscountValue;
          orderDetail.TotalSubItemDisountAmount += subItem.DiscountAmount;
        });
      }
      orderDetail.OrderDiscountValueToShow = orderDetail.OrderDiscountValue;
    }
    // ==> Value
    // Calculating discount value to check how much percentage it equals from the order
    // and then multiplies the percentage into each detail to find out the OrderDiscountValue of each OrderDetail
    else if (orderobj.DiscountType == "2") {
      let totalProductsPricesBeforeDiscount = 0;
      orderobj.OrderDetails.forEach((d) => {
        if(!d.Product)
          d.Product = this.allproductlist?.find((x) => x.DocumentId == d.ProductDocumentId);

        let productPrice = d.Product?.Price;
        if (this.settingobj.PriceIncludesTax) {
          orderobj.Discount = !d.Product.Tax ? orderobj.Discount : orderobj.Discount / (1 + d.Product.Tax.Value / 100);
          productPrice = this.getNetPrice(d.Product,null,orderDetail);
          d.TaxPercentage = !d.Product.Tax ? 0 : d.Product.Tax.Value;
          totalProductsPricesBeforeDiscount +=
            d.SideDishesValue > 0
              ? (productPrice + d.SideDishesValue / (1 + d.TaxPercentage / 100) - d.DiscountAmount) * d.ProductQuantity
              : (productPrice - d.DiscountAmount) * d.ProductQuantity;
        } else {
          totalProductsPricesBeforeDiscount +=
            d.SideDishesValue > 0
              ? (productPrice + d.SideDishesValue - d.DiscountAmount) * d.ProductQuantity
              : (productPrice - d.DiscountAmount) * d.ProductQuantity;
        }
      });

      let percentage = (orderobj.Discount / totalProductsPricesBeforeDiscount) * 100;
      if (percentage > 0) {
        orderDetail.OrderDiscountValue = (percentage / 100) * (price - DiscountAmount);
      } else {
        orderDetail.OrderDiscountValue = 0;
      }

      if (orderDetail?.OrderDetailSubItems?.length > 0) {
        orderDetail.OrderDetailSubItems.forEach((subItem: OrderDetailSubItemModel) => {
          let productSubitem = this.getSubItemOriginalProduct(subItem);

          let subItemProductNetPrice = this.getNetPrice(subItem, productSubitem);

          subItem.DiscountAmount = (Number(DiscountPercentage) / 100) * subItemProductNetPrice;
          subItem.OrderDiscountValue =
            percentage > 0 ? (percentage / 100) * (subItemProductNetPrice - subItem.DiscountAmount) : 0;
          orderDetail.OrderDiscountValueToShow = subItem.OrderDiscountValue;
          orderDetail.TotalSubItemDisountAmount += subItem.DiscountAmount;
          orderDetail.SubItemDiscountValue += subItem.OrderDiscountValue;
        });
      }
      orderDetail.OrderDiscountValueToShow = orderDetail.OrderDiscountValue + orderDetail.SubItemDiscountValue;
    } else {
      orderDetail.OrderDiscountValue = 0;
      orderDetail.OrderDiscountValueToShow = 0;
      orderDetail.SubItemDiscountValue = 0;
      if (orderDetail.OrderDetailSubItems)
        orderDetail.OrderDetailSubItems.forEach((subItem: OrderDetailSubItemModel) => (subItem.OrderDiscountValue = 0));
    }

    if (!orderDetail.OrderDiscountValue || !orderDetail.OrderDiscountValueToShow) {
      orderDetail.OrderDiscountValue = 0;
      orderDetail.OrderDiscountValueToShow = 0;
    }
    return orderDetail;
  }

  handelProductTax(product: ProductModel, orderDetail: OrderDetailModel, orderobj: OrderModel = new OrderModel()) {
    if (!orderDetail.TaxAmount) orderDetail.TaxAmount = 0;
    if (!orderDetail.SideDishNetPrice) orderDetail.SideDishNetPrice = 0;
    if (!orderDetail.SideDishTaxAmount) orderDetail.SideDishTaxAmount = 0;
    if (!orderDetail.SubItemDiscountValue) orderDetail.SubItemDiscountValue = 0;
    if (product.ProductTaxes && product.ProductTaxes.length) {
      if (!orderDetail.SideDishesValue || typeof orderDetail.SideDishesValue != "number")
        orderDetail.SideDishesValue = 0;

      if (
        this.settingobj.PriceIncludesTax ||
        (orderobj.IsCallCenter && this.pos?.LinkWithOnlineOrder) ||
        orderobj.IsMobileOrder
      )
        orderDetail = this.handleWhenPriceIncludesTax(product, orderDetail, orderobj);
      else orderDetail = this.handleWhenPriceNotIncludesTax(product, orderDetail);
    } else if (!product.ProductTaxes || product.ProductTaxes.length == 0) {
      let SideDishTaxAmount = 0;
      let SideDishNetPrice = 0;
      if (orderDetail?.OrderDetailSubItems?.length > 0) {
        orderDetail.OrderDetailSubItems.forEach((subItem: any) => {
          if (
            subItem.Tax === undefined ||
            subItem.TaxDocumentId === undefined ||
            subItem.TaxId === undefined ||
            subItem.TaxPercentage === undefined ||
            subItem.TaxAmount === undefined
          ) {
            subItem.Tax = product?.Tax;
            subItem.TaxDocumentId = product?.TaxDocumentId;
            subItem.TaxId = product?.TaxId;
            subItem.RealPrice = subItem?.Price;
            subItem.ProductPrice = subItem?.RealPrice;
            subItem.TaxAmount = subItem?.RealPrice - subItem?.ProductPrice;
            subItem.TaxPercentage = subItem?.Tax?.Value;
          }
        });
        for (let i = 0; i < orderDetail.OrderDetailSubItems.length; i++) {
          if (orderDetail.OrderDetailSubItems[i].TaxAmount < 0) orderDetail.OrderDetailSubItems[i].TaxAmount = 0;

          SideDishTaxAmount +=
            orderDetail.OrderDetailSubItems[i].TaxAmount * orderDetail.OrderDetailSubItems[i].Quantity;
          SideDishNetPrice +=
            orderDetail.OrderDetailSubItems[i].ProductPrice * orderDetail.OrderDetailSubItems[i].Quantity;
        }
      }
      orderDetail.SideDishTaxAmount = SideDishTaxAmount;
      orderDetail.SideDishNetPrice = SideDishNetPrice;
      orderDetail.SideDishesValue = orderDetail.SideDishNetPrice + orderDetail.SideDishTaxAmount;

      // This is for integration orders that has taxless products
      if (orderobj.IntegrationSystem > 0) orderDetail.ProductPrice = orderDetail.RealPrice;
    }
    if (!orderDetail.ProductFinalPrice) orderDetail.ProductFinalPrice = 0;

    // ===>>>> ProductFinalPrice = product's price + product's tax amount - any discount applied on the product itself
    // orderDetail.ProductFinalPrice =
    //   orderDetail.ProductPrice +
    //   orderDetail.SideDishNetPrice -
    //   orderDetail.DiscountAmount -
    //   orderDetail.OrderDiscountValue -
    //   orderDetail.SubItemDiscountValue +
    //   orderDetail.TaxAmount +
    //   orderDetail.SideDishTaxAmount;
    orderDetail.ProductFinalPrice =
      orderDetail.ProductPrice - orderDetail.DiscountAmount - orderDetail.OrderDiscountValue + orderDetail.TaxAmount;

    if (orderDetail.ProductFinalPrice < 0) {
      orderDetail.ProductFinalPrice = 0;
      orderDetail.SideDishTaxAmount = 0;
      orderDetail.SideDishesValue = 0;
    }
    if(!orderDetail.ProductPrice && (orderDetail.TaxAmount > 0 || orderDetail.OrderDetailTaxes?.length)){
      orderDetail.TaxAmount = 0;
      orderDetail.OrderDetailTaxes = [];
    }
    return orderDetail;
  }

  handleServiceCharge(orderobj: OrderModel) {
    let totalTaxesPercentage = 0;
    let totalTaxesValues = 0;
    let orderTaxAmount = 0;
    let orderTaxPercentage = 0;
    let vatTaxAmount = 0;
    if (!orderobj.ServiceChargeValue) orderobj.ServiceChargeValue = 0;
    if ((orderobj.Discount == 100 && orderobj.DiscountType == "1") || orderobj.CancelServices) {
      orderobj.ServiceChargeValue = 0;
      orderobj.OrderMasterTaxes = [];
    } else {
      if (orderobj.OrderType && orderobj.OrderType.Taxes && orderobj.OrderType.Taxes.length > 0) {
        orderobj.OrderType.Taxes.forEach((orderTypeTax) => {
          if (orderTypeTax.Tax) {
            // step 1 calculate tax amount
            if (orderTypeTax.Tax.ValueType == 1) {
              // percentage
              let taxAmount = 0;
              totalTaxesPercentage += orderTypeTax.Tax.Value;

              let netTotal = orderobj.NetTotal;
              // calculate service from price with vat taxes
              if(this.settingobj?.IsServiceFromTotalWithVat)
                netTotal += orderobj.TotalTaxAmount;

              if (this.settingobj && this.settingobj.IsServiceFromRealPrice)
                taxAmount = netTotal * (orderTypeTax.Tax.Value / 100);
              else
                taxAmount =
                  (netTotal - Number(orderobj.DiscountAmount) - Number(orderobj.DetailsDiscount)) *
                  (orderTypeTax.Tax.Value / 100);

              if (taxAmount < 0) taxAmount = 0;

              totalTaxesValues += taxAmount;

              orderTaxAmount = taxAmount;
              orderTaxPercentage = orderTypeTax.Tax.Value;
            } else if (orderTypeTax.Tax.ValueType == 2) {
              // value
              let orderTypeTaxValue = orderTypeTax.Tax.Value;

              if(orderTypeTax.Tax.ForOnePerson && orderobj.PersonsCount)
                orderTypeTaxValue = orderobj.SubTotal ? (orderTypeTax.Tax.Value * orderobj.PersonsCount) : 0;

              totalTaxesValues += orderTypeTaxValue;
              let taxPercentage = 0;
              if (this.settingobj && this.settingobj.IsServiceFromRealPrice)
                taxPercentage = (orderTypeTaxValue / orderobj.NetTotal) * 100;
              else
                taxPercentage =
                  (orderTypeTaxValue /
                    (orderobj.NetTotal - Number(orderobj.DiscountAmount) - Number(orderobj.DetailsDiscount))) *
                  100;

              totalTaxesPercentage += taxPercentage;
              orderTaxPercentage = taxPercentage;
              orderTaxAmount = orderTypeTaxValue;
            }
            // step2 : add this tax to orderMasterTaxes /////////////////////////////////////////////////////////////////////////
            let tax = this.allTaxes.find(
              (x) =>
                (orderTypeTax.Tax.Id && x.Id == orderTypeTax.Tax.Id) ||
                (orderTypeTax.Tax.DocumentId && x.DocumentId == orderTypeTax.Tax.DocumentId)
            );
            if (!tax) tax = orderTypeTax.Tax;
            let TaxDetails = {
              TaxId: tax.Id,
              TaxDocumentId: tax.DocumentId,
              TaxAmount: orderTaxAmount,
              TaxPercentage: orderTaxPercentage,
              Tax: tax,
              ServiceTaxType: 3
            };
            this.addTaxToOrderMasterTaxes(orderobj, TaxDetails);

            // step 3 check if current orderTpeTax has a VATTax >> calculate it then apply it
            if (
              orderTypeTax.Tax.IncludedVATTaxes &&
              orderTypeTax.Tax.IncludedVATTaxes.length > 0 &&
              !orderTypeTax.Tax.VATTax
            ) {
              orderTypeTax.Tax.VATTax = orderTypeTax.Tax.IncludedVATTaxes[0];
              orderTypeTax.Tax.HasVATTax = true;
              orderTypeTax.Tax.VATTaxDocumentId = orderTypeTax.Tax.VATTax.DocumentId;
              orderTypeTax.Tax.VATTaxId = orderTypeTax.Tax.VATTax.Id;
              // orderTypeTax.Tax.VATTax.IncludeOtherTaxes =  true;
            }
            if (orderTypeTax.Tax.HasVATTax && orderTypeTax.Tax.VATTax) {
              // calculate vATTax amount
              vatTaxAmount += orderTaxAmount * (orderTypeTax.Tax.VATTax.Value / 100);
              // totalTaxesValues += vatTaxAmount;

              // then add  it MasterTaxes as detailRecord but first check if include other taxes////////////////////////////////

              if (orderTypeTax.Tax.VATTax.IncludeOtherTaxes && orderTypeTax.Tax.VATTax.IncludedVATTaxes) {
                // add include taxes to order master taxes
                orderTypeTax.Tax.VATTax.IncludedVATTaxes.forEach((includedTax) => {
                  let tax = this.allTaxes.find(
                    (x) =>
                      (includedTax.Id && x.Id == includedTax.Id) ||
                      (includedTax.DocumentId && x.DocumentId == includedTax.DocumentId)
                  );
                  if (!tax) tax = includedTax;

                  let includedTaxAmount = orderTaxAmount * (includedTax.Value / 100);

                  let TaxDetails = {
                    TaxId: tax.Id,
                    TaxDocumentId: tax.DocumentId,
                    TaxAmount: includedTaxAmount,
                    TaxPercentage: tax.Value,
                    Tax: tax,
                    ServiceTaxType: 3
                  };
                  this.addTaxToOrderMasterTaxes(orderobj, TaxDetails);
                });
              } else {
                // add VATTax itself to orderMasterTaxes
                let vatTax = this.allTaxes.find(
                  (x) =>
                    (orderTypeTax.Tax.VATTaxId && x.Id == orderTypeTax.Tax.VATTaxId) ||
                    (orderTypeTax.Tax.VATTaxDocumentId && x.DocumentId == orderTypeTax.Tax.VATTaxDocumentId)
                );
                if (!vatTax) vatTax = orderTypeTax.Tax.VATTax;

                let TaxDetails = {
                  TaxId: vatTax.Id,
                  TaxDocumentId: vatTax.DocumentId,
                  TaxAmount: vatTaxAmount,
                  TaxPercentage: vatTax.Value,
                  Tax: vatTax,
                  ServiceTaxType: 3
                };
                this.addTaxToOrderMasterTaxes(orderobj, TaxDetails);
              }
            }
          }
        });
        let nullTaxes = orderobj.OrderMasterTaxes?.filter((x) => !x.TaxId && !x.TaxDocumentId);
        if (nullTaxes && nullTaxes.length > 0) {
          nullTaxes.forEach((t) => {
            let index = orderobj.OrderMasterTaxes.indexOf(t);
            if (index != -1) orderobj.OrderMasterTaxes.splice(index, 1);
          });
        }
      } else orderobj.OrderMasterTaxes = [];
    }
    // step 4 add totalServiceCharge To subTotal
    if(!orderobj.ChannelName){
      orderobj.ServiceChargeValue = totalTaxesValues;
      orderobj.ServiceChargePercentage = totalTaxesPercentage;
    }
    else{
      orderobj.ServiceChargePercentage = orderobj.ServiceChargeValue != null ? orderobj.ServiceChargeValue / orderobj.SubTotal : 0;
    }
    // assign service charge for details
    if (orderobj.ServiceChargeValue > 0 && orderobj.OrderDetails && orderobj.OrderDetails.length > 0) {
      orderobj.OrderDetails.forEach((ds) => {
        if (this.settingobj && this.settingobj.IsServiceFromRealPrice) {
          ds.ServiceChargeValue = (Number(orderobj.ServiceChargePercentage) / 100) * ds.ProductPrice;
          // vat for serviceCharge
          if (vatTaxAmount > 0) {
            let percentageOfDetailForTax = ds.ProductPrice / orderobj.NetTotal;
            ds.ServiceChargeValue += vatTaxAmount * percentageOfDetailForTax;
          }
        } else {
          ds.ServiceChargeValue =
            (Number(orderobj.ServiceChargePercentage) / 100) *
            (ds.ProductPrice - ds.DiscountAmount - ds.OrderDiscountValue);
          // vat for serviceCharge
          if (vatTaxAmount > 0) {
            let percentageOfDetailForTax =
              (ds.ProductPrice - ds.DiscountAmount - ds.OrderDiscountValue) /
              (orderobj.NetTotal - Number(orderobj.DiscountAmount) - Number(orderobj.DetailsDiscount));
            ds.ServiceChargeValue += vatTaxAmount * percentageOfDetailForTax;
          }
        }
      });
    } else if (orderobj.ServiceChargeValue == 0 && orderobj.OrderDetails && orderobj.OrderDetails.length > 0) {
      orderobj.OrderDetails.forEach((ds) => {
        ds.ServiceChargeValue = 0;
      });
    }

    orderobj.TotalTaxAmount += vatTaxAmount;
    orderobj.SubTotal += orderobj.ServiceChargeValue + vatTaxAmount;
  }

  handleDeliveryTax(orderobj: OrderModel) {
    if (!orderobj.TotalTaxAmount) orderobj.TotalTaxAmount = 0;
    orderobj.DeliveryNetPrice = 0;
    if (
      orderobj.DeliveryPrice > 0 &&
      this.settingobj &&
      this.settingobj.ApplyTaxOnDeliveryPrice &&
      this.settingobj.TaxDocumentId
    ) {
      let tax = this.allTaxes.filter((x) => x.DocumentId == this.settingobj.TaxDocumentId)[0];
      if (tax) {
        let TaxAmount = 0;
        let taxPercentage = 0;
        if (this.settingobj.PriceIncludesTax) {
          if (tax.ValueType == 1) {
            let DeliveryNetPrice = this.getDeliveryNetPrice(tax, orderobj.DeliveryPrice);
            orderobj.DeliveryNetPrice = DeliveryNetPrice;
            TaxAmount = (DeliveryNetPrice * tax.Value) / 100;
            taxPercentage = tax.Value;
          } else if (tax.ValueType == 2) {
            let DeliveryNetPrice = this.getDeliveryNetPrice(tax, orderobj.DeliveryPrice);
            orderobj.DeliveryNetPrice = DeliveryNetPrice;
            TaxAmount = tax.Value;
            taxPercentage = (tax.Value / DeliveryNetPrice) * 100;
          }
        } else {
          if (tax.ValueType == 1) {
            TaxAmount = (orderobj.DeliveryPrice * tax.Value) / 100;
            taxPercentage = tax.Value;
          } else if (tax.ValueType == 2) {
            TaxAmount = tax.Value;
            taxPercentage = (tax.Value / orderobj.DeliveryPrice) * 100;
          }
          orderobj.SubTotal += TaxAmount;
        }
        let TaxDetails = {
          TaxId: tax.Id,
          TaxDocumentId: tax.DocumentId,
          TaxAmount: TaxAmount,
          TaxPercentage: taxPercentage,
          Tax: tax,
          ServiceTaxType: 1
        };
        this.addTaxToOrderMasterTaxes(orderobj, TaxDetails);

        let nullTaxes = orderobj.OrderMasterTaxes?.filter((x) => !x.TaxId && !x.TaxDocumentId);
        if (nullTaxes && nullTaxes.length > 0) {
          nullTaxes.forEach((t) => {
            let index = orderobj.OrderMasterTaxes.indexOf(t);
            if (index != -1) orderobj.OrderMasterTaxes.splice(index, 1);
          });
        }
        // step 4 add totalServiceCharge To subTotal
        orderobj.TotalTaxAmount += TaxAmount;
      }
    }
  }

  // handlePromo(product: ProductModel, orderDetail: OrderDetailModel, orderobj: OrderModel) {
  //   this.refreshDateAndTime();
  //   if (product.Promos && product.Promos.length > 0) {
  //     let promo = product.Promos.filter(
  //       (x) =>
  //         this.isWeekDayIncluded(x.WorkDays, this.currentMachineDay) &&
  //         this.getTimeString(new Date(x.FromTime)) <= this.currentMachineTime &&
  //         this.getTimeString(new Date(x.ToTime)) >= this.currentMachineTime &&
  //         this.getOnlyDate(new Date(x.FromDate)) <= this.currentMachineDate &&
  //         this.getOnlyDate(new Date(x.ToDate)) >= this.currentMachineDate
  //     )[0];
  //     if (promo) {
  //       product.Promos = [];
  //       product.Promos.push(promo);
  //       if (promo.ValueType == 1 || promo.ValueType == 5) {
  //         product.ShowDiscount = true;
  //         if (promo.ValueType == 1) product.DiscountValue = promo.Value;
  //       }
  //       //  else if (promo.ValueType == 3) {
  //       //   if (orderDetail && orderobj) {
  //       //     this.handelCustomPromo(product, orderDetail, orderobj);
  //       //   }
  //       // }
  //     } else {
  //       product.Promos = [];
  //       product.ShowDiscount = false;
  //     }

  //     const promoOrderTypeNotExist = promo?.OrderTypesList?.length &&
  //       (!promo.OrderTypesList.find((x) => x == orderobj?.OrderType.DocumentId) || !orderobj?.OrderType?.IsPromo);

  //     const promoOrderPayTypeNotExist = promo?.OrderPayTypesList?.length &&
  //       (!promo.OrderPayTypesList.find(x => orderobj?.OrderPayments?.some(p=>p.PayTypeDocumentId == x)) );

  //     if ((promoOrderTypeNotExist || promoOrderPayTypeNotExist ) && orderDetail) {
  //       product.DiscountValue = 0;
  //       orderDetail.DiscountAmount = 0;
  //       orderDetail.DiscountPercentage = 0;
  //     }
  //   }
  //   return orderDetail;
  // }

  handlePromo(product: ProductModel, orderDetail: OrderDetailModel, orderobj: OrderModel) {
    this.refreshDateAndTime();
    if (product.Promos && product.Promos.length > 0) {
      let promos = product.Promos.filter((x) => this.chekWithinTime(x));
      const VolumeDocumentId = orderDetail?.VolumeDocumentId || product.VolumeDocumentId;
      if(VolumeDocumentId)
        promos = promos.filter(x=>x.PromoProducts.some(pr=>pr.TakeProductVolumeDocumentId == VolumeDocumentId && pr.TakeProductDocumentId == product.DocumentId));

      product.Promos = [];
      product.ShowDiscount = false;
      if(promos.length) product.Promos.push(...promos);
      const orderPaysIds = (orderobj?.OrderPayments as any)?.flatMap(x=> x.PayTypeDocumentId) ?? [];
      promos = promos.filter(x=> !x.OrderPayTypesList?.length || (orderPaysIds?.length && orderPaysIds?.every(op=>x.OrderPayTypesList.includes(op))) );
      const orderTypeId = orderobj?.OrderType?.DocumentId || this.orderobj?.OrderType?.DocumentId  
        || this.pointOfSale?.OrderTypeId || orderobj?.pointOfSale?.OrderTypeId || this.orderobj?.pointOfSale?.OrderTypeId;
      promos = promos.filter(x=> !orderTypeId ||!x.OrderTypesList?.length || x.OrderTypesList.find(op=>orderTypeId == op));
      const promo = promos[0];
      if (promo) {
        if (promo.ValueType == 1 || promo.ValueType == 5) {
          product.ShowDiscount = true;
          if (promo.ValueType == 1) product.DiscountValue = promo.Value;
        }
      }
      else if (!promo && orderDetail && !orderDetail?.IsPromo) {
        product.DiscountValue = 0;
        orderDetail.DiscountAmount = 0;
        orderDetail.DiscountPercentage = 0;
      }
    }
    return orderDetail;
  }
  assignPromoCustomPrice(product:ProductModel,productPricingClassVolumes:ProductPricingClassVolumeModel[]=null){
    const promo = product.Promos?.length ? product.Promos[0] : undefined;
    if(!promo) return;
    const promoOrderTypeNotExist = promo?.OrderTypesList?.length &&
        (!promo.OrderTypesList.find((x) => x == this.orderobj?.OrderType.DocumentId) || !this.orderobj?.OrderType?.IsPromo);

    if(!promoOrderTypeNotExist && product.Promos?.length && product.Promos.some(x=>x.ValueType == 5)){
      let promoProducts = product.Promos
        .find(x=>x.ValueType == 5)?.PromoProducts?.filter(x=> x.TakeProductDocumentId == product.DocumentId);

      // set price for each volume
      if(promoProducts?.length && productPricingClassVolumes?.length > 0){
        productPricingClassVolumes.forEach(ppv=>{
          const volume = this.volumes?.find(x=>(ppv.VolumeDocumentId && ppv.VolumeDocumentId == x.DocumentId) ||(ppv.VolumeId && ppv.VolumeId == x.Id));
          const promoProductVolume = promoProducts.find(pp=>pp.TakeProductVolumeDocumentId == volume?.DocumentId);
          if(promoProductVolume) ppv.Price = promoProductVolume.CustomPrice;
        });
      }

      if(promoProducts?.length && product.VolumeDocumentId)
        promoProducts = promoProducts.filter(x=>x.TakeProductVolumeDocumentId == product.VolumeDocumentId && x.TakeProductDocumentId == product.DocumentId);

      if(promoProducts?.length) product.Price = promoProducts[0].CustomPrice;
    }
  }
  oldchekWithinTime(promo:any){
    const fromTime = this.getTimeString(new Date(promo.FromTime));
    const toTime = this.getTimeString(new Date(promo.ToTime));
    const fromDate = this.getOnlyDate(new Date(promo.FromDate));
    const toDate = this.getOnlyDate(new Date(promo.ToDate));
    return this.isWeekDayIncluded(promo.WorkDays, this.currentMachineDay) &&
    fromTime <= this.currentMachineTime &&
    toTime >= this.currentMachineTime &&
    fromDate <= this.currentMachineDate &&
    toDate >= this.currentMachineDate
  }
  chekWithinTime(promo:any){
    const fromTime = this.getTimeString(new Date(promo.FromTime));
    const toTime = this.getTimeString(new Date(promo.ToTime));
    const fromDate = this.getOnlyDate(new Date(promo.FromDate));
    const toDate = this.getOnlyDate(new Date(promo.ToDate));
    
    const now = this.currentMachineDayTime

    // Build full DateTime for accurate comparison
    const fromDateTime = new Date(`${getOnlyDateString(fromDate)}T${fromTime}`);
    let toDateTime = new Date(`${getOnlyDateString(toDate)}T${toTime}`);

    // ⏱ إذا كان ToTime أصغر من FromTime، يعني الوقت ممتد لليوم التالي
    if (toDateTime <= fromDateTime) {
      toDateTime.setDate(toDateTime.getDate() + 1); // زود يوم
      toDate.setDate(toDate.getDate() + 1);
    }

    // If العرض يسمح في هذا اليوم (حسب WorkDays)
    const isDayValid = this.isWeekDayIncluded(promo.WorkDays, this.currentMachineDay);


    return isDayValid &&
         now >= fromDateTime &&
         now <= toDateTime &&
         this.currentMachineDate >= fromDate &&
         this.currentMachineDate <= toDate;
  }
  //handel Customer Promos in Order Screen
  handelCustomerPromos(orderobj: OrderModel, customerchanged: boolean) {
    //refreshDateAndTime that keep the screen refresh
    this.refreshDateAndTime();
    if (this.customerPromos && this.customerPromos.length && orderobj.CustomerDocumentId) {
      let customerPromo = this.customerPromos.filter(
        (x) =>
          x.CustomersList &&
          x.CustomersList.includes(orderobj.CustomerDocumentId) &&
          this.chekWithinTime(x)
      )[0];
      let orderType: any;

      if (customerPromo && customerPromo.ValueType && customerPromo.Value) {
        // orderobj.IsCustsomerPromo = true;
        orderType = customerPromo.OrderTypesList?.find((x) => x === orderobj.OrderTypeDocumentId);
        if (!customerPromo.IsAppliedToProducts) {
          orderobj.DiscountType = customerPromo.ValueType;
          orderobj.Discount = customerPromo.Value;
        } else if (customerPromo.IsAppliedToProducts) {
          orderobj.OrderDetails.forEach((detail: OrderDetailModel) => {
            for (let i = 0; i < customerPromo.ProductList.length; i++) {
              if (customerPromo.ProductList[i] === detail.ProductDocumentId) {
                detail.DiscountPercentage = customerPromo.Value;
              }
            }
          });
        }
      }
    }
  }

  ///method for checking the Minimum charge value and the the hasMinimumCharge boolean attribute
  handelMinimumCharge(table, orderobj: OrderModel) {
    // refreshDateAndTime that keep the screen refresh
    this.refreshDateAndTime();
    if (
      this.minimumCharges &&
      this.minimumCharges.length &&
      this.settingobj.UseMinimumCharge &&
      orderobj.PersonsCount &&
      orderobj.TableId
    ) {
      // let orderTypeExit=this.minimumCharges[0].Tables.filter().forEach(o => {o.OrderTypesList.DocumentId});
      const tableid = table?.DocumentId ?? orderobj.TableId;
      let exitTable = this.minimumCharges[0]?.Tables?.filter((a) => a.DocumentId == tableid)[0];
      if (
        exitTable &&
        this.isWeekDayIncluded(this.minimumCharges[0]?.WorkDays, this.currentMachineDay) &&
        this.getTimeString(new Date(this.minimumCharges[0]?.TimeFrom)) <= this.currentMachineTime &&
        this.getTimeString(new Date(this.minimumCharges[0]?.TimeTo)) >= this.currentMachineTime
      ) {
        if (exitTable && exitTable.ValuePerPerson && exitTable.OrderTypesList && orderobj.PersonsCount) {
          if(orderobj.MinimumChargeNewPerPerson)
            this.orderobj.MinimumChargeValue = orderobj.PersonsCount * orderobj.MinimumChargeNewPerPerson;
          else
            this.orderobj.MinimumChargeValue = orderobj.PersonsCount * exitTable.ValuePerPerson;

          // this.orderobj.HasMinimumCharge = true;
        }
      }
    }
  }

  // showDiscountToCustomer(Customer){
  //   if(this.customerPromos && this.customerPromos.CustomersList.includes(Customer.DocumentId)){
  //     return true;
  //   }
  // }
  calculateOrderDetailTotal(orderdetail: OrderDetailModel, orderobj: OrderModel = new OrderModel()) {
    let Total = 0;

    if (!orderdetail.TaxAmount) orderdetail.TaxAmount = 0;
    if (!orderdetail.DiscountAmount) orderdetail.DiscountAmount = 0;
    if (!orderdetail.OrderDiscountValue) orderdetail.OrderDiscountValue = 0;
    if (!orderdetail.OrderDiscountValueToShow) orderdetail.OrderDiscountValueToShow = 0;
    Total = (orderdetail.ProductPrice +
          orderdetail.TaxAmount  -  orderdetail.DiscountAmount -
          orderdetail.OrderDiscountValue - orderdetail.SubItemDiscountValue -
          orderdetail.TotalSubItemDisountAmount) * orderdetail.ProductQuantity
    
    if (orderdetail.SideDishNetPrice != undefined)
      Total += orderdetail.SideDishNetPrice + orderdetail.SideDishTaxAmount
    if (Total < 0) Total = 0;
    return Total;
  }

  calculateTotals(orderobj: OrderModel, reCalculateOrderPayment: boolean) {
    orderobj.NetTotal = 0;
    orderobj.TotalInsuranceAmount = 0;
    orderobj.DetailsDiscount = 0;
    orderobj.TotalTaxAmount = 0;
    if (!orderobj.DiscountAmount) orderobj.DiscountAmount = 0;
    if (!orderobj.Discount) orderobj.Discount = 0;
    if (!orderobj.ServiceChargeValue) orderobj.ServiceChargeValue = 0;
    if (!orderobj.DeliveryPrice) orderobj.DeliveryPrice = 0;
    else orderobj.DeliveryPrice = Number(orderobj.DeliveryPrice);
    if (!orderobj.DeliveryPersonDeliveryPrice) orderobj.DeliveryPersonDeliveryPrice = 0;
    else orderobj.DeliveryPersonDeliveryPrice = Number(orderobj.DeliveryPersonDeliveryPrice);

    if (
      orderobj.OrderInsurance &&
      orderobj.OrderInsurance.OrderInsuranceDetails &&
      orderobj.OrderInsurance.OrderInsuranceDetails.length > 0
    ) {
      const totalIAmount = orderobj.OrderInsurance.OrderInsuranceDetails.reduce(
        (total, x) => total + Number(x.Quantity) * Number(x.Price),
        0
      );
      orderobj.TotalInsuranceAmount = totalIAmount || 0;
    }

    if (orderobj.OrderDetails.length != 0 || orderobj.OrderDetails != undefined) {
      orderobj.OrderDetails.forEach((detail) => {
        let SideDishNetPrice = 0;
        if (detail.SideDishNetPrice && typeof detail.SideDishNetPrice === "number") {
          SideDishNetPrice = detail.SideDishNetPrice;
        }

        orderobj.NetTotal += (detail.ProductPrice * detail.ProductQuantity) + SideDishNetPrice ;

        if (!detail.InsuranceValue) detail.InsuranceValue = 0;
        if (!detail.DiscountAmount) detail.DiscountAmount = 0;
        if (!detail.TaxAmount) detail.TaxAmount = 0;
        if (!detail.TotalSubItemDisountAmount) detail.TotalSubItemDisountAmount = 0;

        orderobj.DetailsDiscount += (detail.DiscountAmount + detail.TotalSubItemDisountAmount) * detail.ProductQuantity;

        orderobj.TotalTaxAmount += detail.SideDishTaxAmount
          ? (detail.TaxAmount * detail.ProductQuantity) + detail.SideDishTaxAmount
          : detail.TaxAmount * detail.ProductQuantity;
      });

      // Percentage
      if (orderobj.DiscountType == "1") {
        orderobj.DiscountAmount = (Number(orderobj.Discount) / 100) * (orderobj.NetTotal - orderobj.DetailsDiscount);
        if (orderobj.Discount == 100) {
          orderobj.DeliveryPrice = 0;
          orderobj.DeliveryPersonDeliveryPrice = 0;
          orderobj.TotalTaxAmount = 0;
        }
      }
      // Value
      else if (orderobj.DiscountType == "2" && orderobj.NetTotal > 0) {
        let percentage = (Number(orderobj.Discount) / (orderobj.NetTotal - orderobj.DetailsDiscount)) * 100;
        orderobj.DiscountAmount = (percentage / 100) * (orderobj.NetTotal - orderobj.DetailsDiscount);
      }

      orderobj.Total = orderobj.NetTotal - orderobj.DetailsDiscount - orderobj.DiscountAmount + orderobj.TotalTaxAmount;
      if (orderobj.Total < 0) orderobj.Total = 0;

      orderobj.SubTotal =
        orderobj.NetTotal -
        orderobj.DetailsDiscount -
        orderobj.DiscountAmount +
        orderobj.TotalTaxAmount +
        Number(orderobj.DeliveryPrice);
      if (orderobj.SubTotal <= 0) {
        orderobj.SubTotal = 0;
        orderobj.RemainigAmount = 0;
      }

      orderobj = this.handelDriverSettings(orderobj);

      this.handleServiceCharge(orderobj);
      this.handleDeliveryTax(orderobj);
      this.handleRoundingFraction(orderobj);
      this.calculateOrderPayments(orderobj, reCalculateOrderPayment);
      localStorage.setItem("orderobj", JSON.stringify(orderobj));
      // this.orderSer.changeOrderObject(orderobj);
    }
  }

  recalculateSideDishesValue(orderDetial :OrderDetailModel){
    orderDetial.SideDishesValue = 0;

    if (orderDetial.OrderDetailSubItems && orderDetial.OrderDetailSubItems.length > 0){
      orderDetial.OrderDetailSubItems.forEach(subItem=>{
        const sideProduct = this.deepCopy(this.orderSer.originalProductList.find(
          (x) => (subItem.ProductSubItemId && x.Id == subItem.ProductSubItemId) ||( subItem.ProductSubItemDocumentId && x.DocumentId == subItem.ProductSubItemDocumentId) ));

          let detailQuantity =  orderDetial.ProductQuantity;
          if(!detailQuantity) detailQuantity = 0;
          if(!subItem.Price) subItem.Price = 0;

          if(!sideProduct?.UseWeights && detailQuantity % 1 !== 0){
            if(detailQuantity < 1) detailQuantity = 1;
            else detailQuantity = Math.floor(detailQuantity);
          }
          subItem.Quantity = Number(detailQuantity) *  Number(subItem.SingleQuantity)
          orderDetial.SideDishesValue +=  subItem.Quantity * Number(subItem.Price);
      })
      

      // orderobj.OrderDetails[i].SideDishesValue = orderobj.OrderDetails[i].OrderDetailSubItems.reduce(
      //   (sum, x) => sum + Number(x.SingleQuantity) * Number(x.Price), 0 );
    }
  }
  handleRoundingFraction(orderobj: OrderModel) {
    if (this.settingobj && this.settingobj.RoundingMethod > 0 && this.settingobj.RoundingLevel > 0) {
      let subTotalBeforeRounding = orderobj.SubTotal;
      let precision = undefined;
      switch (this.settingobj.RoundingLevel) {
        case 0.01:
          orderobj.SubTotal = Number((this.getRoundedNumber(orderobj.SubTotal * 100) / 100).toFixed(2));
          break;
        case 0.25:
          orderobj.SubTotal = Number((this.getRoundedNumber(orderobj.SubTotal * 4) / 4).toFixed(2));
          break;
        case 0.05:
          orderobj.SubTotal = Number((this.getRoundedNumber(orderobj.SubTotal * 20) / 20).toFixed(2));
          break;
        case 0.1:
          precision = Math.pow(10, 1);
          orderobj.SubTotal = this.getRoundedNumber(orderobj.SubTotal * precision) / precision;
          break;
        case 0.5:
          orderobj.SubTotal = Number((this.getRoundedNumber(orderobj.SubTotal * 2) / 2).toFixed(1));
          break;
        case 1:
          precision = Math.pow(10, 0);
          orderobj.SubTotal = this.getRoundedNumber(orderobj.SubTotal * precision) / precision;
          break;
        case 5:
          orderobj.SubTotal = this.getRoundedNumber(orderobj.SubTotal / 5) * 5;
          break;
        case 10:
          orderobj.SubTotal = this.getRoundedNumber(orderobj.SubTotal / 10) * 10;
          break;
      }
      orderobj.RoundingFraction = orderobj.SubTotal - subTotalBeforeRounding;
    }
  }

  getRoundedNumber(num) {
    switch (this.settingobj.RoundingMethod) {
      case 1: // Up
        num = Math.ceil(num);
        break;
      case 2: // Down
        num = Math.floor(num);
        break;
      case 3: // Average
        num = Math.round(num);
        break;
    }
    return num;
  }

  checkCallCenter(orderobj: OrderModel) {
    if (orderobj?.pointOfSale && orderobj?.pointOfSale?.IsCallCenter) {
      orderobj.IsCallCenter = true;
      if (!orderobj || !orderobj.CustomerDocumentId || !orderobj.CustomerAddressDocumentId) {
        this.isDelivery = true;
        this.showDeliveryModal();
      } else if (!orderobj.CallCenterBranch) {
        $("#modal-Branches").modal("show");
      }
    }
    return orderobj;
  }

  setCallCenterBranch(orderobj: OrderModel, branch) {
    orderobj.CallCenterBranch = branch.DocumentId;
    $("#modal-Branches").modal("hide");
    return orderobj;
  }
  setProductPriceForMobileOrder(detail : OrderDetailModel , EditedPrice: number) {
    if (EditedPrice || EditedPrice === 0) {
      detail.EditedPrice = Number(EditedPrice);
      detail.ProductPrice = Number(EditedPrice);
      detail.Product.Price = Number(EditedPrice);
      detail.Product.PriceChanged = true;
      let product = this.allproductlist.find((x) => x.DocumentId == detail.ProductDocumentId);
      if (product) {
        product.PriceChanged = true;
        product.Price = Number(EditedPrice);
      }
    }
  }
  setProductQuantityForGame(orderobj){
    // calculate game time 
    if(!orderobj.TableId || !this.halls?.length ) return;
    const hall = this.halls?.find(h=> h.Tables.some(t=>t.DocumentId === orderobj.TableId));
    if(!hall || !hall?.ServeEntertainmentServices) return;
    orderobj.OrderDetails?.forEach(orderDetail => {
      if(orderDetail.StartTime && orderDetail.EndTime){
        const totalTimeInMinutes = getTimeDifferenceInSeconds(orderDetail.StartTime, orderDetail.EndTime) / 60;
        if(hall?.EntertainmentServiceTime != 2)
          orderDetail.ProductQuantity = Math.ceil(totalTimeInMinutes) / 60;
        else{
          const ceiledMinutes = Math.ceil(totalTimeInMinutes / 15) * 15;
          orderDetail.ProductQuantity = ceiledMinutes / 60;
        }
      }
      orderDetail.TotalTime = this.getGameTime(orderDetail);
    });
  }

  getGameTime(OD){
    if(OD.StartTime && OD.EndTime){
      const totalTimeInMinutes = getTimeDifferenceInSeconds(OD.StartTime, OD.EndTime) / 60;
      const hours = Math.floor(totalTimeInMinutes / 60);
      const minutes = Math.ceil(totalTimeInMinutes % 60);
      return `${hours}H / ${minutes}M`;
    }
    return '';
  }
  tableHasMinCharge(orderobj: OrderModel){
    const table = this.minimumCharges[0]?.Tables?.find(t=> t.DocumentId === orderobj.TableId);
    if(table) {
      const tableHasMin = table.OrderTypesList?.length ? !!(table.OrderTypesList?.includes(orderobj.OrderTypeDocumentId) && table.ValuePerPerson) : !!table.ValuePerPerson;
      return orderobj.OrderType?.Value == 4 && this.orderSer?.settings?.UseMinimumCharge && orderobj.MinimumChargeValue &&
      orderobj.TableId && tableHasMin;
    }else return false;
  }
  //// this method for recalculate the subtotal and the payments if there is minimum charge
  ApplySubTotalWithMinChargeValue(orderobj: OrderModel) {
    if(!orderobj.OrderMasterTaxes?.length) orderobj.OrderMasterTaxes = [];
    if (orderobj.SubTotal < orderobj.MinimumChargeValue && this.tableHasMinCharge(orderobj)) {
      if(orderobj.HasMinimumCharge == true){
        orderobj.MinimumChargeDifferance = orderobj.MinimumChargeValue - orderobj.SubTotal;
        if (orderobj.MinimumChargeDifferance > 0 && this.minimumCharges?.length && this.minimumCharges[0]?.Tax?.length && this.minimumCharges[0]?.Tax[0]?.DocumentId) {
          this.addTaxToOrderMasterTaxes(orderobj);
        }
        orderobj.SubTotal = orderobj.MinimumChargeValue;

        if (this.minimumCharges?.length && this.minimumCharges[0]?.Tax?.length && this.minimumCharges[0]?.Tax[0]?.DocumentId)
          orderobj.minChargeTaxValue = orderobj.OrderMasterTaxes.filter((x) => x.ServiceTaxType == 2)[0].TaxAmount;

        if (orderobj.minChargeTaxValue)
          orderobj.MinimumChargeDifferance = orderobj.MinimumChargeDifferance - orderobj.minChargeTaxValue;

        orderobj.RemainigAmount = orderobj.MinimumChargeValue * -1;
        orderobj.OrderPayments[0].Amount = orderobj.MinimumChargeValue;
      }
      
    }
    else if(orderobj.SubTotal > orderobj.MinimumChargeValue || !this.tableHasMinCharge(orderobj)){
      orderobj.MinimumChargeDifferance = 0;
      orderobj.minChargeTaxValue = 0;
      orderobj.HasMinimumCharge = false;
      orderobj.OrderMasterTaxes = orderobj.OrderMasterTaxes.filter((x) => x.ServiceTaxType != 2);
    }
  }
  recalculateOrderObject(orderobj: OrderModel, reCalculateOrderPayment: boolean = true ,
     orderTypeDiscountValueCalled = false , foodPlanCalled = false) {
    this.checkWorkTimeFinished();
    if (!orderobj.Serial) orderobj.Serial = Guid.create().toString();
    if (orderobj && orderobj.OrderDetails) {
      this.handelCustomerPromos(orderobj, false);
      orderobj.OrderDetails.filter((x: OrderDetailModel) => !x.IsCancelled);

      for (let i = orderobj.OrderDetails.length - 1; i >= 0; i--) {

        if(orderobj.IsDeliverectOrder) this.setProductPriceForMobileOrder(orderobj.OrderDetails[i], orderobj.OrderDetails[i].RealPrice);

        let product = orderobj.OrderDetails[i].Product;
        if (!orderobj.OrderDetails[i].UUID) orderobj.OrderDetails[i].UUID = Guid.create().toString();

        if (product) {
          this.recalculateSideDishesValue(orderobj.OrderDetails[i]);

          this.checkProductVolumeAndSides(orderobj.OrderDetails[i]);
          
          orderobj.OrderDetails[i] = this.handlePromo(product, orderobj.OrderDetails[i], orderobj);

          orderobj.OrderDetails[i] = this.handelProductDiscount(product, orderobj.OrderDetails[i], orderobj);

          orderobj.OrderDetails[i] = this.handelProductTax(product, orderobj.OrderDetails[i], orderobj);

          this.setProductGroup(orderobj.OrderDetails[i]);
        }
        orderobj.OrderDetails[i].Total = this.calculateOrderDetailTotal(orderobj.OrderDetails[i], orderobj);
      }
      // Start orderDetailWithCustomPromo
      // let orderDetailWithCustomPromo = orderobj.OrderDetails.find(
      //   (x) =>
      //     // x.EditingSelected == true &&
      //     x.Product?.Promos.find(
      //       (p) => p.ValueType == 3 && p?.OrderTypesList?.includes(orderobj?.OrderType?.DocumentId)
      //     )
      // );
      //
      // if (orderDetailWithCustomPromo && orderDetailWithCustomPromo.Product && orderobj && orderobj.OrderType.IsPromo) {
      //   this.handelCustomPromo(orderDetailWithCustomPromo.Product, orderDetailWithCustomPromo, orderobj);
      // }
      // End orderDetailWithCustomPromo
      this.handleDeliveryPriceOptions(orderobj, true);
      this.calculateTotals(orderobj, reCalculateOrderPayment);
      this.ApplySubTotalWithMinChargeValue(orderobj);

      orderobj = this.getReportTranslationObj(orderobj);
      this.updatePendingOrders(orderobj);
    }

    orderobj = this.checkCallCenter(orderobj);
    if (this.settingobj.IsUsingCustomerPriceDisplay) {
      orderobj.DispalyMode = 2;
      this.orderSer.VFDDisplay(orderobj).subscribe();
    }
    this.calculateRemainingAmount(orderobj);
    this.handelFoodPlan(orderobj ,foodPlanCalled);
    if(!orderTypeDiscountValueCalled) return this.setOrderTypeDiscountValue(orderobj);
    else return orderobj;
  }
  setOrderTypeDiscountValue(orderobj : OrderModel){
    if (orderobj.OrderType?.DiscountType == 2 && orderobj.OrderType?.Discount > 0) {
      const discountValue = orderobj.OrderType?.Discount;
      orderobj.Discount = orderobj.DiscountVal =orderobj.DiscountPer=  0;
      this.calculateTotals(orderobj ,false);
      orderobj.DiscountPer = orderobj.SubTotal > 0 ?((Number(discountValue)/orderobj.SubTotal) * 100) :0;
      orderobj.DiscountPer = orderobj.DiscountPer > 100 ? 100 : orderobj.DiscountPer;
      orderobj.Discount = orderobj.DiscountPer;
      orderobj.DiscountType = '1';
      return this.recalculateOrderObject(orderobj ,true,true);
    }
    return orderobj;
  }
  addCustomPromoWithOrderDetail() {}
  handelFoodPlan(orderobj : OrderModel,foodPlanCalled = false){
    if(!orderobj.EmployeeDocumentId || !orderobj.FoodPlanData || foodPlanCalled ||
       !orderobj.FoodPlanData?.remainingAmount) return;

    orderobj.Discount = orderobj.DiscountVal = orderobj.DiscountPer = 0;
    orderobj = this.recalculateOrderObject(orderobj,true,false,true);
    const amount = orderobj.FoodPlanData.remainingAmount;
    orderobj.Discount = orderobj.NetTotal ? (amount / orderobj.NetTotal) * 100 : 0;
    orderobj.Discount = this.clamp(orderobj.Discount, 0, 100);
    orderobj.DiscountType = '1';
    // // get order copy and recalculate it to get final discount
    // const orderCopy =this.recalculateOrderObject(this.deepCopy(orderobj),true,false,true);
    // orderobj.FoodPlanDiscountAmount = orderCopy.DiscountAmount;
    // ////////////////////////////////////////////////////////
    // orderobj.FoodPlanDiscountAmount = orderobj.SubTotal < amount ?  orderobj.SubTotal : amount;

    orderobj = this.recalculateOrderObject(orderobj,true,false,true);
    orderobj.FoodPlanDiscountAmount = orderobj.DiscountAmount;
  }
  setProductGroup(orderDetail: OrderDetailModel) {
    if (this.productgrouplist && this.productgrouplist.length) {
      const group = this.productgrouplist.find(g => 
        (orderDetail.ProductGroupDocumentId && g.DocumentId === orderDetail.ProductGroupDocumentId) ||
        (orderDetail.ProductGroupId && g.Id === orderDetail.ProductGroupId));
      if (group) {
        orderDetail.ProductGroupId = group.Id;
        orderDetail.ProductGroupDocumentId = group.DocumentId;
        orderDetail.ProductGroupName = group.Name;
      }
    }
  }
  handleDeliveryPriceOptions(orderobj: OrderModel, isFromRecalculate) {
    let subtotalerror = false;
    if (orderobj.OrderType && orderobj.OrderType.Value == 2) {
      // set delivery price based on options
      if (isFromRecalculate) {
        if (this.settingobj.IsDeliveryFreeForAll) {
          orderobj.DeliveryPrice = 0;
          orderobj.DeliveryPersonDeliveryPrice = 0;
        } else if (this.settingobj.IsDeliveryFixed) {
          orderobj.DeliveryPrice = this.settingobj.FixedDeliveryPrice;
          orderobj.DeliveryPersonDeliveryPrice = 0;
        } else if (this.settingobj.IsDeliveryFreeForBigOrders) {
          if (orderobj.SubTotal >= this.settingobj.BigOrdersSubTotal) {
            orderobj.DeliveryPrice = 0;
            orderobj.DeliveryPersonDeliveryPrice = 0;
          } else {
            if (!orderobj.DeliveryPrice || orderobj.DeliveryPrice == 0) {
              if (orderobj.CustomerId && orderobj.CustomerAddress && orderobj.CustomerAddress.RegionId) {
                ////////////////////////////
              }
            }
          }
        }
        if(this.settingobj?.IsDeliveryIncludedInRevenueAsPercentage && this.settingobj?.DeliveryIncludedPercentage ){
          const focusedElement:any = document.activeElement as HTMLElement | null;

          // Check if the focused element has a 'name' property and matches the expected name
          if (!focusedElement?.name || focusedElement?.name != 'RegionsDeliveryPrice') {
            const totalDeliveryPrice = (orderobj.DeliveryPrice ?? 0) + (orderobj.DeliveryPersonDeliveryPrice ?? 0);
            orderobj.DeliveryPrice = totalDeliveryPrice * (this.clamp(this.settingobj.DeliveryIncludedPercentage , 1 , 100) / 100);
            orderobj.DeliveryPersonDeliveryPrice = totalDeliveryPrice - orderobj.DeliveryPrice ; 
          }
        }
      }
      // check if the subtotal exceeds the max delivery price
      else {
        if (!this.settingobj.DeliveryMaxSubTotal || Number(this.settingobj.DeliveryMaxSubTotal) == 0) {
          // unlimited total
        } else if (
          !(
            orderobj.SubTotal >= this.settingobj.DeliveryMinSubTotal &&
            orderobj.SubTotal <= this.settingobj.DeliveryMaxSubTotal
          )
        ) {
          subtotalerror = true;
        }
      }
    }

    return subtotalerror;
  }

  calculateOrderPayments(orderobj: OrderModel, reCalculateOrderPayment: boolean) {
    const oldOrderPayments:OrderPaymentModel[] = this.deepCopy(orderobj.OrderPayments);

    // check if total order not changed
    if(!orderobj.Reservation && oldOrderPayments?.length === 1 && oldOrderPayments[0].Amount === this.totalForAllPay(orderobj))
      return orderobj;

    if (!orderobj.OrderPayments || reCalculateOrderPayment) orderobj.OrderPayments = [];
    // orderobj.OrderPayments = [];
    if (reCalculateOrderPayment || orderobj.OrderPayments.length == 0) {
      if (orderobj.FreePaymentCalculated && oldOrderPayments[0] && oldOrderPayments[0].PayTypeDocumentId) {
        let freePayType = this.orderPayTypelist.filter((o) => o.DocumentId == oldOrderPayments[0].PayTypeDocumentId)[0];
        if (freePayType) this.setOrderPayType(freePayType, orderobj);
        else this.setOrderPayType(this.orderPayTypelist[0], orderobj);
      } else if (
        orderobj.OrderType &&
        (orderobj.OrderType.OrderPayTypeDocumentId || orderobj.OrderType.OrderPayTypeId)
      ) {
        let defaultPayTypeForOrderType = this.orderPayTypelist.filter(
          (o) =>
            (orderobj.OrderType.OrderPayTypeId && o.Id == orderobj.OrderType.OrderPayTypeId) ||
            (orderobj.OrderType.OrderPayTypeDocumentId && o.DocumentId == orderobj.OrderType.OrderPayTypeDocumentId)
        )[0];
        if (defaultPayTypeForOrderType) this.setOrderPayType(defaultPayTypeForOrderType, orderobj);
        else this.setOrderPayType(this.orderPayTypelist[0], orderobj);
      } else if (orderobj.OrderType && orderobj.OrderType.Value == 4 && orderobj.OrderType.ForStaff) {
        let creditPayType = this.orderPayTypelist.filter((p) => p.PayType == 20)[0];
        if (creditPayType) this.setOrderPayType(creditPayType, orderobj);
        else this.setOrderPayType(this.orderPayTypelist[0], orderobj);
      } else if (orderobj.Reservation && orderobj.PayedAmountReservation > orderobj.SubTotal) {
        let creditPayType = this.orderPayTypelist.filter((p) => p.PayType == 20)[0];
        if (creditPayType) this.setOrderPayType(creditPayType, orderobj);
        else this.setOrderPayType(this.orderPayTypelist[0], orderobj);
      } else {
        let oldPayType = oldOrderPayments?.length === 1 ? this.orderPayTypelist.find(p=>p.DocumentId == oldOrderPayments[0].PayTypeDocumentId && p.PayType != 70) : null;
        if(!oldPayType)
          oldPayType = this.orderPayTypelist.find(p=>p.PayType == 10);
        this.setOrderPayType(oldPayType ?? this.orderPayTypelist[0] , orderobj);
      }
    }

    return orderobj;
  }

  setReservationPayment(orderobj: OrderModel) {
    if (orderobj.Reservation && orderobj.PayedAmountReservation > 0) {
      let creditPayType = this.orderPayTypelist.filter((p) => p.PayType == 20)[0];
      if (creditPayType) {
        let payment: OrderPaymentModel = new OrderPaymentModel();
        payment.PayTypeId = creditPayType.Id;
        payment.PayTypeDocumentId = creditPayType.DocumentId;
        payment.PayTypeName = creditPayType.Name;
        payment.Amount = orderobj.PayedAmountReservation;
        payment.PayAmount = orderobj.PayedAmountReservation;
        payment.ReservationPayment = true;

        if (
          orderobj.OrderPayments == null ||
          orderobj.OrderPayments.length == 0 ||
          (orderobj.OrderPayments.findIndex(
            (x) =>
              (payment.PayTypeId && x.PayTypeId == payment.PayTypeId) ||
              x.PayTypeDocumentId == payment.PayTypeDocumentId
          ) == -1 &&
            orderobj.OrderPayments[orderobj.OrderPayments.length - 1].Amount != 0)
        ) {
          orderobj.OrderPayments.push(payment);
          this.calculateRemainingAmount(orderobj);
        }
      } else {
        this.toastr.info("Missing Credit Payment Types !");
        this.router.navigateByUrl("/PayType");
      }
    }
    return orderobj;
  }

  setOrderPayType(value: OrderPayTypeModel, orderobj: OrderModel, paymentSystem = null) {
    if (!orderobj.OrderPayments) orderobj.OrderPayments = [];

    // We don't want to set order payments for integration Order. It comes only from backend
    if (orderobj.IntegrationSystem && orderobj.IntegrationSystem > 0) {
      return;
    }

    // check if order from Reservation
    if (orderobj.Reservation && orderobj.PayedAmountReservation > 0) orderobj = this.setReservationPayment(orderobj);

    if (!value) value = new OrderPayTypeModel();
    if (!orderobj.TotalInsuranceAmount) orderobj.TotalInsuranceAmount = 0;
    let payment: OrderPaymentModel = new OrderPaymentModel();
    payment.PayTypeId = value.Id ? value.Id : null;
    payment.PayTypeDocumentId = value.DocumentId;
    orderobj.OrderPayTypeId = value.Id ? value.Id : null;
    orderobj.OrderPayTypeDocumentId = value.DocumentId;
    orderobj.OrderPayTypeName = value.Name;
    payment.PayTypeName = this.getTypeName(value);

    if(value.PayType == 70) payment.PayType = value.PayType;
    if (value.PayType === 70 && orderobj.RemainigAmount < 0) {
      let cardValue = Math.abs(orderobj.RemainigAmount) > this.selectedPointsCard?.Value ?
       this.selectedPointsCard?.Value : Math.abs(orderobj.RemainigAmount)

      if (cardValue && getDecimalPlaces(cardValue) > 5)
        cardValue = parseFloat(cardValue.toFixed(5));

      payment.Amount = cardValue;
      payment.PayAmount = cardValue;
      orderobj.PointsCountApplied = this.selectedPointsCard?.PointsCount;
    } else {
      payment.Amount = 0.0;
    }
    //payment.PayAmount=0.00;
    if (paymentSystem) {
      payment.PayTypeName = paymentSystem.Name;
      payment.PaymentSystemDocumentId = paymentSystem.PaymentSystemDocumentId;
    }

    if (value.PayType !== 70) {
      if (orderobj.OrderPayments == null || orderobj.OrderPayments.length == 0) {
        //payment.Amount=orderobj.SubTotal + orderobj.DeliveryPersonDeliveryPrice;
        payment.Amount = orderobj.SubTotal + orderobj.DeliveryPersonDeliveryPrice + orderobj.TotalInsuranceAmount;
      } else {
        if (Number(orderobj.RemainigAmount) >= 0.0) {
          payment.Amount = 0.0;
        } else {
          payment.Amount = orderobj.RemainigAmount * -1;
        }
      }
    }
    if (!orderobj.Reservation || orderobj.PayedAmountReservation < orderobj.SubTotal) {
      if (
        orderobj.OrderPayments == null ||
        orderobj.OrderPayments.length == 0 ||
        (orderobj.OrderPayments.findIndex((x) => x.PayTypeDocumentId == payment.PayTypeDocumentId) == -1 &&
          orderobj.OrderPayments[orderobj.OrderPayments.length - 1].Amount != 0)
      ) {
        if (payment.PayType === 70) {
          orderobj.OrderPayments.unshift(payment);
          this.calculateRemainingAmount(orderobj, getDecimalPlaces(orderobj.SubTotal) > 5);
          if(orderobj.RemainigAmount < 0) this.setOrderPayType(this.defaultSelectedPayType, orderobj);
        } else {
          orderobj.OrderPayments.push(payment);
        }
        this.calculateRemainingAmount(orderobj);
      }
    }
    // if (
    //   orderobj.OrderPayments == null ||
    //   orderobj.OrderPayments.length == 0 ||
    //   (orderobj.OrderPayments.findIndex((x) => x.PayTypeDocumentId == payment.PayTypeDocumentId) == -1 &&
    //     orderobj.OrderPayments[orderobj.OrderPayments.length - 1].Amount != 0)
    // ) {
    //   orderobj.OrderPayments.push(payment);
    //   this.calculateRemainingAmount(orderobj);
    // }

    // free payment
    if (value.Percentage > 0 && !orderobj.FreePaymentCalculated) {
      orderobj.Discount = value.Percentage;
      orderobj.DiscountType = "1";
      orderobj.FreePaymentCalculated = true;
      orderobj = this.recalculateOrderObject(orderobj, true);
    } else if (orderobj.FreePaymentCalculated) {
      orderobj.FreePaymentCalculated = false;
    }
    ////////////////
  }

  // private calculateVisaCommissionAmount(value: OrderPayTypeModel, payment: OrderPaymentModel, orderobj: OrderModel) {
  //   // if (value.PayType == 30 && value.HasCommission && value.CarryCommissionOn == CarryCommissionOn.Customer && value.CommissionAmount > 0) {
  //   //   if (value.CommissionAmount > 100)
  //   //     value.CommissionAmount = 100;
  //   //   payment.VisaCommissionAmount = payment.Amount * (value.CommissionAmount / 100);
  //   //   payment.Amount += payment.VisaCommissionAmount;
  //   //   orderobj.SubTotal += payment.VisaCommissionAmount;
  //   // }
  // }

  calculateRemainingAmount(orderobj: OrderModel = new OrderModel() ,toFixed5: boolean = false) {
    this.totalOrderPayment = 0.0;
    if (!orderobj?.RemainigAmount) orderobj.RemainigAmount = 0;
    if (orderobj?.SubTotal) {
      if (orderobj.OrderPayments != null) {
        orderobj.OrderPayments.forEach((element) => {
          this.totalOrderPayment += element.PayAmount && element.PayAmount > 0 ? Number(element.PayAmount) : 0;
        });
      }
      //orderobj.RemainigAmount=this.totalOrderPayment-orderobj.SubTotal - orderobj.DeliveryPersonDeliveryPrice;
      orderobj.RemainigAmount =
        this.totalOrderPayment -
        (toFixed5 ? Number(orderobj.SubTotal.toFixed(5)) : orderobj.SubTotal) -
        orderobj.DeliveryPersonDeliveryPrice -
        orderobj.TotalInsuranceAmount;
    }
    if (orderobj.SubTotal == 0 && (orderobj.TotalInsuranceAmount > 0 || orderobj.TotalInsuranceAmount)) {
      if (!orderobj.pointOfSale.PaymentButtonDirectly) {
        orderobj.RemainigAmount = orderobj?.TotalInsuranceAmount * -1;
      }
    }
  }

  validatePayment(orderobj: OrderModel, IsFromPayment: boolean = false) {
    if (
      !orderobj.OrderPayments ||
      !orderobj.OrderPayments.length ||
      orderobj.OrderPayments.some((p) => !p.PayTypeDocumentId)
    ) {
      this.toastr.warning(this.translate.instant("messages.PleaseInsertPayAmountForEachPayment"));
      return;
    }

    if(orderobj.Reservation && orderobj.PayedAmountReservation > 0 && orderobj.OrderPayments?.length > 1){
      orderobj.OrderPayments?.forEach(p=>{
        if(p?.Amount && !p?.PayAmount) p.PayAmount = p.Amount;
      })
    }

    if (
      (orderobj.OrderPayments.length > 1 &&
        orderobj.OrderPayments[orderobj.OrderPayments.length - 1].PayAmount <
          orderobj.OrderPayments[orderobj.OrderPayments.length - 1].Amount) ||
      (orderobj.OrderPayments.length > 1 && !orderobj.OrderPayments[orderobj.OrderPayments.length - 1].PayAmount)
    ) {
      this.toastr.warning(this.translate.instant("messages.PleaseInsertPayAmountForEachPayment"));
      return;
    }
    /////////////////////////////////////

    // **********************************************
    // **********************************************
    // **********************************************
    // **********************************************
    // **********************************************
    // **********************************************
    // **********************************************
    // **********************************************
    if (!(orderobj.Discount == 100 && orderobj.DiscountType == "1")) {
      if (!orderobj.OrderPayments || orderobj.OrderPayments.length == 0) {
        this.toastr.warning(this.translate.instant("messages.paymentRequired"));
        return false;
      }
      if (orderobj.OrderPayments.filter((x) => !x.PayTypeDocumentId)[0]) {
        this.toastr.warning(this.translate.instant("messages.paymentRequired"));
        orderobj = this.recalculateOrderObject(orderobj);
        return false;
      }
      if (orderobj.OrderPayments.filter((x) => !x.Amount || x.Amount == 0)[0]) {
        if (orderobj.OrderDetails.filter((x) => x.IsCancelled).length < orderobj.OrderDetails.length) {
          if (orderobj.SubTotal > 0) {
            let op = orderobj.OrderPayments.filter((x) => !x.Amount || x.Amount == 0)[0];
            let index = orderobj.OrderPayments.indexOf(op);
            this.toastr.warning(this.translate.instant("messages.PaymentAmountCannotbeZero"));
            this.setFocusById("PayAmount" + index);
            return false;
          }
        }
      }

      let orderPaymentsAmounts = orderobj.OrderPayments.map((x) => Number(x.Amount)).reduce(
        (next, current) => next + current,
        0
      );
      // if (orderPaymentsAmounts < orderobj.SubTotal) {

      let diff = Number(orderobj.SubTotal - orderPaymentsAmounts);
      if (orderobj.IsMobileOrder == true || orderobj.IsCallCenter == true) {
        return true;
      }
      if (diff > 0.01) {
        this.toastr.warning(this.translate.instant("messages.OrderPaymentMustbeGreaterthanorequaltototal"));
        return false;
      }
      if (
        IsFromPayment &&
        this.settingobj.PreventClosingWithoutFullPayment &&
        orderobj.OrderPayments.filter((x) => !x.PayAmount || x.PayAmount == 0)[0] &&
        orderobj.OrderPayments.filter((x) => x.Amount > 0)[0]
      ) {
        let op = orderobj.OrderPayments.filter((x) => !x.PayAmount || x.PayAmount == 0)[0];
        let index = orderobj.OrderPayments.indexOf(op);
        this.toastr.warning(this.translate.instant("messages.PaymentAmountCannotbeZero"));
        this.setFocusById("PayAmount" + index);
        return false;
      }
      // Check if reservatison order and not credit pay
      if (orderobj.Reservation && orderobj.PayedAmountReservation > 0 && !this.checkCreditPayment(orderobj)) {
        this.toastr.warning(this.translate.instant("messages.MustAddCreditPayment"));
        return false;
      }
      if (
        orderobj.pointOfSale &&
        orderobj.pointOfSale.IsCallCenter &&
        (!orderobj.CustomerDocumentId || !orderobj.CustomerAddressDocumentId || !orderobj.CallCenterBranch)
      ) {
        if (!orderobj.CustomerDocumentId || !orderobj.CustomerAddressDocumentId)
          this.toastr.info(this.translate.instant("messages.MustSelectCustomer"));
        if (!orderobj.CallCenterBranch) this.toastr.info(this.translate.instant("Shared.BranchName") + "!");

        orderobj = this.checkCallCenter(orderobj);
        return false;
      }
      // Check if OtelPrimo order and not credit pay
      if (orderobj.OtelPrimoRoomNo > 0 && !this.checkCreditPayment(orderobj)) {
        this.toastr.warning(this.translate.instant("messages.MustAddCreditPayment"));
        return false;
      }
      // check reuired payment note
      const payTypesRequiresNotes = this.orderPayTypelist.filter(x=>x.NoteIsRequired).map(p=>p.DocumentId);
      if(payTypesRequiresNotes?.length){
        const payTypesRequiresNotesExists = orderobj.OrderPayments
          .find(x=> payTypesRequiresNotes.includes(x.PayTypeDocumentId) && !x.Note);

        if(payTypesRequiresNotesExists){
          this.toastr.warning(this.translate.instant("messages.NoteIsRequiredForPayment") + payTypesRequiresNotesExists.PayTypeName);
          return false;
        }
      }
      
    }


  if((orderobj.paymentErrorFired || 
    (orderobj.OrderPayments.length == 1 &&
    ((orderobj.OrderPayTypeId && orderobj.OrderPayments[0].PayTypeId != orderobj.OrderPayTypeId)||
    (orderobj.OrderPayTypeDocumentId && orderobj.OrderPayments[0].PayTypeDocumentId != orderobj.OrderPayTypeDocumentId) ) )) && !orderobj.IsMobileOrder && !orderobj.IsCallCenter){
     orderobj.OrderPayments = [];
     orderobj.paymentErrorFired = true;
     this.toastr.warning(this.translate.instant("messages.PleaseMakeSureOfOrderPayment"));
     return false;
   }
    return true;
  }

  getName(ob) {
    if(!ob) return '';
    if (ob.ProductProperties && ob.ProductProperties.Name && !ob.VolumeId && !ob.VolumeDocumentId) {
      return ob.ProductProperties.Name ?? "";
    } else if (this.defaultLanguage && this.settingobj && this.currentUserLanguage) {
      if (this.settingobj.ShowBothNameAndForeignName && ob.ForiegnName && ob.ForiegnName != "") {
        return (ob.Name ?? "") + " , " + (ob.ForiegnName ?? "");
      } else if (this.settingobj.NamesOfProductsBasedOnMainUserLang) {
        if (!this.currentUserLanguage.includes(this.defaultLanguage) && ob.ForiegnName && ob.ForiegnName != "")
          return ob.ForiegnName ?? "";
        else return ob.Name ?? "";
      }
      return ob.Name ?? "";
    }
    return ob.Name ?? "";
  }

  getNameForProduct(ob ,fromAria="") {
    if( ob?.AsGroupMeal && ob?.GroupMealName && fromAria != "GroupMealPopup"  ) return ob?.GroupMealName;
    let productCode='';
    if(this.settingobj?.ShowProductCodeWithNameInOrderScreen && ob.ProductNumber)
      productCode = '-' + ob.ProductNumber;
    
    return `${this.getName(ob)}${productCode}`
  }

  getTypeOfName() {
    if (this.defaultLanguage && this.settingobj && this.currentUserLanguage) {
      if (this.settingobj.NamesOfProductsBasedOnMainUserLang) {
        if (!this.currentUserLanguage.includes(this.defaultLanguage)) return 2;
        else return 1;
      }
      return 1;
    }
    return 1;
  }

  getTypeName(ob) {
    if(!ob) return '';
    if (this.defaultLanguage && this.settingobj && this.currentUserLanguage) {
      if (this.settingobj.ShowBothNameAndForeignName && ob.ForeignName && ob.ForeignName != "") {
        return (ob.Name ?? "") + " , " + (ob.ForeignName ?? "");
      }
      if (this.settingobj.NamesOfProductsBasedOnMainUserLang) {
        if (!this.currentUserLanguage.includes(this.defaultLanguage) && ob.ForeignName && ob.ForeignName != "")
          return ob.ForeignName ?? "";
        else return ob.Name ?? "";
      }
      return ob.Name ?? "";
    }
    return ob.Name ?? "";
  }

  checkCreditPayment(orderobj: OrderModel) {
    if (orderobj && orderobj.OrderPayments) {
      let creditPayTypeIds = this.orderPayTypelist.filter((x) => x.PayType === 20 && x.Id).map((x) => x.Id);
      let creditPayTypeDocumentIds = this.orderPayTypelist
        .filter((x) => x.PayType === 20 && x.DocumentId)
        .map((x) => x.DocumentId);
      let creditePayment = orderobj.OrderPayments.find(
        (x) => creditPayTypeIds.includes(x.PayTypeId) || creditPayTypeDocumentIds.includes(x.PayTypeDocumentId)
      );
      if (creditePayment) return true;
      else return false;
    } else return false;
  }

  checkAvailableQuantityBeforeSave(orderobj: OrderModel) {
    return new Promise((resolve) => {
      this.orderSer.checkAvailableQuantityBeforeSave(orderobj).subscribe(
        async (res) => {
          resolve(true);
          return true;
        },
        (err) => {
          this.handeExeptionError(err.error);
          resolve(false);
          return false;
        }
      );
    });
  }

  closeAsync(orderobj: OrderModel, isOnlinePay: boolean = false) {
    this.showLoader(isOnlinePay);
    this.updatePendingOrders(orderobj ,true);
    return new Promise((resolve) => {
      if (orderobj.DocumentId) {
        // Update order
        this.orderSer.UpdateOrder(orderobj).subscribe(
          async (res) => {
            this.showSuccess(isOnlinePay);
            if (res && res["Item1"] == 1) {
              this.toastr.success(this.toastrMessage.GlobalMessages(res["Item1"]), "Order");
              if(this.settingobj?.UseStocksAndPurchase) this.orderSer.UpdateItemsQuantities(orderobj.DocumentId).subscribe();
              if (res["Item2"]) this.PrintToPrinterFromCloud(res["Item2"], orderobj.LanguageOptions);
            } else {
              this.showFaild(isOnlinePay);
              this.toastr.error(this.toastrMessage.GlobalMessages(res), "Order");
            }
            resolve(res);
          },
          (err) => {
            this.showFaild(isOnlinePay);
            this.handeExeptionError(err.error);
            resolve(err);
          }
        );
      } else {
        this.orderSer.CloseOrder(orderobj).subscribe({
          next: (res) => {
            this.showSuccess(isOnlinePay);
            if (res && res["Item4"] && this.settingobj?.UseStocksAndPurchase) this.orderSer.UpdateItemsQuantities(res["Item4"]).subscribe();
            if (res && !res["Item1"]) {
              this.toastr.success(this.toastrMessage.GlobalMessages(res), "Order");
            } else if (res["Item1"] == 1) {
              if (orderobj.IntegrationSystem > 0) {
                this.updateOrderStatus(0, orderobj.ReferenceCode, "", orderobj);
              }
              this.toastr.success(this.toastrMessage.GlobalMessages(res["Item1"]), "Order");
              if (res["Item2"] == true) this.toastr.info("Printed Successfully", "Order");
              else this.toastr.error("Something wrong hapeens while printing", "Order");
              if (res["Item3"]) this.PrintToPrinterFromCloud(res["Item3"], orderobj.LanguageOptions);
            } else {
              this.showFaild(isOnlinePay);
              this.toastr.error(this.toastrMessage.GlobalMessages(res["Item1"]), "Order");
            }
            resolve(res);
          },
          error: (err) => {
            this.showFaild(isOnlinePay);
            this.handeExeptionError(err.error);
            resolve(err);
          }
        });
      }
    });
  }

  checkIsOnlinePay(pos, orderobj: OrderModel) {
    if (pos && pos.UsePaymentDevices && pos.PaymentDevices.length > 0 && orderobj.Paid) {
      let devicePaymentsIds = pos.PaymentDevices.map((d) => d.PayTypeDocumentId);
      let payments = orderobj.OrderPayments.filter((p) => devicePaymentsIds.includes(p.PayTypeDocumentId));
      if (payments.length > 0) return true;
      else return false;
    }
    return false;
  }

  showLoader(isOnlinePay: boolean) {
    this.errorForPaymentDevice = false;
    if (isOnlinePay) {
      this.requestStarted = false;
      Swal.fire({
        title: this.translate.instant("setting.Connecting"),
        html: this.translate.instant("setting.Pleasewait"),
        timerProgressBar: true,
        allowOutsideClick: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    }
  }

  showSuccess(isOnlinePay: boolean) {
    this.errorInSaveOrder = false;
    if (isOnlinePay) {
      Swal.close();
      Swal.fire({
        title: this.translate.instant("setting.Success"),
        text: this.translate.instant("Shared.Done"),
        icon: "success",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        cancelButtonText: this.translate.instant("Shared.Cancel")
      }).then((result) => {
        if (result) {
        }
      });
    }
  }

  showFaild(isOnlinePay: boolean) {
    this.errorInSaveOrder = true;
    if (isOnlinePay) {
      this.errorForPaymentDevice = true;
      Swal.close();
      Swal.fire({
        title: "",
        text: this.translate.instant("setting.FaildConnect") + "!",
        icon: "error",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        cancelButtonText: this.translate.instant("Shared.Cancel")
        // confirmButtonColor: '#3085d6',
        // cancelButtonColor: '#d33',
        // confirmButtonText: 'Create new Order!'
      }).then((result) => {
        if (result) {
        }
      });
    }
  }

  PrintToPrinterFromCloud(cloudPrintingModel: any, LanguageOptions) {
    if (
      (cloudPrintingModel.Reports && cloudPrintingModel.Reports.length) ||
      (cloudPrintingModel.OrderDetailPrinters && cloudPrintingModel.OrderDetailPrinters.length)
    ) {
      var lanOprtions = this.deepCopy(LanguageOptions);
      lanOprtions.ReportsJson = undefined;
      lanOprtions.JsonLangFile = this.getJsonLangforCloud();
      let token = localStorage.getItem("token");
      let tenantId = localStorage.getItem("TenantId");
      let pointOfSaleDocumentId = localStorage.getItem("PointOfSaleDocumentId");

      let model = {
        Url: this.orderSer.common.rooturl.toString(),
        Token: token,
        LanguageOptions: lanOprtions,
        TenantId: tenantId,
        PointOfSaleDocumentId: pointOfSaleDocumentId,
        Reports: cloudPrintingModel.Reports,
        OrderDetailPrinters: cloudPrintingModel.OrderDetailPrinters
      };

      this.orderSer.CompressGZip(JSON.stringify(model)).subscribe((res: any) => {
        if (res && res.json) {
          location.href = "PrintToPrinter:" + res.json;
        }
      });
    }
  }

  handeExeptionError(error) {
    let errMessage = '';
    if (error.errors && error.title) {
      this.toastr.error(error.title);
      errMessage = error.title;
    }else {
      try {
        let index = error.indexOf(" at ");
        //then get everything after the found index
        let strOut = error.substr(0, index);
        errMessage = strOut;
        if (strOut.includes("UnAvailableQuantity")) {
          let indexOfproductName = strOut.indexOf("UnAvailableQuantity");
          let productName = strOut.substr(indexOfproductName + "UnAvailableQuantity".length);
          this.toastr.info(this.translate.instant("messages.NoAvailableQuantity") + " " + productName, "Order");
        } else if(!errMessage.toLowerCase().includes('validate order')) this.toastr.error(strOut, "Order");
      } catch (error) {
        this.toastr.error(error);
        errMessage = error;
      }
    }
    // stopp clear order if Validate order exception
    if(typeof errMessage === 'string' && (errMessage.toLowerCase().includes('validate order')
      || errMessage.toLowerCase().includes('shiftbeforedo')) ){
      this.requestStarted = false;
      this.orderSer.stopLoaderOnError = true;
      
      if(!errMessage.toLowerCase().includes('shiftbeforedo'))
        this.handelValidateOrderExeptionMessages(errMessage);
      
      const preloader = document.getElementById('preloader-wrap');
      if(preloader) preloader.style.display = 'none';
      throw new Error(errMessage);
    }
  }
  handelValidateOrderExeptionMessages(errMessage){
    if(errMessage.toLowerCase().includes('please add setting to printer paths'))
      this.toastr.warning(this.translate.instant("messages.pleaseaddsettingtoprinterpaths"));
    else if(errMessage.toLowerCase().includes('make sure your tax printer is connected'))
      this.toastr.warning(this.translate.instant("messages.Makesureyourtaxprinterisconnected"));
    else
      this.toastr.warning(errMessage);
  }

  handelCustomPromo(product: ProductModel, orderDetail: OrderDetailModel, orderobj: OrderModel) {
    this.freeProducts = [];
    let promoProducts = product.Promos.map((p) => p.PromoProducts).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    if (promoProducts && promoProducts.length > 0) {
      promoProducts = promoProducts.filter((pp) => pp.TakeProductDocumentId == product.DocumentId);
      const VolumeDocumentId = product.VolumeDocumentId || orderDetail?.VolumeDocumentId;
      if(promoProducts?.length && VolumeDocumentId)
        promoProducts = promoProducts.filter(x=>x.TakeProductVolumeDocumentId == VolumeDocumentId && x.TakeProductDocumentId == product.DocumentId);
      
      let promoProduct = promoProducts[0];
      if (promoProduct && (promoProduct.GetProducts?.length > 0 || promoProduct?.PromoCustomProductDetails?.length > 0)) {
        if (!promoProduct.TakeProductQuantity) promoProduct.TakeProductQuantity = 1;
        let dividForSameProduct = Number(orderDetail.ProductQuantity) / Number(promoProduct.TakeProductQuantity);

        if (Number(dividForSameProduct) > 0 && orderDetail.ProductQuantity === promoProduct.TakeProductQuantity) {
          if (this.allproductlist && this.allproductlist.length > 0) {
            if (promoProduct && promoProduct?.PromoCustomProductDetails?.length) {
              let getProductDocumentIds = promoProduct?.PromoCustomProductDetails.map(x => x.GetProductDocumentId);
              this.freeProducts = this.deepCopy(this.allproductlist.filter(x => getProductDocumentIds.includes(x.DocumentId)));
            }
            else{
              this.freeProducts = this.deepCopy(
                this.allproductlist.filter((x) => promoProduct.GetProducts.map(y=>y.GetProductDocumentId).includes(x.DocumentId))
              );
            }
            this.freeProducts.forEach((free: any) => {
              if (!free.Disabled) free.Disabled = false;
              if (!free.FreeChecked) free.FreeChecked = false;
            });
          }
          if (orderDetail.IsParentPromo) {
            this.freeProducts.forEach((freeProduct) => {
              // promoDetail For Detail is Exist
              let index = orderobj.OrderDetails.findIndex(
                (x) =>
                  x.ProductDocumentId == freeProduct.DocumentId &&
                  x.ProductIndex == orderDetail.ProductIndex &&
                  x.IsPromo
              );
              if (index != -1) {
                orderobj.OrderDetails[index].ProductQuantity = promoProduct.GetProductQuantity * dividForSameProduct;
                orderobj.OrderDetails[index].PromoProductName = orderDetail.ProductName;
              }
            });
          } else {
            orderDetail.IsParentPromo = true;
            if (!orderDetail.IsPromo) {
              this.freeobj = {
                promoProduct: promoProduct,
                orderDetail: orderDetail,
                dividForSameProduct: dividForSameProduct,
                orderobj: orderobj
              };
              if (this.freeProducts.length === 1) {
                // true => because we are auto checking the promo product
                // 0 => because the freeProducts array length is only 1 so there is only one product inside of it
                // and its index will be 0
                this.selectFreeProducts(true, 0);
              } else {
                this.freeProductsSelectionLimit = promoProduct.GetProductQuantity;
                $("#modal-CustomPromo").modal("show");
              }
            }
          }
        }
      }
    }
  }

  printOrderObj(orderobj: OrderModel) {
    if(orderobj.OrderDetails.some(x=>x.StartTime && !x.EndTime)){
      this.toastr.warning(this.translate.instant("messages.PleaseCloseOpendGame"));
      return;
    }
    this.isPrinting = true;
    this.orderSer.PrintOrder(orderobj).subscribe(
      async (res) => {
        if (res && res["Item1"] == 1) {
          this.toastr.success(this.toastrMessage.GlobalMessages(res["Item1"]), "Order");
          if (res["Item2"]) this.PrintToPrinterFromCloud(res["Item2"], orderobj.LanguageOptions);
          if(orderobj.PrintCount) orderobj.PrintCount++;
          else orderobj.PrintCount = 1;
        } else this.toastr.error(this.toastrMessage.GlobalMessages(res), "Order");

        this.isPrinting = false;
      },
      (err) => {
        this.toastr.error(this.translate.instant("messages.Somethingwronghapeenswhileprinting"));
        this.isPrinting = false;
      }
    );
  }
  PrintPreviewOrder(orderobj: OrderModel) {
    this.isPrinting = true;
    if(!orderobj.LanguageOptions) this.getReportTranslationObj(orderobj);
    this.orderSer.PrintPreviewOrder(orderobj).subscribe(
      async (res) => {
        if (res) {
          this.toastr.success(this.toastrMessage.GlobalMessages(res));
        }
        this.isPrinting = false;
      },
      (err) => {
        this.toastr.error(this.translate.instant("messages.Somethingwronghapeenswhileprinting"));
        this.isPrinting = false;
      }
    );
  }
  printMultiOrders(orders){
    orders.forEach(order => {
      this.PrintPreviewOrder(order);
    });
  }
  permittedPrint(order: OrderModel){
    if(this.isAdmin) return true;
    let permitted = this.validationList["CanPrint"];
    if(!permitted || order.PrintCount > 0)
      permitted = this.validationList["CanPrintMoreThanOne"];
    return permitted;
  }
  // this method for btn print that prints the order  and isPaymentPrintBtn i used to spcifay it to check if
  // this is the print btn from the payment
  printOrder(orderobj: OrderModel, isPaymentPrintBtn?) {
    // this print var is used for checking whether to continue the printing or stoping it
    // if there is a product dosent send to the kitchen
    if(orderobj.OrderDetails.some(x=>x.StartTime && !x.EndTime)){
      this.toastr.warning(this.translate.instant("messages.PleaseCloseOpendGame"));
      return;
    }
    if(this.settingobj?.UseMinimumCharge && orderobj.MinimumChargeValue && orderobj.MinimumChargeValue > orderobj.SubTotal){
      this.toastr.warning(this.translate.instant("messages.MinimumChargeValueShouldBe"));
      return;
    }
    let print = false;
    if (isPaymentPrintBtn == true) {
      orderobj.OrderDetails.forEach((x) => {
        if (x.Printed == false || x.Printed == undefined) {
          this.toastr.warning(this.translate.instant("messages.paymentprintorderwarning"));
          print = false;
        } else {
          print = true;
        }
      });
      if (print == false) {
        return;
      }
      this.printOrderObj(orderobj);
      return false;
    }
    this.printOrderObj(orderobj);
  }

  getValidationOptions() {
    var validations: { [key: string]: any } = {
      CanSuspendOrder: false,
      CanAddExtraService: false,
      CanAddDiscount: false,
      CanAddTips: false,
      CanAddCustomer: false,
      CanViewPayment: false,
      CanPrint: false,
      CanPrintMoreThanOne: false,
      CanSplitOrder: false,
      CanSplitOrderAfterPrint: false,
      CanSplitReceipt: false,
      CanChangeTable: false,
      CanViewCachierOperations: false,
      CanViewSales: false,
      CanViewClosedOrders: false,
      CanCancelOrder: false,
      CanCancelOrderAfterPrint: false,
      CanCancelOrderAfterOrderPreparationTime: false,
      CanChangeEndOfDayDate: false,
      CanChangeDeliveryPrice: false,
      CanChangeInsurancePrice: false,
      CanChangeProductProperties: false,
      CanAddDiscountForDetail: false,
      CanCloseWithoutPrint: false,
      CanAddCreditCustomer: false,
      CanNotEditOrderForAnotherUser: false,
      CanEditDeliveryInfoAfterSave: false,
      CanViewTotalOfOrdersInHall: false,
      CannotAddAndEditHallsAndTables: false,
      VerifiedOrderByPinBeforeSave: false,
      CanAddCancelReasonFromOrder: false,
      CanEditTheCaptainInOrder: false,
      CanEditTheWaiterInOrder: false,
      CanEditPersonsCountAfterSave: false,
      CanCancelService:false,
      CanViewTotalLastOrders:false,
      CanChangeQuantityAfterSaveForWeightedProduct:false
    };
    this.validationList = validations;

    return this.clone(this.validationList);
  }

  showCustomerPopUp(orderobj, validationList) {
    if (orderobj.DocumentId && !validationList["CanEditDeliveryInfoAfterSave"])
      this.toastr.info(this.translate.instant("messages.CanNotEditDeliveryInfoAfterSave"));
    else {
      if (this.orderSer.closeOrderFromPayment){
        setTimeout(() => {this.showDeliveryModal()}, 200);
        this.orderSer.closeOrderFromPayment = false;
      }
      else 
        this.showDeliveryModal();
    }
  }
  showDeliveryModal(){
    this.orderSer.showDeliveryPopup = true;
    $("#modal-40444").modal("show");
    setTimeout(() => {
     this.setFocusById('search_PhoneNumber');
    }, 300);
  }
  hideDeliveryModal() {
    this.orderSer.showDeliveryPopup = false;
    $("#modal-40444").modal("hide");
  }
  CheckISGrantedTo(permission: string, userPermissions) {
    let permited = false;
    userPermissions.forEach((up) => {
      up.POSUserRoleOptions.forEach((option) => {
        if (option.Name == permission && option.IsGranted) {
          permited = true;
          return true;
        }
      });
    });
    if (permited == false) {
      return false;
    } else {
      return true;
    }
  }

  grantOptionsForUser(isAdmin: boolean, validationList, userPermissions: any) {
    var validationList2 = this.clone(validationList);
    var keys = Object.keys(validationList2);

    if (isAdmin) {
      keys.forEach((x) => {
        validationList2[x] = true;
      });
    } else {
      keys.forEach((x) => {
        validationList2[x] = this.CheckISGrantedTo(x, userPermissions);
      });
    }
    return validationList2;
  }

  routIfMissingData(dataName: string , message = '') {
    switch (dataName) {
      case "pointofsale":
        this.toastr.info(this.translate.instant("messages.MissingPointofsale"));
        this.router.navigateByUrl("/pointofsale");
        break;
      case "producttype":
        this.toastr.info("Missing Products !");
        this.router.navigateByUrl("/serversync");
        break;
      case "setting":
        this.toastr.info("Missing settings !");
        this.router.navigateByUrl("/POSsettings");
        break;
      case "ordertype":
        this.toastr.info("Missing OrderType !");
        this.router.navigateByUrl("/serversync");
        break;
      case "orderpaytype":
        this.toastr.info("Missing OrderPayTypes !");
        this.router.navigateByUrl("/serversync");
        break;
      case "pin":
        this.toastr.info(this.translate.instant("messages.MustPin"));
        this.router.navigateByUrl("/home");
      case "user":
        this.toastr.info(this.translate.instant("messages.MustCaptain"));
        setTimeout(() => {
          this.router.navigateByUrl("/home");
        }, 100);
        break;
      case "workTime":
        this.toastr.info(this.translate.instant(message ? message : "messages.MustLinkUserWithShift"));
        setTimeout(() => {
          this.router.navigateByUrl("/home");
        }, 100);
        break;
      case "admin":
        this.toastr.info(this.translate.instant("messages.AdminAccessDenied"));
        setTimeout(() => {
          this.router.navigateByUrl("/home");
        }, 100);
        break;
      default:
        this.router.navigateByUrl("/home");
        break;
    }
  }

  continueAfterPin(permission: string, orderComponent: OrderComponent|null = null) {
    switch (permission) {
      case "CanCancelOrder":
      case "CanCancelOrderAfterPrint":
        $("#modal-Cancel").modal("show");
        break;
      case "CanSplitReceipt":
        this.splitReceipt();
        break;
      case "CanSplitOrder":
        this.splitOrChangeOrder(true);
        break;
      case "CanChangeTable":
        this.splitOrChangeOrder(false);
        break;
      case "ReturnOrder":
        this.router.navigateByUrl("/returnorder",{state:{PinUserId:this.orderobj.PinUserId}});
        break;
      case "CanPrintMoreThanOne" :
      case "CanPrint" :
        this.printOrder(this.orderobj);
        orderComponent?.ClearOrderModel();
        orderComponent?.clearSuggestions();
        break;
      case "CanCancelOrderAfterOrderPreparationTime":
        orderComponent?.openCancelOrder();
        break;
    }
  }

  handelDriverSettings(orderobj: OrderModel) {
    if (orderobj.Driver && orderobj.DriverDocumentId && orderobj.DeliveryPrice > 0) {
      if (!orderobj.DeliveryPersonDeliveryPrice) orderobj.DeliveryPersonDeliveryPrice = 0;
      if (!orderobj.DeliveryPrice) orderobj.DeliveryPrice = 0;
      if (orderobj.Driver.NotIncludedInTotal) {
        orderobj.DeliveryPersonDeliveryPrice += Number(orderobj.DeliveryPrice);
        orderobj.SubTotal -= Number(orderobj.DeliveryPrice);
        orderobj.DeliveryPrice = 0;
      } else if (orderobj.Driver.FixedDeliveryPersonAmount && orderobj.Driver.DriverFixedAmount > 0) {
        orderobj.DeliveryPersonDeliveryPrice += Number(orderobj.Driver.DriverFixedAmount);
        orderobj.SubTotal -= Number(orderobj.Driver.DriverFixedAmount);
        orderobj.DeliveryPrice -= Number(orderobj.Driver.DriverFixedAmount);
      }
    }
    return orderobj;
  }

  PrintOrderWithDataSet(order: OrderModel) {
    let orderobj = this.clone(order);
    // if (
    //   orderobj.DeliveryNetPrice &&
    //   orderobj.DeliveryNetPrice > 0 &&
    //   (!orderobj.DeliveryPrice || orderobj.DeliveryPrice === 0)
    // )
    //   orderobj.DeliveryPrice = orderobj.DeliveryNetPrice;
    this.orderSer.PrintOrderWithDataSet({ Order: orderobj, IsA4: false }).subscribe(
      (data: any) => {
        try {
          //  var report = new Stimulsoft.Report.StiReport();
          this.reprtresult = data?.report;
          this.orderToPrint = data?.orderToPrint;
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

          var tag_id = document.getElementById("StimulsoftId");
          if (tag_id) tag_id.innerHTML = textWriter.getStringBuilder().toString();
        } catch (error) {}
      },
      (err) => {
        this.handeExeptionError(err.error);
      }
    );
  }

  PrintPerview(orderobj: OrderModel) {
    ///////////////////////////////  this part si added to make sure that each product detail sent to the kit before print it
    if(orderobj.OrderDetails.some(x=>x.StartTime && !x.EndTime)){
      this.toastr.warning(this.translate.instant("messages.PleaseCloseOpendGame"));
      return;
    }
    let print = false;
    orderobj.OrderDetails.forEach((x) => {
      if (x.Printed == false || x.Printed == undefined) {
        this.toastr.warning(this.translate.instant("messages.paymentprintorderwarning"));
        print = false;
      } else {
        print = true;
      }
    });
    if (print == false) {
      return;
    }
    ////////////////////////////////end of part
    this.orderSer.PrintOrderWithDataSet({ Order: orderobj, IsA4: true }).subscribe(
      (data: any) => {
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
      (err) => {
        this.handeExeptionError(err.error);
      }
    );
    return false;
  }

  UnselectCustomer(order: OrderModel) {
    order.DeliveryPrice = 0;
    order.DeliveryPersonDeliveryPrice = 0;
    order.DeliveryNetPrice = 0;
    order.CustomerDocumentId = undefined;
    order.CustomerId = undefined;
    order.CustomerAddressDocumentId = undefined;
    order.CustomerName = undefined;
    order.CustomerPhone = undefined;
    order.Customer = new CustomerModel();
    order.CustomerAddress = new CustomerAddressModel();
    return order;
  }

  updateOrderStatus(OrderStates: number, OrderId, Reason, Order: OrderModel = null) {
    // Returning promise because we need to know if it is successful or not
    return new Promise((resolve) => {
      let diff = 10;
      let clickedStatusList = JSON.parse(localStorage.getItem("clickedStatusList"));

      if (!clickedStatusList) clickedStatusList = [];
      let ClickedTime = clickedStatusList.filter((x) => x.OrderId == OrderId)[0];
      if (ClickedTime) diff = (new Date().getTime() - new Date(ClickedTime.Date).getTime()) / (1000 * 60);
      // if (diff >= 2 || OrderStates === 0) {
      let model = {
        OrderStates: OrderStates,
        OrderId: OrderId,
        Reason: Reason?.Name,
        ReasonId: Reason?.Id,
        ItemIdList: Reason?.ItemIdList,
        Order: Order,
        Integration: Order.IntegrationSystem
      };
      this.orderSer.updateOrderStatus(model).subscribe({
        next: (res) => {
          this.toastr.success(this.toastrMessage.GlobalMessages(res));
          resolve(true);
        },
        error: (err) => {
          this.toastr.error(err?.error?.Message);
          resolve(false);
        }
      });
      $("#modal-YemekSepeti").modal("hide");
      if (ClickedTime) ClickedTime.Date = new Date();
      else clickedStatusList.push({ OrderId: OrderId, Date: new Date() });
      localStorage.setItem("clickedStatusList", JSON.stringify(clickedStatusList));
      // } else {
      //   this.toastr.info("you have to wait 2 minute before update order statuse!");
      //   $("#modal-YemekSepeti").modal("hide");
      // }
    });
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

  getJsonLangforCloud() {
    let lang = "en.json";
    switch (this.settingobj.CustomerReceiptReportLanguage1) {
      case 2:
        lang = "ar.json";
        break;
      case 3:
        lang = "tu.json";
        break;
      case 4:
        lang = "fr.json";
        break;
    }
    let FrontUrl = window.location.href.replace("order", "");
    return lang;
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

  selectFreeProducts(event: any, index: number) {
    if (event) {
      if (this.freeProducts[index].FreeChecked === false) {
        this.freeOrderDetail = new OrderDetailModel();
        if (!this.freeOrderDetails) this.freeOrderDetails = [];
        this.freeProducts[index].FreeChecked = event;
        this.selectedFreeProducts.push(this.freeProducts[index]);

        this.selectedFreeProducts.forEach((freeProduct) => {
          if (freeProduct.FreeChecked) {
            this.freeOrderDetail.PromoProductName = this.freeobj.orderDetail.ProductName;
            this.freeOrderDetail.IsPromo = true;
            this.freeOrderDetail.ProductId = freeProduct.Id;
            if (!this.freeobj.orderDetail.ProductIndex && this.freeobj.orderDetail.ProductIndex != 0)
              this.freeobj.orderDetail.ProductIndex = freeProduct.orderobj.OrderDetails.length;
            this.freeOrderDetail.ProductIndex = this.freeobj.orderDetail.ProductIndex;
            this.freeOrderDetail.ProductDocumentId = freeProduct.DocumentId;
            this.freeOrderDetail.ProductGroupDocumentId = freeProduct.ProductGroupDocumentId;
            this.freeOrderDetail.ProductGroupId = freeProduct.ProductGroupId;
            this.freeOrderDetail.ProductName = this.getName(freeProduct);
            
            this.freeOrderDetail.Product = this.deepCopy(freeProduct);
            if(this.freeobj?.promoProduct?.GetProducts?.length){
              this.freeOrderDetail.VolumeDocumentId = this.freeobj?.promoProduct?.GetProducts?.find(x=>x.GetProductDocumentId == freeProduct.DocumentId)?.GetProductVolumeDocumentId;
              this.setFreeDetailVolume(this.freeOrderDetail.Product );
            }
            this.freeOrderDetail.ProductPrice = 0;
            this.freeOrderDetail.Product.Price = 0;

            if(this.freeobj?.promoProduct?.PromoCustomProductDetails?.length){
              const promoCustomProductDetail = this.freeobj?.promoProduct?.PromoCustomProductDetails?.find(x=> x.GetProductDocumentId == freeProduct.DocumentId)
              this.freeOrderDetail.VolumeDocumentId = promoCustomProductDetail?.GetProductVolumeDocumentId;
              const volume = this.setFreeDetailVolume(this.freeOrderDetail.Product );
              if(promoCustomProductDetail && promoCustomProductDetail.NewPrice){
                this.freeOrderDetail.ProductPrice = promoCustomProductDetail.NewPrice;
                this.freeOrderDetail.Product.Price = promoCustomProductDetail.NewPrice;
                this.freeOrderDetail.DiscountPercentage = 0;
              }
              if(promoCustomProductDetail && promoCustomProductDetail.DiscountPercentage){
                let price = freeProduct.Price ;
                if(this.freeOrderDetail.VolumeDocumentId && volume){
                  const pVolume = freeProduct.ProductVolumes.find(x=>(volume.DocumentId && volume.DocumentId == x.VolumeDocumentId) ||(volume.VolumeId && volume.VolumeId == x.VolumeId));
                  if(pVolume) price = pVolume.Price;
                }
                this.freeOrderDetail.ProductPrice = price;
                this.freeOrderDetail.Product.Price = price;
                this.freeOrderDetail.DiscountPercentage = promoCustomProductDetail.DiscountPercentage;
              }
            }
            if (this.selectedFreeProducts.length > 1) {
              this.freeOrderDetail.ProductQuantity = 1;
              this.freeOrderDetails.forEach((freeDetail: OrderDetailModel) => {
                freeDetail.ProductQuantity = 1;
              });
            } else {
              this.freeOrderDetail.ProductQuantity = this.freeobj.promoProduct.GetProductQuantity;
            }
          }
        });
        this.freeOrderDetails.push(this.freeOrderDetail);
        if (this.freeProducts.length === 1) {
          this.confirmFreeProductsModel();
          return;
        }
      }
    } else {

      this.freeProducts[index].FreeChecked = event;
      const removedIndex = this.selectedFreeProducts.findIndex(
        (prod) => prod.DocumentId === this.freeProducts[index].DocumentId
      );
      this.selectedFreeProducts.splice(removedIndex, 1);
      const freeDetailRemovedIndex = this.freeOrderDetails.findIndex(
        (freeDetail) => freeDetail.ProductDocumentId === this.freeProducts[index].DocumentId
      );
      this.freeOrderDetails.splice(freeDetailRemovedIndex, 1);
      if (this.selectedFreeProducts.length === 1 && this.freeOrderDetails.length === 1) {
        this.freeOrderDetails[0].ProductQuantity = this.freeobj.promoProduct.GetProductQuantity;
      }
    }
    if (
      (this.freeobj.orderDetail.VolumeDocumentId && this.freeobj.orderDetail.VolumeDocumentId.length > 1) ||
      (this.freeobj.orderDetail.VolumeFerpCode && this.freeobj.orderDetail.VolumeFerpCode.length > 1) ||
      this.freeobj.orderDetail.VolumeId
    ) {
      this.confirmFreeProductsModel();
    }
  }
  setFreeDetailVolume(product: ProductModel) {
    if (this.freeOrderDetail.VolumeDocumentId) {
      const volume = this.volumes?.find(x => x.DocumentId == this.freeOrderDetail.VolumeDocumentId);
      if (volume) {
        this.freeOrderDetail.VolumeId = volume.Id;
        this.freeOrderDetail.ProductVolumName = this.getName(volume);
        if(this.settingobj?.ShowVolumeAsProduct ){
          product.Name = this.freeOrderDetail.ProductName + ` ${this.settingobj?.VolumeAndProductNameSeparatorCharacter ?? '/'} ` + this.freeOrderDetail.ProductVolumName;
        }
      }
      return volume;
    }
    return null;
  }
  confirmFreeProductsModel() {
    this.freeobj.orderobj.OrderDetails.push(...this.freeOrderDetails);
    $("#modal-CustomPromo").modal("hide");
    this.freeProducts = [];
    this.freeobj = {};
    this.freeOrderDetails = [];
    this.freeOrderDetail = new OrderDetailModel();
    this.selectedFreeProducts = [];
    if(this.freeobj.orderobj) this.freeobj.orderobj.OrderDetails = [];
    this.orderobj = this.recalculateOrderObject(this.orderobj);
  }

  closeFreeProductsModel() {
    $("#modal-CustomPromo").modal("hide");
    this.freeProducts = [];
    this.freeobj = {};
    this.freeOrderDetails = [];
    this.freeOrderDetail = new OrderDetailModel();
    this.selectedFreeProducts = [];
    if(this.freeobj.orderobj) this.freeobj.orderobj.OrderDetails = [];
  }

  getMaxDiscountForUser(isAdmin: boolean, permission: string, userPermissions, validationList) {
    let MaxDiscountValue = 100;
    if (!isAdmin) {
      let userOptions = userPermissions.map((x) => x.POSUserRoleOptions);
      let options = [];

      userOptions.forEach((userOption) => {
        let option = userOption.filter((x) => x.Name == permission && x.IsGranted)[0];
        if (option) options.push(option);
      });
      let discounts = [];
      if (options && options.length > 0) discounts = options.map((x) => x.MaxDiscountValue);
      else if (validationList[permission]) discounts.push(MaxDiscountValue);
      let MaxDiscount = Math.max.apply(null, discounts);
      if (MaxDiscount > 0) MaxDiscountValue = MaxDiscount;
      else MaxDiscountValue = 0;

      // validationList["CanAddDiscountForDetail"] = options[0]?.IsGranted;
    }
    return MaxDiscountValue;
  }

  checkIfPersonSelected(personId, personDocumentId: string, Employee, SelectLabel: boolean): boolean {
    if (SelectLabel) {
      if (Employee.Id && personId != Employee.Id) return true;
      else if (!Employee.Id && Employee.DocumentId && personDocumentId != Employee.DocumentId) return true;
    } else {
      if (Employee.Id && personId == Employee.Id) return true;
      else if (!Employee.Id && Employee.DocumentId && personDocumentId == Employee.DocumentId) return true;
    }
    return false;
  }

  callkeyboard() {
    // this.showKeyboard = !this.showKeyboard;
    this.orderSer.openkeyboard().subscribe();

  }

  setKeyBoardInput(modelToChange) {
    this.KeyboardNgModel = modelToChange;
  }
  clearSearch() {
    this.orderSer.customerList = [];
    this.orderSer.customerAddressList = [];
  }
  checkProductVolumeAndSides(orderDetail:OrderDetailModel){

    // Volumes
    let product = orderDetail.Product;
    if(this.orderSer.originalProductList?.length)
        product = this.orderSer.originalProductList.find(p=>p.DocumentId == orderDetail.Product?.DocumentId);

    if((orderDetail.ProductVolumName || orderDetail.VolumeDocumentId || orderDetail.VolumeId || orderDetail.VolumeFerpCode) && !product?.ProductVolumes?.length){
      orderDetail.ProductVolumName = undefined;
      orderDetail.VolumeDocumentId = undefined;
      orderDetail.VolumeId = undefined;
      orderDetail.VolumeFerpCode = undefined;
    }
    // subitems
    if(orderDetail.OrderDetailSubItems?.length && !product?.ProductSubItems?.length && !product?.IsCombo){
      const comboProduct = this.comboProducts?.find(c => c.ProductDocumentId == product.DocumentId);
      if (!comboProduct?.ComboDetails?.length)
        orderDetail.OrderDetailSubItems = [];
    }

  }
  totalForAllPay(_orderobj :OrderModel){
    return _orderobj?.SubTotal + _orderobj?.DeliveryPersonDeliveryPrice + _orderobj?.TotalInsuranceAmount;
  }

  checkWorkTimeFinished(){
    
    this.refreshDateAndTime();

    const day = this.orderSer.workTime?.WorkTimeDays?.find(x=> x.DayName.toLowerCase() == this.currentMachineDay.toLowerCase() && x.IsDayActive);
    if(!day || !day.ToTime) return;

    let fireSwal = '';
    let message = '';
    let remainingMinutes = 0;

    const toTime = this.getDateFromTime(day.ToTime) 

    if(this.orderSer.workTime?.ExitSystemWhenShiftEnd && this.currentMachineTime >= this.getTimeString(toTime) ){
      message = "Order.ShiftEnded";
      fireSwal = 'close';
      this.orderSer.shiftAlertFired = false;
    }
    else if(this.orderSer.workTime?.AlertBeforeEnd ){
      toTime.setMinutes(toTime.getMinutes() - this.orderSer.workTime?.AlertBeforeEnd);
      if(this.currentMachineTime >= this.getTimeString(toTime) && !this.orderSer.shiftAlertFired){
        message = "Order.ShiftAlert";
        fireSwal = 'alert';
        remainingMinutes = this.getDateFromTime(day.ToTime).getMinutes() - this.getDateFromTime(this.currentMachineTime).getMinutes();
        
        setTimeout(() => {
          this.orderSer.shiftAlertFired = false;
        }, 60*1000 * remainingMinutes);

        this.orderSer.shiftAlertFired = true;
      }
    }

    if(fireSwal && message){
      Swal.fire({
        title: this.translate.instant("messages.Warning") + "!",
        text: (remainingMinutes ? remainingMinutes : '')  + this.translate.instant(message),
        icon: "warning",
        confirmButtonColor: "#3085d6",
        backdrop:false,
        confirmButtonText: this.translate.instant("Shared.Ok")
      }).then((result) => {
        if (result.isConfirmed && fireSwal == 'close') {
          this.routIfMissingData("workTime",message);
        }
      });
    }

  }

  getDateFromTime(time:string){
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  getScalerWeight() {
    return new Promise<any>((resolve) => {
      this.orderSer.GetScalerWeight().subscribe(
        async (res) => { resolve(res);},
        (err) => {
          this.handeExeptionError(err.error);
          resolve(0);
        }
      );
    });
  }

  public static getDefaultCustomerGroup(customerGroupList : any[]){
    if(customerGroupList && customerGroupList.length > 0){
      let defaultGroup = customerGroupList.find(x => x.Id > 0 && x.DefaultGroup);
      if(!defaultGroup) defaultGroup = customerGroupList.find(x => x.Id > 0);
      if(!defaultGroup) defaultGroup = customerGroupList.find(x => x.DefaultGroup);
      return defaultGroup;
    }
    return null;
  }
  updatePendingOrders(orderobj:OrderModel, remove:boolean = false){
    if(!this.orderSer.settings?.UsePendingOrders) return;
    this.pendingOrders = LocalstorgeService.getByKey(this.pendingOrdersKey) || [];
    if(orderobj?.Serial && orderobj.OrderType?.Value == 1){
      if(this.pendingOrders.find(x=>x.Serial == orderobj.Serial))
        this.pendingOrders = this.pendingOrders.filter(x=>x.Serial != orderobj.Serial);
  
      if(!remove && orderobj?.OrderDetails?.length && !orderobj.DocumentId) this.pendingOrders.push(orderobj);
      LocalstorgeService.addOrUpdate(this.pendingOrdersKey,this.pendingOrders);
    }
    this.pendingOrdersCount = this.pendingOrders.filter(x=>x.Serial != orderobj?.Serial).length;
  }
  
  openPendingOrders() {
    this.pendingOrders = LocalstorgeService.getByKey(this.pendingOrdersKey) || [];
    this.pendingOrders = this.pendingOrders.filter(x => x.Serial !== this.orderobj?.Serial);
    $("#modal-PendingOrders").modal("show");
  }
  
  selectPendingOrder(order: OrderModel) {
    this.orderobj = order;
    $("#modal-PendingOrders").modal("hide");
  }
  //#region getters
  isOrderPreparationTimeFinished(order:any,forHistoryOrders : boolean = false){
    let prepareTimeInMinutes = this.orderSer.settings?.DefaultOrderPreparationTimeInMinutes ? this.orderSer.settings?.DefaultOrderPreparationTimeInMinutes : 0;
    if(forHistoryOrders){
      let productPeriodTime = Math.max(...order.OrderDetails
        .filter(x=>x.Product?.ProductPeriodTime > 0)?.map(x=>x.Product?.ProductPeriodTime));
      if(productPeriodTime > prepareTimeInMinutes) prepareTimeInMinutes = productPeriodTime;
    }
    if(!order?.CreationTime || !prepareTimeInMinutes)
      return false;
    const orderTime = order?.CreationTime;
    const orderTimeDate = new Date(orderTime);
    const orderTimeDatePlusPreparationTime = new Date(orderTimeDate.getTime() + prepareTimeInMinutes * 60 * 1000);
    const finished = orderTimeDatePlusPreparationTime < new Date();
    if(finished) order.IsPreparationTimeFinished = true;
    if(!forHistoryOrders && finished)
      this.toastr.info(this.translate.instant("Order.PreparationTimeFinished"));
    return finished;
  }
  //#endregion
}
