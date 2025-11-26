import { Component, OnInit, ViewChild } from "@angular/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  general,
  PricingClassesService,
  HandlingBackMessages,
  PricingproductGroup,
  ProductPricingClassModel,
  PricingClassModel
} from "../pricing-classes-import";

@Component({
  selector: "app-product-pricing-class",
  templateUrl: "./product-pricing-class.component.html",
  styleUrls: ["./product-pricing-class.component.scss"]
})
export class ProductPricingClassComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;

  @ViewChild("frmRef") frmRef;

  public customClass: string = "customClass";
  public isOpenFirst: boolean = true;

  options: number[] = [10, 15, 20, 50];
  finalProductList: any[];
  NumberItems: number = 15;
  currentPage = 1;
  smallnumPages = 0;
  filtredProducts: any = [];
  //#endregion
  constructor(
    public PricingClassesSer: PricingClassesService,
    private router: Router,
    public toastr: ToastrService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public toastrMessage: HandlingBackMessages
  ) {
    super();
    this.initializeobjects();
  }

  ngOnInit(): void {
    if (
      this.request.DocumentId != undefined &&
      (this.request.DocumentId != undefined) != null &&
      this.request.DocumentId != ""
    ) {
      this.PricingClassesSer.GetproductGroups(this.request.DocumentId).subscribe((res) => {
        this.data = res;
        this.productGroup = Array<PricingproductGroup>();
        this.data.productGroup.forEach((item) => {
          let obj = new PricingproductGroup();
          obj.ProductGroupDocumentId = item.ProductGroupDocumentId;
          obj.ProductGroupName = item.ProductGroupName;
          obj.Selected = false;
          this.productGroup.push(obj);
          if (res == "null") {
            this.router.navigateByUrl("/login");
          }
        });
        this.ProductPricingClassList = [];
        this.ProductPricingClassList = this.data.ProductPricingClassList as ProductPricingClassModel[];
        this.finalProductList = this.ProductPricingClassList;
      });
    } else {
      this.router.navigate(["/PricingClass/PricingClassList"]);
    }
  }

  initializeobjects(): void {
    this.responseobj = new PricingClassModel();
    this.service = this.PricingClassesSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  filterProductsBySelectedgroups() {
    this.finalProductList = [];
    this.finalProductList = this.ProductPricingClassList.filter((item) => item.ProductGroupName);

    let selectedProductgroups = [];
    this.productGroup.forEach((item) => {
      if (item.Selected == true) {
        selectedProductgroups.push(item.ProductGroupDocumentId);
      }
    });
    if (selectedProductgroups.length > 0)
      this.finalProductList = this.ProductPricingClassList.filter((x) =>
        selectedProductgroups.includes(x.ProductGroupDocumentId)
      );
    else this.finalProductList = this.ProductPricingClassList;
  }

  GetProductPrice(event) {
    this.ProductPricingClassList.forEach((item) => {
      if (
        item.IsVolume &&
        item.ProductDocumentId &&
        item.ProductDocumentId == event.ProductDocumentId &&
        (item.VolumeDocumentId == event.VolumeDocumentId || item.VolumeFerpCode == event.VolumeFerpCode)
      ) {
        item.Price = event.Price;
      } else if (!item.IsVolume && item.ProductDocumentId && item.ProductDocumentId == event.ProductDocumentId) {
        item.Price = event.Price;
      }
    });
  }

  SaveProducts() {
    this.responseobj.DocumentId = this.request.DocumentId;
    this.responseobj.Name = this.request.Name;
    this.responseobj.ForeignName = this.request.ForeignName;
    this.responseobj.POSProductPricingClasses = [];
    this.ProductPricingClassList.forEach((item) => {
      if (item.Price != undefined && item.Price != null && item.Price > 0) {
        this.responseobj.POSProductPricingClasses.push(item);
      }
    });
    this.PricingClassesSer.Transactions(this.responseobj, "PostProduct").subscribe((res) => {
      if (res == 1) {
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
      } else {
        this.toastr.error(this.toastrMessage.GlobalMessages(res), this._pagename);
      }
    });
  }

  searchProducts(ProductGroupvalue, ProductValue) {
    if (!ProductGroupvalue && !ProductValue) {
      this.finalProductList = [];
      this.finalProductList = this.ProductPricingClassList;
    } else if (ProductGroupvalue && ProductGroupvalue != "" && ProductValue && ProductValue != "") {
      this.finalProductList = [];
      this.finalProductList = this.ProductPricingClassList.filter(
        (item) =>
          item.ProductGroupName.toLowerCase().indexOf(ProductGroupvalue.toLowerCase()) > -1 &&
          item.ProductName.toLowerCase().indexOf(ProductValue.toLowerCase()) > -1
      );
    } else if (ProductGroupvalue && ProductGroupvalue != "") {
      this.finalProductList = [];
      this.finalProductList = this.ProductPricingClassList.filter(
        (item) => item.ProductGroupName.toLowerCase().indexOf(ProductGroupvalue.toLowerCase()) > -1
      );
    } else if (ProductValue && ProductValue != "") {
      this.finalProductList = [];
      this.finalProductList = this.ProductPricingClassList.filter(
        (item) => item.ProductName.toLowerCase().indexOf(ProductValue.toLowerCase()) > -1
      );
    }
  }
}
