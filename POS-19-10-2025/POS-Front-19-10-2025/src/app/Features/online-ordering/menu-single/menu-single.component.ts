import { Component, OnInit } from "@angular/core";
import { MenuItem } from "src/app/app.model";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "src/app/core/Services/app.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ProductModel } from "src/app/core/Models/Transactions/product-model";
import { AdditionsCartComponent } from "src/app/shared/additions-cart/additions-cart.component";
import { CommonService } from "../../branch/branchimport";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-menu-single",
  templateUrl: "./menu-single.component.html",
  styleUrls: ["./menu-single.component.scss"]
})
export class MenuSingleComponent implements OnInit {
  public menuItem!: any;
  private sub: any;
  DocumentId: string;
  max = 5;
  rate = 4;
  [key: string]: any;
  isReadonly = true;
  public quantityCount: number = 1;
  constructor(
    private activatedRoute: ActivatedRoute,
    public appService: AppService,
    public snackBar: MatSnackBar,
    private common: CommonService,
    public bsModalRef: BsModalRef
  ) {
    this.defaultIm = "assets/images/v10.jpg";
    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";
  }

  ngOnInit(): void {
    this.getMenuItemById(this.DocumentId);
  }
  ngOnDestroy() {}
  public getMenuItemById(id: string) {
    const index: number = this.appService.allproductlist.findIndex((item) => item.DocumentId == id);
    if (index !== -1) {
      this.menuItem = this.appService.allproductlist[index];
      // this.quantityCount = this.menuItem.cartCount;
      this.menuItem.allSubItems = "";
      if (this.menuItem.ProductSubItems && this.menuItem.ProductSubItems.length) {
        this.menuItem.ProductSubItems.forEach((ps) => {
          this.menuItem.allSubItems += " - " + ps.Name;
        });
      }
      this.menuItem.allVolumes = "";
      if (this.menuItem.ProductVolumes && this.menuItem.ProductVolumes.length) {
        this.menuItem.ProductVolumes.forEach((pv) => {
          this.menuItem.allVolumes += " - " + pv.VolumeName;
        });
      }
    }
  }
  cancel() {
    this.bsModalRef.hide();
  }
}
