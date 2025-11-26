import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef } from "@angular/core";
import { Tooltip } from 'bootstrap';
import { DailyStockService, LanguageSerService, general, quickAction } from "../daily-stock-imports";
import { ToastrService } from "ngx-toastr";
import {Router} from '@angular/router'
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-daily-stock",
  templateUrl: "./daily-stock.component.html",
  styleUrls: ["./daily-stock.component.scss"]
})
export class DailyStockComponent extends general implements OnInit, OnDestroy, AfterViewInit {
  //#region Declartions
  [key: string]: any;
  Products: any;
  ProductGroups: any;
  filteredProducts: any;
  @ViewChild("frmRef") frmRef;
  //#endregion

  // boolean for last and sales quantity disable
  alwaysDisabled: boolean = true;

  //#region Constructor
  constructor(
    private _DailyStockService: DailyStockService,
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
  
  ngAfterViewInit() {
    // Initialize tooltips
    if (this.refreshButton) {
      new Tooltip(this.refreshButton.nativeElement);
    }
  }
  //#region Angular Life Cycle
  ngOnInit(): void {
    this.refresh();
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));

    this.translate.use(this.language);
  }

  refresh(){
    this._DailyStockService.showCopy.next(true);

    this.scrFirstOpen().subscribe(() => {

      // this.Products = this.responseobj.Products;
      this.ProductGroups = this.responseobj.ProductGroups;

      this.filteredProducts = this.ProductGroups?.flatMap((group: any) =>
        group?.Products?.filter((product: any) => product?.IsDeleted !== true && product?.IsStopped !== true)
      );
      this.allProduct = this.deepCopy(this.filteredProducts);

      // const productsFromGroup = this.selectProductGroup(this.ProductGroups[0], "");
      this.selectedGroup = this.ProductGroups?.length > 0 ? this.ProductGroups[0] : null;
      // this.selectProductGroup(this.ProductGroups[0], "");
      if (this.request.currentAction == "Add") {
        this.responseobj.Date = new Date();
        this.responseobj.dailyStockDetails = [];
      }
      if (this.request.currentAction == "Edit") {
        this.gridFlage = true;
      }
    });
  }
  ngOnDestroy() {
    this._DailyStockService.showCopy.next(false);
  }
  //#endregion

  //#region CashReceipt Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this._DailyStockService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.field = { text: "Name", value: "DocumentId" };
  }
  //#endregion

  //#region OperationMenu
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.afterNew({ dateFields: ["Date"] }).subscribe(() => {
          this.gridFlage = true;
        });
        // this.afterNew({ dateFields: ["FromDate"] }).subscribe(() => {
        //   this.gridFlage = true;
        // });
        // this.afterNew({ dateFields: ["ToDate"] }).subscribe(() => {
        //   this.gridFlage = true;
        // });
        this.responseobj.FromDate = new Date();
        this.responseobj.ToDate = new Date();
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
        this.checkDateValidation();
        this.BeforAddUpdateAdd();
        break;
      case quickAction.beforeUpdate:
        this.checkDateValidation();
        this.BeforAddUpdateAdd();
        break;
      case quickAction.afterModify:
        this.afterModify();
        break;
    }
  }
  //#endregion
