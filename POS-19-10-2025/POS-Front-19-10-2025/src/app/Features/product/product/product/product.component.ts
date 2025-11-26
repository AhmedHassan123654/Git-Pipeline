import { Component, OnInit, ViewChild } from "@angular/core";
import { ToastrService, HandlingBackMessages, GridComponent, ProductService, Router, general, quickAction } from "../productimports";
import { TranslateService } from "@ngx-translate/core";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { CommonService } from "src/app/core/Services/Common/common.service";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as XLSX from "xlsx";
import { ProductModel,ProductInsertResponse } from "src/app/core/Models/Transactions/product-model";
import { sumByKey } from "src/app/core/Helper/objectHelper";
declare var $: any;

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"]
})
export class ProductComponent extends general implements OnInit {
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  @ViewChild("grid", { static: false }) grid: GridComponent;
  public breakSave: boolean = false;
  ProductSuggestions: any = [];
  product: ProductModel = new ProductModel();
  selectedGroupMealProductDocumentId: string;

  
  constructor(
    public productSer: ProductService,
    public toastr: ToastrService,
    private common: CommonService,
    public translate: TranslateService,
    public toastrMessage: HandlingBackMessages,
    public orderSer: OrderService,
    private languageSerService: LanguageSerService,
    private router: Router
  ) {
    super();
    this.initializeobjects();
  }
  ngOnInit(): void {
    this.FLG = { text: "Name", value: "DocumentId" };
    this.IdFLG = { text: "Name", value: "Id" };
    this.productFirstOpen();
    this.scrFirstOpen().subscribe(() => {
      this.ProductPricing = this.responseobj.ProductPricing;
      if(this.responseobj.LastProduct?.ProductNumber) this.lastProduct = this.responseobj.LastProduct;
      this.preAddUpdate({});
      this.responseobj.screenPermission.Print = false;
    });
    this.initializeGrid();
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.productSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.productSer.GetProductCount().subscribe((res) => {
      this.ShowExelTab = res;
    });
  }
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
    this.productFirstOpen();
    this.setProductConfiguration();
  }
  quickEvents(event: quickAction): void {
    if(this.responseobj.LastProduct?.ProductNumber) this.lastProduct = this.responseobj.LastProduct;
    switch (event) {
      case quickAction.afterNew:
        this.afterNew({});
        this.enableChiled = true;
        if (this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        this.setProductConfiguration();
        break;
      case quickAction.afterAdd:
        this.uploadFile();
        this.enableChiled = false;
        if (this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        this.afterAdd();
        break;
      case quickAction.afterModify:
        this.afterModify();
        this.enableChiled = true;
        if (this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        this.setProductConfiguration();
        break;
      case quickAction.afterUndo:
        this.enableChiled = false;
        break;
      case quickAction.beforeAdd:
        this.checkRequiredFeildsBeforeSave();
        break;
      case quickAction.beforeUpdate:
        this.checkRequiredFeildsBeforeSave();
        break;
      case quickAction.afterUpdate:
        this.uploadFile();
        break;
    }
  }
  checkRequiredFeildsBeforeSave() {
    // Mark all form controls as touched to show validation messages
    this.currentProd = this.deepCopy(this.responseobj);
    Object.keys(this.frmRef.controls).forEach(key => {
      const control = this.frmRef.controls[key];
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if(!this.frmRef.form.invalid && this.responseobj.ProductSubItems?.length > 0) {
      const sideQuantity = sumByKey(this.responseobj.ProductSubItems, 'Quantity');
      if(sideQuantity > this.responseobj.NumberOfSideDishesAllowed) {
        this.toastr.info(this.translate.instant("products.NumberOfSideDishesAllowed") + " : " + this.responseobj.NumberOfSideDishesAllowed);
        this.frmRef.form.setErrors({ 'invalid': true });
      }
    }
    //  if(this.responseobj.ProductVolumes && this.responseobj.ProductVolumes.length > 0){
    //   let mainExist = this.responseobj.ProductVolumes.find(x=>x.MainUnit);
    //   if(!mainExist) {
    //     this.toastr.info(this.translate.instant("messages.MainProductVolumeIsRquired"));
    //     this.breakSave = true;
    //   }
    //   else
    //     this.breakSave = false;
    // }
  }
  SelectProduct(id) {
    if (id && this.Products && this.Products.length > 0 && this.responseobj.Count) {
      let product = this.Products.find((x) => x.DocumentId == id);
      if (product) {
        let screenPermission = this.responseobj.screenPermission
          ? this.deepCopy(this.responseobj.screenPermission)
          : this.responseobj.screenPermission;
        let Count = this.responseobj.Count;
        this.responseobj = this.deepCopy(product);
        this.responseobj.screenPermission = screenPermission;
        this.responseobj.Count = Count;
        this.setProductConfiguration();
      }
    }
  }
  assignTaxToProduct() {
    if (!this.taxes) this.taxes = [];
    this.taxes.forEach((t) => {
      t.checked = false;
    });

    if (!this.responseobj.ProductTaxes) this.responseobj.ProductTaxes = [];
    if (
      this.responseobj &&
      this.responseobj.DocumentId &&
      this.productTaxes &&
      this.productTaxes.length > 0 &&
      this.taxes.length > 0
    ) {
      let pts = this.productTaxes.filter(
        (x) =>
          (this.responseobj.Id && x.ProductId == this.responseobj.Id) ||
          x.ProductDocumentId == this.responseobj.DocumentId
      );
      if (pts) this.responseobj.ProductTaxes = this.deepCopy(pts);
      if (this.responseobj.ProductTaxes && this.responseobj.ProductTaxes.length > 0) {
        pts.forEach((e) => {
          let index = this.taxes.findIndex((x) =>
            (e.TaxDocumentId && x.DocumentId == e.TaxDocumentId) || (e.TaxId && x.Id == e.TaxId));

          if (index != -1) this.taxes[index].checked = true;
        });
      }
    }
  }
  // SelectPricingClass(SelectedPricingClassDocumentId){
  //   if(!this.responseobj.ProductPricingClasses) this.responseobj.ProductPricingClasses =[];
  //   let pricingClass = this.pricingClasses.find(pc=>pc.DocumentId == SelectedPricingClassDocumentId);
  //   if(pricingClass){
  //     let productPriceingClass = {
  //       ProductDocumentId : this.responseobj.DocumentId, ProductId : this.responseobj.Id,
  //       PricingClassId : pricingClass.Id, PricingClassDocumentId : pricingClass.DocumentId
  //     }
  //   }

  // }
  setProductConfiguration() {
    // handel ProductGroup
    if (
      this.responseobj &&
      !this.responseobj.ProductGroupDocumentId &&
      this.ProductGroupList &&
      this.ProductGroupList.length > 0
    ) {
      let group = this.ProductGroupList.find(
        (x) =>
          (this.responseobj.ProductGroupId && x.Id == this.responseobj.ProductGroupId) ||
          x.DocumentId == this.responseobj.ProductGroupDocumentId
      );
      if (group) this.responseobj.ProductGroupDocumentId = group.FlagValue;
    }
    // handel subItems
    if (this.SubItems && this.SubItems.length > 0) {
      this.SubItems.forEach((s) => {
        s.SideChecked = false;
        s.NewPrice = undefined;
        s.Quantity = undefined;
      });
    }
    if (this.responseobj && this.responseobj.ProductSubItems && this.responseobj.ProductSubItems.length > 0 &&
      this.SubItems && this.SubItems.length > 0)
    {
      this.responseobj.ProductSubItems.forEach((productSubitem) => {
        let index = this.SubItems.findIndex((x) =>
            (productSubitem.SubItemId && x.Id == productSubitem.SubItemId) ||
            x.DocumentId == productSubitem.SubItemDocumentId
        );
        if (index != -1) {
          this.SubItems[index].SideChecked = true;
          this.SubItems[index].NewPrice = productSubitem.NewPrice;
          this.SubItems[index].Quantity = productSubitem.Quantity;
          this.SubItems[index].IsMandatory = productSubitem.IsMandatory;
        }
      });
    }

    // handel ProductItems
    if (this.responseobj && this.responseobj.ProductItems) {
      this.responseobj.ProductItems.forEach((productItem, index) => {
        this.SetProductItem(index);
        if (productItem.ItemOrderTypes && productItem.ItemOrderTypes.length > 0) {
          productItem.OrderTypeData = productItem.ItemOrderTypes.map((otd) => otd.OrderTypeId);
        }
      });
    }

    // handel ProductPricingClasses
    if (
      this.responseobj &&
      this.responseobj.ProductPricingClasses &&
      this.responseobj.ProductPricingClasses.length > 0 &&
      this.pricingClasses &&
      this.pricingClasses.length > 0
    ) {
      this.responseobj.ProductPricingClasses.forEach((pp) => {
        let pricingClass = this.pricingClasses.find((pc) => pc.Id == pp.PricingClassId);
        if (pricingClass) {
          pp.PricingClassDocumentId = pricingClass.DocumentId;
          pp.Name = pricingClass.Name;
          this.SelectedPricingClassDocumentId = pricingClass.DocumentId;
        }
        if (pp.ProductPricingClassVolumes && pp.ProductPricingClassVolumes.length > 0) {
          pp.ProductPricingClassVolumes.forEach((pv) => {
            let volume = this.volumes.find((pc) => pc.Id == pv.VolumeId);
            if (volume) pv.Name = volume.Name;
          });
        }
      });
    }

    // handel ProductVolumes
    if (
      this.responseobj &&
      this.responseobj.ProductVolumes &&
      this.responseobj.ProductVolumes.length > 0 &&
      this.volumes &&
      this.volumes.length > 0
    ) {
      this.responseobj.ProductVolumes.forEach((pv) => {
        if (pv.VolumeId) {
          let volume = this.volumes.find((x) => x.Id == pv.VolumeId);
          if (volume) {
            pv.VolumeDocumentId = volume.DocumentId
            pv.VolumeFerpCode = volume.VolumeFerpCode;
          }
        }
      });
    }

    // handel ProductSuggestion

    // if (
    //   this.responseobj &&
    //   this.responseobj.ProductSuggestions &&
    //   this.responseobj.ProductSuggestions.length > 0 &&
    //   this.Products &&
    //   this.Products.length > 0
    // ) {
    //   this.responseobj.ProductSuggestions.forEach((ps) => {
    //     if (ps.ProductDocumentId) {
    //       let product = this.Products.find((x) => x.Id == ps.ProductId || x.Id == ps.ProductDocumentId);
    //       if (product) ps.ProductDocumentId = product.DocumentId;
    //     }
    //   });
    // }

    // handel ProductPropertis
    if (this.allProductProperties && this.allProductProperties.length > 0) {
      let pp = this.allProductProperties?.find(
        (x) =>
          (this.responseobj.Id && x.ProductId == this.responseobj.Id) ||
          x.ProductDocumentId == this.responseobj.DocumentId
      );
      if (pp) {
        this.ProductProperties = pp;
        this.responseobj.PicturePath = this.ProductProperties.ImgPath;
        this.responseobj.ProductProperties = this.ProductProperties;
        this.responseobj.GeneralGroups = this.ProductProperties.GeneralGroups;
      } else {
        this.ProductProperties = undefined;
        this.responseobj.PicturePath = this.responseobj.PicturePath ?? "";
        this.responseobj.ProductProperties = this.ProductProperties;
        this.responseobj.GeneralGroups = undefined;
      }
    }

    this.assignTaxToProduct();
  }
  productFirstOpen() {
    this.productSer.productFirstOpen().subscribe((res) => {
      this.Products = res["Products"];
      this.items = res["Items"];
      this.SubItems = this.Products.filter((p) => p.IsSubItem && !p.IsStopped && !p.IsDeleted);
      this.taxes = res["Taxes"].filter(x => x.Type == 1);
      this.productTaxes = res["ProductTaxes"];
      this.volumes = res["Volumes"];
      this.units = res["Units"];
      this.orderTypes = res["OrderTypes"];
      this.lastProduct = res["LastProduct"];
      // this.pricingClasses = res["PricingClasses"];
      this.allProductProperties = res["ProductProperties"];
      this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";
      this.responseobj.ProductTaxes = [];
      this.setProductConfiguration();
    });
  }
  onAsGroupMealChange(): void {
    if (this.responseobj?.AsGroupMeal) {
      this.ProductsForGroupMeals = this.Products.filter(p => !p.AsGroupMeal && p.DocumentId !== this.responseobj?.DocumentId);
      setTimeout(() => {
        try {
          ($ as any)(`a[href="#tab-10"]`).tab('show');
        } catch {}
      });
    }
  }
  // Group Meal helpers
  getProductNameByDocumentId(docId: string): string {
    const p = this.Products?.find((x: any) => x.DocumentId === docId);
    return p ? p.Name : docId;
  }
  addGroupMealProduct(): void {
    if (!this.selectedGroupMealProductDocumentId) return;
    if (!this.responseobj.Combos) this.responseobj.Combos = [];
    const selected = this.Products?.find((x: any) => x.DocumentId === this.selectedGroupMealProductDocumentId);
    if (!selected) return;

    const exists = this.responseobj.Combos.some((c: any) =>c.ComboProductDocumentId === selected.DocumentId);
    if (exists) return;

    this.responseobj.Combos.push({
      ProductId: this.responseobj?.Id,
      ProductDocumentId: this.responseobj?.DocumentId,
      ComboProductId: selected?.Id,
      ComboProductDocumentId: selected?.DocumentId
    });

    this.selectedGroupMealProductDocumentId = null;
  }
  removeGroupMealProduct(combo: any): void {
    const index = this.responseobj?.Combos?.indexOf(combo);
    if (index > -1) this.responseobj.Combos.splice(index, 1);
  }
  isTaxChecked() {
    this.responseobj.ProductTaxes = [];

    const checkedTaxes = this.taxes.filter(x => x.checked);

    checkedTaxes.forEach(checkedTax => {
      this.responseobj.ProductTaxes.push({
        TaxId: checkedTax.Id,
        ProductDocumentId: this.responseobj?.DocumentId,
        ProductId: this.responseobj?.Id,
        TaxDocumentId: checkedTax.DocumentId
      });
    });
  }
  addProductVolume() {
    let c = this.ProductGroupFlds;
    if (!this.responseobj.ProductVolumes) this.responseobj.ProductVolumes = [];
    this.responseobj.ProductVolumes.push({ VolumeDocumentId: null });
  }
  // openProductSuggestion it's make add dropdown
  openProductSuggestion() {
    if (!this.responseobj.ProductSuggestions) this.responseobj.ProductSuggestions = [];
    //push empty object of product suggestion
    this.responseobj.ProductSuggestions.push({ ProductDocumentId: null, ProductId: null, Name: null });
  }
  // addProductSuggestion add new Product Suggestion will save Name , ProductDocumentId , ProductId , FerpCode
  addProductSuggestion(product) {
    if (product) {
      let ProductExist = this.Products?.find((x: any) => x.DocumentId === product.ProductDocumentId);
      if (ProductExist) {
        this.responseobj.ProductSuggestions[this.responseobj.ProductSuggestions.indexOf(product)].Name =
          ProductExist.Name;
        this.responseobj.ProductSuggestions[this.responseobj.ProductSuggestions.indexOf(product)].ProductId =
          ProductExist.Id;
        this.responseobj.ProductSuggestions[this.responseobj.ProductSuggestions.indexOf(product)].ProductDocumentId =
          ProductExist.DocumentId;
        this.responseobj.ProductSuggestions[this.responseobj.ProductSuggestions.indexOf(product)].FerpCode =
          ProductExist.FerpCode;
      }
    }
  }

  deleteProductSuggestion(inedx) {
    this.responseobj.ProductSuggestions.splice(inedx, 1);
  }
  addProductItems() {
    if (!this.responseobj.ProductItems) this.responseobj.ProductItems = [];
    this.responseobj.ProductItems.push({});
  }
  deleteProductVolume(inedx) {
    this.responseobj.ProductVolumes.splice(inedx, 1);
  }
  deleteProductItem(inedx) {
    this.responseobj.ProductItems.splice(inedx, 1);
  }
  setProductVolume(productVolume) {
    let volume = this.volumes.find((x) => x.VolumeFerpCode == productVolume.VolumeFerpCode || x.DocumentId == productVolume.VolumeDocumentId);
    if (volume) {
      productVolume.VolumeId = volume.Id;
    }
  }
  setProductSubItem(subItem) {
    if (!this.responseobj.ProductSubItems) this.responseobj.ProductSubItems = [];
    if (!subItem.SideChecked) {
      this.responseobj.ProductSubItems.push({
        ProductId: this.responseobj.Id,
        ProductDocumentId: this.responseobj.DocumentId,
        SubItemId: subItem.Id,
        SubItemDocumentId: subItem.DocumentId,
        Name: subItem.Name,
        ForiegnName: subItem.ForiegnName,
        NewPrice: subItem.NewPrice,
        Quantity: subItem.Quantity,
        IsMandatory: subItem.IsMandatory
      });
    } else {
      let index = this.responseobj.ProductSubItems.findIndex(
        (x) => (subItem.Id && x.SubItemId == subItem.Id) || x.SubItemDocumentId == subItem.DocumentId
      );
      if (index != -1) this.responseobj.ProductSubItems.splice(index, 1);
    }
  }
  getProductSubItem(subItem) {
    if (!this.responseobj.ProductSubItems) this.responseobj.ProductSubItems = [];
    let index = this.responseobj.ProductSubItems.findIndex(
      (x) => (subItem.Id && x.SubItemId == subItem.Id) || x.SubItemDocumentId == subItem.DocumentId
    );
    if (index == -1) return null;
    return this.responseobj.ProductSubItems[index];
  }
  setSubItemPrice(subItem) {
    if (!subItem.NewPrice) subItem.NewPrice = 0;
    let productSubItem = this.getProductSubItem(subItem);
    if (productSubItem) productSubItem.NewPrice = subItem.NewPrice;
  }
  setSubItemQuantity(subItem) {
    let productSubItem = this.getProductSubItem(subItem);
    if (productSubItem) productSubItem.Quantity = subItem.Quantity;
  }
  setSubItemIsMandatory(subItem) {
    let productSubItem = this.getProductSubItem(subItem);
    if (productSubItem) productSubItem.IsMandatory = subItem.IsMandatory ? false : true;
  }
  setMainProductVolume(productVolume) {
    if (!productVolume.MainUnit) {
      let index = this.responseobj.ProductVolumes.indexOf(productVolume);
      if (!this.responseobj.ProductVolumes) this.responseobj.ProductVolumes = [];
      this.responseobj.ProductVolumes.forEach((pv) => {
        if (pv.MainUnit) pv.MainUnit = false;
      });
      if (index != -1) {
        // this.responseobj.ProductVolumes[index].MainUnit = true;
        this.responseobj.ProductVolumes[index].SizeFromMainUnit = 1;
      }
    } else {
      let index = this.responseobj.ProductVolumes.indexOf(productVolume);
      if (!this.responseobj.ProductVolumes) this.responseobj.ProductVolumes = [];
      if (index != -1)
        this.responseobj.ProductVolumes[index].MainUnit = !this.responseobj.ProductVolumes[index].MainUnit;
    }
  }
  setMainProductItem(productItem) {
    // if(!productItem.IsMain){
    //  if(!this.responseobj.ProductItems) this.responseobj.ProductItems = [];
    //  let index = this.responseobj.ProductItems.indexOf(productItem);

    //  this.responseobj.ProductItems.forEach(pv => { if(pv.IsMain) pv.IsMain = false;});
    //  if(index != -1){

    //  }
    //  }else{
    //    if(!this.responseobj.ProductItems) this.responseobj.ProductItems = [];
    //    let index = this.responseobj.ProductItems.indexOf(productItem);
    //    if(index != -1)
    //      this.responseobj.ProductItems[index].IsMain = !this.responseobj.ProductItems[index].IsMain;

    //  }

    if (!productItem.IsMain) {
      let index = this.responseobj.ProductItems.indexOf(productItem);
      this.responseobj.ProductItems.forEach((pv) => {
        if (pv.IsMain) pv.IsMain = false;
      });
      this.responseobj.ProductItems[index].IsMain = true;
    }
  }
  SetProductItem(index) {
    let productItem = this.responseobj.ProductItems[index];

    let item = this.items?.find((i) => i.Id == productItem.ItemId);
    this.responseobj.ProductItems[index].Item = item;
    this.responseobj.ProductItems[index].ItemDocumentId = item?.DocumentId;
    this.responseobj.ProductItems[index].ItemCost = item?.ItemCost;

    this.responseobj.ProductItems[index].ProductId = this.responseobj?.Id;
    this.responseobj.ProductItems[index].ProductDocumentId = this.responseobj?.DocumentId;

    let mainUnitForItem = item?.ItemUnits.find((iu) => iu.MainUnit);
    let unit = this.units?.find((x) => x.Id == mainUnitForItem?.UnitId);
    this.responseobj.ProductItems[index].ItemUnitId = unit?.Id;
    this.responseobj.ProductItems[index].ItemUnitDocumentId = unit?.DocumentId;
  }
  SetOrderTypeData(index) {
    let OrderTypeData = this.responseobj.ProductItems[index].OrderTypeData;
    if (OrderTypeData && OrderTypeData.length > 0) {
      this.responseobj.ProductItems[index].ItemOrderTypes = [];
      OrderTypeData.forEach((id) => {
        let orderType = this.orderTypes.find((o) => o.Id == id);
        if (orderType)
          this.responseobj.ProductItems[index].ItemOrderTypes.push({
            OrderTypeId: id,
            OrderTypeDocumentId: orderType.DocumentId
          });
      });
    }
  }

  uploadImage(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      var reader = new FileReader();
      this.EditFile = event.target.files[0];
      // reader.readAsDataURL(event.target.files[0]);
      // reader.onload = (event: any) => {
      //   this.responseobj.PicturePath = event.target.result;
      // };
      this.responseobj.PicturePath = this.EditFile.name;
    }
  }
  removeImage() {
    this.branchSer.RemoveImages().subscribe((res: any) => {
      if (res == true) {
        this.toastr.warning(this.toastrMessage.GlobalMessages(3));
        this.responseobj.Logo = null;
      }
    });
  }
  uploadFile() {
    if (this.EditFile) {
      let pp = this.allProductProperties?.find(
        (x) =>
          (this.currentProd.Id && x.ProductId == this.currentProd.Id) ||
          x.ProductDocumentId == this.currentProd.DocumentId
      );
      if (pp) this.ProductProperties = pp;
      else
        this.ProductProperties = {
          Name: this.currentProd.Name,
          ImgPath: "",
          ProductDocumentId: this.currentProd.DocumentId,
          ProductId: this.currentProd.Id
        };
      this.currentProd.ProductProperties = this.ProductProperties;

      const formData = new FormData();
      formData.append("file", this.EditFile, this.EditFile.name);
      this.orderSer.uploadImage(formData).subscribe((res) => {
        let obj = res as any;
        if (res && obj.dbPath) {
          this.saveProductProperties(obj);
        } else this.toastr.error(this.toastrMessage.GlobalMessages(res));
      });
    }
  }
  saveProductProperties(obj) {
    this.ProductProperties.ImgPath = obj.dbPath;
    this.orderSer.saveProductProperties(this.ProductProperties).subscribe(async (res) => {
      if (res == 1) {
        this.currentProd.PicturePath = this.ProductProperties.ImgPath;
        this.currentProd.ProductProperties = this.ProductProperties;
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
        this.productFirstOpen();
      } else this.toastr.error(this.toastrMessage.GlobalMessages(res));
    });
  }

  uploadedFile(event) {
    this.fileUploaded = event.target.files[0];
    this.namefile = this.fileUploaded.name;
    this.readExcel();
  }
  readExcel() {
    let readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      var data = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[first_sheet_name];
    };
    readFile.readAsArrayBuffer(this.fileUploaded);
  }

  readAsJson() {
    this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false });
    this.gridList = [];
    this.jsonData.forEach((item) => {

      let ProductGroupCode = item.ProductGroupCode;
      let ProductName = item.ProductName;
      let ForiegnName = item.ForiegnName;
      let Price = item.Price;
      let dataobj = {};
      dataobj = { ProductGroupCode, ProductName, ForiegnName, Price };
      this.gridList.push(dataobj);
    });
    this.grid.refresh();
  }

  async AddProducts() {
    if (this.gridList != undefined) {
      let Products = [];
      this.gridList.forEach((item) => {
        let ProductObj: any = {};
        ProductObj.Price = Number(item.Price);
        ProductObj.ProductGroupCode = item.ProductGroupCode;
        ProductObj.Name = item.ProductName;
        ProductObj.ForiegnName = item.ForiegnName;
        Products.push(ProductObj);
      });
      try {
        debugger;
        const response = await this.productSer.InsertProductsFromExcel(Products).toPromise() as ProductInsertResponse;
        if (response.Success) {
          this.toastr.success("Products added successfully.");
        } else {
          // If there are errors, open a modal to display them
          debugger;
          this.openErrorModal(response.errors);
        }
      } catch (error) {
        // Handle any unexpected errors
        this.openErrorModal(error.error.errors);
      }
    }
  }
  openErrorModal(errors) {
    if (errors.length > 0) {
      this.errors=errors;
      $("#modal-ErrorsFromExcel").modal("show");
    }
  }
  closeModal() {
    $("#modal-ErrorsFromExcel").modal("hide");
  }
  initializeGrid(): void {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["ExcelExport"];
    this.filterOptions = {
      type: "Menu"
    };
  }
  openGeneralGroupsPopUp() {
    this.allGroupsSelected = false;
    this.ProductGroupList.forEach((pg) => {
      pg.IsSelected = false;
    });
    let pp = this.allProductProperties?.find(
      (x) =>
        (this.responseobj.Id && x.ProductId == this.responseobj.Id) ||
        x.ProductDocumentId == this.responseobj.DocumentId
    );
    //  this.responseobj.GeneralGroups = pp?.GeneralGroups;
    if (pp && pp.GeneralGroups) {
      let selectedGroups = pp.GeneralGroups.split(",");
      selectedGroups.forEach((g) => {
        let selected = this.ProductGroupList.filter((pg) => pg.FlagValue == g)[0];
        if (selected) selected.IsSelected = true;
      });
    }

    if (this.ProductGroupList && this.ProductGroupList.length > 0 && this.responseobj) {
      $("#modal-GeneralGroups").modal("show");
    }
  }
  selectAllGroups() {
    let checked = !this.allGroupsSelected ? true : false;
    this.ProductGroupList.forEach((g) => (g.IsSelected = checked));
  }
  saveGeneralGroups() {
    let pp = this.allProductProperties?.find(
      (x) =>
        (this.responseobj.Id && x.ProductId == this.responseobj.Id) ||
        x.ProductDocumentId == this.responseobj.DocumentId
    );
    if (!pp)
      pp = {
        Name: this.responseobj.Name,
        ImgPath: "",
        ProductDocumentId: this.responseobj.DocumentId,
        ProductId: this.responseobj.Id
      };

    pp.GeneralGroups = this.ProductGroupList.filter((g) => g.IsSelected)
      .map((g) => g.FlagValue)
      .join(",");
    // pp.GeneralGroups = this.responseobj.GeneralGroups;

    this.orderSer.saveProductProperties(pp).subscribe((res) => {
      if (res == 1) {
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
        this.productFirstOpen();
        $("#modal-GeneralGroups").modal("hide");
      } else this.toastr.error(this.toastrMessage.GlobalMessages(res));
    });
  }
}
