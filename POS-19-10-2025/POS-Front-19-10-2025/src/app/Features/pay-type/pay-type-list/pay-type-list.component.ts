import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../pay-type-import";
@Component({
  selector: "app-pay-type-list",
  templateUrl: "./pay-type-list.component.html",
  styleUrls: ["./pay-type-list.component.scss"]
})
export class PayTypeListComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Constructor
  constructor(
    public PayTypeSer: imp.PayTypeService,
    public toast: imp.ToastrService,
    public messages: imp.HandlingBackMessages,
    public SettingSer: imp.SettingService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    public Router: imp.Router
  ) {
    super(toast, messages, SettingSer, Router);
    this.initializeobjects();
  }
  //#endregion
  //#region Angular Life Cycle
  ngOnInit(): void {
    this.GetGrideList().subscribe(() => {
      this.toolbarList = [];
      if (this.showNew)
        this.toolbarList.push({
          text: "",
          tooltipText: "Add",
          prefixIcon: "e-add",
          id: "Add"
        });
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
      /* if(this.showPrint)
  this.toolbarList.push({ text: '', tooltipText: 'Print', prefixIcon: 'e-print', id: "Print" }); */
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
    this.service = this.PayTypeSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/PayType";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
}
