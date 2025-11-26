import { Component, ViewChild } from "@angular/core";
import * as imp from "../integration-setting-import";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { Params } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
@Component({
  selector: "app-integration-setting-products",
  templateUrl: "./integration-setting-products.component.html",
  styleUrls: ["./integration-setting-products.component.scss"]
})
export class IntegrationSettingProductsComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  // finalProductList:any[];
  // NumberItems :number =15;
  // currentPage = 1;
  // smallnumPages = 0;
  data: any = {};
  flds = { text: "ProductName", value: "ProductDocumentId" };

  //#endregion
  constructor(
    public IntegrationSettingSer: imp.IntegrationSettingService,
    private router: imp.Router,
    private route: imp.ActivatedRoute,
    public toastr: imp.ToastrService,
    public toastrMessage: imp.HandlingBackMessages,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    super();
    this.initializeobjects();
  }
  initializeobjects(): void {
    this.responseobj = new imp.IntegrationSettingModel();
    this.service = this.IntegrationSettingSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  // pageChanged(event: PageChangedEvent): void {
  //   // this.smallnumPages = event;

  //   const startItem = (event.page - 1) * event.itemsPerPage;
  //   const endItem = event.page * event.itemsPerPage;
  //   this.finalProductList = this.filtredProducts.slice(startItem, endItem);
  // }
  // onChange(evt){
  //   // debugger
  //   this.NumberItems = Number(evt);
  //   this.pagainateProducts();
  // }
  // pagainateProducts(){

  //   this.finalProductList = this.filtredProducts.slice(0,this.NumberItems);

  // }
  ngOnInit(): void {

    if (
      this.request.DocumentId != undefined &&
      (this.request.DocumentId != undefined) != null &&
      this.request.DocumentId != ""
    ) {
      console.log(this.yemekSepetiProducts);
      this.IntegrationSettingSer.GetIntegrationSettingproduct(this.request.DocumentId).subscribe((res: any) => {
        this.data = res["Model"];
        this.yemekSepetiProducts as any[];
        this.yemekSepetiProducts = [];
        let allYemekSepetiProducts = res["FoodOrderProducts"];

        this.IntegrationSettingProductList = [];
        let IntegrationProductList = this.data?.IntegrationProductList as imp.IntegrationSettingProductsModel[];
        IntegrationProductList.forEach((y) => {
          this.IntegrationSettingProductList.push({
            ProductName: y.ProductName,
            ProductDocumentId: y.ProductDocumentId,
            ReferenceCode: y.ReferenceCode
          });
        });
        allYemekSepetiProducts.forEach((y) => {
          let integrationSettingProduct = this.IntegrationSettingProductList.filter((s) => s.ReferenceCode == y.Id)[0];
          if (integrationSettingProduct) console.log(integrationSettingProduct);
          this.yemekSepetiProducts.push({
            Name: y.Name,
            ProductDocumentId: integrationSettingProduct?.ProductDocumentId,
            ReferenceCode: y.Id
          });
        });
        this.productList = this.distinct(this.IntegrationSettingProductList, "ProductName");
      });

      /*  this.route.params.subscribe(
          (params:Params) =>{
            this.request.DocumentId = params['rowData.id']
          }
        ) */
    } else {
      this.router.navigate(["/IntegrationSetting/Integrationlist"]);
      this.toastr.error("Should Choose aPricing Class First", "Pricing Class");
    }
  }

  // SaveProducts()
  // {
  //      this.responseobj.DocumentId=this.request.DocumentId;
  //     this.responseobj.IntegrationSettingProducts=[];
  //      this.IntegrationSettingProductList.forEach(item => {
  //        if(item.ReferenceCode != undefined &&item.ReferenceCode != null){
  //         this.responseobj.IntegrationSettingProducts.push(item);
  //        }
  //      });
  //      this.IntegrationSettingSer.Transactions( this.responseobj, 'PostProduct').subscribe(
  //       (res) => {
  //         if (res == 1) {
  //           this.toastr.success(
  //             this.toastrMessage.GlobalMessages(res),

  //           );
  //           this.router.navigate(['/IntegrationSetting/Integrationlist']);
  //         }

  //         else {
  //           this.toastr.error(
  //             this.toastrMessage.GlobalMessages(res),
  //             this._pagename
  //           );
  //         }
  //       },

  //     );
  // }
  SaveProducts() {
    let model = {
      DocumentId: this.request.DocumentId,
      IntegrationSettingProducts: this.yemekSepetiProducts
    };
    this.IntegrationSettingSer.updateIntegrationProducts(model).subscribe((res) => {
      if (res == 1) {
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
        this.router.navigate(["/IntegrationSetting/Integrationlist"]);
      } else {
        this.toastr.error(this.toastrMessage.GlobalMessages(res));
      }
    });
  }
}
