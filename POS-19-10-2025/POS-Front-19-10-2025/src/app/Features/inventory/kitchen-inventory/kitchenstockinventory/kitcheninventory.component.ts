import * as imp from "../kitcheninventory-imports";
import { Component, Input, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { NgForm } from "@angular/forms";
import { InventoryTypeEnum } from "src/app/core/Enums/InventoryTypeEnum";
import { ComboBoxComponent } from "@syncfusion/ej2-angular-dropdowns";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import { StockhelperService } from "src/app/core/Services/Transactions/stockhelper.service";

@Component({
  selector: "app-inventory",
  templateUrl: "./kitcheninventory.component.html",
  styleUrls: ["./kitcheninventory.component.scss"]
})
export class KitchenInventoryComponent extends imp.general implements imp.OnInit {
  [key: string]: any;

  Showingkeyboard: boolean = false;
  enableStockDocId: boolean = false;
  enableKitchenDocId: boolean = false;
  // tslint:disable-next-line: variable-name
  @Input("inventoryType") _inventoryType;

  @ViewChildren(imp.PopoverContentComponent)
  @ViewChild("frmRef")
  frmRef;
  @ViewChild("StockDocId") StockDocId: ComboBoxComponent;
  public comboObject: ComboBoxComponent;

  allPopovers: imp.QueryList<imp.PopoverContentComponent>;
  public Details;
  config: any;

  @ViewChild("grid")
  grid: imp.GridComponent;
  constructor(
    public kitchenInventoryService: imp.KitchenInventoryService,
    private toastr: imp.ToastrService,
    private toastrMessage: imp.HandlingBackMessages,
    public datepipe: imp.DatePipe,
    private router: imp.Router,
    private route: imp.ActivatedRoute,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private stockhelper: StockhelperService
  ) {
    super();
    this.initializeobjects();
    this.pageNumber = this.router.getCurrentNavigation().extras as number;

    //this.inventorytype=this.router.url.substr(0,1) === '/' ? this.router.url.slice(1): this.router.url;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  ngOnInit() {
    this.inventoryfirstOpen();
  }
  updateFilterOne(eventList) {
    if (eventList && eventList.length > 0) {
      this.filterdItemlist = eventList;
    } else {
      this.filterdItemlist = this.cloneList(this.itemlist);
    }
  }
  updateFilterTwo(eventList) {
    if (eventList && eventList.length > 0) {
      this.filterdItemlistTwo = eventList;
    } else {
      this.filterdItemlistTwo = this.cloneList(this.itemsGroups);
    }
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.kitchenInventoryService;
    this.responseobj.Type = 2;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.disableControlEdit = true; // imp.quickMode.queryMode ;
  }
  inventoryfirstOpen() {
    this.scrFirstOpen().subscribe(() => {
      this.initiateData();
    });
  }
  initiateData() {
    this.itemsGroups = this.responseobj.ItemGroups;
    this.filterdItemlistTwo = this.cloneList(this.itemsGroups);
    this.units = this.responseobj.Units;
    this.responseobj.Type = 2;
    this.StockList = this.responseobj.KitchenList;
    this.listfields = { text: "Name", value: "DocumentId" };
    this.items = [];
    this.itemsGroups != null
      ? this.itemsGroups.forEach((x) => {
          // tslint:disable: curly
          if (x && x.Items && x.Items.length !== 0)
            x.Items.forEach((element) => {
              this.items.push(element);
            });
        })
      : // tslint:disable: no-unused-expression
        [];

    this.firsFill();
  }
  filterBasedType() {
    this.responseobj.StockDocumentId = null;
  }
  disableStockType() {
    return this.responseobj.InventoryDetails?.length > 0;
  }
  //#region Pagger
  afterPag(event: unknown): void {
    this.enableKitchenDocId = false;
    this.disableControlEdit = true;
    this.formPaging({ formObj: event });
  }
  returnobjEvent(event) {
    this.responseobj = event;
  }

  clearobject() {
    this.responseobj = null;
  }
  quickEvents(event: imp.quickAction): void {
    // this.disableControlEdit = event;
    switch (event) {
      case imp.quickAction.afterNew:
        this.initAfterNew();
        this.disableControlEdit = false;
        this.enableKitchenDocId = true;
        break;
      case imp.quickAction.afterAdd:
        this.disableControlEdit = true;
        this.afterAdd();
        break;
      case imp.quickAction.afterModify:
        // this.initAfterModify();
        this.afterModify().subscribe(() => {
          var kitchenElement = <HTMLInputElement>document.getElementById("kitchen");
          kitchenElement.disabled = true;
        });
        break;
      case imp.quickAction.afterUndo:
        // this.initAfterModify();
        this.disableControlEdit = true;
        break;
      case imp.quickAction.afterUpdate:
        this.disableControlEdit = true;
        break;
    }
  }
  disableEdit() {
    if (this.responseobj.Sent != undefined && this.responseobj.Sent) {
      this.responseobj.screenPermission.Edit = false;
      // tslint:disable-next-line: align
      this.responseobj.screenPermission.Delete = false;
    } else {
      this.responseobj.screenPermission.Edit = true;
      this.responseobj.screenPermission.Delete = true;
    }
  }
  initAfterNew() {
    this.afterNew({ dateFields: ["DocumentDate"] }).subscribe(() => {
      this.responseobj = this.responsedata;
      this.responseobj.InventoryDetails = [];
      this.responseobj.DocumentDate = new Date();
      this.initiateData();
    });
  }
  initAfterModify() {
    // this.afterModify().subscribe(() => {
    //   this.responseobj=this.responsedata;

    // });
    this.initiateData();
  }
  CheckEdit() {
    if (this.pageNumber > 0) {
      return true;
    } else return false;
  }

  firsFill() {
    this.itemlist = [];
    if (this.itemsGroups[0].Items && this.itemsGroups[0].Items.length != 0) {
      this.itemlist = this.itemsGroups[0].Items;
    }
    this.filterdItemlist = this.cloneList(this.itemlist);
  }
  loadItems(itemgroup: any) {
    this.itemlist = [];
    if (itemgroup.Items && itemgroup.Items.length != 0) {
      this.itemlist = this.itemsGroups.filter((x) => x.Id === itemgroup.Id).map((i) => i.Items)[0];
    }
    this.filterdItemlist = this.cloneList(this.itemlist);
  }

  showUnits(item: any) {
    this.unitList = [];
    this.itemUnits = item.ItemUnits;
    this.itemUnits.forEach((x) => {
      var unit = this.units.filter((u) => u.Id === x.UnitId)[0];
      this.unitList.push(unit);
    });

    this.addDetail(item);
  }
  addDetail(item: any) {
    // tslint:disable: no-// debugger
    let detail: any;
    this.responseobj.InventoryDetails.push({
      // Id: 0,
      ItemId: item.Id,
      ItemName: item.Name,
      ItemUnits: this.unitList,
      IsGeneral: item.IsGeneral,
      ItemDocumentId: this.stockhelper.getItemDocumentId(item.Id, this.items),
      GItemId: item.GeneralItemData !== undefined && item.GeneralItemData !== null ? item.GeneralItemData.ItemId : null,
      GUnitId: item.GeneralItemData !== undefined && item.GeneralItemData !== null ? item.GeneralItemData.UnitId : null,
      GSizeFromMainUnit:
        item.GeneralItemData !== undefined && item.GeneralItemData !== null ? item.GeneralItemData.Quantity : 1,
      GItemDocumentId:
        item.GeneralItemData !== undefined && item.GeneralItemData !== null
          ? item.GeneralItemData.ItemDocumentId
          : null,
      GUnitDocumentId:
        item.GeneralItemData !== undefined && item.GeneralItemData !== null ? item.GeneralItemData.UnitDocumentId : null
    });

    // tslint:disable: comment-format
  }
  gtSelectedUnits(detail) {
    if (this.items && this.units) {
      var units = [];
      var selectedList = this.items.filter((x) => x.Id === detail.ItemId)[0];
      if (selectedList) {
        let inventoryUnits =
          selectedList.ItemUnits.length > 0
            ? selectedList.ItemUnits.filter((t) => t.IsInventoryUnit)
            : selectedList.ItemUnits;
        if (inventoryUnits.length > 0)
          inventoryUnits.forEach((x) => {
            var unit = this.units.filter((u) => u.Id === x.UnitId)[0];
            units.push(unit);
          });
        detail.ItemUnits = selectedList.ItemUnits;
      }
      this.unitList = units;
      return units;
    }
  }
  setSizeFromMainUnit(detail) {
    var sizeFromMainUnit = detail.ItemUnits.filter((x) => x.UnitId === Number(detail.UnitId))[0];
    detail.UnitDocumentId = this.stockhelper.getUnitDocumentId(detail.UnitId, this.units);
    var mainUnit = detail.ItemUnits.filter((x) => x.MainUnit)[0];
    if (sizeFromMainUnit) {
      detail.SizeFromMainUnit = sizeFromMainUnit.SizeFromMainUnit;
      detail.MainUnitId = mainUnit.UnitId;
      detail.MainUnitDocumentId = this.stockhelper.getUnitDocumentId(detail.MainUnitId, this.units);
      // this.calcGItemQuantity(detail);
    }
  }
  setAlternativeGSizeFromMainUnit(detail) {
    if (this.items) var alternativeItem = this.items.filter((x) => x.Id === Number(detail.AlternativeItemId))[0];
    if (alternativeItem) {
      detail.GSizeFromMainUnit =
        alternativeItem.GeneralItemData !== null ? alternativeItem.GeneralItemData.Quantity : 1;
      detail.AlternativeItemDocumentId = this.stockhelper.getItemDocumentId(detail.AlternativeItemId, this.items);
    }
  }
  getAlternativeItems(detail) {
    if (this.items) var alternativeItems = this.items.filter((x) => x.GItemId === detail.ItemId);
    return alternativeItems;
  }
  //Chehck Dublication
  checkDuplication = function (item) {
    var recordFoundIndex = -1;
    var transferlist = this.responseobj.InventoryDetails;
    var itemIndex = this.responseobj.InventoryDetails.indexOf(item);
    recordFoundIndex = this.responseobj.InventoryDetails.findIndex(function (element) {
      return (
        element.ItemId === item.ItemId && element.UnitId === item.UnitId && transferlist.indexOf(element) !== itemIndex
      );
    });
    // not first record
    if (recordFoundIndex !== -1 && itemIndex !== -1) {
      this.isDuplicated = 1;
      item.errorDuplication = true;
      this.toastr.error("Duplicated Item", this._pagename);
      return false;
    } else {
      item.errorDuplication = false;
      this.isDuplicated = 0;
    }
  };
  deleteRow(index: any) {
    if (index == 0) {
      if (confirm("Are you want to delete last record ??")) this.responseobj.InventoryDetails.splice(index, 1);
    } else this.responseobj.InventoryDetails.splice(index, 1);
  }
  downloadStockItems() {
    result: [];
    this.kitchenInventoryService.downloadStockItems(this.responseobj).subscribe((res) => {

      this.result = res;
      this.responseobj.InventoryDetails = [];
      this.result.forEach((item) => {
        this.responseobj.InventoryDetails.push({
          // Id: 0,
          ItemId: item.ItemId,
          UnitId: item.UnitId
          // ItemUnits: this.unitList
        });
      });
    });
  }
}
