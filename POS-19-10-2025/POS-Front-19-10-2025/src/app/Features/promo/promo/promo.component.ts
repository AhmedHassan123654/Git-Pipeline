import { DatePipe } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../promoimport";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { PromoCustomsWithDetailModel } from "src/app/core/Models/Transactions/promo-custom-model";

declare let $: any;
@Component({
  selector: "app-promo",
  templateUrl: "./promo.component.html",
  styleUrls: ["./promo.component.scss"]
})
export class PromoComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  currentroutes: any[];
  public Flds = { text: "Name", value: "Id" };
  public PaymentTypeFld = { text: "Name", value: "DocumentId" };
  public ProductFId = {
    text: "TakeProductName",
    value: "TakeProductDocumentId"
  };
  disabled = false;
  itemsPerPageOptions: number[] = [15,20]; // Choose your desired options
  itemsPerPage: number = this.itemsPerPageOptions[0]; // Default items per page
  currentPage: number = 1;
  takeProductNewList:PromoCustomsWithDetailModel[];
  public href: string = "";
  public newProductList: any = [];
  public disabledflag: boolean = false;
  public originalPromoProducts: any[] = [];
  public productsLockUp: Array<{ TakeProductDocumentId: string; TakeProductName: string }> = [];
  public valueTypeThreeList: any[] = [];
  public selectedValueTypeThreeDetail: any = null;
  private valueTypeThreeRowCounter = 0;
  // Grouped UI state for ValueType 1 or 5
  public groupedByGroup: Array<{ groupDocumentId: string; groupName: string; products: any[]; isGroupSelected?: boolean; selectedCount?: number; totalCount?: number }>=[];
  public selectedGroup: { groupDocumentId: string; groupName: string; products: any[]; isGroupSelected?: boolean; selectedCount?: number; totalCount?: number } = null;
  public groupAllSelected: boolean = true;
  //#endregion

  constructor(
    public PromoService: imp.PromoService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    private router: imp.Router
  ) {
    super();

    this.initializeobjects();
  }

  ngOnInit() {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.PromoValueList = [
        { Id: 1, Name: this.translate.instant("Shared.Percentage") },
        { Id: 3, Name: this.translate.instant("Shared.Custom") },
        { Id: 5, Name: this.translate.instant("Shared.CustomPrice") },
      ];
      this.responseobj.screenPermission.Print = false;
      this.FiltterObj.ProductGroupList = this.responseobj.ProductGroups;
      this.products = this.responseobj.PromoProducts;
      this.originalPromoProducts = this.responseobj.PromoProducts ?? [];
      this.productsLockUp = (this.originalPromoProducts || []).map(p => ({
        TakeProductDocumentId: this.buildLookupKeyFromIds(p.TakeProductDocumentId, p.TakeProductVolumeDocumentId),
        TakeProductName: p.TakeProductName
      }));
      this.initializeValueTypeThreeList();
      this.refreshDisplayList(false);
      this.buildGroupedProducts();
      let fromtime = this.responseobj.FromTime;
      let totime = this.responseobj.ToTime;
      if (fromtime != null && fromtime != undefined)
        this.responseobj.FromTime = this.datePipe.transform(this.responseobj.FromTime, "HH:mm");
      if (totime != null && totime != undefined)
        this.responseobj.ToTime = this.datePipe.transform(this.responseobj.ToTime, "HH:mm");

      // if (this.request.currentAction=="Add" || this.request.currentAction=="Edit" || this.request.currentAction=="View" )
      // this.disabledflag=true;
      if (this.request.currentAction == "Add") {
        this.responseobj.FromTime = null;
        this.responseobj.ToTime = null;
        this.responseobj.PromoProducts.forEach((item) => {
          item.IsChecked = false;
          item.GetProductDocumentId = null;
          item.GetProducts = [];
          item.TakeProductQuantity = 0;
          item.GetProductQuantity = 0;
        });
      }
      if (this.request.currentAction == "Edit") {
        this.disabledflag = true;
      }

      if(this.responseobj?.BranchList?.length) this.BranchList = this.responseobj.BranchList;
      if(this.responseobj?.OrderPayTypeList?.length) this.OrderPayTypeList = this.responseobj.OrderPayTypeList;
      if(this.responseobj?.OrderTypeList?.length) this.OrderTypeList = this.responseobj.OrderTypeList;

      this.setSelectedGetProductsList();
    });
  }

  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    if(this.responseobj?.BranchList?.length) this.BranchList = this.responseobj.BranchList;
    if(this.responseobj?.OrderPayTypeList?.length) this.OrderPayTypeList = this.responseobj.OrderPayTypeList;
    if(this.responseobj?.OrderTypeList?.length) this.OrderTypeList = this.responseobj.OrderTypeList;
    this.showHidePromoElements();

    switch (event) {
      case imp.quickAction.afterNew:
        this.promoAfterNew();
        break;
      case imp.quickAction.beforeAdd:
        this.PromobeforAdd();
        break;
      case imp.quickAction.afterAdd:
        this.disabledflag = false;
        break;
      case imp.quickAction.afterUpdate:
        this.disabledflag = false;
        this.setCurrentPage();
        break;
      case imp.quickAction.beforeUpdate:
        this.PromobeforAdd();
        break;
      case imp.quickAction.afterModify:
        this.disabledflag = true;
        break;
      case imp.quickAction.afterUndo:
        this.disabledflag = false;
        break;
    }
  }
  showHidePromoElements() {
    if (this.responseobj.ValueType != null && this.responseobj.ValueType != undefined) {
      if (this.responseobj.ValueType == 1 || this.responseobj.ValueType == 4) {
        this.showpercentageAndValue = true;
        this.showCustomProduct = false;
      } else if (this.responseobj.ValueType == 3) {
        this.showCustomProduct = true;
        this.showpercentageAndValue = false;
      }
      else if (this.responseobj.ValueType == 5) {
        this.showCustomProduct = false;
        this.showpercentageAndValue = false;
      }
    }
  }
  promoAfterNew() {
    this.disabledflag = true;
    this.showCustomProduct = false;
    this.showpercentageAndValue = false;
    this.responseobj.ValueType = 1;
    this.valueTypeThreeList = [];
    this.refreshDisplayList();
    // reset grouped UI/state so a fresh New starts clean
    this.groupedByGroup?.forEach(element => {
      element.isGroupSelected = false;
      element.selectedCount = 0;
      // element.totalCount = 0;
    });
    this.selectedGroup = null;
    this.groupAllSelected = true;
    this.responseobj.PromoProducts = this.newProductList;
    if (this.request.currentAction != "Add")
      for (const name in this.frmRef.controls) {
        this.responseobj.WorkDays?.forEach((item, index) => {
          item.IsWork = true;
          this.itemwithindex = "IsWork" + index;
          if (name == this.itemwithindex) this.frmRef.controls[name].setValue(true);
        });
      }
  }

  // instance of DatePipe to transform date and time formats
  datePipe = new DatePipe("en-US");

  PromobeforAdd() {
    this.responseobj.FromDate = this.datePipe.transform(this.responseobj.FromDate, "MM/dd/yyyy");
    this.responseobj.ToDate = this.datePipe.transform(this.responseobj.ToDate, "MM/dd/yyyy");
    if (this.responseobj.ValueType != 3) {
      this.newPromoProducts = [];
      this.responseobj.PromoProducts.forEach((item) => {
        if (item.IsChecked) {
          item.TakeProductQuantity = 1;
          this.newPromoProducts.push(item);
        }
      });
      this.responseobj.PromoProducts = this.newPromoProducts;
    } else if (this.responseobj.ValueType == 3) {
      (this.valueTypeThreeList || []).forEach(item => this.persistValueTypeThreeRows(item));
      this.responseobj.ValueTypeThreeDetails = this.deepCopy(this.valueTypeThreeList || []);
      this.responseobj.PromoProducts = (this.valueTypeThreeList || []).map(item => {
        const cloned = this.deepCopy(item);
        delete cloned.TakeRows;
        delete cloned.FreeRows;
        return cloned;
      });
    }
  }
  //#endregion
  //#region Pagger

  initializeobjects(): void {
    this.responseobj = {};
    this.FiltterObj = {};
    this.service = this.PromoService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  //#region Pagger
  afterPag(event: any): void {
    this.formPaging({ formObj: event });
    this.worksDays = [];
    this.worksDays = event.WorkDays;
    this.originalPromoProducts = this.responseobj.PromoProducts ?? [];
    this.productsLockUp = (this.originalPromoProducts || []).map(p => ({
      TakeProductDocumentId: this.buildLookupKeyFromIds(p.TakeProductDocumentId, p.TakeProductVolumeDocumentId),
      TakeProductName: p.TakeProductName
    }));
    this.initializeValueTypeThreeList();
    this.refreshDisplayList(false);
    this.buildGroupedProducts();
    if (this.responseobj.ValueType == 1 || this.responseobj.ValueType == 4) {
      this.showCustomProduct = false;
      this.showpercentageAndValue = true;
    } else if (this.responseobj.ValueType == 3) {
      this.showpercentageAndValue = false;
      this.showCustomProduct = true;
    }
    this.setCurrentPage();
    this.responseobj.FromTime = this.datePipe.transform(this.responseobj.FromTime, "HH:mm");
    this.responseobj.ToTime = this.datePipe.transform(this.responseobj.ToTime, "HH:mm");
  }

  //#endregion
  setPromoType(data) {
    if (data.value != null && data.value != undefined) {
      this.responseobj.ValueType = data.value;
      if (data.value == 1 || data.value == 4) {
        this.showpercentageAndValue = true;
        this.showCustomProduct = false;
        this.responseobj.PromoProducts.forEach(x => {
          x.TakeProductQuantity = 0;
          x.GetProductDocumentId = [];
          x.GetProducts = [];
          x.GetProductQuantity = 0;
        });
        this.refreshDisplayList();
      } else if (data.value == 3) {
        this.showCustomProduct = true;
        this.showpercentageAndValue = false;
        this.initializeValueTypeThreeList();
        // if (this.request?.currentAction === "Add") {
        //   this.valueTypeThreeList = [];
        // }
        this.refreshDisplayList();
      }
    }
  }
  // addProductTocustomList() {
  //   this.responseobj.PromoProducts.push({});
  //   this.refreshCustomPaganation();
  // }
  // DeleteProductTocustomList(index) {
  //   if (index > -1) {
  //     this.responseobj.PromoProducts.splice(index, 1);
  //     this.refreshCustomPaganation();

  //     //  this.returnedArray = this.responseobj.PromoProducts;
  //   }
  // }

  buildGroupedProducts() {
    const map = new Map<string, { groupDocumentId: string; groupName: string; products: any[]; isGroupSelected?: boolean; selectedCount?: number; totalCount?: number }>();
    (this.responseobj?.PromoProducts || []).forEach(p => {
      const key = p.TakeProductGroupDocumentId || p.TakeProductGroupName || "";
      if (!map.has(key)) {
        map.set(key, { groupDocumentId: p.TakeProductGroupDocumentId, groupName: p.TakeProductGroupName, products: [] });
      }
      map.get(key).products.push(p);
    });
    this.groupedByGroup = Array.from(map.values());
    this.groupedByGroup.forEach(g => this.updateGroupSummary(g));
  }

  openGroupProductsModal(group: { groupDocumentId: string; groupName: string; products: any[]; isGroupSelected?: boolean; selectedCount?: number; totalCount?: number }) {
    this.selectedGroup = group;
    // Default: select all if no selection was made before
    const hasAnyChecked = group?.products?.some(x => x.IsChecked === true);
    if (!hasAnyChecked) {
      group?.products?.forEach(x => (x.IsChecked = true));
    }
    // Sync select-all checkbox
    this.groupAllSelected = group?.products?.every(x => !!x.IsChecked);
    this.updateGroupSummary(group);
    $("#GroupProductsModal").modal("show");
  }

  toggleSelectAllInGroup(event: any) {
    const value = event?.currentTarget?.checked ?? false;
    this.groupAllSelected = value;
    if (this.selectedGroup?.products?.length) {
      this.selectedGroup.products.forEach(p => (p.IsChecked = value));
    }
    this.updateGroupSummary(this.selectedGroup);
  }

  closeGroupProductsModal() {
    $("#GroupProductsModal").modal("hide");
  }

  // Toggle full group selection from the grouped grid
  toggleGroupSelection(group: { products: any[]; isGroupSelected?: boolean; selectedCount?: number; totalCount?: number }, event: any) {
    const checked = event?.currentTarget?.checked ?? false;
    group.isGroupSelected = checked;
    if (group?.products?.length) {
      group.products.forEach(p => (p.IsChecked = checked));
    }
    if (this.selectedGroup && this.selectedGroup.groupDocumentId === (group as any).groupDocumentId) {
      this.groupAllSelected = checked;
    }
    this.updateGroupSummary(group);
  }

  // Keep group summary in sync
  updateGroupSummary(group: { products: any[]; isGroupSelected?: boolean; selectedCount?: number; totalCount?: number }) {
    if (!group) { return; }
    const total = group.products?.length || 0;
    const selected = group.products?.filter(x => !!x.IsChecked)?.length || 0;
    group.totalCount = total;
    group.selectedCount = selected;
    // If user has any product selected, keep the group selected.
    // Only force uncheck when nothing is selected (or when explicitly toggled off elsewhere).
    if (selected === 0) {
      group.isGroupSelected = false;
    } else if (group.isGroupSelected !== true) {
      group.isGroupSelected = true;
    }
  }

  onGroupProductCheckedChange(group: { products: any[]; isGroupSelected?: boolean; selectedCount?: number; totalCount?: number }){
    // called when a single product checkbox within the modal changes
    // sync the modal select-all and the main grid summary
    if (!group) return;
    this.groupAllSelected = group.products?.every(p => !!p.IsChecked) ?? false;
    this.updateGroupSummary(group);
  }

  // setTime(date: Date) {
  //   let hours = ("0" + date.getHours()).slice(-2);
  //   let minutes = ("0" + date.getMinutes()).slice(-2);
  //   let str = hours + ":" + minutes;
  //   return str;
  // }
  CheckPromoDays() {
    $("#modal-WorkDays").modal("show");
  }
  FiltterPromoProducts() {
    $("#FiltterPromoProducts").modal("show");
  }
  SelectAllEvent(event: any) {
    let value = event.currentTarget.checked;
    this.newProductList.forEach((item) => {
      item.IsChecked = value;
    });
  }
  searchProducts(ProductGroupvalue, ProductValue) {
    const source = this.responseobj?.ValueType === 3 ? (this.valueTypeThreeList || []) : (this.responseobj?.PromoProducts || []);
    if (!ProductGroupvalue && !ProductValue) {
      this.refreshDisplayList();
      return;
    }
    let filtered = source;
    if (ProductGroupvalue) {
      const val = this.normalizeText(ProductGroupvalue);
      filtered = filtered.filter(item => this.normalizeText(item.TakeProductGroupName).indexOf(val) > -1);
    }
    if (ProductValue) {
      const val = this.normalizeText(ProductValue);
      filtered = filtered.filter(item => this.normalizeText(item.TakeProductName).indexOf(val) > -1);
    }
    this.newProductList = filtered;
    const resetEvent: PageChangedEvent = { page: 1, itemsPerPage: this.itemsPerPage || 15 };
    this.pageChanged(resetEvent);
    this.setSelectedGetProductsList();
  }
  GetFiltterObj() {
    if (this.responseobj.ValueType == 3) {
      $("#FiltterPromoProducts").modal("hide");
      return;
    }
    if (this.FiltterObj.IsCheckedOneForOne) {
      this.newProductList.forEach((item) => {
        item.IsChecked = true;
        item.TakeProductQuantity = 1;
        item.GetProductQuantity = 1;
        item.GetProductDocumentId = [];
        item.GetProducts = [];
        let Product = this.responseobj.PromoProducts.filter((a) => a.TakeProductName.toLowerCase() == item.TakeProductName.toLowerCase())[0];
        if(Product){
          item.GetProductDocumentId.push(Product?.TakeProductDocumentId);
          item.GetProducts.push({
            GetProductDocumentId : Product?.TakeProductDocumentId,
            GetProductVolumeDocumentId : Product?.TakeProductVolumeDocumentId,
          })
        }
      });
    }
    let selectedProductgroups = [];
    this.FiltterObj.ProductGroupList.forEach((item) => {
      if (item.IsSelectedProductGroup) {
        selectedProductgroups.push(item.Id);
      }
    });
    if (selectedProductgroups.length > 0)
      this.newProductList = this.responseobj.PromoProducts.filter((x) =>
        selectedProductgroups.includes(x.TakeProductGroupDocumentId)
      ) ?? [];
    else this.newProductList = this.responseobj.PromoProducts ?? [];
    $("#FiltterPromoProducts").modal("hide");
  }

  setCurrentPage(): void {
    this.pC = {page:1 , itemsPerPage:!this.itemsPerPage ? 15 : this.itemsPerPage};
    this.pageChanged(this.pC)
    this.setSelectedGetProductsList();
  }
  get paginatedData(): any[] {
    if(this._paginatedData){
      return this._paginatedData;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.newProductList.slice(startIndex, endIndex);
  }

  pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this._paginatedData = this.newProductList.slice(startItem, endItem);
  }
  addValueTypeThreeRow() {
    const blankDetail: any = {
      DocumentId: null,
      IsChecked: true,
      PromoDiscritpion: "",
      TakeProductQuantity: 1,
      GetProductQuantity: 1,
      TakeRows: [this.createTakeRow()],
      FreeRows: [this.createFreeRow()],
      GetProducts: []
    };
    this.valueTypeThreeList = [blankDetail, ...(this.valueTypeThreeList || [])];
    this.setTakeProductsPreview(blankDetail);
    this.setFreeProductsPreview(blankDetail);
    this.refreshDisplayList();
    this.syncValueTypeThreeResponse();
  }

  openValueTypeThreeModal(detail: any){
    if(!detail){ return; }
    this.selectedValueTypeThreeDetail = detail;
    this.ensureValueTypeThreeRows(detail);
    $("#ValueTypeThreeModal").modal("show");
  }

  closeValueTypeThreeModal(){
    if(this.selectedValueTypeThreeDetail){
      this.persistValueTypeThreeRows(this.selectedValueTypeThreeDetail);
      this.setTakeProductsPreview(this.selectedValueTypeThreeDetail);
      this.setFreeProductsPreview(this.selectedValueTypeThreeDetail);
      this.refreshDisplayList(false);
      this.syncValueTypeThreeResponse();
    }
    $("#ValueTypeThreeModal").modal("hide");
    this.selectedValueTypeThreeDetail = null;
  }

  removeValueTypeThreeRow(detail: any){
    if(!detail){ return; }
    const idx = (this.valueTypeThreeList || []).indexOf(detail);
    if(idx === -1){ return; }
    this.valueTypeThreeList.splice(idx,1);
    this.refreshDisplayList(true);
    this.syncValueTypeThreeResponse();
  }

  addValueTypeThreeTakeRow(){
    if(!this.selectedValueTypeThreeDetail){ return; }
    this.selectedValueTypeThreeDetail.TakeRows.push(this.createTakeRow());
  }

  removeValueTypeThreeTakeRow(index: number){
    if(!this.selectedValueTypeThreeDetail){ return; }
    if(this.selectedValueTypeThreeDetail.TakeRows.length <= 1){ return; }
    this.selectedValueTypeThreeDetail.TakeRows.splice(index,1);
  }

  handleValueTypeThreeTakeProductChange(row: any){
    if(!row){ return; }
    const product = this.findBaseProductByLookup(row.SelectedProductKey);
    if(product){
      row.ProductName = product.TakeProductName;
      row.GroupName = product.TakeProductGroupName;
      row.ProductDocumentId = product.TakeProductDocumentId;
      row.ProductVolumeDocumentId = product.TakeProductVolumeDocumentId;
      row.SelectedProductKey = row.SelectedProductKey || this.buildLookupKeyFromIds(row.ProductDocumentId, row.ProductVolumeDocumentId);
    }
  }

  addValueTypeThreeFreeRow(){
    if(!this.selectedValueTypeThreeDetail){ return; }
    this.selectedValueTypeThreeDetail.FreeRows.push(this.createFreeRow());
  }

  removeValueTypeThreeFreeRow(index: number){
    if(!this.selectedValueTypeThreeDetail){ return; }
    if(this.selectedValueTypeThreeDetail.FreeRows.length <= 1){ return; }
    this.selectedValueTypeThreeDetail.FreeRows.splice(index,1);
  }

  handleValueTypeThreeFreeProductChange(row:any){
    if(!row){ return; }
    if(!row.SelectedProductKey){
      row.ProductName = null;
      row.ProductDocumentId = null;
      row.ProductVolumeDocumentId = null;
      return;
    }
    const product = this.findBaseProductByLookup(row.SelectedProductKey);
    if(product){
      row.ProductName = product.TakeProductName;
      row.ProductDocumentId = product.TakeProductDocumentId;
      row.ProductVolumeDocumentId = product.TakeProductVolumeDocumentId;
      row.SelectedProductKey = row.SelectedProductKey || this.buildLookupKeyFromIds(row.ProductDocumentId, row.ProductVolumeDocumentId);
    }
  }

  // Helpers to hide already-selected products on the same side while keeping the current value selectable.
  getTakeProductOptions(detail: any, currentRow: any){
    if(!detail || !Array.isArray(detail.TakeRows)){ return this.productsLockUp || []; }
    return this.getFilteredProducts(detail.TakeRows, currentRow);
  }

  getFreeProductOptions(detail: any, currentRow: any){
    if(!detail || !Array.isArray(detail.FreeRows)){ return this.productsLockUp || []; }
    return this.getFilteredProducts(detail.FreeRows, currentRow);
  }

  private getFilteredProducts(rows: any[], currentRow: any){
    if(!currentRow){ return this.productsLockUp || []; }
    const currentKey = currentRow?.SelectedProductKey;
    const excluded = new Set(
      (rows || [])
        .filter(r => r && r !== currentRow)
        .map(r => r.SelectedProductKey)
        .filter(k => !!k)
    );
    return (this.productsLockUp || []).filter(p =>
      p.TakeProductDocumentId === currentKey || !excluded.has(p.TakeProductDocumentId)
    );
  }
  insertRow() {
    let deebList = this.takeProductNewList?.length ? this.deepCopy(this.takeProductNewList) : [];
    deebList.push(new PromoCustomsWithDetailModel());
    this.takeProductNewList = deebList;
  }
  deleteRow(i: number) {
    this.takeProductNewList.splice(i,1);
  }
  showAddPromoCustomProductDetails( detail : any) {
    if(detail){
      if(detail?.PromoCustomProductDetails?.length){
        this.takeProductNewList = detail.PromoCustomProductDetails;
      }
      $("#addCustomProductDetails").modal("show");
      this.selectedTakeProductDocumentId = detail?.TakeProductDocumentId;
    }
    else{
      this.responseobj?.PromoProducts?.find(x=>{
        if(x.TakeProductDocumentId == this.selectedTakeProductDocumentId && this.takeProductNewList?.length){
          x.PromoCustomProductDetails = this.takeProductNewList;
        }
      })
      $("#addCustomProductDetails").modal("hide");
      this.clearDetail();
    }
  }
  clearDetail(){
    this.takeProductNewList = [];
  }

  setSelectedGetProductsList(){
    this.showHidePromoElements();
    const list = this.responseobj?.ValueType === 3 ? (this.valueTypeThreeList || []) : (this.responseobj?.PromoProducts || []);
    list.forEach(x=>{
      if(x.GetProducts?.length > 0){
        x.selectedTakeProductsDocumentId = [];
        x.selectedTakeProductsDocumentId.push(...x.GetProducts
          .map(y=>this.buildLookupKeyFromIds(y.GetProductDocumentId, y.GetProductVolumeDocumentId)));
      }
      if(x.PromoCustomProductDetails?.length > 0){
        x.PromoCustomProductDetails.forEach(y=>{
          y.selectedTakeProductDocumentId = this.buildLookupKeyFromIds(y.GetProductDocumentId, y.GetProductVolumeDocumentId);
        })
      }
      if(this.responseobj?.ValueType === 3){
        this.ensureValueTypeThreeRows(x);
        this.setTakeProductsPreview(x);
        this.setFreeProductsPreview(x);
      }
    })


  }
  GetProductDocumentIdChange(detail){
    detail.GetProducts = [];
    if(detail.selectedTakeProductsDocumentId?.length > 0){
      detail.selectedTakeProductsDocumentId.forEach(x=>{
        const product = this.findBaseProductByLookup(x);
        if(product){
          detail.GetProducts.push({
            GetProductDocumentId : product.TakeProductDocumentId,
            GetProductVolumeDocumentId : product.TakeProductVolumeDocumentId,
          })
        }
      })
    }
  }

  GetProductDocumentIdChangeNewList(detail){
    const product = this.findBaseProductByLookup(detail.selectedTakeProductDocumentId);

    if(product){
      detail.GetProductDocumentId = product.TakeProductDocumentId;
      detail.GetProductVolumeDocumentId = product.TakeProductVolumeDocumentId;
    }

      
  }

  handleValueTypeThreeRowPriceChange(row: any, field: "NewPrice" | "DiscountPercentage"){
    if(!row){ return; }
    const price = Math.max(Number(row.NewPrice) || 0, 0);
    const discount = Math.min(Math.max(Number(row.DiscountPercentage) || 0, 0), 100);
    if(field === "NewPrice"){
      row.NewPrice = price;
      if(price > 0){
        row.DiscountPercentage = 0;
      }
    }else{
      row.DiscountPercentage = discount > 100 ? 100 : discount;
      if(discount > 0){
        row.NewPrice = 0;
      }
    }
  }

  getTakeProductsPreview(detail: any): string{
    if(detail?.TakeRows?.length){
      const names = detail.TakeRows
        .filter(row => !!row?.ProductName)
        .map(row => `(${row.Quantity || 0} × ${row.ProductName})`);
      return this.formatPreviewList(names, this.translate.instant("Shared.Select"));
    }
    if(detail?.TakeProductName){
      return `${detail.TakeProductQuantity || 0} × ${detail.TakeProductName}`;
    }
    return this.translate.instant("Shared.Select");
  }

  getFreeProductsPreview(detail: any): string{
    if(this.responseobj?.UseNewPriceAndPercentage){
      const total = detail?.PromoCustomProductDetails?.length || 0;
      return total > 0 ? `${total} items` : this.translate.instant("Shared.Filtter");
    }
    if(detail?.FreeRows?.length){
      const names = detail.FreeRows
        .filter(row => !!row?.ProductName)
        .map(row => `(${row.Quantity || 0} × ${row.ProductName})`);
      return this.formatPreviewList(names, this.translate.instant("Shared.Select"));
    }
    if(detail?.GetProducts?.length){
      const list = detail.GetProducts
        .map(p=>this.getProductNameByDocument(p.GetProductDocumentId, p.GetProductVolumeDocumentId))
        .filter(n=>!!n);
      return this.formatPreviewList(list, this.translate.instant("Shared.Select"));
    }
    return this.translate.instant("Shared.Select");
  }

  private formatPreviewList(items: string[], placeholder: string, max: number = 3): string{
    const list = (items || []).filter(i => !!i);
    if(!list.length){ return placeholder; }
    const visible = list.slice(0, max);
    const extra = list.length - visible.length;
    const preview = visible.join(" + ");
    return extra > 0 ? `${preview} +${extra} more` : preview;
  }

  private normalizeValueTypeThreeRow(row: any){
    if(!row){ return row; }
    // row.Id = row.Id ?? row.id;
    row.SelectedProductKey = row.SelectedProductKey ?? row.selectedProductKey;
    row.Quantity = row.Quantity ?? row.quantity;
    row.ProductName = row.ProductName ?? row.productName;
    row.GroupName = row.GroupName ?? row.groupName;
    row.ProductDocumentId = row.ProductDocumentId ?? row.DocumentId ?? row.documentId;
    row.ProductVolumeDocumentId = row.ProductVolumeDocumentId ?? row.VolumeDocumentId ?? row.volumeDocumentId;
    return row;
  }

  private ensureValueTypeThreeRows(detail: any){
    if(!detail){ return; }
    if(Array.isArray(detail.TakeRows)){
      detail.TakeRows = detail.TakeRows.map(row => this.normalizeValueTypeThreeRow(row));
    }
    if(Array.isArray(detail.FreeRows)){
      detail.FreeRows = detail.FreeRows.map(row => this.normalizeValueTypeThreeRow(row));
    }
    if(!Array.isArray(detail.TakeRows) || !detail.TakeRows.length){
      const key = detail.selectedTakeProductDocumentId
        || this.buildLookupKeyFromIds(detail.TakeProductDocumentId, detail.TakeProductVolumeDocumentId);
      detail.TakeRows = [this.createTakeRow(key, detail.TakeProductQuantity || 1, detail)];
    }
    if(!Array.isArray(detail.FreeRows) || !detail.FreeRows.length){
      if(detail.GetProducts?.length){
        detail.FreeRows = detail.GetProducts.map(x=>
          this.createFreeRow(
            this.buildLookupKeyFromIds(x.GetProductDocumentId, x.GetProductVolumeDocumentId),
            detail.GetProductQuantity || 1,
            x));
      }else{
        detail.FreeRows = [this.createFreeRow()];
      }
    }
  }

  private createTakeRow(productKey?: string, quantity: number = 1, source?: any){
    const row: any = {
      // Id: ++this.valueTypeThreeRowCounter,
      SelectedProductKey: productKey || null,
      Quantity: quantity || 1
    };
    const product = this.findBaseProductByLookup(row.SelectedProductKey);
    if(product){
      row.ProductName = product.TakeProductName;
      row.GroupName = product.TakeProductGroupName;
      row.ProductDocumentId = product.TakeProductDocumentId;
      row.ProductVolumeDocumentId = product.TakeProductVolumeDocumentId;
    }else if(source){
      row.ProductName = source.TakeProductName || source.ProductName;
      row.GroupName = source.TakeProductGroupName || source.GroupName;
      row.ProductDocumentId = source.TakeProductDocumentId || source.ProductDocumentId;
      row.ProductVolumeDocumentId = source.TakeProductVolumeDocumentId || source.ProductVolumeDocumentId;
      if(!row.SelectedProductKey && row.ProductDocumentId){
        row.SelectedProductKey = this.buildLookupKeyFromIds(row.ProductDocumentId, row.ProductVolumeDocumentId);
      }
    }
    return row;
  }

  private createFreeRow(productKey?: string, quantity: number = 1, source?: any){
    const row: any = {
      // Id: ++this.valueTypeThreeRowCounter,
      SelectedProductKey: productKey || null,
      Quantity: quantity || 1 ,
      NewPrice : 0,
      DiscountPercentage : 0
    };
    const product = this.findBaseProductByLookup(row.SelectedProductKey);
    if(product){
      row.ProductName = product.TakeProductName;
      row.ProductDocumentId = product.TakeProductDocumentId;
      row.ProductVolumeDocumentId = product.TakeProductVolumeDocumentId;
    }else if(source){
      row.ProductName = source.ProductName || this.getProductNameByDocument(source.GetProductDocumentId, source.GetProductVolumeDocumentId);
      row.ProductDocumentId = source.GetProductDocumentId || source.ProductDocumentId;
      row.ProductVolumeDocumentId = source.GetProductVolumeDocumentId || source.ProductVolumeDocumentId;
      if(!row.SelectedProductKey && row.ProductDocumentId){
        row.SelectedProductKey = this.buildLookupKeyFromIds(row.ProductDocumentId, row.ProductVolumeDocumentId);
      }
    }
    return row;
  }

  private persistValueTypeThreeRows(detail: any){
    if(!detail){ return; }
    if(detail.TakeRows?.length){
      const first = detail.TakeRows[0];
      if(first.SelectedProductKey){
        const product = this.findBaseProductByLookup(first.SelectedProductKey);
        if(product){
          detail.selectedTakeProductDocumentId = first.SelectedProductKey;
          detail.TakeProductDocumentId = product.TakeProductDocumentId;
          detail.TakeProductVolumeDocumentId = product.TakeProductVolumeDocumentId;
          detail.TakeProductName = product.TakeProductName;
          detail.TakeProductGroupName = product.TakeProductGroupName;
        }
      }
      detail.TakeProductQuantity = first.Quantity || 1;
    }
    detail.GetProducts = [];
    detail.selectedTakeProductsDocumentId = [];
    if(detail.FreeRows?.length){
      detail.FreeRows.forEach(row=>{
        if(!row.SelectedProductKey){ return; }
        const product = this.findBaseProductByLookup(row.SelectedProductKey);
        if(product){
          detail.GetProducts.push({
            GetProductDocumentId : product.TakeProductDocumentId,
            GetProductVolumeDocumentId : product.TakeProductVolumeDocumentId
          });
          detail.selectedTakeProductsDocumentId.push(row.SelectedProductKey);
        }
      });
      detail.GetProductQuantity = detail.FreeRows[0]?.Quantity || detail.GetProductQuantity || 1;
    }
  }

  private buildLookupKeyFromIds(docId?: string, volumeDocumentId?: string){
    return (docId || "") + (volumeDocumentId || "");
  }

  private findBaseProductByLookup(key: string){
    if(!key){ return null; }
    return (this.originalPromoProducts || []).find(p=> this.buildLookupKeyFromIds(p.TakeProductDocumentId, p.TakeProductVolumeDocumentId) === key);
  }

  private findBaseProductByIds(docId?: string, volumeDocumentId?: string){
    return this.findBaseProductByLookup(this.buildLookupKeyFromIds(docId, volumeDocumentId));
  }

  private getProductNameByDocument(docId?: string, volumeDocumentId?: string){
    const product = this.findBaseProductByIds(docId, volumeDocumentId);
    return product?.TakeProductName || "";
  }

  private normalizeText(value: any): string{
    return value ? value.toString().toLowerCase() : "";
  }

  private initializeValueTypeThreeList(){
    this.valueTypeThreeList = [];
    this.valueTypeThreeRowCounter = 0;

    if(this.responseobj?.ValueType !== 3){
      return;
    }

    const details = Array.isArray(this.responseobj?.ValueTypeThreeDetails)
      ? this.responseobj.ValueTypeThreeDetails
      : [];

    this.valueTypeThreeList = this.deepCopy(details);
    this.valueTypeThreeList.forEach(item=> {
      this.ensureValueTypeThreeRows(item);
      this.setTakeProductsPreview(item);
      this.setFreeProductsPreview(item);
    });

    const totalRows = this.valueTypeThreeList.reduce((total, item) =>
      total + (item.TakeRows?.length || 0) + (item.FreeRows?.length || 0), 0);
    this.valueTypeThreeRowCounter = Math.max(this.valueTypeThreeRowCounter, totalRows);
    this.syncValueTypeThreeResponse();
  }

  private syncValueTypeThreeResponse(){
    if(this.responseobj?.ValueType !== 3){ return; }
    (this.valueTypeThreeList || []).forEach(item => {
      this.persistValueTypeThreeRows(item);
      this.setTakeProductsPreview(item);
      this.setFreeProductsPreview(item);
    });
    this.responseobj.ValueTypeThreeDetails = (this.valueTypeThreeList || []).map(item => ({
      TakeRows: this.deepCopy(item.TakeRows || []),
      FreeRows: this.deepCopy(item.FreeRows || []),
      IsChecked: item.IsChecked,
      PromoDiscritpion: item.PromoDiscritpion
    }));
  }

  private refreshDisplayList(setPage:boolean = true){
    this.newProductList = this.responseobj?.ValueType === 3 ? (this.valueTypeThreeList || []) : (this.responseobj?.PromoProducts || []);
    if(setPage){
      this.setCurrentPage();
    }
  }

  private setFreeProductsPreview(detail: any){
    if(!detail){ return; }
    detail.freeProductsPreview = this.getFreeProductsPreview(detail);
  }

  private setTakeProductsPreview(detail: any){
    if(!detail){ return; }
    detail.takeProductsPreview = this.getTakeProductsPreview(detail);
  }
}
