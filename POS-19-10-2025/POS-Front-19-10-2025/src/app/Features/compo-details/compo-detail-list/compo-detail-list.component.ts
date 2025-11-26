import { Component, OnInit, ViewChild } from "@angular/core";
import { PrintDetailModel } from "src/app/core/Models/Shared/print-detail-model";
import { ComboService } from "src/app/core/Services/Transactions/combo.service";
import { CashreceiptService } from "../../cash-receipt/cash-receiptimport";
import { CustomerOrderService } from "../../customer-order/customerorderimport";
import {
  GeneralGrid,
  GridComponent,
  HandlingBackMessages,
  LanguageSerService,
  Router,
  SettingService,
  ToastrService
} from "../../manage-order/manageorderimport";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-compo-detail-list",
  templateUrl: "./compo-detail-list.component.html",
  styleUrls: ["./compo-detail-list.component.scss"]
})
export class CompoDetailListComponent extends GeneralGrid implements OnInit {
  //#region Declartions
  [key: string]: any;
  public orderDateFormat: any = { type: "date", format: "dd-MM-yyyy hh:mm a" };
  @ViewChild("Grid", { static: false }) grid: GridComponent;
  //#endregion
  //#region Constructor
  constructor(
    public comboServ: ComboService,
    public cashreceiptSer: CashreceiptService,
    public toast: ToastrService,
    public messages: HandlingBackMessages,
    public SettingSer: SettingService,
    public router: Router,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    super(toast, messages, SettingSer, router);
    this.initializeobjects();
  }
  //#endregion
  //#region Angular Life Cycle
  ngOnInit(): void {
    this.initScreen();
  }
  initScreen() {
    this.GetGrideList().subscribe(() => {
      this.toolbarList = [];
      if (this.showNew) {
        this.toolbarList.push({
          text: "Add",
          tooltipText: "Add",
          prefixIcon: "e-add",
          id: "Add"
        });
      }
      if (this.showView)
        this.toolbarList.push({
          text: "",
          tooltipText: "View",
          prefixIcon: "e-view",
          id: "View"
        });
      if (this.showEdit)
        this.toolbarList.push({
          text: "",
          tooltipText: "Edit",
          prefixIcon: "e-edit",
          id: "Edit"
        });
      if (this.showDelete)
        this.toolbarList.push({
          text: "",
          tooltipText: "Delete",
          prefixIcon: "e-delete",
          id: "Delete"
        });
      if (this.showPrint)
        // this.toolbarList.push({ text: '', tooltipText: 'Print', prefixIcon: 'e-print', id: "Print" });
        this.toolbarOptions = this.toolbarList;
    });
    this.initializeGrid();
    setTimeout(() => {
      this.DisabledGridButton();
    }, 300);
  }

  //#endregion

  //#region CashReceiptList Methods

  initializeobjects(): void {
    this.responseobj = {};
    if (!this.printDetailobj) this.printDetailobj = new PrintDetailModel();
    this.service = this.comboServ;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/comboProducts";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
}
