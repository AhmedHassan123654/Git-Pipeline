import { Component, ViewChild } from "@angular/core";
import * as imp from "../shift-imports";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";

@Component({
  selector: "app-shiftlist",
  templateUrl: "./shiftlist.component.html",
  styleUrls: ["./shiftlist.component.css"]
})
export class ShiftlistComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: imp.GridComponent;

  //#endregion
  constructor(
    public shiftSer: imp.ShiftsService,
    public toastr: imp.ToastrService,
    public SettingSer: imp.SettingService,
    public toastrMessage: imp.HandlingBackMessages,
    public Rout: imp.Router,
    public translate: TranslateService,
    private languageSerService: LanguageSerService
  ) {
    super(toastr, toastrMessage, SettingSer, Rout);
    this.initializeobjects();
  }
  ngOnInit() {
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
      if (this.showPrint)
        this.toolbarList.push({
          text: "",
          tooltipText: "Print",
          prefixIcon: "e-print",
          id: "Print"
        });
      this.toolbarOptions = this.toolbarList;
    });
    this.initializeGrid;
    setTimeout(() => {
      this.DisabledGridButton();
    }, 300);
  }
  initializeobjects(): void {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.responseobj = {};
    this.service = this.shiftSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/shifts";
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.filterOptions = {
      type: "Menu"
    };
  }
}
