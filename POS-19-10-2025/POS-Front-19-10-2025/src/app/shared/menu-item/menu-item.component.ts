import { Component, Input, OnInit } from "@angular/core";
import { MenuItem } from "src/app/app.model";
import { AppService } from "src/app/core/Services/app.service";
import { AdditionsCartComponent } from "../additions-cart/additions-cart.component";
import { CartOverviewComponent } from "../cart-overview/cart-overview.component";
import { OrderDetailModel } from "src/app/core/Models/Transactions/order-detail-model";
import { CommonService } from "../Directives/pagetransactionsimport";
import { ProductModel } from "src/app/core/Models/Transactions/product-model";
import { BsModalService, ModalOptions, BsModalRef } from "ngx-bootstrap/modal";
import { MenuSingleComponent } from "src/app/Features/online-ordering/menu-single/menu-single.component";

@Component({
  selector: "app-menu-item",
  templateUrl: "./menu-item.component.html",
  styleUrls: ["./menu-item.component.scss"]
})
export class MenuItemComponent implements OnInit {
  @Input() menuItem!: ProductModel;
  max = 5;
  rate = 4;
  [key: string]: any;
  isReadonly = true;
  bsModalRef?: BsModalRef;
  constructor(public appService: AppService, private common: CommonService, private modalService: BsModalService) {
    this.defaultIm = "assets/images/v10.jpg";
    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";
  }

  ngOnInit(): void {}
  public addToCart() {
    // if(this.menuItem.id > 1){
    //      this.appService.addToCart(this.menuItem, CartOverviewComponent);
    //      this.appService.getMenuItemById(this.menuItem.id);
    // }else{
    //     this.appService.addToCart(this.menuItem, AdditionsCartComponent);
    // }
    let product = this.appService.allproductlist.find((p) => p.DocumentId == this.menuItem.DocumentId);
    this.appService.AddAdditional(Object.assign({}, product), AdditionsCartComponent);
  }
  openModalWithComponent(DocumentId: string) {
    const initialState: ModalOptions = {
      initialState: {
        DocumentId: DocumentId
      }
    };
    this.bsModalRef = this.modalService.show(MenuSingleComponent, initialState);
    this.bsModalRef.content.closeBtnName = "Close";
  }
  // public onCart(){
  //   if(this.appService.Data.cartList.find(item=>item.DocumentId == this.menuItem.Doc)){
  //     return true;
  //   }
  //   return false;
  // }
}
