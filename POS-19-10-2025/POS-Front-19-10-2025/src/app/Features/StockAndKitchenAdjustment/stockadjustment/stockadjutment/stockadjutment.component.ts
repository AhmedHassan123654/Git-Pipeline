import * as imp from "../stockadjustment-imports";
import { Component, Input, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { NgForm } from "@angular/forms";
import { InventoryTypeEnum } from "src/app/core/Enums/InventoryTypeEnum";
import { ComboBoxComponent } from "@syncfusion/ej2-angular-dropdowns";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { StockhelperService } from "src/app/core/Services/Transactions/stockhelper.service";
@Component({
  selector: "app-stockadjutment",
  templateUrl: "./stockadjutment.component.html",
  styleUrls: ["./stockadjutment.component.scss"]
})
export class StockadjutmentComponent extends imp.general implements imp.OnInit {
  [key: string]: any;
  Showingkeyboard: boolean = false;
  enableStockDocId: boolean = false;
  enableKitchenDocId: boolean = false;
  disableControlEdit = true;
  @ViewChild("frmRef") frmRef;
  @ViewChild("StockDocumentId") StockDocumentId: ComboBoxComponent;

  constructor(
    public stockadjutmentService: imp.StockadjustmentService,
    private toastr: imp.ToastrService,
    private toastrMessage: imp.HandlingBackMessages,
    public datepipe: imp.DatePipe,
    private router: imp.Router,
    private route: imp.ActivatedRoute,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public stockhelper: StockhelperService
  ) {
    super();
    this.initializeobjects();
  }
  ngOnInit(): void {
    this.stockadjutmentfirstOpen();
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.stockadjutmentService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.pageNumber = this.router.getCurrentNavigation().extras as number;
    this.disableControlEdit = true;
    this.inventorylistFlds = { text: "FlagName", value: "FlagValue" };
    this.listFlds = { text: "FlagName", value: "FlagValue" };
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  stockadjutmentfirstOpen() {
    this.scrFirstOpen().subscribe(() => {
      this.actionsAfterEditFromGrid();
      this.initiateData();
    });
  }
  initiateData() {
    this.items = this.responseobj.Items;
    this.units = this.responseobj.Units;
    this.InventoriesList = this.responseobj.InventoriesList;
  }
  actionsAfterEditFromGrid() {
    if (this.request.PageNumber != null) {
      this.responseobj.screenPermission.Save = false;
      this.disableControlEdit = true;
    }
  }
  filterBasedType(responseobj) {
    this.responseobj.StockDocumentId = null;
    this.responseobj.InventoryDocumentId = null;
    this.responseobj.POSStockAdjustmentDetails = [];
    let type = 0;
    if (responseobj.name === "inventory") {
      type = 1;
    } else if (responseobj.name === "kitchen") {
      type = 2;
    }
    if (responseobj !== null && this.inventoriesList !== null && this.inventoriesList.length > 0)
      this.filterdInventoriesList = this.inventoriesList.filter((x) => x.Type == type);
  }
  fillDetailsBasedOnInventory(inventoryDocumentId) {
    if (!this.disableControlEdit) this.responseobj.POSStockAdjustmentDetails = [];
    if (inventoryDocumentId !== undefined && inventoryDocumentId !== null) {
      let inventory = this.inventoriesList?.filter((x) => x.DocumentId == inventoryDocumentId)[0];
      if (inventory != null) {
        this.responseobj.StockDocumentId = inventory.StockDocumentId;
        this.responseobj.InventoryDocumentNumber = inventory.FlagName;
        inventory.POSInventoryDetails.forEach((detail) => {
          let stockadjustmentDetail = {
            ItemId: detail.ItemId,
            UnitId: detail.UnitId,
            Quantity: detail.Quantity,
            MainUnitId: detail.MainUnitId,
            GItemId: detail.GItemId,
            GUnitId: detail.GUnitId,
            SizeFromMainUnit: detail.SizeFromMainUnit,
            GSizeFromMainUnit: detail.GSizeFromMainUnit,
            AlternativeItemId: detail.AlternativeItemId,
            ItemDocumentId: detail.ItemDocumentId, // this.stockhelper.getItemDocumentId(detail.ItemId,this.items),
            UnitDocumentId: detail.UnitDocumentId, // this.stockhelper.getUnitDocumentId(detail.UnitId,this.units),
            MainUnitDocumentId: this.stockhelper.getUnitDocumentId(detail.MainUnitId, this.units),
            GItemDocumentId: detail.GItemDocumentId, // this.stockhelper.getItemDocumentId(detail.GItemId,this.items),
            GUnitDocumentId: detail.GUnitDocumentId, // this.stockhelper.getUnitDocumentId(detail.GUnitId,this.units),
            AlternativeItemDocumentId: detail.AlternativeItemDocumentId // this.stockhelper.getItemDocumentId(detail.AlternativeItemId,this.items)
          };
          this.responseobj.POSStockAdjustmentDetails.push(stockadjustmentDetail);
        });
      }
    }
    if (!this.disableControlEdit) {
      this.resetTotals();
      if (inventoryDocumentId != null) {
        var documentdate = this.responseobj.DocumentDate;
        this.stockadjutmentService.assignAvailabeQuantyToDetails(this.responseobj).subscribe((res) => {
          this.responseobj.POSStockAdjustmentDetails = res;
          this.calculateTotalIncrease();
          this.calculateTotalDeficit();
        });
        this.responseobj.DocumentDate = documentdate;
      }
    }
  }
  assignAccountId(accountDocumentId) {
    if (accountDocumentId !== undefined && accountDocumentId !== null) {
      let account = this.AccountsList?.filter((x) => x.FlagValue == accountDocumentId)[0];
      if (account != null) {
        this.responseobj.AccountId = account.Id;
      }
    }
  }
  disableStockType() {
    return this.responseobj.POSStockAdjutmentDetails?.length > 0;
  }
  calculateTotalIncrease() {
    if (this.responseobj.POSStockAdjustmentDetails !== undefined) {
      var totalIncrease = this.responseobj.POSStockAdjustmentDetails.filter((x) => x.Deficit > 0).map(
        (i) => i.Deficit * i.CostAverage
      );

      this.responseobj.TotalIncrease =
        totalIncrease.length > 0
          ? totalIncrease.reduce(function (a, b) {
              return a + b;
            })
          : 0;
    }
  }
  calculateTotalDeficit() {
    if (this.responseobj.POSStockAdjustmentDetails !== undefined) {
      var totalDeficit = this.responseobj.POSStockAdjustmentDetails?.filter((x) => x.Deficit < 0)?.map(
        (i) => i.Deficit * i.CostAverage
      );

      this.responseobj.TotalDeficit =
        totalDeficit.length > 0
          ? totalDeficit.reduce(function (a, b) {
              return a + b;
            })
          : 0;
    }
  }
  resetTotals() {
    this.responseobj.TotalIncrease = 0;
    this.responseobj.TotalDeficit = 0;
  }
  afterPag(event: unknown): void {
    this.enableStockDocId = false;
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
    switch (event) {
      case imp.quickAction.afterNew:
        this.initAfterNew();
        this.disableControlEdit = false;
        this.enableStockDocId = false;
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd().subscribe((res) => {
          this.disableControlEdit = true;
        });

        break;
      case imp.quickAction.afterModify:
        this.afterModify().subscribe(() => {
          this.disableControlEdit = false;
          var inventoryElement = <HTMLInputElement>document.getElementById("inventory");
          inventoryElement.disabled = true;
        });
        break;
      case imp.quickAction.afterUndo:
        this.disableControlEdit = true;
        break;
      case imp.quickAction.afterUpdate:
        this.disableControlEdit = true;
        break;
    }
  }

  initAfterNew() {
    this.afterNew({ dateFields: ["DocumentDate"] }).subscribe(() => {
      this.responseobj = this.responsedata;
      this.inventoriesList = this.responseobj.InventoriesList;
      this.responseobj.StockAdjutmentDetails = [];
      this.responseobj.DocumentDate = new Date();
      this.filterdInventoriesList = [];
    });
  }
  CheckEdit() {
    if (this.pageNumber > 0) {
      return true;
    } else return false;
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
      }
      this.unitList = units;
      return units;
    }
  }

  deleteRow(index: any) {
    if (this.responseobj.StockAdjutmentDetails.length === 1) {
      if (confirm("Are you want to delete last record ??")) this.responseobj.StockAdjutmentDetails.splice(index, 1);
    } else this.responseobj.StockAdjutmentDetails.splice(index, 1);
  }
}
