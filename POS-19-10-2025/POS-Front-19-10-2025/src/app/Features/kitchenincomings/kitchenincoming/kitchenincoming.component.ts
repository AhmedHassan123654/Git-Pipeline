/* eslint-disable no-// debugger */
import * as imp from "../kitchenincoming-imports";
import { Component, ViewChildren, ViewChild, Input } from "@angular/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
export { Component, OnInit, ViewChildren, QueryList, ViewChild } from "@angular/core";

@Component({
  selector: "app-kitchenincoming",
  templateUrl: "./kitchenincoming.component.html",
  styleUrls: ["./kitchenincoming.component.scss"]
})
export class KitchenincomingComponent extends imp.general implements imp.OnInit {
  Showingkeyboard: boolean = false;
  [key: string]: any;
  @ViewChildren(imp.PopoverContentComponent)
  @ViewChild("grid", { static: false })
  grid: imp.GridComponent;
  constructor(
    private http: imp.HttpClient,
    public incomingService: imp.IncomingService,
    private toastr: imp.ToastrService,
    private toastrMessage: imp.HandlingBackMessages,
    public datepipe: imp.DatePipe,
    private router: imp.Router,
    private route: imp.ActivatedRoute,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private stockhelper: imp.StockhelperService
  ) {
    super();
    this.initializeobjects();
  }
  updateFilterone(eventList) {
    if (eventList && eventList.length > 0) {
      this.filterdItemlist = eventList;
    } else {
      this.filterdItemlist = this.cloneList(this.itemsGroups);
    }
  }
  updateFilterTwo(eventList) {
    if (eventList && eventList.length > 0) {
      this.filterdItemlistTwo = eventList;
    } else {
      this.filterdItemlistTwo = this.cloneList(this.itemlist);
    }
  }
  ngOnInit() {
    this.incomingfirstOpen();
    this.numericParams = { params: { decimals: 2, value: 5 } };
    this.initializeGrid();
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.responseobj.POSIncomingDetails = [];
    this.service = this.incomingService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.pageNumber = this.router.getCurrentNavigation().extras as number;
    this.breakSave = false;
    this.disableControlEdit = imp.quickMode.queryMode;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  initializeGrid() {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = [
      "Add",
      // "Edit",
      // "Delete",
      // "Update",
      "Cancel",
      "Search",
      // "PdfExport",
      "ExcelExport"
    ];
    this.ddParams = { params: { value: "Beverages" } };
    this.editOptions = {
      showDeleteConfirmDialog: true,
      allowEditing: true,
      allowAdding: false,
      allowDeleting: true,
      mode: "Normal"
    };
    this.filterOptions = { type: "Menu" };
    this.commands = [
      {
        type: "Edit",
        buttonOption: { cssClass: "e-flat", iconCss: "e-edit e-icons" }
      },
      {
        type: "Delete",
        buttonOption: { cssClass: "e-flat", iconCss: "e-delete e-icons" }
      },
      {
        type: "Save",
        buttonOption: { cssClass: "e-flat", iconCss: "e-update e-icons" }
      },
      {
        type: "Cancel",
        buttonOption: { cssClass: "e-flat", iconCss: "e-cancel-icon e-icons" }
      }
    ];
  }

  closeAllPopovers() {
    this.allPopovers.forEach((p) => p.hideFromPopover());
  }
  addDetail(item: any) {
    //  let detail: any; // ItemTransferRequestDetailsModel = new ItemTransferRequestDetailsModel();
    this.responseobj.POSIncomingDetails.push({
      Id: 0,
      ItemId: item.Id,
      ItemName: item.Name,
      //ItemUnits: this.unitList,
      ItemDocumentId: this.stockhelper.getItemDocumentId(item.Id, this.items),
      CostAverage: item.ItemCost,
      GItemId: item.GeneralItemData !== undefined && item.GeneralItemData !== null ? item.GeneralItemData.ItemId : null,
      GUnitId: item.GeneralItemData !== undefined && item.GeneralItemData !== null ? item.GeneralItemData.UnitId : null,
      GSizeFromMainUnit:
        item.GeneralItemData !== undefined && item.GeneralItemData !== null ? item.GeneralItemData.Quantity : 1,
      GeneralItem:
        item.GeneralItemData !== undefined && item.GeneralItemData !== null ? item.GeneralItemData.Name : null,
      Quantity: 0,
      GItemDocumentId:
        item.GeneralItemData !== undefined && item.GeneralItemData !== null
          ? item.GeneralItemData.ItemDocumentId
          : null,
      GUnitDocumentId:
        item.GeneralItemData !== undefined && item.GeneralItemData !== null ? item.GeneralItemData.UnitDocumentId : null
    });
    this.checkDuplication(this.responseobj.POSIncomingDetails[this.responseobj.POSIncomingDetails.length - 1]);
  }
  incomingfirstOpen() {
    this.scrFirstOpen().subscribe(() => {
      if (this.responseobj.Count === 0) {
        this.responseobj.POSIncomingDetails = [];
      }
      this.initiateData();
    });
  }
  initAfterNew() {
    this.afterNew({ dateFields: ["DocumentDate"] }).subscribe(() => {
      this.responseobj = this.responsedata;
      this.responseobj.POSIncomingDetails = [];
      this.responseobj.DocumentDate = new Date();
      if (this.responseobj.StockName && this.responseobj.StockName !== null) {
        this.store = this.responseobj.StockName;
      }
      this.initiateData();
    });
  }
  initiateData() {
    this.itemsGroups = this.responseobj.ItemGroups;
    this.filterdItemlist = this.cloneList(this.itemsGroups);
    this.units = this.responseobj.Units;
    this.StockList = this.responseobj.StockList;
    this.kitchens = this.responseobj.Kitchens;
    this.listfields = { text: "Name", value: "Id" };
    this.items = [];
    this.GItems = [];
    this.itemsGroups != null
      ? this.itemsGroups.forEach((x) => {
          if (x && x.Items && x.Items.length !== 0) {
            var gItems = x.Items.filter((t) => t.IsGeneral);
            x.Items = x.Items.filter((t) => !t.IsGeneral);
            x.Items.forEach((element) => {
              this.items.push(element);
            });
            gItems.forEach((element) => {
              this.GItems.push(element);
            });
          }
        })
      : [];
    // tslint:disable-next-line: curly
    if (this.responseobj.StockName && this.responseobj.StockName !== null) this.store = this.responseobj.StockName;

    if (this.responseobj.Id == null || this.responseobj.Id === 0) {
      this.responseobj.DocumentDate = new Date();
    }
    this.firsFill();
  }
  quickEvents(event: imp.quickAction): void {
    // this.disableControlEdit = event;
    switch (event) {
      case imp.quickAction.afterNew:
        this.initAfterNew();
        this.disableControlEdit = false;
        break;
      case imp.quickAction.afterAdd:
        this.disableControlEdit = true;
        this.afterAdd();
        break;
      case imp.quickAction.afterModify:
        // this.initAfterModify();
        this.afterModify();
        this.disableControlEdit = false;

        break;
      case imp.quickAction.afterUndo:
        this.disableControlEdit = true;
        break;
      case imp.quickAction.afterUpdate:
        this.disableControlEdit = true;
        break;
      case imp.quickAction.beforeAdd:
        this.checkAllValidationsBeforSave();
        break;
    }
  }
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  returnobjEvent(event) {
    this.responseobj = event;
  }

  clearobject() {
    this.responseobj = null;
    this.store = "مخزن التحويل";
  }
  beforeinsert() {
    if (!(this.responseobj.POSIncomingDetails.length > 0)) return;
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
    this.filterdItemlistTwo = this.cloneList(this.itemlist);
  }
  loadItems(itemgroup: any) {
    this.itemlist = [];
    if (itemgroup.Items && itemgroup.Items.length != 0) {
      this.itemlist = this.itemsGroups.filter((x) => x.Id === itemgroup.Id).map((i) => i.Items)[0];
      this.filterdItemlistTwo = this.cloneList(this.itemlist);
    }
  }
  getAvailableQuantity(detail: any) {
    let stockModel = {
      GItemId: detail.GItemId != null ? detail.GItemId : detail.ItemId,
      GItemDocumentId: detail.GItemDocumentId != null ? detail.GItemDocumentId : detail.ItemDocumentId,
      ItemId: detail.ItemId,
      ItemDocumentId: detail.ItemDocumentId,
      KitchenId: detail.StockId,
      Type: 3
    };
    this.stockhelper.getAvailableQuantity(stockModel).subscribe((res) => {
      detail.KitchenAvailableQuantity =
        detail.SizeFromMainUnit !== undefined
          ? res.KitchenAvailableQuantity / detail.SizeFromMainUnit
          : res.KitchenAvailableQuantity;
      detail.StockAvailableQuantity =
        detail.SizeFromMainUnit !== undefined
          ? res.StockAvailableQuantity / detail.SizeFromMainUnit
          : res.StockAvailableQuantity;
    });
  }
  gtSelectedUnits(detail) {
    if (this.items && this.units) {
      var units = [];
      var selectedList = this.items.filter((x) => x.Id === detail.ItemId)[0];
      if (selectedList) {
        selectedList.ItemUnits.forEach((x) => {
          var unit = this.units.filter((u) => u.Id === x.UnitId)[0];
          units.push(unit);
        });
        detail.ItemUnits = selectedList.ItemUnits;
      }
      this.unitList = units;
      return units;
    }
  }
  // Chehck Dublication
  checkDuplication = function (item) {
    var recordFoundIndex = -1;
    var incomingList = this.responseobj.POSIncomingDetails;
    var itemIndex = this.responseobj.POSIncomingDetails.indexOf(item);
    // tslint:disable-next-line: only-arrow-functions
    recordFoundIndex = this.responseobj.POSIncomingDetails.findIndex(function (element) {
      // tslint:disable-next-line: no-// debugger
      return (
        element.ItemId === item.ItemId &&
        element.UnitId === item.UnitId &&
        element.StockId === item.StockId &&
        incomingList.indexOf(element) !== itemIndex
      );
    });
    // not first record
    if (recordFoundIndex !== -1 && itemIndex !== -1) {
      this.isDuplicated = 1;
      item.errorDuplication = true;
      this.toastr.error("Duplicated Item", "Incoming");
      return false;
    } else {
      item.errorDuplication = false;
      this.isDuplicated = 0;
    }
  };
  calcGItemQuantity(detail) {
    if (detail.GSizeFromMainUnit && detail.Quantity && detail.SizeFromMainUnit) {
      return detail.GSizeFromMainUnit * detail.Quantity * detail.SizeFromMainUnit;
    }
  }
  checkQuantity(detail) {
    if (detail.Quantity > detail.StockAvailableQuantity) {
      detail.quantityError = 1;
      this.toastr.error("الكميه يجب ان تكون اقل من او تساوي الكميه المتوفرة في المخزن", "Incoming");
    } else {
      detail.quantityError = 0;
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
    this.checkDuplication(detail);
  }
  checkAllValidationsBeforSave() {
    // first check if has details then check dupplication and quantity
    if (!(this.responseobj.POSIncomingDetails.length > 0)) {
      this.breakSave = true;
      this.toastr.error("لا يمكن الحفظ لا بد ان يحتوي المستند على سجل واحد على الاقل", "Incoming");
      return;
    }
    this.responseobj.POSIncomingDetails.forEach((element) => {
      if (element.errorDuplication) {
        this.breakSave = true;
        this.toastr.error("لا يمكن الحفظ, يوجد سجلات مكرره", "Incoming");
        return;
      }
      if (element.quantityError) {
        this.breakSave = true;
        this.toastr.error("لا يمكن الحفظ,الكميه يجب ان تكون اقل من او تساوي الكميه المتوفرة في المخزن", "Incoming");
        return;
      }
    });
  }
  deleteRow(index: any) {
    // if (this.responseobj.DocumentId === null)
    if (index === 0) {
      if (confirm("Are you want to delete last record ??")) {
        this.responseobj.POSIncomingDetails.splice(index, 1);
      }
    } else {
      this.responseobj.POSIncomingDetails.splice(index, 1);
    }
  }
  setStock(stock: any) {
    // this.responseobj.StockId = stock.Id;
    // this.store = stock.Name;
    // this.closeAllPopovers();
  }

  NewEvent(event) {
    this.clearobject();
    this.incomingfirstOpen();
  }

  openkeyboardNum() {
    this.Showingkeyboard = true;
  }
  closekeyboardNum() {

    this.Showingkeyboard = false;
  }
}
