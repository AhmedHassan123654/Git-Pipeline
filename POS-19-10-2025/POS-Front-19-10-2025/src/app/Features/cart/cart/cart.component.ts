import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/core/Services/app.service";
import { MenuItem } from "stimulsoft-viewer-angular/lib/menu/meni-item.component";
@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"]
})
export class CartComponent implements OnInit {
  constructor(public appService: AppService) {}

  ngOnInit(): void {}
  public clear() {
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }
  public remove(item: MenuItem) {}
}
