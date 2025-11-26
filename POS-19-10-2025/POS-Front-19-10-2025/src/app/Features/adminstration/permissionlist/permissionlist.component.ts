import { Component, OnInit, ViewChild } from "@angular/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import Swal from "sweetalert2";
import * as imp from "../permission-imports";
import { Router } from "@angular/router";
import {
  GeneralGrid,
  GridComponent,
  HandlingBackMessages,
  PermissionService,
  ToastrService,
  SettingService,
  TranslateService
} from "../permission-imports";
@Component({
  selector: "app-permissionlist",
  templateUrl: "./permissionlist.component.html",
  styleUrls: ["./permissionlist.component.css"]
})
export class PermissionlistComponent extends GeneralGrid implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid") grid: GridComponent;
  //#endregion

  constructor(
    public permissionService: PermissionService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    public SettingSer: SettingService,
    public Rout: Router,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
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
      // if (this.showDelete)
      //   this.toolbarList.push({
      //     text: "",
      //     tooltipText: "Delete",
      //     prefixIcon: "e-delete",
      //     id: "Delete"
      //   });
      /*   if(this.showPrint)
      this.toolbarList.push({ text: '', tooltipText: 'Print', prefixIcon: 'e-print', id: "Print" }); */
      this.toolbarOptions = this.toolbarList;
      setTimeout(() => {
        this.DisabledGridButton();
      }, 300);
    });
    this.initializeGrid();
  }

  initializeobjects(): void {
    this.responseobj = [];
    this.service = this.permissionService;
    this.showEdit = true;
    this.showDelete = false;
    this.RouteName = "/PermissionGroup";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  onResourceSetPermission(args: any): void {
    const queryData = this.grid.getRowInfo(args.target).rowData as unknown;

    this.router.navigateByUrl("/PermissionGroup/SetPermissionGroup", queryData);
  }
  onResourceSetUser(args: any): void {
    const queryData = this.grid.getRowInfo(args.target).rowData as unknown;

    this.router.navigateByUrl("/PermissionGroup/SetUsers", queryData);
  }
}
