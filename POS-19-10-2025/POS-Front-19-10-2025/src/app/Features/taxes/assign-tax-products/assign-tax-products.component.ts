import { Component, OnInit } from "@angular/core";
import * as imp from "../taximports";
import { TaxModel } from "src/app/core/Models/order/TaxModel";
import { ProductGroupModel } from "src/app/core/Models/Transactions/product-group-model";
import { ProductModel } from "src/app/core/Models/Transactions/product-model";
import { GenericHelper } from "../../GenericHelper";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import { SettingService } from "../taximports";

@Component({
  selector: "app-assign-tax-products",
  templateUrl: "./assign-tax-products.component.html",
  styleUrls: ["./assign-tax-products.component.scss"]
})
export class AssignTaxProductsComponent extends GenericHelper implements OnInit {
  customClass = "customClass";
  isFirstOpen = true;
  finalProductList: any[];
  [key: string]: any;
  taxes: TaxModel[];
  tax: TaxModel;
  productGroups: ProductGroupModel[];
  products: ProductModel[];
  filtredProducts: ProductModel[];
  currentPage = 1;
  smallnumPages = 0;
  options: number[] = [10, 15, 20, 50];
  NumberItems: number = 15;
  constructor(
    public taxSer: imp.TaxService,
    private router: imp.Router,
    private toster: imp.ToastrService,
    private messages: imp.HandlingBackMessages,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public SettingSer: SettingService,
  ) {
    super();
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);

    this.tax = this.router.getCurrentNavigation().extras as TaxModel;
    if (!this.tax || (!this.tax.DocumentId && !this.tax.Id)) this.router.navigateByUrl("/tax/taxlist");
  }
  pageChanged(event: PageChangedEvent): void {
    // this.smallnumPages = event;

    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.finalProductList = this.filtredProducts.slice(startItem, endItem);
  }
  ngOnInit(): void {
    this.assignTaxFirstOpen();
    this.GetSettings();
  }
  toggleAllGroups(event) {
    this.productGroups.forEach((g) => {
      g.Selected = event.target.checked;
    });
    this.filterProductsBySelectedgroups();
  }
  toggleAllProducts(event) {
    this.filtredProducts.forEach((p) => {
      p.Selected = event.target.checked;
      this.addProductTaxes(p);
    });
  }

  // toggleGroup(IsSelected){
  //   if ( event.target.checked ) {
  //     this.contentEditable = true;
  // }
  // }
  assignTaxFirstOpen() {
    this.taxSer.assignTaxFirstOpen().subscribe((res) => {
      this.taxes = res["Taxes"] as TaxModel[];
      this.productGroups = res["ProductGroups"] as ProductGroupModel[];
      this.productTaxes = res["ProductTaxes"];
      this.products = [];
      this.filtredProducts = [];
      this.productGroups.forEach((g) => {
        if (g.Products != null) {
          g.Products.forEach((product) => {
            product = this.assignTaxToProduct(product);
          });
          this.products.push.apply(this.products, g.Products);
        }
      });
      this.selectProductGroups();
      this.filterProductsBySelectedgroups();
    });
  }
  selectProductGroups() {
    let ProductGroupDocumentIds = this.products.filter((x) => x.Selected).map((x) => x.ProductGroupDocumentId);
    this.productGroups.forEach((g) => {
      if (ProductGroupDocumentIds.includes(g.DocumentId)) g.Selected = true;
    });
  }
  assignTaxToProduct(product: ProductModel) {
    if (this.productTaxes && this.productTaxes.length > 0 && this.taxes && this.taxes.length > 0) {
      let exist = this.productTaxes.find(
        (x) =>
          ((product.Id && x.ProductId == product.Id) || x.ProductDocumentId == product.DocumentId) &&
          ((this.tax.Id && x.TaxId == this.tax.Id) || x.TaxDocumentId == this.tax.DocumentId)
      );
      if (exist) product.Selected = true;
      return product;
    }
  }
  filterProductsBySelectedgroups() {
    let selectedProductgroups = this.productGroups.filter((p) => p.Selected).map((x) => x.DocumentId);
    if (selectedProductgroups.length > 0)
      this.filtredProducts = this.cloneList(
        this.products.filter((x) => selectedProductgroups.includes(x.ProductGroupDocumentId))
      );
    else this.filtredProducts = this.cloneList(this.products);

    this.pagainateProducts();
  }
  onChange(evt) {
    this.NumberItems = Number(evt);
    this.pagainateProducts();
  }
  pagainateProducts() {
    this.finalProductList = this.filtredProducts.slice(0, this.NumberItems);
  }

  addProductTaxes(product: ProductModel) {
    if (!this.productTaxes) this.productTaxes = [];
    let exist = this.productTaxes.find(
      (x) =>
        ((product.Id && x.ProductId == product.Id) || x.ProductDocumentId == product.DocumentId) &&
        ((this.tax.Id && x.TaxId == this.tax.Id) || x.TaxDocumentId == this.tax.DocumentId)
    );
    if (product.Selected) {
      if (!exist)
        this.productTaxes.push({
          TaxId: this.tax.Id,
          TaxDocumentId: this.tax.DocumentId,
          ProductId: product.Id,
          ProductDocumentId: product.DocumentId
        });
    } else {
      if (exist) {
        let index = this.productTaxes.indexOf(exist);
        if (index != -1) this.productTaxes.splice(index, 1);
      }
    }
  }
  insertOrUpdateProductTaxes() {
    if (!this.productTaxes) this.productTaxes = [];
    this.taxSer.insertOrUpdateProductTaxes(this.productTaxes).subscribe((res) => {
      if (res == 1) this.toster.success(this.messages.GlobalMessages(res));
      else this.toster.error(this.messages.GlobalMessages(res));

      this.assignTaxFirstOpen();
    });
  }
  backToTaxList() {
    this.router.navigateByUrl("/tax/taxlist");
  }
  
  GetSettings() {
    this.SettingSer.GetSettings().subscribe((res) => {
      this.settings = res as any;
    });
  }
  get disableSave(){
    return !this.settings || this.settings.PullAllTablesFromPOS  || this.settings.FinancialSystem != 3;
  }
}
