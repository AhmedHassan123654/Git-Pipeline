import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import Swal from "sweetalert2";
import * as imp from "../print-imports";

@Component({
  selector: "app-printerlist",
  templateUrl: "./printerlist.component.html",
  styleUrls: ["./printerlist.component.css"]
})
export class PrinterlistComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid") grid: imp.GridComponent;
  //#endregion

  constructor(
    public printSer: imp.PrinterService,
    public Rout: imp.Router,
    public toster: imp.ToastrService,
    public messages: imp.HandlingBackMessages,
    public SettingSer: imp.SettingService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService
  ) {
    super(toster, messages, SettingSer, Rout);
    this.initializeobjects();
  }
  //#region Angular Life Cycle
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
      /*  if(this.showPrint)
      this.toolbarList.push({ text: '', tooltipText: 'Print', prefixIcon: 'e-print', id: "Print" }); */
      this.toolbarOptions = this.toolbarList;
    });
    this.initializeGrid();
  }
  //#region Printer Methods
  initializeobjects(): void {
    this.responseobj = [];
    this.service = this.printSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/printer";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  onResourceEditProductPrinting(event: any) {

    const rowData = this.grid.getRowInfo(event.target).rowData as any;
    rowData.showEdit = this.showEdit;
    this.router.navigateByUrl("/printer/productPrinting", rowData);
  }
  //#endregion
}
