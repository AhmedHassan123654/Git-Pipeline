import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import Swal from "sweetalert2";
import * as imp from "../ordertypeimpots";
@Component({
  selector: "app-order-types-list",
  templateUrl: "./order-types-list.component.html",
  styleUrls: ["./order-types-list.component.scss"]
})
export class OrderTypesListComponent extends imp.GeneralGrid implements imp.OnInit {
  constructor(
    public orderTypeService: imp.OrderTypeService,
    public toast: imp.ToastrService,
    public messages: imp.HandlingBackMessages,
    public SettingSer: imp.SettingService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    public Rout: imp.Router
  ) {
    super(toast, messages, SettingSer, Rout);
    this.initializeobjects();
  }
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: imp.GridComponent;
  //#endregion

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
      /*  if(this.showPrint)
      this.toolbarList.push({ text: '', tooltipText: 'Print', prefixIcon: 'e-print', id: "Print" }); */
      this.toolbarOptions = this.toolbarList;
    });
    this.initializeGrid();
    setTimeout(() => {
      this.DisabledGridButton();
    }, 300);
  }

  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.orderTypeService;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/OrderType";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
}
