import { Component, OnInit, ViewChild } from "@angular/core";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { CancellationReasonService } from "src/app/core/Services/Transactions/cancellationReason.service";
import {
  GeneralGrid,
  HandlingBackMessages,
  LanguageSerService,
  Router,
  SettingService,
  ToastrService,
  TranslateService
} from "../../adminstration/permission-imports";

@Component({
  selector: "app-cancellation-reason-list",
  templateUrl: "./cancellation-reason-list.component.html",
  styleUrls: ["./cancellation-reason-list.component.scss"]
})
export class CancellationReasonListComponent extends GeneralGrid implements OnInit {
  //#region Declartions
  [key: string]: any;
  public orderDateFormat: any = { type: "date", format: "dd-MM-yyyy hh:mm a" };
  @ViewChild("Grid", { static: false }) grid: GridComponent;
  //#endregion
  //#region Constructor
  constructor(
    public CancellationReasonSer: CancellationReasonService,
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
    this.service = this.CancellationReasonSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/CancellationReason";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
}
