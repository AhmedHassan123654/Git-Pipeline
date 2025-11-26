import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import Swal from "sweetalert2";
import { GeneralGrid } from "src/app/core/Helper/general-grid";
import { EmployeeService } from "src/app/core/Services/Transactions/employee.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { SettingService } from "src/app/core/Services/Settings/SettingService";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
// import * as imp from "../emp-imports";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.scss"]
})
export class EmployeeListComponent extends GeneralGrid implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: GridComponent;
  //#endregion

  //#region Constructor
  constructor(
    public empser: EmployeeService,
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
  //#endregion
  //#region Angular Life Cycle
  ngOnInit(): void {
    // const state = { action:{currentPage:1},skip: 0, take: 10 };
    // this.cashreceiptSer.execute(state);
    this.GetGrideList().subscribe(() => {
      //   this.toolbarList=[];
      //   if(this.showNew)
      //   this.toolbarList.push({ text: '', tooltipText: 'Add', prefixIcon: 'e-add', id: "Add" });
      //   if(this.showView)
      //  this.toolbarList.push({ text: '', tooltipText: 'View', prefixIcon: 'e-view', id: "View" });
      //   if(this.showEdit)
      //   this.toolbarList.push({ text: '', tooltipText: 'Edit', prefixIcon: 'e-edit', id: "Edit" });
      //   if(this.showDelete)
      //   this.toolbarList.push({ text: '', tooltipText: 'Delete', prefixIcon: 'e-delete', id: "Delete" });
      //  /*  if(this.showPrint)
      //   this.toolbarList.push({ text: '', tooltipText: 'Print', prefixIcon: 'e-print', id: "Print" }); */
      //   this.toolbarOptions = this.toolbarList;
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
    this.service = this.empser;
    this.showEdit = false;
    this.showDelete = false;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/employees";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  //#endregion
}
