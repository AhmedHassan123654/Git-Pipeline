import { Injectable, ViewChild, ElementRef } from "@angular/core";
import { Subject } from "rxjs";
import { res } from "../Models/Shared/res";
import { ClickEventArgs } from "@syncfusion/ej2-navigations";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { PrintDetailModel } from "../Models/Shared/print-detail-model";
import { RowSelectEventArgs } from "@syncfusion/ej2-angular-grids";
import Swal from "sweetalert2";
import { ISharedGridList } from "./ISharedGridList";
declare var Stimulsoft: any;
declare let $: any;
@Injectable({
  providedIn: "root"
})
export class GenericGridList {
  //#region Declartions
  [key: string]: any;
  toolbarList = [];
  responseobj: any;
  public format = { type: "date", format: "dd/MM/yyyy" };
  private service: any;
  private routeName: any;
  private showEdit = false;
  private showDelete = false;
  private showNew = false;
  private showView = false;
  private showPrint = false;
  private screenButton = {
    Add: true,
    View: true,
    Edit: true,
    Delete: true,
    Print: true,
    CustomButton1: false
  };
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
  public formatoptions = { type: "date", format: "dd/MM/yyyy" };
  //#endregion
  //#region Constructor
  constructor(public shared: ISharedGridList) {
    this.initializeConstants();
  }
  //#endregion
  //#region General Methods
  initializeConstants() {
    this.customButton1 = {
      tooltipText: "Sync",
      prefixIcon: "e-sync"
    };
    this.responseobj = { List: [] };
  }
  getGrideList(obj?:any): any {
    this.getSettings();
    const subject = new Subject();

    this.service.getGrideList(obj).subscribe((res) => {
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
        tooltipText: this.trans("pagetransactions.Add"),
        prefixIcon: "e-add",
        id: "Add"
      });
    if (this.showView && this.screenButton.View)
      this.toolbarList.push({
        text: "",
        tooltipText: this.trans("pagetransactions.View"),
        prefixIcon: "e-view",
        id: "View"
      });
    if (this.showEdit && this.screenButton.Edit)
      this.toolbarList.push({
        text: "",
        tooltipText: this.trans("pagetransactions.Edit"),
        prefixIcon: "e-edit",
        id: "Edit"
      });
    if (this.showDelete && this.screenButton.Delete)
      this.toolbarList.push({
        text: "",
        tooltipText: this.trans("pagetransactions.Delete"),
        prefixIcon: "e-delete",
        id: "Delete"
      });
    if (this.showPrint && this.screenButton.Print)
      this.toolbarList.push({
        text: "",
        tooltipText: this.trans("pagetransactions.Print"),
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
    }
    this.toolbarOptions = this.toolbarList;
  }
  initializeGrid(): void {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.filterOptions = {
      type: "Menu"
    };
    setTimeout(() => {
      this.disabledGridButton();
    }, 300);
  }
  public trans(text: string): string {
    return this.shared.translate.instant(text);
  }
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === "Add") {
      if (this.responseobj.List !== undefined) {
        this.rowData = this.responseobj.List[0];
        this.rowData.screenPermission = this.responseobj.screenPermission;
        this.rowData.currentAction = "Add";
        this.addButtonAction();
      } else {
        this.rowData = { currentAction: "Add" };
        this.shared.router.navigateByUrl(this.routeName, this.rowData);
      }
    } else if (this.rowData == undefined && this.rowData == null) return;
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
  disabledGridButton() {
    $("#View").addClass("e-overlay addIcon");
    $("#Edit").addClass("e-overlay addIcon");
    $("#Delete").addClass("e-overlay addIcon");
    $("#Print").addClass("e-overlay addIcon");
    $("#customButton1").addClass("e-overlay addIcon");
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
  deleteFromGrideList(data: any): any {
    this.service.Transactions(data, "Delete").subscribe((res) => {
      if (res == 3) {
        this.shared.toastr.warning(this.shared.toastrMessage.GlobalMessages(res));
        this.getGrideList();
        this.grid.refresh();
      } else {
        return this.shared.toastr.error(this.shared.toastrMessage.GlobalMessages(res));
      }
    });
  }
  getSettings() {
    this.shared.SettingSer.GetSettings().subscribe((res) => {
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

  setServiceAndRouteName(service: any, routeName: string) {
    this.service = service;
    this.routeName = routeName;
  }
  setCustomButton1ToolTipAndIcon(tooltip: string = "Sync", prefixIcon: string = "e-sync") {
    this.screenButton.CustomButton1 = true;
    this.customButton1.tooltipText = tooltip;
    this.customButton1.prefixIcon = prefixIcon;
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
        this.screenButton.CustomButton1 = value;
        break;
      default:
        break;
    }
    this.drawActionButtonsBasedOnPermissions();
  }
  addButtonAction() {
    this.shared.router.navigateByUrl(this.routeName, this.rowData);
  }
  viewButtonAction() {
    this.shared.router.navigateByUrl(this.routeName, this.rowData);
  }
  editButtonAction() {
    this.shared.router.navigateByUrl(this.routeName, this.rowData);
  }
  deleteButtonAction() {
    this.delete();
  }
  delete() {
    if (this.rowData.IsSync == true) {
      this.shared.toastr.error(this.shared.toastrMessage.GlobalMessages(29));
      return;
    }
    this.onResourceDelete();
  }
  printButtonAction() {
    this.Print();
  }
  customButton1Action() {}
  onRowSelectedEvent() {}

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
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.model.push(this.rowData.DocumentId);
      this.myjson = ar["Reports"];
      this.model.push(this.myjson);
      this.model.push("ar");
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
      this.viewer.renderHtml("viewer");
      $("#modal-2").modal("show");
    });
    this.ifPerview = false;
    return false;
  }

  //    ngDoCheck() {
  //
  //     this.shared.languageSerService.currentLang.subscribe(lan => this.language = lan);
  //     this.shared.translate.use(this.language);
  // }
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
}
function preAddUpdateParams(arg0: { subject: any }, preAddUpdateParams: any) {
  throw new Error("Function not implemented.");
}
