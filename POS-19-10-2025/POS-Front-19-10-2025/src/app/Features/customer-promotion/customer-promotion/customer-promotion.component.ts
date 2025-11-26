import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ActivatedRoute,
  LanguageSerService,
  ProductGroupModel,
  general,
  quickAction
} from "../../product-group/product-groupimports";
import { ProductModel } from "src/app/core/Models/Transactions/product-model";
import { TranslateService } from "@ngx-translate/core";
import { CustomerPromotionService } from "../imports-customer-promotion";
import { Router } from "@angular/router";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
declare let $: any;
@Component({
  selector: "app-customer-promotion",
  templateUrl: "./customer-promotion.component.html",
  styleUrls: ["./customer-promotion.component.scss"]
})
export class CustomerPromotionComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  currentroutes: any[];
  public Flds = { text: "Name", value: "Id" };
  public PaymentTypeFld = { text: "Name", value: "DocumentId" };
  public CustomerFId = { text: "CustomerName", value: "CustomerDocumentId" };
  public href: string = "";
  public newCustomerList: any = [];
  //productGroupList: any = [];
  public customClass: string = "customClass";
  Products: any[] = [];
  ProductGroups: any[] = [];

  itemsPerPageOptions: number[] = [20,30,40,50]; // Choose your desired options
  itemsPerPage: number = this.itemsPerPageOptions[0]; // Default items per page
  currentPage: number = 1;
  //#endregion
  constructor(
    public CustomerPromotionSer: CustomerPromotionService,
    private languageSerService: LanguageSerService,
    private Router: ActivatedRoute,
    public translate: TranslateService,
    private router: Router
  ) {
    super();

    this.initializeobjects();
  }

  ngOnInit() {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.customerPromotionFirstOpen();
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.PromoValueList = [
        { Id: 1, Name: this.translate.instant("Shared.Percentage") },
        ,
        { Id: 2, Name: this.translate.instant("Shared.value") }
      ];
      this.responseobj.screenPermission.Print = false;
      //this.responseobj.productgrouplist;
      this.Customers = this.responseobj.Customers;
      let fromtime = this.responseobj.FromTime;
      let totime = this.responseobj.ToTime;
      if (fromtime != null && fromtime != undefined) this.responseobj.FromTime = this.setTime(new Date(fromtime));
      if (totime != null && totime != undefined) this.responseobj.ToTime = this.setTime(new Date(totime));

      if (this.responseobj.ValueType == 1 || this.responseobj.ValueType == 2) {
        this.showpercentageAndValue = true;
      }
      if (this.request.currentAction == "Add") {
        this.responseobj.FromTime = null;
        this.responseobj.ToTime = null;
        this.responseobj.Customers.forEach((item) => {
          item.IsChecked = false;
        });
      }
      if (this.request.currentAction == "Edit") {
        this.disabledflag = true;
      }
      this.responseobj.Customers.forEach((item) => {
        if (item.CustomerGroupName == undefined || item.CustomerGroupName == "") {
          item.CustomerGroupName = this.translate.instant("Shared.Notassociatedwithagroup");
        }
      });
      this.newCustomerList = this.responseobj.Customers;
      this.FillProductGroupsWithData();
      this.FillProductsWithData();
      // debugger
      // this.ProductGroups?.forEach((group) => {
      //   for (let i = 0; i < this.responseobj.ProductGroupList.length; i++) {
      //     if (group.DocumentId === this.responseobj.ProductGroupList[i]) {
      //       this.checkProductsOfCheckedGroup(true, group);
      //     }
      //   }
      // let g = this.ProductGroups.find((x) => item === x.DocumentId);
      // if (g) {
      //   g.Checked = true;
      // }
      // });
    });
  }
  customerPromotionFirstOpen(){
    this.CustomerPromotionSer.customerPromotionFirstOpen().subscribe((res:any)=>{
      this.BranchList = res.BranchList;
      this.OrderTypeList = res.OrderTypeList;
    });
  }
  FillProductGroupsWithData() {
    this.ProductGroups = this.deepCopy(this.responseobj.ProductGroups);
  }
  FillProductsWithData() {
    this.Products = this.deepCopy(this.responseobj.AllProducts);
    this.responseobj.ProductList?.forEach((item) => {
      let pro = this.Products.find((x) => item === x.DocumentId);
      if (pro) {
        pro.Checked = true;
      }
    });
  }

  //#region OperationMenu
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.promoAfterNew();
        this.newCustomerList = this.responseobj.Customers;
        break;
      case quickAction.beforeAdd:
        this.PromobeforUpdate();
        break;
      case quickAction.afterAdd:
        this.disabledflag = false;
        break;
      case quickAction.afterUpdate:
        this.disabledflag = false;
        break;
      case quickAction.beforeUpdate:
        this.PromobeforUpdate();
        break;
      case quickAction.afterModify:
        this.disabledflag = true;
        this.MyafterModify();
        break;
      case quickAction.afterUndo:
        this.disabledflag = false;
        break;
    }
  }
  MyafterModify() {
    if (this.responseobj.ValueType != null && this.responseobj.ValueType != undefined) {
      if (this.responseobj.ValueType == 1 || this.responseobj.ValueType == 2) {
        this.showpercentagevalue = true;
      }
    }

    // if (this.responseobj.ProductGroupList && this.responseobj.ProductGroupList.length > 0) {
    //   this.responseobj.ProductGroupList?.forEach((item) => {
    //     let g = this.ProductGroups.find((group) => item === group.DocumentId);
    //     if (g) {
    //       g.Checked = true;
    //     }
    //   });
    // }
  }
  promoAfterNew() {
    this.disabledflag = true;
    this.showpercentageAndValue = false;
    if (this.request.currentAction != "Add") {
      this.responseobj?.WorkDays?.forEach((item) => {
        item.IsWork = true;
      });
      this.responseobj?.ProductsGroups?.forEach((item) => {
        item.Checked = false;
      });
      this.Products?.forEach((item) => {
        item.Checked = false;
      });
      this.responseobj?.Customers?.forEach((item) => {
        item.Checked = false;
      });
    }
  }

  appliedToAllProducts(event: boolean) {
    if (event == false) {
      this.ProductGroups?.forEach((item) => {
        item.Checked = false;
      });
      this.Products?.forEach((item) => {
        item.Checked = false;
      });
    }
  }
  ProductCheckboxChanged(event: boolean, product: ProductModel) {
    let group = this.ProductGroups?.find((item) => item.DocumentId == product.ProductGroupDocumentId);
    if (!event) {
      if (group) group.Checked = false;
    } else {
      let unChekedProduct = this.Products.find(
        (x) => x.ProductGroupDocumentId == group.DocumentId && !x.Checked && x.DocumentId != product.DocumentId
      );
      if (!unChekedProduct && group) group.Checked = true;
    }
  }
  PromobeforAdd() {
    if (this.responseobj.ValueType == 1 || this.responseobj.ValueType == 2) {
      this.newCustomerList = [];
      this.responseobj.Customers.forEach((item) => {
        if (item.IsChecked) {
          this.newCustomerList.push(item.CustomerDocumentId);
        }
      });
      this.responseobj.CustomersList = this.newCustomerList;
      //assign selected product groups
      this.responseobj.ProductList = this.Products.filter((x) => x.Checked == true).map((x) => x.DocumentId);
      this.responseobj.ProductGroupList = this.ProductGroups.filter((x) => x.Checked == true).map((x) => x.DocumentId);
    }
  }
  PromobeforUpdate() {
    if (this.responseobj.ValueType == 1 || this.responseobj.ValueType == 2) {
      this.MyCustomerList = [];
      this.responseobj.Customers.forEach((item) => {
        if (item.IsChecked) {
          this.MyCustomerList.push(item.CustomerDocumentId);
        }
      });
      //To Send Data To Backend
      this.responseobj.CustomersList = this.MyCustomerList;
      this.responseobj.ProductList = this.Products.filter((x) => x.Checked == true).map((x) => x.DocumentId);
      this.responseobj.ProductGroupList = this.ProductGroups.filter((x) => x.Checked == true).map((x) => x.DocumentId);
      //this.responseobj.Products = this.responseobj.Products.filter((product: any) => product.Checked === true)
    }
  }
  //#endregion
  //#region Pagger

  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.CustomerPromotionSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  //#region Pagger
  afterPag(event: any): void {
    this.formPaging({ formObj: event });
    this.worksDays = [];
    this.worksDays = event.WorkDays;
    this.responseobj?.Customers?.forEach((item) => {
      if (item.CustomerGroupName == undefined || item.CustomerGroupName == "") {
        item.CustomerGroupName = this.translate.instant("Shared.Notassociatedwithagroup");
      }
    });
    this.newCustomerList = this.responseobj.Customers;
    //
    if (this.responseobj.ValueType == 1 || this.responseobj.ValueType == 2) this.showpercentageAndValue = true;
    //
    this.responseobj.FromTime = this.setTime(new Date(event.FromTime));
    this.responseobj.ToTime = this.setTime(new Date(event.ToTime));
  }

  //#endregion
  setPromoType(data) {
    if (data.value != null && data.value != undefined) {
      if (data.value == 1 || data.value == 2) {
        this.showpercentageAndValue = true;
      }
    }
  }

  setTime(date: Date) {
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let str = hours + ":" + minutes;
    return str;
  }
  CheckPromoDays() {
    $("#modal-WorkDays").modal("show");
  }

  SelectAllEvent(event: any) {
    let value = event.currentTarget.checked;
    this.newCustomerList.forEach((item) => {
      item.IsChecked = value;
    });
  }
  searchCustomers(CustomerGroupvalue, CustomerValue) {
    if (!CustomerGroupvalue && !CustomerValue) {
      this.newCustomerList = [];
      this.newCustomerList = this.responseobj.Customers;
    } else if (CustomerGroupvalue && CustomerGroupvalue != "" && CustomerValue && CustomerValue != "") {
      this.newCustomerList = [];
      this.newCustomerList = this.responseobj.Customers.filter(
        (item) =>
          item.CustomerGroupName && item.CustomerGroupName.toLowerCase().includes(CustomerGroupvalue.toLowerCase()) &&
          item.CustomerName && item.CustomerName.toLowerCase().includes(CustomerValue.toLowerCase())
      );
    } else if (CustomerGroupvalue && CustomerGroupvalue != "") {
      this.newCustomerList = [];
      this.newCustomerList = this.responseobj.Customers.filter(
        (item) => item.CustomerGroupName && item.CustomerGroupName.toLowerCase().includes(CustomerGroupvalue.toLowerCase())
      );
    } else if (CustomerValue && CustomerValue != "") {
      this.newCustomerList = [];
      this.newCustomerList = this.responseobj.Customers.filter(
        (item) => item.CustomerName && item.CustomerName.toLowerCase().includes(CustomerValue.toLowerCase())
      );
    }
  }

  checkProductsOfCheckedGroup(event: any, productGroup: ProductGroupModel) {
    let products = this.Products.filter(
      (product: ProductModel) => product.ProductGroupDocumentId === productGroup.DocumentId
    );
    products.forEach((x) => {
      x.Checked = event.target.checked;
    });
  }

  setCurrentPage(): void {
    this.pC = {page:1 , itemsPerPage:!this.itemsPerPage ? this.itemsPerPageOptions[0] : this.itemsPerPage};
    this.pageChanged(this.pC)
  }
  get paginatedData(): any[] {
    if(this._paginatedData){
      return this._paginatedData;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.newCustomerList.slice(startIndex, endIndex);
  }

  pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this._paginatedData = this.newCustomerList.slice(startItem, endItem);
  }
}
