import { Injectable, ViewChild, ElementRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
//import { ClickEventArgs, HandlingBackMessages ,ToastrService} from 'src/app/shared/Imports/featureimports';
import { res } from "../Models/Shared/res";
import { ClickEventArgs } from "@syncfusion/ej2-navigations";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { PrintDetailModel } from "../Models/Shared/print-detail-model";
import { SettingService } from "../Services/Settings/SettingService";
import { RowSelectEventArgs } from "@syncfusion/ej2-angular-grids";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
//import { SharedGridList } from './SharedGridList';
import { TranslateService } from "@ngx-translate/core";
declare var Stimulsoft: any;
declare let $: any;
@Injectable({
  providedIn: "root"
})
export class GeneralGrid {
  //#region Declartions
  [key: string]: any;
  toolbarList = [];
  public format = { type: "date", format: "dd/MM/yyyy" };

  @ViewChild("Grid") content: ElementRef;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  printDetailobj: PrintDetailModel = new PrintDetailModel();
  public languages: any[] = [
    { Id: 1, Name: "English" },
    { Id: 2, Name: "Arabic" },
    { Id: 3, Name: "Turkish" },
    { Id: 4, Name: "French" }
  ];
  public fields = { text: "Name", value: "Id" };
  //#endregion

  //#region Constructor
  constructor(
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    public SettingSer: SettingService,
    public router: Router // public translate: TranslateService,
  ) {
    this.initializeConstants();
  }

  //#endregion
  //#region General Methods
  initializeConstants() {
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.screenButton = {
      Add: true,
      View: true,
      Edit: true,
      Delete: true,
      Print: true,
      CustomButton1: false
    };
    this.hasCustomAction = {
      Add: false,
      Edit: false,
      View: false,
      Delete: false
    };
    this.selectedRowHasCustomCondition = {
      Add: false,
      Edit: false,
      View: false,
      Delete: false,
      Print: false,
      customButton1: false
    };
    this.actionButtonShowCustomCondition = {
      View: false
    };
    this.customButton1 = {
      tooltipText: "Sync",
      prefixIcon: "e-sync"
    };
  }

  setServiceAndRouteName(service: any, routeName: string) {
    this.service = service;
    this.RouteName = routeName;
  }
  GetGrideList(): any {
    this.GetSettings();
    const subject = new Subject();
    this.service.getGrideList().subscribe((res) => {
      this.responseobj = res as res;
      this.assignActionButtonsPermission();
      this.drawActionButtonsBasedOnPermissions();
      subject.next();
    });
    return subject;
  }
  private assignActionButtonsPermission() {
    this.showEdit = this.responseobj.screenPermission.Edit;
    this.showDelete = this.responseobj.screenPermission.Delete;
    this.showNew = this.responseobj.screenPermission.New;
    this.showView = this.responseobj.screenPermission.View;
    this.showPrint = this.responseobj.screenPermission.Print;
  }
  public drawActionButtonsBasedOnPermissions() {
    this.toolbarList = [];
    if (this.showNew && this.screenButton.Add)
      this.toolbarList.push({
        text: "Add",
        tooltipText: "Add",
        prefixIcon: "e-add",
        id: "Add"
      });
    if (this.showView && this.screenButton.View)
      this.toolbarList.push({
        text: "",
        tooltipText: "View", //  this.translate.instant("pagetransactions.View"),
        prefixIcon: "e-view",
        id: "View"
      });
    if (this.showEdit && this.screenButton.Edit)
      this.toolbarList.push({
        text: "",
        tooltipText: "Edit",
        prefixIcon: "e-edit",
        id: "Edit"
      });
    if (this.showDelete && this.screenButton.Delete)
      this.toolbarList.push({
        text: "",
        tooltipText: "Delete",
        prefixIcon: "e-delete",
        id: "Delete"
      });
    if (this.showPrint && this.screenButton.Print)
      this.toolbarList.push({
        text: "",
        tooltipText: "Print",
        prefixIcon: "e-print",
        id: "Print"
      });
    if (this.screenButton.CustomButton1) {
      this.toolbarList.push({
        text: "",
        tooltipText: this.customButton1.tooltipText,
        prefixIcon: this.customButton1.prefixIcon,
        id: "customButton1"
      });
      // this.setCustomButton1ToolTipAndIcon('Sync','e-sync');
    }

    this.toolbarOptions = this.toolbarList;
  }
  DisabledGridButton() {
    $("#View").addClass("e-overlay addIcon");
    $("#Edit").addClass("e-overlay addIcon");
    $("#Delete").addClass("e-overlay addIcon");
    $("#Print").addClass("e-overlay addIcon");
    $("#customButton1").addClass("e-overlay addIcon");
  }
  setCustomButton1ToolTipAndIcon(tooltip: string = "Sync", prefixIcon: string = "e-sync") {
    this.screenButton.CustomButton1 = true;
    this.customButton1.tooltipText = tooltip;
    this.customButton1.prefixIcon = prefixIcon;
  }
  deleteFromGrideList(data: any): any {
    this.service.Transactions(data, "Delete").subscribe((res) => {
      if (res == 3) {
        this.toastr.warning(this.toastrMessage.GlobalMessages(res));
        this.GetGrideList();
        this.grid.refresh();
      } else {
        return this.MyToster.error(this.toastrMessage.GlobalMessages(res));
      }
    });
  }

  initializeGrid(): void {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.filterOptions = {
      type: "Menu"
    };
    this.renderHTML();
  }
  toolbarClick1(args: ClickEventArgs): void {
    if (args.item.id === "Add") {
      if (this.responseobj.List !== undefined) {
        this.rowData = this.responseobj.List[0];
        this.rowData.screenPermission = this.responseobj.screenPermission;
        this.rowData.currentAction = "Add";
        this.addButtonAction();
      } else {
        this.rowData = {
          currentAction: "Add"
        };
        this.router.navigateByUrl(this.RouteName, this.rowData);
      }
    }
    if (args.item.id === "Edit") {
      if (this.rowData == undefined && this.rowData == null) return;
      else {
        this.rowData.currentAction = "Edit";
        if (!this.hasCustomAction.Edit) this.router.navigateByUrl(this.RouteName, this.rowData);
        else this.doCustomAction(args.item.id);
      }
    }
    if (args.item.id === "View") {
      if (this.rowData == undefined && this.rowData == null) return;
      else {
        this.rowData.currentAction = "View";

        //    if(!this.hasCustomAction.View)
        //      this.router.navigateByUrl(this.RouteName,this.rowData);
        //  else
        //     this.doCustomAction(args.item.id);
        this.viewAction();
      }
    }
    if (args.item.id === "Delete") {
      if (this.rowData == undefined && this.rowData == null) return;
      else {
        if (this.rowData.IsSync == true) {
          this.toastr.error(this.toastrMessage.GlobalMessages(29));
          return;
        }
        if (!this.hasCustomAction.Delete) this.onResourceDelete();
        else this.doCustomAction(args.item.id);
      }
    }
    if (args.item.id === "Print") {
      if (this.rowData == undefined && this.rowData == null) return;
      else {
        this.Print();
      }
    }
    if (args.item.id === "customButton1") {
      this.doCustomAction(args.item.id);
    }
    if (args.item.id === "ExcelExport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.grid.excelExport();
    }
    if (args.item.id === 'Grid_excelexport') 
      this.grid.excelExport();
    if (args.item.id === "Word") {
      this.wordexport();
    }
    if (args.item.id === "PDF") {
      /*  let pdfExportProperties: PdfExportProperties = {
        dataSource: this.responseobj.List
        };

        this.grid.pdfExport(pdfExportProperties); // need to call pdfExport method of grid when get the entire data
        */
      ///this.SavePDF();
    }
  }

  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === "Add") {
      if (this.responseobj.List !== undefined) {
        this.rowData = this.responseobj.List[0];
        this.rowData.screenPermission = this.responseobj.screenPermission;
        this.rowData.currentAction = "Add";
        this.addButtonAction();
      } else {
        this.rowData = {
          currentAction: "Add"
        };
        this.router.navigateByUrl(this.RouteName, this.rowData);
      }
    }
    else if (args.item.id === "Grid_excelexport") {
      this.grid.excelExport();
    }
    else if (this.rowData == undefined && this.rowData == null) return;
    else {
      switch (args.item.id) {
        case "Edit":
          this.rowData.currentAction = "Edit";
          this.editButtonAction();
          break;

        case "View":
          this.rowData.currentAction = "View";
          this.viewButtonAction();
          break;

        case "Delete":
          this.deleteButtonAction();
          break;

        case "Print":
          this.printButtonAction();
          break;

        case "customButton1":
          this.customButton1Action();
          break;

        case "ExcelExport":
          this.grid.excelExport();
          break;

        case "Word":
          this.wordexport();
          break;

        case "PDF":
          break;

        default:
          break;
      }
    }
  }

  /*  public SavePDF(): void {
    
  const doc = new jspdf('l', 'mm', 'a4');
   let data = this.responseobj.List;
   let result=[];
  data.forEach(item => {
   // result.push(item.toArray());
  });
  this.head = [['CustomerName', 'Amount', 'Date', 'Description']] */
  /* let any=function json2array(data){
    var result = [];
    var keys = Object.keys(data);
    keys.forEach(function(key){
        result.push(data[key]);
    });
    return result;
} */
  /*
   autoTable(doc, {
    head: this.head,
    body: data,
    didDrawCell: (data) => { },
});

 doc.save('PDF.pdf');

  }  */

  //#endregion

  wordexport() {
    var header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'><body>";
    var footer = "</body></html>";
    var headcontent = document.getElementsByClassName("e-gridheader")[0].innerHTML;
    var content = document.getElementsByClassName("e-gridcontent")[0].innerHTML;
    var sourceHTML = header + headcontent + content + footer;

    var source = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(sourceHTML);
    var fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = "document.doc";
    fileDownload.click();
    document.body.removeChild(fileDownload);
  }
  Print() {
    this.model = [];
    if (this.printDetailobj.LanguageId == 1) {
      this.model.push(this.rowData.DocumentId);
      this.myjson = en["Reports"];
      this.model.push(this.myjson);
      this.model.push("ar");
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.model.push(this.rowData.DocumentId);
      this.myjson = ar["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.model.push(this.rowData.DocumentId);
      this.myjson = tr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.model.push(this.rowData.DocumentId);
      this.myjson = fr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    this.model.push(this.printDetailobj.PrintModelId);
    this.model.push(this.printDetailobj.DestinationId);
    this.model.push(this.printDetailobj.FileFormatId);
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
    this.service.print(this.model).subscribe((data: Response) => {
      this.loading = false;
      this.report.loadDocument(data);
      this.viewer.report = this.report;
      this.viewer.renderHtml("myviewer");
      // this.viewer.renderHtml("viewer");
      $("#modal-99").modal("show");
    });
    this.ifPerview = false;

    return false;
  }
  GetSettings() {
    this.SettingSer.GetSettings().subscribe((res) => {
      this.settings = res as any;
      this.printDetailobj.LanguageId = this.settings.SystemMainLanguage;
    });
  }
  setReport(data) {
    this.printDetailobj.LanguageId = data.value;
    this.Print();
  }

  public btnClick(): void {
    if (this.Grid.element.classList.contains("disablegrid")) {
      this.Grid.element.classList.remove("disablegrid");
      document.getElementById("GridParent").classList.remove("wrapper");
    } else {
      this.Grid.element.classList.add("disablegrid");
      document.getElementById("GridParent").classList.add("wrapper");
    }
  }
  public onRowSelected(args: RowSelectEventArgs): void {
    this.rowData = args.data.valueOf();
    this.removeGrayColor();
    this.onRowSelectedEvent();
  }

  private removeGrayColor() {
    $("#View").removeClass("e-overlay addIcon");
    $("#Edit").removeClass("e-overlay addIcon");
    $("#Delete").removeClass("e-overlay addIcon");
    $("#Print").removeClass("e-overlay addIcon");
    $("#customButton1").removeClass("e-overlay addIcon");
  }

  onResourceDelete(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it?"
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteFromGrideList(this.rowData);
      }
    });
  }
  showActionButton(action: string, value: boolean) {
    switch (action) {
      case "Add":
        this.screenButton.Add = value;
        break;
      case "View":
        this.screenButton.View = value;
        break;
      case "Edit":
        this.screenButton.Edit = value;
        break;
      case "Delete":
        this.screenButton.Delete = value;
        break;
      case "Print":
        this.screenButton.Print = value;
        break;
      case "customButton1":
        this.screenButton.customButton1 = value;
        break;

      default:
        break;
    }
    this.drawActionButtonsBasedOnPermissions();
  }

  addButtonAction() {
    this.router.navigateByUrl(this.RouteName, this.rowData);
  }
  viewButtonAction() {
    this.rowData.screenPermission = this.responseobj.screenPermission;
    this.router.navigateByUrl(this.RouteName, this.rowData);
  }
  editButtonAction() {
    this.router.navigateByUrl(this.RouteName, this.rowData);
  }
  deleteButtonAction() {
    this.delete();
  }
  delete() {
    if (this.rowData.IsSync == true) {
      this.toastr.error(this.toastrMessage.GlobalMessages(29));
      return;
    }
    this.onResourceDelete();
  }
  printButtonAction() {
    this.Print();
  }
  customButton1Action() {}
  onRowSelectedEvent() {}
  private generateHTML(): string {
    return `
      <div>
      <div class="modal fade" id="modal-99" tabindex="-1" role="dialog" aria-labelledby="modal-1">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header borderb">
              <h5 class="modal-title has-icon ms-icon-round orangeColor restaurantName4">
                <svg
                  width="28px"
                  height="27px"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 512 512"
                  style="enable-background: new 0 0 512 512"
                  xml:space="preserve">
                  <g>
                    <g>
                      <path
                        d="M324.267,366.933H187.733c-5.12,0-8.533,3.413-8.533,8.533s3.413,8.533,8.533,8.533h136.533
            c5.12,0,8.533-3.413,8.533-8.533S329.387,366.933,324.267,366.933z" />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M349.867,409.6H162.133c-5.12,0-8.533,3.413-8.533,8.533s3.413,8.533,8.533,8.533h187.733c5.12,0,8.533-3.413,8.533-8.533
            S354.987,409.6,349.867,409.6z" />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M375.467,452.267H136.533c-5.12,0-8.533,3.413-8.533,8.533c0,5.12,3.413,8.533,8.533,8.533h238.933
            c5.12,0,8.533-3.413,8.533-8.533C384,455.68,380.587,452.267,375.467,452.267z" />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M0,307.2v93.867c0,14.507,11.093,25.6,25.6,25.6h58.027l-12.8,64.853c-0.853,5.12,0,10.24,3.413,14.507
            S81.92,512,87.04,512h337.92c5.12,0,10.24-2.56,12.8-5.973c3.413-4.267,4.267-9.387,3.413-14.507l-12.8-64.853H486.4
            c14.507,0,25.6-11.093,25.6-25.6V307.2H0z M87.04,494.933l15.36-75.093l15.36-78.507h276.48l15.36,78.507l15.36,75.093H87.04z" />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M486.4,85.333h-59.733v102.4c0,23.893-18.773,42.667-42.667,42.667H128c-23.893,0-42.667-18.773-42.667-42.667v-102.4
            H25.6c-14.507,0-25.6,11.093-25.6,25.6v179.2h512v-179.2C512,96.427,500.907,85.333,486.4,85.333z" />
                    </g>
                  </g>
                  <g>
                    <g>
                      <rect x="290.133px" y="145.067px" width="85.333px" height="34.133px" />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M401.067,85.333V17.067C401.067,7.68,393.387,0,384,0H128c-9.387,0-17.067,7.68-17.067,17.067v68.267H102.4v102.4
            c0,14.507,11.093,25.6,25.6,25.6h256c14.507,0,25.6-11.093,25.6-25.6v-102.4H401.067z M128,17.067h256v68.267H128V17.067z
              M392.533,187.733c0,5.12-3.413,8.533-8.533,8.533H281.6c-5.12,0-8.533-3.413-8.533-8.533v-51.2c0-5.12,3.413-8.533,8.533-8.533
            H384c5.12,0,8.533,3.413,8.533,8.533V187.733z" />
                    </g>
                  </g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                </svg>
                <span class="px-2"> Printer Setting</span>
              </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="modal-body">
        <form>
          <div class="row d-flex justify-content-center align-items-center">
            <div class="col-md-10 py-2">
              <div class="row justify-content-center align-items-center">
                <div class="col-md-3 d-flex justify-content-start align-items-center label1"></div>
              </div>
            </div>
          </div>
        </form>
        <div id="myviewer"></div>

        <div></div>
      </div>
          </div>
        </div>
      </div>
            </div>
          `;
  }

  private renderHTML() {
    let container = document.getElementById("Grid"); // Replace with the ID of your container element
    if (!container) {
      container = document.getElementById("grid"); // Replace with the ID of your container element
    }
    if (container) {
      container.innerHTML = this.generateHTML();
    }
  }
}
