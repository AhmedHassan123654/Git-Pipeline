import { DatePipe } from "@angular/common";
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import Swal from "sweetalert2";
import * as imp from "../pagetransactionsimport";
declare var Stimulsoft: any;
declare let $: any;
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { countPagingParams } from "src/app/core/Models/Shared/function-named-paramaters";
import { PrintDetailModel } from "src/app/core/Models/Shared/print-detail-model";
import { quickAction } from "src/app/core/Enums/quick";
import {
  HandlingBackMessages,
  SettingService,
  ToastrService,
  TranslateService
} from "src/app/Features/adminstration/permission-imports";
import { ActivatedRoute } from "@angular/router";
import { ExtraExpensesService } from "src/app/core/Services/Transactions/extraexpenses.service";
import { DailyStockService } from "src/app/core/Services/Transactions/daily-stock.service";

@Component({
  selector: "app-pagetransactions",
  templateUrl: "./pagetransactions.component.html",
  styleUrls: ["./pagetransactions.component.css"],
  providers: [DatePipe],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagetransactionsComponent implements imp.OnInit {
  //#region Declartions
  fbb: boolean = true;
  [key: string]: any;
  @Input("form") _frm;
  @Input("service") _service;
  @Input("formobj") _formobj;
  @Input("pagename") _pagename;
  @Input("pageNumber") _pageNumber;
  @Input("dateFields") _dateFields;
  @Input("request") request;
  @Input("breakSave") _breakSave: boolean = false;
  @Input("hidePagination") _hidePagination: boolean = true;
  @Input("actionFromParnt") _actionFromParnt;
  @Input("translateSection") _translateSection;
  @Input() _print:(data:any) => void;
  // @Input('AddCount') AddCount:number=0;
  @Output() NewEvent: EventEmitter<any> = new EventEmitter();
  @Output() returnobjEvent: EventEmitter<any> = new EventEmitter();
  @Output() clearobjEvent: EventEmitter<any> = new EventEmitter();
  @Output() quickEvents: EventEmitter<any> = new EventEmitter();
  @Output() afterPag: EventEmitter<any> = new EventEmitter();
  oading: boolean = true;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  //designeroptions: any = new Stimulsoft.Designer.StiDesignerOptions();
  //designer: any = new Stimulsoft.Designer.StiDesigner(this.designeroptions, 'StiDesigner', false);
  printDetailobj: PrintDetailModel = new PrintDetailModel();
  combovalLanguage: string = "";
  combovalPrintModel: string = "";
  combovalDestination: string = "";
  combovalfileFormat: string = "";
  fields: object;
  ifPerview: boolean = false;

  //#endregion
  //#region Constructor
  constructor(
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages,
    private datePipe: DatePipe,
    private SettingSer: SettingService,
    public translate: TranslateService,
    private _ActivatedRoute: ActivatedRoute,
    public _ExtraExpensesService: ExtraExpensesService,
    public _DailyStockService: DailyStockService
  ) {}
  // copy button array for parent components which are allowed only to use it
  parentNames: Array<string> = ["dailystock"];

  public languages: any[] = [
    { Id: 1, Name: "English" },
    { Id: 2, Name: "Arabic" },
    { Id: 3, Name: "Turkish" },
    { Id: 4, Name: "French" }
  ];
  public printModels: any[] = [];
  public destinations: any[] = [
    { Id: 1, Name: "Preview" },
    { Id: 2, Name: "Email" }
  ];
  public fileFormats: any[] = [{ Id: 1, Name: "PDF" }];

  //#endregion

  //#region Angular Life Cycle
  ngOnInit() {
    this.PageTransactionsFirstOpen();
    this.fields = { text: "Name", value: "Id" };

    this.printDetailobj.DestinationId = 1;
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
    this.GetSettings();
  }
  ngOnChanges(): void {
    // this.count= this.AddCount;

    this._breakSave = this._breakSave;
    this.btnPrivliges();
    if (this._actionFromParnt == quickAction.afterUndo) {
      this.quickMenueMode(imp.quickMode.queryMode);
      this.pageNumber = 1;
      this.scrPaging();
    }
  }
  //#endregion
  //#region Print
  /*  setReport() {
    // Forcibly show process indicator
   this.viewer.showProcessIndicator();

    // Timeout need for immediate display loading report indicator

      var report = new Stimulsoft.Report.StiReport();
      report.dictionary.databases.clear();
      var json = { "DataSet": [ { Id: "a", Name: "A" } ] };
      var dataSet = new Stimulsoft.System.Data.DataSet("JSON");
      dataSet.readJson(json);
      report.regData("JSON", "JSON", dataSet);
    this.viewer.report = report;

  } */
  Print() {
    if(this._print)
    {
      setTimeout(() => {
        $('#modal-2').modal('hide');
      }, 470);
      this._print(this._formobj);
    }
    else{
      this.model = [];
      let translateSection = this._translateSection ?? "Reports";
      if (this.printDetailobj.LanguageId == 1) {
        this.model.push(this._formobj.DocumentId);
        this.myjson = en["Reports"];
        this.model.push(this.myjson);
        this.model.push("ar");
      }
      if (this.printDetailobj.LanguageId == 2) {
        this.model.push(this._formobj.DocumentId);
        this.myjson = ar["Reports"];
        this.model.push(this.myjson);
        this.model.push("en");
      }
      if (this.printDetailobj.LanguageId == 3) {
        this.model.push(this._formobj.DocumentId);
        this.myjson = tr["Reports"];
        this.model.push(this.myjson);
        this.model.push("en");
      }
      if (this.printDetailobj.LanguageId == 4) {
        this.model.push(this._formobj.DocumentId);
        this.myjson = fr["Reports"];
        this.model.push(this.myjson);
        this.model.push("en");
      }
      this.model.push(this.printDetailobj.PrintModelId);
      this.model.push(this.printDetailobj.DestinationId);
      this.model.push(this.printDetailobj.FileFormatId);
  
      if (this.printDetailobj.DestinationId == 2) {
        this.model.push(this.printDetailobj.Reciever);
        this.model.push(this.printDetailobj.Title);
        this.model.push(this.printDetailobj.Message);
        this.ifPerview = false;
      } else {
        this.ifPerview = true;
      }
  
      this._service.print(this.model).subscribe((data: Response) => {
        /*  if(this.printDetailobj.DestinationId == 2){
          $('#modal-1').modal('hide');
          return;
        } */
        this.loading = false;
        // this.reprtresult = data;
        this.report.loadDocument(data);
        this.viewer.report = this.report;
        this.viewer.renderHtml("viewer");
        // $('#modal-2').modal('show');
        // this.report.loadDocument(this.reprtresult);
  
        // // Render report
        // this.report.renderAsync();
  
        // // Create an HTML settings instance. You can change export settings.
        // var settings = new Stimulsoft.Report.Export.StiHtmlExportSettings();
        // // Create an HTML service instance.
        // var service = new Stimulsoft.Report.Export.StiHtmlExportService();
        // // Create a text writer objects.
        // var textWriter = new Stimulsoft.System.IO.TextWriter();
        // var htmlTextWriter = new Stimulsoft.Report.Export.StiHtmlTextWriter(
        //   textWriter
        // );
  
        // // Export HTML using text writer.
        // service.exportTo(this.report, htmlTextWriter, settings);
        // //  var contents =(<HTMLInputElement>document.getElementById("FrameDIv")).innerHTML;
        // var frame1 = document.createElement('iframe');
        // frame1.name = 'frame1';
        // frame1.style.position = 'absolute';
        // frame1.style.top = '-10000000px';
        // document.body.appendChild(frame1);
        // var frameDoc =
        //   (<HTMLIFrameElement>frame1).contentDocument ||
        //   (<HTMLIFrameElement>frame1).contentWindow.document;
        // frameDoc.open();
        // frameDoc.write('</head><body>');
        // frameDoc.write(textWriter.getStringBuilder().toString());
        // frameDoc.write('</body></html>');
        // frameDoc.close();
        // setTimeout(function () {
        //   // debugger;
        //  window.frames['frame1'].focus();
        //  window.frames['frame1'].print();
        //  document.body.removeChild(frame1);
  
        //  },500 )
      });
      this.ifPerview = false;
    }
    return false;
  }
  submitData(submitData) {
    if (!submitData.form.valid) {
      this.toastr.warning("Enter Required Data");
      return false;
    }
    this.Print();
  }

  //#region CashReceipt Methods
  PageTransactionsFirstOpen(): void {
    if (this.request.currentAction == "Add") {
      this.pageNumber = "";
      this.count = this.request.Count;
      this.disablePaging();
      this.quickMenueMode(imp.quickMode.newMode);
      this.quickEvents.emit(imp.quickAction.afterNew);
    } else if (this.request.currentAction == "Edit") {
      this.pageNumber = this.request.PageNumber;
      this.count = this.request.Count;
      this.disablePaging();
      this.disableNew = true;
      this.disableEdit = true;
      this.disableDelete = true;
      this.disableSave = false;
      this.disablePrint = true;
      this.disableUndo = false;
      this.quickEvents.emit(imp.quickAction.gridAfterEdit);
    }  else if (this.request.currentAction == "View") {
      this.pageNumber = this.request.PageNumber;
      this.count = this.request.Count;
      this.disablePaging();
      this.disableNew = true;
      this.disableEdit = true;
      this.disableDelete = true;
      this.disableSave = true;
      this.disablePrint = true;
      this.disableUndo = true;
    } else {
      this.pageNumber = 0;
      this.count = 0;
      this.countPaging({});
      this.quickMenueMode(imp.quickMode.queryMode);
    }
  }

  Next() {
    if (this.pageNumber < this.count && this.pageNumber > 0) {
      ++this.pageNumber;
      this.scrPaging();
    }
  }

  Previous(): void {
    if (this.pageNumber >= 1 && this.pageNumber <= this.count) {
      --this.pageNumber;
      this.scrPaging();
    }
  }

  First(): void {
    if (this.pageNumber >= 1) {
      this.pageNumber = 1;
      this.scrPaging();
    }
  }

  Last(): void {
    if (this.pageNumber < this.count && this.pageNumber > 0) {
      this.pageNumber = this.count;
      this.scrPaging();
    }
  }

  New(): void {
    this.pageNumber = "";
    this.disablePaging();
    for (const name in this._frm.controls) {
      this._frm.controls[name].enable();
    }
    this._frm.resetForm();
    this.quickMenueMode(imp.quickMode.newMode);
    this.quickEvents.emit(imp.quickAction.afterNew);
  }

  Edit(): void {
    this.disablePaging();
    for (const name in this._frm.controls) {
      this._frm.controls[name].enable();
    }
    this.quickMenueMode(imp.quickMode.modifyMode);
    this.quickEvents.emit(imp.quickAction.afterModify);
  }

  save(): void {
    if (this.currentMode == imp.quickMode.newMode) {
      this.quickEvents.emit(imp.quickAction.beforeAdd);
      if (this._frm.valid && this._breakSave == false) {
        this.disableSave = true;
        this.disableAlert.emit(true);

        this.newFrmObj = Object.assign({}, this._formobj);
        this._dateFields?.forEach((element) => {
          this.newFrmObj[element] = this.datePipe.transform(this.newFrmObj[element], "MM-dd-yyyy");
        });
        this._service.Transactions(this.newFrmObj, "Post").subscribe({
          next: (res) => {
            this.disableSave = false;
            this.isGridFlag.emit(true);
            if (res == 1) {
              this.toastr.success(this.toastrMessage.GlobalMessages(res), this._pagename);
              this.quickMenueMode(imp.quickMode.queryMode);
              this.enablePaging();
              this.countPaging({ currentAction: imp.quickAction.afterAdd });
              for (const name in this._frm.controls) {
                this._frm.controls[name].disable();
              }
              this.quickEvents.emit(imp.quickAction.afterAdd);
            } else if (res == 20) {
              this.toastr.error(this.toastrMessage.GlobalMessages(res), this._pagename);
            } else if (res == 22) {
              this.toastr.error(this.toastrMessage.GlobalMessages(res), this._pagename);
            } else {
              this.toastr.error(this.toastrMessage.GlobalMessages(res), this._pagename);
            }
          },
          error: () => {
            this.changeButtonsStatus(imp.quickMode.newMode);
            this.isGridFlag.emit(false);
          }
        });
      }
    } else {
      this.quickEvents.emit(imp.quickAction.beforeUpdate);
      if (this._frm.valid && this._breakSave == false) {
        this._service.Transactions(this._formobj, "Edit").subscribe({
          next: (res) => {
            if (res == 2) {
              this.disableAlert.emit(true);
              this.isGridFlag.emit(true);
              this.toastr.info(this.toastrMessage.GlobalMessages(res), this._pagename);
              this.quickMenueMode(imp.quickMode.queryMode);
              this.enablePaging();
              // this.countPaging({ currentAction: imp.quickAction.afterAdd });
              for (const name in this._frm.controls) {
                this._frm.controls[name].disable();
              }
              this.quickEvents.emit(imp.quickAction.afterUpdate);
            } else if (res == 22) {
              this.toastr.error(this.toastrMessage.GlobalMessages(res), this._pagename);
            } else {
              this.toastr.error(this.toastrMessage.GlobalMessages(res), this._pagename);
            }
          },
          error: (err) => {
            this.changeButtonsStatus(imp.quickMode.modifyMode);
            this.isGridFlag.emit(false);
          }
        });
      }
    }
  }

  Delete(): void {
    Swal.fire({
      title: this.translate.instant("Shared.Areyousure?"),
      text: this.translate.instant("Shared.Youwon'tbeabletorevertthis"),
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translate.instant("Shared.Yes,deleteit?")
    }).then((result) => {
      if (result.isConfirmed) {
        this._service.Transactions(this._formobj, "Delete").subscribe((res) => {
          if (res == 3) {
            this.toastr.warning(this.toastrMessage.GlobalMessages(res), this._pagename);
            if (this.pageNumber != 1) {
              if (this.pageNumber != undefined && this._pageNumber != "") {
                this.enablePaging();
                this.pageNumber = this.pageNumber - 1;
                this.countPaging({
                  currentAction: imp.quickAction.afterDelete
                });
              } else if (this.pageNumber == "") {
                this.pageNumber = 1;
                this.countPaging({
                  currentAction: imp.quickAction.afterDelete
                });
              }
            } else {
              if (this.pageNumber == 1) {
                if (this.count > 1) this.enablePaging();
                else {
                  this.pageNumber = 0;
                  this.disablePaging();
                  this._frm.resetForm();
                }
                this.countPaging({
                  currentAction: imp.quickAction.afterDelete
                });
              }
            }
            this.quickEvents.emit(imp.quickAction.afterDelete);
          } else {
            this.toastr.error(this.toastrMessage.GlobalMessages(res), this._pagename);
          }
        });
      }
    });
  }

  scrPaging(): void {
    this._service.Pagination(this.pageNumber).subscribe((res) => {
      this.returnobj = res;
      this.afterPag.emit(this.returnobj);
    });
  }

  countPaging({ currentAction }: countPagingParams): void {
    if (
      this.pageNumber != undefined ||
      currentAction == imp.quickAction.afterAdd ||
      currentAction == imp.quickAction.afterDelete
    ) {
      this._service.Pagination(1).subscribe((res) => {
        this.returnobj = res;
        this.count = this.returnobj !== null ? this.returnobj.Count : 0;
        if (this.count == 0) this.pageNumber = 0;
        else {
          this.pageNumber = 1;
          if (currentAction == imp.quickAction.afterAdd) this.pageNumber = this.count;
          if (currentAction == imp.quickAction.afterDelete) this.afterPag.emit(this.returnobj);
        }
      });
    } else this.count = 0;
  }
  quickMenueMode(mode: imp.quickMode): void {
    this.currentMode = mode;
    this.changeButtonsStatus(mode);
  }
  changeButtonsStatus(mode: imp.quickMode): void {
    if (mode == imp.quickMode.queryMode) {
      this.disableNew = false;
      this.disableEdit = false;
      this.disableDelete = false;
      this.disableSave = true;
      this.disablePrint = false;
      this.disableUndo = true;
      this.disableCopy = true;
      this.disableExtraExpenses = true;
    }
    if (mode == imp.quickMode.newMode || mode == imp.quickMode.modifyMode) {
      this.disableNew = true;
      this.disableEdit = true;
      this.disableDelete = true;
      this.disableSave = false;
      this.disablePrint = true;
      this.disableUndo = false;
      this.disableExtraExpenses = false;
      for (const parent in this._ActivatedRoute.snapshot.data) {
        if (this.parentNames[parent] === this._ActivatedRoute.snapshot.data[parent]) {
          this.disableCopy = false;
          return;
        } else {
          this.disableCopy = true;
          return;
        }
      }
    }
  }

  btnPrivliges(): void {
    if (this._formobj.screenPermission != undefined) {
      this.showNew = this._formobj.screenPermission.New;
      this.showEdit = this._formobj.screenPermission.Edit;
      this.showDelete = this._formobj.screenPermission.Delete;
      this.showPrint = this._formobj.screenPermission.Print;
      this.showSave = this._formobj.screenPermission.Save;
      if (this.showSave == true || this.showEdit == true) {
        this.showUndo = true;
        // this._ExtraExpensesService.showCopy.next(true);
        this.showExtraExpenses = true;
      } else {
        this.showUndo = false;
        // this._ExtraExpensesService.showCopy.next(false);
        this.showExtraExpenses = false;
      }
    }
  }

  disablePaging(): void {
    this.disableFirst = true;
    this.disablePrevious = true;
    this.disablePageNumber = true;
    this.disableNext = true;
    this.disableLast = true;
  }

  enablePaging(): void {
    this.disableFirst = false;
    this.disablePrevious = false;
    this.disablePageNumber = false;
    this.disableNext = false;
    this.disableLast = false;
  }
  //#endregion

  EditEvent() {
    this._service.FirstOpen().subscribe((res) => {
      var returnobj = res;
      if (returnobj.Count == 0) {
        this.toastr.warning(this.toastrMessage.GlobalMessages(res), this._pagename);
        this.count = 0;
        this.pageNumber = 0;
      } else if (returnobj.Count == undefined) {
        this.count = 1;
        this.pageNumber = 1;
        this.editBtn = false;
        return;
      } else {
        this.count = returnobj.Count;
        if (this._pageNumber) {
          this.pageNumber = this._pageNumber;
          this.Paging();
        } else this.pageNumber = this.count;
      }
    });
    //
  }

  // End : Add

  // Start : Edit
  // Edit() {
  //   this.beforeupdate.emit();
  //   if (this._frm.valid) {
  //     this._service.Transactions(this._formobj, 'Edit').subscribe(
  //       (res) => {
  //         if (res == 2) {
  //           if (this._formobj.FileToUpload) {
  //             const formData = new FormData();
  //             formData.append('file', this._formobj.FileToUpload);
  //             this.http
  //               .post(this.common.rooturl + '/Branch/UploadImages', formData)
  //               .subscribe((res) => {
  //                 if (res == true)
  //                   return this.toastr.info(
  //                     this.toastrMessage.GlobalMessages(res),
  //                     this._pagename
  //                   );
  //                 else
  //                   return this.toastr.error(
  //                     this.toastrMessage.GlobalMessages(res),
  //                     this._pagename
  //                   );
  //               });
  //           } else
  //             this.toastr.info(
  //               this.toastrMessage.GlobalMessages(res),
  //               this._pagename
  //             );
  //         } else {
  //           this.toastr.error(
  //             this.toastrMessage.GlobalMessages(res),
  //             this._pagename
  //           );
  //         }
  //       },
  //       (err) => {
  //         this.toastr.error(
  //           this.toastrMessage.GlobalMessages(err),
  //           this._pagename
  //         );
  //       }
  //     );
  //   }
  // }
  // End : Edit

  //start: undo
  /* Read more about handling dismissals below */
  undo() {
    Swal.fire({
      title: this.translate.instant("Shared.Areyousure?"),
      text: this.translate.instant("Shared.YouwanttoUndothis!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.quickMenueMode(imp.quickMode.queryMode);
        this.isGridFlag.emit(true);
        this.pageNumber = 1;
        this.scrPaging();
        for (const name in this._frm.controls) {
          this._frm.controls[name].disable();
        }
        this.enablePaging();
        this.disableAlert.emit(true);
        this.quickEvents.emit(imp.quickAction.afterUndo);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Empty
      }
    });
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
  /*   GetDesignReport(){
          this._service.GetReportDesgin().subscribe(data=> {
             let report = new Stimulsoft.Report.StiReport();
               report.loadFile(data.Report);
               this.designer.report = report;
              this.designer.renderHtml("Desgin");

             }

            );
        } */

  // fixing save, edit & undo buttons following actions
  @Output() isGridFlag: EventEmitter<boolean> = new EventEmitter();

  // hanlding copy daily stock list
  @Input() stocks: Array<object> = [];
  @Input() stockDetailsSelected: object = {};
  @Output() copyStockDetails: EventEmitter<boolean> = new EventEmitter();
  @Output() displaySelectedDailyStockDetails: EventEmitter<object> = new EventEmitter();
  @Output() disableAlert: EventEmitter<boolean> = new EventEmitter();

  copy() {
    this.copyStockDetails.emit(true);
    $("#copyModal").modal("show");
  }

  onSelect(stock: object) {
    this.displaySelectedDailyStockDetails.emit(stock);
    $("#copyModal").modal("hide");
  }

  openModelExtraExpenses() {
    this._ExtraExpensesService.openExtraExpenses.next(true);
    this.openModal.emit(true);
    console.log("_ExtraExpensesService.openExtraExpenses : ", this._ExtraExpensesService.openExtraExpenses.getValue());
  }

  @Output() openModal: EventEmitter<boolean> = new EventEmitter();
}
