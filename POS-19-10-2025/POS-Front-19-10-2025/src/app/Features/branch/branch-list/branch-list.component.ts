import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import { GeneralGrid, BranchService, HandlingBackMessages, SettingService, LanguageSerService } from "../branchimport";

@Component({
  selector: "app-branch-list",
  templateUrl: "./branch-list.component.html",
  styleUrls: ["./branch-list.component.scss"]
})
export class BranchListComponent extends GeneralGrid implements OnInit {
  //#region Declartions
  [key: string]: any;
  //#endregion
  @ViewChild("grid", { static: false }) grid: GridComponent;
  constructor(
    public branchSer: BranchService,
    public toast: ToastrService,
    public messages: HandlingBackMessages,
    public SettingSer: SettingService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    public Rout: Router
  ) {
    super(toast, messages, SettingSer, Rout);
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
      // if(this.showPrint)
      // this.toolbarList.push({ text: '', tooltipText: 'Print', prefixIcon: 'e-print', id: "Print" });
      this.toolbarOptions = this.toolbarList;
      setTimeout(() => {
        this.DisabledGridButton();
      }, 300);
    });
    this.initializeGrid();
  }
  initializeobjects(): void {
    this.responseobj = [];
    this.service = this.branchSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/branch";
    this.languageSerService.currentLang.subscribe((lan) => this.translate.use(lan));
  }
}
