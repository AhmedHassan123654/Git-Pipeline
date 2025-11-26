import { Component, OnInit } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MenuItem } from "src/app/app.model";
import { AppService } from "src/app/core/Services/app.service";
import { CommonService, Router, ToastrService, HandlingBackMessages } from "../Directives/pagetransactionsimport";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { OrderDetailModel } from "src/app/core/Models/Transactions/order-detail-model";

@Component({
  selector: "app-cart-overview",
  templateUrl: "./cart-overview.component.html",
  styleUrls: ["./cart-overview.component.scss"]
})
export class CartOverviewComponent implements OnInit {
  public menuItems: MenuItem[] = [];
  [key: string]: any;
  constructor(
    private bottomSheetRef: MatBottomSheetRef<CartOverviewComponent>,
    private router: Router,
    public toastr: ToastrService,
    public appService: AppService,
    private common: CommonService,
    public orderSer: OrderService,
    public toastrMessage: HandlingBackMessages
  ) {
    this.defaultIm = "assets/images/v10.jpg";
    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";
  }

  ngOnInit(): void {
    this.menuItems = this.appService.Data.cartList;
    this.orderobj = this.appService.orderobj;
  }
  public hideSheet(isRedirect: boolean) {
    this.bottomSheetRef.dismiss(isRedirect);
  }
  // closeAsync(){
  //   return new Promise(resolve=>{
  //     this.requestStarted = true;
  //     this.orderSer.CloseMobileOrder(this.orderobj).subscribe(
  //       async res=>{
  //         if(res ==1)
  //         {
  //           this.toastr.success(this.toastrMessage.GlobalMessages(res));
  //         }
  //         resolve(res);
  //         this.requestStarted = false;
  //         this.hideSheet(true);
  //         this.router.navigateByUrl("/home");
  //       }
  //     );
  //   });
  // }
  checkout() {
    this.hideSheet(false);
    this.router.navigateByUrl("/firstHome/checkout?TableDocumentId=" + this.orderobj.TableId);
  }
  public clearCart() {
    this.orderobj.OrderDetails = [];
    this.hideSheet(false);
  }
  public remove(item: any, event: any) {
    const index: number = this.orderobj.OrderDetails.indexOf(item);
    if (index !== -1) {
      item.cartCount = 0;
      this.orderobj.OrderDetails.splice(index, 1);
    }
    if (this.orderobj.OrderDetails.length == 0) {
      this.hideSheet(false);
    }
    event.preventDefault();
  }
  changeProductQuantity(obj) {
  }
  decrementProductQuantity(detail: OrderDetailModel) {
    detail.ProductQuantity++;
  }
  incrementProductQuantity(detail: OrderDetailModel) {
    if (detail.ProductQuantity - 1 > 0) detail.ProductQuantity--;
  }
}
