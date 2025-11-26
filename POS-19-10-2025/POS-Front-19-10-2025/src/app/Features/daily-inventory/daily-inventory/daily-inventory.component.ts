import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef } from "@angular/core";
import { Tooltip } from 'bootstrap';
import { DailyInventoryService, LanguageSerService, general, quickAction } from "../daily-inventory-imports";
import { ToastrService } from "ngx-toastr";
import {Router} from '@angular/router'
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-daily-inventory",
  templateUrl: "./daily-inventory.component.html",
  styleUrls: ["./daily-inventory.component.scss"]
})
export class DailyInventoryComponent extends general implements OnInit, OnDestroy {
  //#region Declartions
  [key: string]: any;
  Products: any;
  ProductGroups: any;
  filteredProducts: any;
  branchName:string;
  @ViewChild("frmRef") frmRef;
  //#endregion

  // boolean for last and sales quantity disable
  alwaysDisabled: boolean = true;

  //#region Constructor
  constructor(
    private _dailyInventoryService: DailyInventoryService,
    public router: Router,
    private toastr: ToastrService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    super();
    this.initializeobjects();
  }
  //#endregion
  
  @ViewChild('refreshButton') refreshButton: ElementRef;
  selectedGroup: any;
  
  //#region Angular Life Cycle
  ngOnInit(): void {
    this.refresh();
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));

    this.translate.use(this.language);
  }

  refresh(){
    this._dailyInventoryService.showCopy.next(true);

    this.scrFirstOpen().subscribe(() => {

      // this.Products = this.responseobj.Products;
      this.ProductGroups = this.responseobj.ProductGroups;
      this.branchName = this.responseobj.Branch.Name
      this.filteredProducts = this.ProductGroups?.flatMap((group: any) =>
        group?.Products?.filter((product: any) => product?.IsDeleted !== true && product?.IsStopped !== true)
      );
      this.allProduct = this.deepCopy(this.filteredProducts);

      // const productsFromGroup = this.selectProductGroup(this.ProductGroups[0], "");
      this.selectedGroup = this.ProductGroups?.length > 0 ? this.ProductGroups[0] : null;
      // this.selectProductGroup(this.ProductGroups[0], "");
      if (this.request.currentAction == "Add") {
        this.responseobj.Date = new Date();
        this.responseobj.DailyInventoryDetails = [];
      }
      if (this.request.currentAction == "Edit") {
        this.gridFlage = true;
      }
      this.BeforAddUpdateAdd();
    });
  }
  ngOnDestroy() {
    this._dailyInventoryService.showCopy.next(false);
  }
  //#endregion

  initializeobjects(): void {
    this.responseobj = {};
    this.service = this._dailyInventoryService;
    this.request = this.router.getCurrentNavigation()?.extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.field = { text: "Name", value: "DocumentId" };
  }
  //#region OperationMenu
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.afterNew({ dateFields: ["Date"] }).subscribe(() => {
          this.gridFlage = true;
        });
        this.gridFlage = true;
        break;
      case quickAction.afterModify:
        this.gridFlage = true;
        break;
      case quickAction.afterAdd:
        this.afterAdd();
        this.gridFlage = false;
        break;
      case quickAction.afterUndo:
        this.gridFlage = false;
        break;
      case quickAction.afterUpdate:
        this.gridFlage = false;
        break;
      case quickAction.beforeAdd:
        this.BeforAddUpdateAdd();
        break;
      case quickAction.beforeUpdate:
        this.BeforAddUpdateAdd();
        break;
      case quickAction.afterModify:
        this.afterModify();
        break;
    }
  }
  //#endregion

  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
    this.BeforAddUpdateAdd();
  }
  //#endregion

  addNewDetailRecord() {
    if (!this.responseobj.DailyInventoryDetails) {
      this.responseobj.DailyInventoryDetails = [];
    }
    this.responseobj.DailyInventoryDetails.push({ Quantity: 1});
  }
  delete(i) {
    this.responseobj.DailyInventoryDetails.splice(i, 1);
    // this.responseobj = this.recalculateOrderObject(this.responseobj);
  }
  BeforAddUpdateAdd() {
    if (this.responseobj?.DailyInventoryDetails?.length != 0) {
      this.responseobj?.DailyInventoryDetails?.forEach((item) => {
        let currentProduct = this.filteredProducts?.filter((x) => x.DocumentId === item.ProductDocumentId);
        if (currentProduct != undefined && currentProduct != null) {
          item.ProductName = currentProduct[0]?.Name;
        }
      });
    }
  }

  inventorys: Array<object> = [];
  isRequired: boolean = false;
  searchTerm: string = "";

  isGridFlag(event: boolean) {
    if (event) this.gridFlage = false;
    else this.gridFlage = true;
  }
  selectAllProduct() {
    // responseobj.DailyInventoryDetails
    if (this.allProduct?.length != this.responseobj?.DailyInventoryDetails?.length) {
      this.allProduct?.forEach((productObj) => {
        if (!this.responseobj?.DailyInventoryDetails?.find((p: any) => productObj["Name"] === p.productName)) {
          this.pushProduct(productObj);
        }
      });
    }
  }
  pushProduct(productObj: object) {
    if (this.responseobj?.DailyInventoryDetails?.find((p: any) => productObj["Name"] === p.productName)) {
      let product = this.responseobj?.DailyInventoryDetails?.find((p: any) => productObj["Name"] === p.productName);
      this.plusMinusCurrentQuantity("+", product);
      return;
    } else {
      productObj = {
        ProductDocumentId: productObj["DocumentId"],
        ProductName: productObj["Name"],
        Quantity: 1
      };
      if (!this.responseobj.DailyInventoryDetails) {
        this.responseobj.DailyInventoryDetails = [];
        if (this.responseobj.DailyInventoryDetails.length > 0) {
          this.responseobj.DailyInventoryDetails.push(productObj);
        } else {
          this.responseobj.DailyInventoryDetails = [productObj];
        }
      } else if (this.responseobj.DailyInventoryDetails.length > 0) {
        this.responseobj.DailyInventoryDetails.push(productObj);
      } else if (!this.responseobj.DailyInventoryDetails.length) {
        this.responseobj.DailyInventoryDetails = [];
        this.responseobj.DailyInventoryDetails.push(productObj);
      }
    }
  }

  plusMinusCurrentQuantity(arg: string, II: any) {
    if (arg === "-") {
      if (II.Quantity === 1) II.Quantity = 0;
      else if (II.Quantity < 1) return;
      else II.Quantity--;
    }
    if (arg === "+") {
      II.Quantity++;
    }
  }

  selectProductGroup(productGroup: any, searchTerm: string) {
    if (searchTerm !== "" && searchTerm !== null) {
      return this.filteredProducts?.filter((p: any) => p.Name.toLowerCase().includes(searchTerm?.toLowerCase()));
    } else {
      return productGroup?.Products;
    }
  }
  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.responseobj.DailyInventoryDetails.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
