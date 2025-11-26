import { Component, HostListener, OnInit, ViewChild, KeyValueDiffer, DoCheck, KeyValueDiffers } from "@angular/core";
// import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Subscription } from "rxjs";
import { filter, map } from "rxjs/operators";
import { MenuItem, Pagination } from "src/app/app.model";
import { AppService } from "src/app/core/Services/app.service";
import { OrderHelper } from "../../order/OrderHelper";
import { TranslateService } from "@ngx-translate/core";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SettingService, ToastrService, HandlingBackMessages } from "../../user/userimport";
import { OrderModel } from "../../manage-order/manageorderimport";
import { ProductTypeModel } from "src/app/core/Models/Transactions/product-type-model";
import { OrderTypeModel } from "../../order-types/ordertypeimpots";
import { ProductPricingClassModel } from "../../pricing-class/pricing-classes-import";
import { ProductPricingClassVolumeModel } from "src/app/core/Models/Transactions/ProductPricingClassVolumeModel";
import { ProductModel } from "src/app/core/Models/Transactions/product-model";
import { CommonService } from "../../branch/branchimport";
import { GenericHelper } from "../../GenericHelper";
import { AdditionsCartComponent } from "src/app/shared/additions-cart/additions-cart.component";
import { CartOverviewComponent } from "src/app/shared/cart-overview/cart-overview.component";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { CustomerService, CustomerModel } from "../../customer/customerimport";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent extends GenericHelper implements OnInit, DoCheck {
  innerWidth: any;
  openMainMenu: boolean = true;
  openSide: boolean;
  public pagination: Pagination = new Pagination(1, this.count, null, 2, 0, 0);
  public sort: string = "";
  public watcher: Subscription;
  public sidenavOpen: boolean = false;
  public showSidenavToggle: boolean = false;
  private orderDiffer: KeyValueDiffer<string, any>;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true,
    useBothWheelAxes: true
  };
  [key: string]: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("sidenav") sidenav: any;
  // public psConfig: PerfectScrollbarConfigInterface = {
  //   wheelPropagation:true
  // };
  radioModel = "0";
  categoryId: any;
  radioModelDisabled = "Middle";
  modelGroupDisabled = false;
  public categories: any[] = [];
  public menuItems: MenuItem[] = [];
  constructor(
    public appService: AppService,
    public translate: TranslateService,
    public orderSer: OrderService,
    private common: CommonService,
    private router: Router,
    public SettingSer: SettingService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    private kvDiffers: KeyValueDiffers,
    private route: ActivatedRoute,
    public customerService: CustomerService
  ) {
    super();
    this.onResize();
    this.route.queryParams.subscribe((params) => {
      this.TableDocumentId = params.TableDocumentId;
      this.CustomerDocumentId = params.CustomerDocumentId;
    });
    this.orderHelper = new OrderHelper(SettingSer, orderSer, toastr, toastrMessage, router, translate);
    this.defaultIm = "assets/images/v10.jpg";
    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";
  }
  openBottomSheet() {}
  public changeCount(count: number) {
    this.count = count;
    //  this.finalProductList.length = 0;
    this.resetPagination();
  }
  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
  }

  ngOnInit(): void {
    if (!this.TableDocumentId || this.TableDocumentId == "undefined") {
      this.TableDocumentId = "";
    }
    this.orderobj = new OrderModel();
    this.orderobj.OrderDetails = [];
    this.orderobj.IsMobileOrder = true;
    this.orderDiffer = this.kvDiffers.find(this.orderobj.OrderDetails).create();
    this.firstOpen();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth < 992) {
      this.openSide = true;
      this.sidenavOpen = false;
      this.openMainMenu = false;
      this.showSidenavToggle = true;
      // this.sidenav.open();
    } else {
      this.showSidenavToggle = false;
      this.openSide = false;
      this.openMainMenu = true;
      this.sidenavOpen = false;
      // this.sidenav.close();
    }
  }
  onPageChange(e: any) {
    this.pagination.page = e.pageIndex + 1;
    // this.getMenuItems();
    window.scrollTo(0, 0);
  }

  ngDoCheck(): void {
    // let changes = this.orderDiffer.diff(this.orderobj.OrderDetails);
    // if (changes) {
    //   this.orderobj = this.orderHelper.recalculateOrderObject(this.orderobj);
    //   this.appService.orderobj = this.orderobj;
    // }
    this.orderobj = this.orderHelper.recalculateOrderObject(this.orderobj);
  }

  changeSorting(event) {
    switch (event) {
      case "Price (Low to High)":
        this.productlist.sort(function (a, b) {
          return a.Price - b.Price;
        });
        break;
      case "Price (High to Low)":
        this.productlist.sort(function (a, b) {
          return b.Price - a.Price;
        });
        break;
      default:
        this.productlist.sort(function (a, b) {
          return a.IndexInGroup - b.IndexInGroup;
        });
        break;
    }
    this.finalProductList = this.getFinalProductList(0, 0);
  }
  //#region
  firstOpen() {
    this.requestStarted = true;
    if (this.deliveryCustomerComponent) this.deliveryCustomerComponent.initFromParent();
    this.orderSer.MenuFirstOpen().subscribe((res) => {
      this.producttypelist = res["productTypes"] as ProductTypeModel[];
      if (!this.producttypelist || this.producttypelist.length == 0) this.orderHelper.routIfMissingData("producttype");
      this.settingobj = res["setting"];
      if (!this.settingobj) this.orderHelper.routIfMissingData("setting");
      this.ordertypelist = res["ordertypes"] as OrderTypeModel[];
      if (this.TableDocumentId) this.ordertypelist = this.ordertypelist.filter((x) => x.Value == 4);
      if (!this.ordertypelist || this.ordertypelist.length == 0) this.orderHelper.routIfMissingData("ordertype");
      this.volumes = res["volumes"];
      this.promos = res["promos"];
      this.users = res["users"];
      this.pointOfSale = res["pointOfSale"];
      this.productTaxes = res["productTaxes"];
      this.taxes = res["taxes"];
      this.productsProperties = res["productProperties"];
      this.cancellationReasons = res["cancellationReasons"];
      this.productPricingClasses = res["productPricingClasses"] as ProductPricingClassModel[];
      this.productPricingClasseVolumes = res["productPricingClasseVolumes"] as ProductPricingClassVolumeModel[];
      this.halls = res["halls"];
      this.branches = res["branches"];
      this.productgrouplist = [];
      this.productgroupclasslist = [];
      this.productlist = [];
      this.allproductlist = [];
      this.productlisdFilter = [];

      this.appService.fraction = this.fraction;
      this.appService.pointOfSale = this.pointOfSale;
      this.appService.productPricingClasseVolumes = this.cloneList(this.productPricingClasseVolumes);
      this.appService.halls = this.cloneList(this.halls);
      this.appService.productsProperties = this.productsProperties;
      this.checkScreenParams();
      this.appService.orderobj = this.orderobj;

      if (this.producttypelist.length > 0) {
        this.producttypelist.forEach((element) => {
          if (element.ProductGroups.length > 0) {
            element.ProductGroups.forEach((element2) => {
              this.productgrouplist.push(element2);
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
                          (pv.VolumeId && v.Id == pv.VolumeId) ||
                          (pv.VolumeDocumentId && v.DocumentId == pv.VolumeDocumentId)
                      )?.Name;
                    });
                  }
                  element3 = this.assignTaxToProduct(element3);
                  element3 = this.assignPromoToProduct(element3);
                  element3 = this.assignProductProperties(element3);
                  element3 = this.assignProductPrice(element3, this.orderobj, this.pointOfSale);

                  element3.ProductGroupName = element2.Name;
                  this.allproductlist.push(element3);
                });
              }
            });
          }
        });
        this.allproductlist = this.distinct(this.allproductlist, "DocumentId");
      }
      this.loadProductDetails(this.productgrouplist[0]);
      this.setOrderType();
      if (this.settingobj) this.fraction = "." + this.settingobj.Round + "-" + this.settingobj.Round;
      this.appService.allproductlist = this.cloneList(this.allproductlist);

      this.requestStarted = false;
    });
  }
  checkScreenParams() {
    // select many tables from halls
    if (this.halls && this.halls.length) {
      let tables = this.halls
        .map((p) => p.Tables)
        .reduce(function (a, b) {
          return a.concat(b);
        }, []);
      if (this.TableDocumentId && tables && tables.length) {
        let table = tables.filter((x) => x.DocumentId == this.TableDocumentId)[0];
        // this.orderSer.GetOrderForTabel(table.DocumentId).subscribe(
        //   res=>{
        //     let orders = res as OrderModel[];
        //     if (orders && orders.length > 0)
        //     {
        //       this.toastr.info("Table is busy please try another table!");
        //       setTimeout(() => {
        //         location.href= 'http://www.google.com';
        //       }, 200);
        //     }
        //     if(table){
        //       this.orderobj.OrderTable = table;
        //       this.orderobj.TableId = table.DocumentId;
        //       this.orderobj.TableName = table.Name;
        //     }
        // });
        if (table) {
          this.orderobj.OrderTable = table;
          this.orderobj.TableId = table.DocumentId;
          this.orderobj.TableName = table.Name;
        }
      }
    }

    // if Customer Selected
    if (this.CustomerDocumentId) {
      this.customerService.getCustomerByDocumentId(this.CustomerDocumentId).subscribe((customer: CustomerModel) => {
        if (customer) {
          this.orderobj.Customer = customer;
          this.orderobj.CustomerId = customer.Id;
          this.orderobj.CustomerDocumentId = customer.DocumentId;
          this.orderobj.CustomerName = customer.Name;
          this.orderobj.CustomerPhone = customer.Phone;
        }
      });
    }
  }
  setOrderType() {
    let orderType = this.ordertypelist[0];
    if (!this.TableDocumentId) orderType = this.ordertypelist.filter((x) => x.Value != 4)[0];
    this.orderobj.OrderTypeId = orderType.Id;
    this.orderobj.OrderTypeDocumentId = orderType.DocumentId;
    this.orderobj.OrderTypeName = orderType.Name;
    this.orderobj.OrderType = orderType;
    this.orderobj = this.reassignPricesToAllProducts(this.orderobj);
  }
  assignProductPrice(product: ProductModel, order: OrderModel, pos) {
    let productPricingClass = product.ProductPricingClasses[0];
    let changed = false;
    if (this.productPricingClasses && this.productPricingClasses.length > 0) {
      if (order && order.TableId && this.halls && this.halls.length > 0) {
        let hall = this.appService.getHallByTable(order.TableId);
        if (hall && hall.PricingClassDocumentId) {
          changed = true;
          let pPClass = this.productPricingClasses.find(
            (pp) =>
              pp.ProductDocumentId == product.DocumentId && pp.PricingClassDocumentId == hall.PricingClassDocumentId
          );
          if (pPClass) {
            productPricingClass = pPClass;
          }
        }
      }
      if (pos && pos.PricingClassId && !changed) {
        changed = true;
        let pPClass = this.productPricingClasses.find(
          (pp) => pp.ProductDocumentId == product.DocumentId && pp.PricingClassDocumentId == pos.PricingClassId
        );
        if (pPClass) {
          productPricingClass = pPClass;
        }
      }
      if (order && order.OrderType && order.OrderType.PricingClassDocumentId && !changed) {
        changed = true;
        let pPClass = this.productPricingClasses.find(
          (pp) =>
            pp.ProductDocumentId == product.DocumentId &&
            pp.PricingClassDocumentId == order.OrderType.PricingClassDocumentId
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
  reassignPricesToAllProducts(order: OrderModel) {
    this.allproductlist.forEach((x) => {
      if (!x.PriceChanged) x = this.assignProductPrice(x, order, this.pointOfSale);
    });
    order.OrderDetails?.forEach((d) => {
      if (!d.Product.PriceChanged) d.Product = this.assignProductPrice(d.Product, order, this.pointOfSale);
    });
    this.loadProductDetails(this.productgrouplist[0]);
    return order;
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
  assignPromoToProduct(product: ProductModel) {
    product.Promos = [];
    if (this.promos && this.promos.length > 0) {
      let promos = this.promos.filter((x) =>
        x.PromoProducts.map((pr) => pr.TakeProductDocumentId).includes(product.DocumentId)
      );
      // return items.filter(it => it[args[0]] == args[1]);
      if (promos && promos.length > 0) {
        promos.forEach((promo) => {
          product.Promos.push(promo);
        });
        this.orderHelper.handlePromo(product, undefined, undefined);
      }

      // this.refreshDateAndTime();
      // let promos = this.promos.filter(x=>this.isWeekDayIncluded(x.WorkDays,this.currentMachineDay)
      //      && this.getTimeString(new Date(x.FromTime)) <= this.currentMachineTime && this.getTimeString(new Date(x.ToTime)) >= this.currentMachineTime
      //      && this.getOnlyDate(new Date(x.FromDate)) <= this.currentMachineDate && this.getOnlyDate(new Date(x.ToDate)) >= this.currentMachineDate);

      // if (promos && promos.length > 0) {
      //   let promo = this.promos.filter(x=>x.PromoProducts.filter(x=>x.TakeProductQuantity == product.DocumentId))[0];
      //   if(promo){
      //     product.Promos.push(promo);
      //     if(promo.ValueType == 1){
      //       product.ShowDiscount =true;
      //       product.DiscountValue = promo.Value;
      //     }
      //   }
      // }
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
  loadProductDetails(productgroup: any) {
    this.productgroupclasslist = [];
    this.productlist = [];
    this.finalProductList = [];
    this.currentproductgroup = productgroup;

    var groupList = [productgroup];
    if (!productgroup) groupList = this.productgrouplist;
    this.selectedCategoryId = groupList[0].DocumentId;

    groupList.forEach((g) => {
      if (g.Products.length != 0) {
        g.Products.forEach((element) => {
          this.productlist.push(element);
        });
      }
    });

    // sort products by customer past arrangment
    this.productlist.sort(function (a, b) {
      return a.IndexInGroup - b.IndexInGroup;
    });
    this.finalProductList = this.getFinalProductList(0, 0);
  }
  getFinalProductList(startnum: number, endnum: number) {
    let l;
    if (this.settingobj.HideZerosProducts) {
      l = this.cloneList(this.productlist).filter((x) => x.Price > 0);
    } else l = this.cloneList(this.productlist);

    if (endnum) l = l.slice(startnum, endnum);
    return this.cloneList(l);
  }
  assignPriceToVolumes(product: ProductModel) {
    let productPricingClassVolumes = this.appService.getProductPricingClasseVolumes(
      this.clone(product),
      this.orderobj,
      this.pointOfSale
    );
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

  //#endregion
}
