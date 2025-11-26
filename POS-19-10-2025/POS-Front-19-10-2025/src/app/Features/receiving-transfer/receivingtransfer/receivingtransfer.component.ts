import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { StockhelperService } from "src/app/core/Services/Transactions/stockhelper.service";
import * as imp from "../receivingtransfer-imports";

@Component({
  selector: "app-receivingtransfer",
  templateUrl: "./receivingtransfer.component.html",
  styleUrls: ["./receivingtransfer.component.css"]
})
export class ReceivingtransferComponent extends imp.general implements imp.OnInit {
  [key: string]: any;
  inputdisable: boolean = true;
  disable: boolean = true;

  constructor(
    public receivingtransferService: imp.ReceivingtransferService,
    private toastr: imp.ToastrService,
    private toastrMessage: imp.HandlingBackMessages,
    public datepipe: imp.DatePipe,
    private router: imp.Router,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    private route: imp.ActivatedRoute,
    public stockhelper: StockhelperService
  ) {
    super();
    this.initializeobjects();
  }
  @ViewChild("grid") grid: imp.GridComponent;
  @ViewChild("scrollbar") scrollbar: imp.PerfectScrollbarComponent;

  ngOnInit() {
    this.receivingtransferfirstOpen();
    this.initializeGrid();
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.receivingtransferService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.flagQueryM = imp.quickMode.queryMode;
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
    // this.unitParams = {
    //   params: {
    //     dataSource: this.Details,
    //     fields: { text: "Item", value: "ItemUnit" },
    //     value: "Item",
    //   },
    // };
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
  disableEdit() {
    // if(this.responseobj.Sent !=undefined && this.responseobj.Sent )
    //   {  this.responseobj.screenPermission.Edit= false;
    //     this.responseobj.screenPermission.Delete= false;
    //   }
    //   else{
    //     this.responseobj.screenPermission.Edit= true;
    //     this.responseobj.screenPermission.Delete= true;
    //   }
    if (this.responseobj.ReceivingTransferDetails) {
      this.responseobj.screenPermission.Edit = true;
      this.responseobj.screenPermission.Delete = true;
    } else {
      this.responseobj.screenPermission.Edit = false;
      this.responseobj.screenPermission.Delete = false;
    }
  }
  receivingtransferfirstOpen() {
    this.pagedResultInput = new imp.PagedResultInput();
    this.scrFirstOpen().subscribe(() => {
      this.disableEdit();
      this.initiateData();
    });
  }
  quickEvents(event: imp.quickAction): void {
    // this.flagQueryM = event;
    switch (event) {
      case imp.quickAction.afterNew:
        this.initAfterNew();
        this.flagQueryM = false;
        this.inputdisable = false;
        this.disable = false;
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd().subscribe((res) => {
          this.disableEdit();
          this.inputdisable = true;
        });
        break;
      case imp.quickAction.afterModify:
        // this.initAfterModify();
        this.afterModify().subscribe((res) => {
          this.disableEdit();
        });
        this.flagQueryM = false;
        this.inputdisable = true;
        this.disable = true;

        break;
      case imp.quickAction.afterUndo:
        // this.initAfterModify();
        this.flagQueryM = true;
        this.inputdisable = true;
        break;
      // case imp.quickAction.afterDelete:
      //   // debugger
      //   if(!this.responseobj.ReceivingTransferDetails.ReceivingTransferId || !this.responseobj.ReceivingTransferDetails.ItemId)
      //   {
      //     this.responseobj.screenPermission.Edit= false;
      //     this.responseobj.screenPermission.Delete= false;
      //   }
      //   break;
    }
  }
  initAfterNew() {
    this.afterNew({ dateFields: ["DocumentDate"] }).subscribe(() => {
      this.responseobj = this.responsedata;
      this.responseobj.ReceivingTransferDetails = [];
      this.responseobj.DocumentDate = new Date();
      this.initiateData();
    });
  }
  initAfterModify() {

    this.initiateData();
  }
  initiateData() {
    //  this.receivingtransfer = res as any; //ItemTransferRequestModel;
    //this.receivingtransfer.IsSync = false;

    this.itemsGroups = this.responseobj.ItemGroups;

    this.units = this.responseobj.Units;
    this.StockList = this.responseobj.StockList;
    // this.listfields = { text: 'Name', value: 'Id' };
    this.items = [];
    this.itemsGroups != null
      ? this.itemsGroups.forEach((x) => {
          // tslint:disable-next-line: triple-equals
          if (x && x.Items && x.Items.length != 0)
            x.Items.forEach((element) => {
              this.items.push(element);
            });
        })
      : [];

    if (this.responseobj.Id == null || this.responseobj.Id == 0) {
      this.responseobj.DocumentDate = new Date();
    }
  }
  showServerTransfers() {
    this.receivingtransferService.getServerTransfers().subscribe((res) => {
      this.transfers = res;
    });
  }
  autoInsertReceivingTransfer() {
    this.receivingtransferService.autoInsertReceivingTransfer().subscribe((res) => {
    });
  }
  onTransferChange(transfer: any, index: any) {
    this.transferSelected = !transfer.Checked;
    //let x = event.target.checked;
    // //if (transfer.Checked) {
    this.transfers.forEach((x) => {
      x.Checked = false;
    });
    this.transfers[index].Checked = this.transferSelected;
    (this.transferId = -1), (this.transferId = index);
  }
  fillReceivingTransfer() {
    if (this.transferSelected) {
      let transfer: any;
      transfer = this.transfers[this.transferId];
      this.responseobj.FromStockId = transfer.StockId;
      this.responseobj.FromStockDocId = this.StockList.filter((x) => x.Id == transfer.StockId)[0]?.FlagValue;
      // this.receivingtransfer.StockId = 1;
      this.responseobj.TransferId = transfer.Id;
      //  this.receivingtransfer.DocumentNumber = transfer.DocumentId;
      this.responseobj.TransferDocumentId = transfer.DocumentId;
      this.responseobj.ReceivingTransferDetails = transfer.TransferDetails;
      this.responseobj.ReceivingTransferDetails.forEach((detail) => {
        // detail.ReceivingTransferId = this.receivingtransfer.Id;
        detail.Id = 0;
        detail.TransferQuantity = detail.Quantity - 0;
        detail.ReceiptQuantity = detail.Quantity;
        var selectedItem = this.items.filter((x) => x.Id === detail.ItemId)[0];
        detail.ItemDocumentId = this.stockhelper.getItemDocumentId(detail.ItemId, this.items);
        detail.UnitDocumentId = this.stockhelper.getUnitDocumentId(detail.UnitId, this.units);
        if (selectedItem) {
          detail.ItemUnits = selectedItem.ItemUnits;
          this.setSizeFromMainUnit(detail);
          detail.CostAverage = selectedItem.ItemCost;
          var mainUnit = detail.ItemUnits.filter((x) => x.MainUnit)[0];
          if (mainUnit) {
            detail.MainUnitId = mainUnit.UnitId;
            detail.MainUnitDocumentId = this.stockhelper.getUnitDocumentId(detail.MainUnitId, this.units);
          }
          (detail.GItemId = selectedItem.GeneralItemData ? selectedItem.GeneralItemData.ItemId : null),
            (detail.GUnitId =
              selectedItem.GeneralItemData && selectedItem.GeneralItemData !== null
                ? selectedItem.GeneralItemData.UnitId
                : null),
            (detail.GSizeFromMainUnit =
              selectedItem.GerneralItemData && selectedItem.GeneralItemData !== null
                ? selectedItem.GerneralItemData.Quantity
                : 1);
          if (selectedItem.GeneralItemData && selectedItem.GeneralItemData !== null)
            detail.GItemDocumentId = selectedItem.GeneralItemData.ItemDocumentId;
          if (selectedItem.GeneralItemData && selectedItem.GeneralItemData !== null)
            detail.GUnitDocumentId = selectedItem.GeneralItemData.UnitDocumentId;
        }
      });
    }
  }
  setSizeFromMainUnit(detail) {
    var sizeFromMainUnit = detail.ItemUnits.filter((x) => x.UnitId === Number(detail.UnitId))[0];
    //var mainUnit = detail.ItemUnits.filter((x) => x.MainUnit)[0];
    if (sizeFromMainUnit) {
      detail.SizeFromMainUnit = sizeFromMainUnit.SizeFromMainUnit;
      // detail.MainUnitId = mainUnit.UnitId;
      // this.calcGItemQuantity(detail);
    }
  }

  deleteRow(index: any) {
    //if (this.itemtransferrequest.DocumentId === null)
    if (index == 0) {
      if (confirm("Are you want to delete last record ??")) this.responseobj.ReceivingTransferDetails.splice(index, 1);
    } else this.responseobj.ReceivingTransferDetails.splice(index, 1);
  }
  gtSelectedUnits(detail) {
    if (this.items && this.units) {
      var units = [];
      // var selectedList=any;
      //   selectedList.POSItemUnits = [];
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
  afterPag(event: unknown): void {
    // this.disableEdit();
    this.formPaging({ formObj: event });
  }
  returnobjEvent(event) {
    this.receivingtransfer = event;
    //this.cashreceiptobj.Date = this.datepipe.transform(new Date(this.cashreceiptobj.Date), 'yyyy-MM-dd');
    //this.calenderValue = this.datepipe.transform(new Date(this.cashreceiptobj.Date), 'MM/dd/yyyy');
  }
  CheckEdit() {
    if (this.pageNumber > 0) {
      return true;
    } else return false;
  }
  clearobject() {
    this.receivingtransfer = null;
  }
  NewEvent(event) {
    this.clearobject();
    this.receivingtransferfirstOpen();
  }

  openkeyboardNum() {
    this.Showingkeyboard = true;
  }
  closekeyboardNum() {

    this.Showingkeyboard = false;
  }
  // rowSelected(args: imp.RowSelectEventArgs) {
  //   const selectedrecords: object[] = this.grid.getSelectedRecords(); // Get the selected records.

  //   console.log(selectedrecords);

  //   // Ahmed .. Make model fro this data after that pass data to left grid
  //   // like =>> this.detials= selectedrecords;
  // }
  getReceiptQuantity(detail: any) {
    if (detail.ReceiptQuantity > detail.TransferQuantity) {
      detail.TransferQuantity = detail.TransferQuantity;
      detail.ReceiptQuantity = detail.TransferQuantity;
    }
  }
}