checkDateValidation(){
  if (this.responseobj.FromDate && this.responseobj.ToDate) {
    const fromDate = new Date(this.responseobj.FromDate);
  
    let toDate = this.responseobj.ToDate;
    if (typeof toDate === 'string') {
      toDate = new Date(toDate);
    }
    if (fromDate > toDate) {
      this.toastr.warning(this.translate.instant("Shared.incorrectdate"));
      this.frmRef.form.setErrors({ 'invalid': true });
    }
  }
}
  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  //#endregion

  addNewDetailRecord() {
    if (!this.responseobj.dailyStockDetails) {
      this.responseobj.dailyStockDetails = [];
    }
    this.responseobj.dailyStockDetails.push({ SalesQuantity: 0, CurrentQuantity: 0 });
  }
  delete(i) {
    this.responseobj.dailyStockDetails.splice(i, 1);
    // this.responseobj = this.recalculateOrderObject(this.responseobj);
  }
  BeforAddUpdateAdd() {
    if (this.responseobj?.dailyStockDetails?.length != 0) {
      this.responseobj?.dailyStockDetails?.forEach((item) => {
        let currentProduct = this.filteredProducts?.filter((x) => x.DocumentId === item.productDocumentId);
        if (currentProduct != undefined && currentProduct != null) {
          item.productName = currentProduct[0].Name;
          item.LastQuantity = item.CurrentQuantity - item.SalesQuantity;
        }
      });
    }
  }

  // handling daily stock details copy
  stockDetailsSelected: object = {};
  stocks: Array<object> = [];
  isAlert: boolean = false;
  isRequired: boolean = false;
  searchTerm: string = "";

  copyStockDetails(event: object) {
    if (event) {
      this._DailyStockService.getGrideList().subscribe({
        next: (res) => {
          this.stocks = res["List"].slice(-10);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  // to clear the date feild in case the user selected an item from copy list
  displaySelectedDailyStockDetails(dailyStockDetails: object) {
    dailyStockDetails["dailyStockDetails"].filter((x) => {
      x.SalesQuantity = 0;
      x.LastQuantity = 0;
    });
    this.responseobj.dailyStockDetails = dailyStockDetails["dailyStockDetails"];
    this.isAlert = true;
    this.frmRef.form.controls["date"].setValue(null);
    this.frmRef.form.controls["FromDate"].setValue(null);
    this.frmRef.form.controls["ToDate"].setValue(null);
  }

  disableAlert(isAlert: boolean) {
    if (isAlert) this.isAlert = false;
  }

  isGridFlag(event: boolean) {
    if (event) this.gridFlage = false;
    else this.gridFlage = true;
  }
  selectAllProduct() {
    // responseobj.dailyStockDetails
    if (this.allProduct?.length != this.responseobj?.dailyStockDetails?.length) {
      this.allProduct?.forEach((productObj) => {
        if (!this.responseobj?.dailyStockDetails?.find((p: any) => productObj["Name"] === p.productName)) {
          this.pushProduct(productObj);
        }
      });
    }
  }
  pushProduct(productObj: object) {
    if (this.responseobj?.dailyStockDetails?.find((p: any) => productObj["Name"] === p.productName)) {
      let product = this.responseobj?.dailyStockDetails?.find((p: any) => productObj["Name"] === p.productName);
      this.plusMinusCurrentQuantity("+", product);
      return;
    } else {
      productObj = {
        productDocumentId: productObj["DocumentId"],
        productName: productObj["Name"],
        SalesQuantity: 0,
        CurrentQuantity: 0
      };
      if (!this.responseobj.dailyStockDetails) {
        this.responseobj.dailyStockDetails = [];
        if (this.responseobj.dailyStockDetails.length > 0) {
          this.responseobj.dailyStockDetails.push(productObj);
        } else {
          this.responseobj.dailyStockDetails = [productObj];
        }
      } else if (this.responseobj.dailyStockDetails.length > 0) {
        this.responseobj.dailyStockDetails.push(productObj);
      } else if (!this.responseobj.dailyStockDetails.length) {
        this.responseobj.dailyStockDetails = [];
        this.responseobj.dailyStockDetails.push(productObj);
      }
    }
  }

  plusMinusCurrentQuantity(arg: string, II: any) {
    if (arg === "-") {
      if (II.CurrentQuantity === 1) II.CurrentQuantity = 0;
      else if (II.CurrentQuantity < 1) return;
      else II.CurrentQuantity--;
    }
    if (arg === "+") {
      II.CurrentQuantity++;
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

    this.responseobj.dailyStockDetails.sort((a, b) => {
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
