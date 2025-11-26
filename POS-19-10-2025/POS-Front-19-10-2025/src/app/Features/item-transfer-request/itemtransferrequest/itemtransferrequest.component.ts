/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-// debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as imp from "../itemtransferrequest-imports";
import { Component, ViewChildren, ViewChild, Input } from "@angular/core";
import { PopoverContentComponent } from "../itemtransferrequest-imports";
import { NgForm } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { PrintCashirComponent } from "src/app/Features/common/print-cashir/print-cashir.component";
import { Observable } from "rxjs";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { PrintDetailModel } from "src/app/core/Models/Shared/print-detail-model";
declare var $: any;
@Component({
  selector: "app-itemtransferrequest",
  templateUrl: "./itemtransferrequest.component.html",
  styleUrls: ["./itemtransferrequest.component.css"]
})
export class ItemtransferrequestComponent extends imp.general implements imp.OnInit {
  [key: string]: any;
  @ViewChild("frmRef") frmRef;

  Showingkeyboard: boolean = false;

  @ViewChildren(imp.PopoverContentComponent)
  allPopovers: imp.QueryList<imp.PopoverContentComponent>;
  public Details;
  config: any;
  printDetailobj: PrintDetailModel = new PrintDetailModel();
  @ViewChild("grid")
  grid: imp.GridComponent;
  constructor(
    public itemtransferrequestService: imp.ItemtransferrequestService,
    private toastr: imp.ToastrService,
    private toastrMessage: imp.HandlingBackMessages,
    public datepipe: imp.DatePipe,
    private router: imp.Router,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private route: imp.ActivatedRoute,
    private orderServ: OrderService
  ) {
    super();
    this.initializeobjects();
  }
  itemtransferrequest: any;
  store = "مخزن التحويل";
  ngOnInit() {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));

    this.translate.use(this.language);
    this.itemTransferRequestfirstOpen();
    this.numericParams = { params: { decimals: 2, value: 5 } };
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.itemtransferrequestService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.disableControlEdit = imp.quickMode.queryMode;
  }
  updateFilterTwo(eventList) {
    if (eventList && eventList.length > 0) {
      this.filterdItemlistTwo = eventList;
    } else {
      this.filterdItemlistTwo = this.cloneList(this.itemsGroups);
    }
  }
  updateFilterOne(eventList) {
    if (eventList && eventList.length > 0) {
      this.filterdItemlist = eventList;
    } else {
      this.filterdItemlist = this.cloneList(this.itemlist);
    }
  }
  closeAllPopovers() {
    this.allPopovers.forEach((p) => p.hideFromPopover());
  }
  addDetail(item: any) {
    // tslint:disable: no-// debugger
    let detail: any; // ItemTransferRequestDetailsModel = new ItemTransferRequestDetailsModel();

    this.responseobj.ItemTransferRequestDetails.push({
      Id: 0,
      ItemId: item.Id,
      ItemName: item.Name,
      ItemUnits: this.unitList
    });

    // tslint:disable: comment-format
  }
  quickEvents(event: imp.quickAction): void {
    // this.disableControlEdit = event;
    switch (event) {
      case imp.quickAction.afterNew:
        this.initAfterNew();
        this.disableControlEdit = false;
        break;
      case imp.quickAction.afterAdd:
        this.initAfterAdd();
        this.disableControlEdit = true;
        break;
      case imp.quickAction.afterModify:
        // this.initAfterModify();
        this.afterModify();
        this.disableControlEdit = false;

        break;
      case imp.quickAction.afterUndo:
        // this.initAfterModify();
        this.disableControlEdit = true;

        break;
    }
  }
  disableEdit() {
    if (this.responseobj.Sent != undefined && this.responseobj.Sent) {
      this.responseobj.screenPermission.Edit = false;
      this.responseobj.screenPermission.Delete = false;
    } else {
      this.responseobj.screenPermission.Edit = true;
      this.responseobj.screenPermission.Delete = true;
    }
  }
  initAfterNew() {
    this.afterNew({ dateFields: ["DocumentDate"] }).subscribe(() => {
      this.responseobj = this.responsedata;
      this.responseobj.ItemTransferRequestDetails = [];
      this.responseobj.DocumentDate = new Date();
      if (this.responseobj.StockName && this.responseobj.StockName !== null) this.store = this.responseobj.StockName;
      this.initiateData();
    });
  }
  initAfterModify() {
    // this.afterModify().subscribe(() => {
    //   this.responseobj=this.responsedata;

    // });
    this.initiateData();
  }
  initAfterAdd() {
    this.afterAdd().subscribe(() => {
      this.disableControlEdit = true;
    });
  }
  itemTransferRequestfirstOpen() {
    this.scrFirstOpen().subscribe(() => {
      this.disableEdit();
      this.initiateData();
    });

    // this.itemtransferrequestService.firstOpen().subscribe((res) => {
  }
  initiateData() {
    //this.responseobj.ItemTransferRequestDetails=[];
    this.itemsGroups = this.responseobj.ItemGroups;
    this.filterdItemlistTwo = this.cloneList(this.itemsGroups);
    this.units = this.responseobj.Units;
    this.StockList = this.responseobj.StockList;
    this.CostCentersList = this.responseobj.CostCentersList;
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
    this.items = this.items.filter((x) => !x.IsGeneral);
    this.firsFill();
  }
  //#region Pagger
  afterPag(event: unknown): void {
    // this.disableEdit();
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
    if (!(this.responseobj.ItemTransferRequestDetails.length > 0)) return;
    // this.toastr.error(
    //   // this.toastrMessage.GlobalMessages(this.itemtransferrequest),
    //   "لا بد من وجود تفاصيل",
    //   this.pagename
    // );
  }
  CheckEdit() {
    if (this.pageNumber > 0) {
      return true;
    } else return false;
  }

  firsFill() {
    this.itemlist = [];
    if (this.itemsGroups[0].Items && this.itemsGroups[0].Items.length != 0) {
      this.itemlist = this.itemsGroups[0].Items.filter((x) => !x.IsGeneral);
    }
    this.filterdItemlist = this.cloneList(this.itemlist);
  }
  loadItems(itemgroup: any) {
    this.itemlist = [];
    if (itemgroup.Items && itemgroup.Items.length != 0) {
      this.itemlist = this.itemsGroups
        .filter((x) => x.Id === itemgroup.Id)
        .map((i) => i.Items)[0]
        .filter((x) => !x.IsGeneral);
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
  gtSelectedUnits(detail) {
    if (this.items && this.units) {
      var units = [];
      // var selectedList=any;
      //   selectedList.ItemUnits = [];
      var selectedList = this.items.filter((x) => x.Id === detail.ItemId)[0];
      if (selectedList) {
        selectedList.ItemUnits.forEach((x) => {
          if (x.IsRequestUnit) {
            var unit = this.units.filter((u) => u.Id === x.UnitId)[0];
            units.push(unit);
          }
        });
      }
      this.unitList = units;
      return units;
    }
  }
  //Chehck Dublication
  checkDuplication = function (item) {
    var recordFoundIndex = -1;
    var transferlist = this.responseobj.ItemTransferRequestDetails;
    var itemIndex = this.responseobj.ItemTransferRequestDetails.indexOf(item);
    recordFoundIndex = this.responseobj.ItemTransferRequestDetails.findIndex(function (element) {
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
    //if (this.itemtransferrequest.DocumentId === null)
    if (index == 0) {
      if (confirm("Are you want to delete last record ??"))
        this.responseobj.ItemTransferRequestDetails.splice(index, 1);
    } else this.responseobj.ItemTransferRequestDetails.splice(index, 1);
  }
  setStock(stock: any) {
    this.responseobj.StockId = stock.Id;
    this.store = stock.Name;
    this.closeAllPopovers();
  }

  NewEvent(event) {
    this.clearobject();
    this.itemTransferRequestfirstOpen();
  }

  openkeyboardNum() {
    this.Showingkeyboard = true;
  }
  closekeyboardNum() {

    this.Showingkeyboard = false;
  }

  printPriview(printCashirPerview) {
    // const order=this.getReportTranslationObj(data);
    //  this.itemtransferrequestService.getById("6241d6a5deac8f1b64d4cb9a").subscribe(
    //   (data: Response)=>{
    //         // Step 4: Another code
    //         // debugger
    //       this.reportData= data;
    //       printCashirPerview(data);
    //       });
    this.model = [];
    this.printDetailobj.LanguageId = 1;
    if (this.printDetailobj.LanguageId == 1) {
      this.model.push(this.responseobj.DocumentId);
      this.myjson = en["Reports"];
      this.model.push(this.myjson);
      this.model.push("ar");
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.model.push(this.responseobj.DocumentId);
      this.myjson = ar["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.model.push(this._formobj.DocumentId);
      this.myjson = tr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.model.push(this._formobj.DocumentId);
      this.myjson = fr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    this.model.push(this.printDetailobj.PrintModelId);
    this.model.push(this.printDetailobj.DestinationId);
    this.model.push(this.printDetailobj.FileFormatId);

    if (this.printDetailobj.DestinationId && this.printDetailobj.DestinationId == 2) {
      this.model.push(this.printDetailobj.Reciever);
      this.model.push(this.printDetailobj.Title);
      this.model.push(this.printDetailobj.Message);
      this.ifPerview = false;
    } else {
      this.ifPerview = true;
    }

    this.itemtransferrequestService.print(this.model).subscribe((data: Response) => {
      // Step 4: Another code
      this.reportData = data;
      printCashirPerview(data);
    });
  }
}
