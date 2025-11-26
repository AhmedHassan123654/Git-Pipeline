import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MenuItem, Category, Order } from "src/app/app.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { OrderModel } from "../Models/order/orderModel";
import { OrderDetailModel } from "../Models/Transactions/order-detail-model";
import { ProductModel } from "../Models/Transactions/product-model";
// import { MatSnackBar } from '@angular/material/snack-bar';
export class Data {
  constructor(
    public categories: Category[],
    public cartList: MenuItem[],
    public AddToAdditional: MenuItem[],
    public orderList: Order[],
    public favorites: MenuItem[],
    public totalPrice: number,
    public totalCartCount: number
  ) {}
}
@Injectable({
  providedIn: "root"
})
export class AppService {
  public Data = new Data(
    [], // categories
    [], // cartList
    [], //AddToAdditional
    [], // orderList
    [], // favorites
    0, // totalPrice
    0 //totalCartCount
  );
  [key: string]: any;
  fraction: any;
  public CurrentProduct: ProductModel;
  public orderobj: OrderModel;
  public allproductlist: ProductModel[];

  // public url = environment.url + '/assets/data/';
  constructor(public http: HttpClient, private bottomSheet: MatBottomSheet) {}
  // public getMenuItems(): Observable<MenuItem[]>{
  //   return this.http.get<MenuItem[]>(this.url + 'menu-items.json');
  // }
  // public filterData(data:any, categoryId:number){
  //   if(categoryId==0){
  //    return data
  //   }else if(categoryId > 0){
  //     data = data.filter((item:any) => item.categoryId == categoryId);
  //   }
  //   return data;
  // }
  // public getCategories(): Observable<Category[]>{
  //   return this.http.get<Category[]>(this.url + 'categories.json');
  // }
  public addToCart(menuItem: MenuItem, component: any) {
    if (component) {
      this.openCart(component);
    }
  }
  public AddToAdditional(product: ProductModel, component: any) {
    this.CurrentProduct = Object.assign({}, product);
    if (component) {
      this.openCart(component);
    }
    // else{
    //   this.snackBar.open('The menu item "' + menuItem.name + '" has been added to cart.', '×', {
    //     verticalPosition: 'top',
    //     duration: 3000,
    //      direction: (this.appSettings.settings.rtl) ? 'rtl':'ltr',
    //     panelClass: ['success']
    //   });
    // }
    // }
  }
  public AddAdditional(product: ProductModel, component: any) {
    this.CurrentProduct = Object.assign({}, product);
    if (component) {
      this.openCart(component);
    }
  }
  public openCart(component: any) {
    this.bottomSheet
      .open(component, {})
      .afterDismissed()
      .subscribe((isRedirect) => {
        if (isRedirect) {
          window.scrollTo(0, 0);
        }
      });
  }

  // public getMenuItemById(id:number): Observable<MenuItem>{
  //   return this.http.get<MenuItem>(this.url + 'menu-item-' + id + '.json');
  // }

  //#region
  getProductPricingClasseVolumes(product: ProductModel, order: OrderModel, pos) {
    let productPricingClasseVolumes = product.ProductPricingClasses[0]?.ProductPricingClassVolumes;
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
    return productPricingClasseVolumes;
  }
  getHallByTable(TableId) {
    let hall;
    this.halls.forEach((h) => {
      let tableIds = h.Tables.map((t) => t.DocumentId);
      if (tableIds && tableIds.length > 0 && tableIds.includes(TableId)) hall = h;
    });
    return hall;
  }
  //#endregion
}
