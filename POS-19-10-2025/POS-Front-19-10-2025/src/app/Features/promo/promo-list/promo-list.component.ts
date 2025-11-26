import * as imp from "../promoimport";
import { Component, ViewChild } from "@angular/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from "../promoimport";
@Component({
  selector: "app-promo-list",
  templateUrl: "./promo-list.component.html",
  styleUrls: ["./promo-list.component.scss"]
})
export class PromoListComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Declartions
  public href: string = "";
  [key: string]: any;
  @ViewChild("Grid", { static: false }) grid: imp.GridComponent;
  //#endregion

  //#region Constructor
  constructor(
    public PromoSer: imp.PromoService,
    public toast: imp.ToastrService,
    public messages: imp.HandlingBackMessages,
    public SettingSer: imp.SettingService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public Router: imp.Router,
    private route: ActivatedRoute
  ) {
    super(toast, messages, SettingSer, Router);
    this.initializeobjects();
  }
  //#endregion

  //#region Angular Life Cycle
  ngOnInit(): void {
    // this.currentroutes = this.Router.url.split("/").slice(1);
    // console.log(this.router.url.split("/"));
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
      // if(this.showPrint)
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
    this.service = this.PromoSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/promo";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
}
