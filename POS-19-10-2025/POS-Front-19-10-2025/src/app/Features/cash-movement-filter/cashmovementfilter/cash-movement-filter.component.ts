import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  ColumnModel,
  CommandModel,
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  PageSettingsModel,
  ToolbarItems
} from "@syncfusion/ej2-angular-grids";
import { BranchModel } from "src/app/core/Models/Authentication/branch-model";
import { EODReportModel } from "src/app/core/Models/Transactions/EODReportModel";
import { LoginService } from "src/app/core/Services/Authentication/login.service";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { DashboardService } from "src/app/core/Services/Transactions/dashboard.service";
import { ClickEventArgs, HandlingBackMessages, ToastrService } from "src/app/shared/Directives/pagetransactionsimport";

@Component({
  selector: "app-cash-movement-filter",
  templateUrl: "./cash-movement-filter.component.html",
  styleUrls: ["./cash-movement-filter.component.css"]
})
export class CashMovementFilterComponent implements OnInit {
  [key: string]: any;
  pageSettings: PageSettingsModel;
  editOptions: EditSettingsModel;
  filterOptions: FilterSettingsModel;
  toolbarOptions: ToolbarItems[];
  commands: CommandModel[];
  creationTime: string;

  pageNumber: object;
  Branch: BranchModel;
  EODReport: Array<EODReportModel>[];
  EODReportData: EODReportModel[];
  branshdata: any[];
  dateFrom: any;
  dateTo: any;
  users: any;
  userData: any[];
  public orderColumns: ColumnModel[];
  public returnColumns: ColumnModel[];

  public fields: Object = { text: "UserName", value: "UserName" };
  public branshfields: Object = { text: "Name", value: "Id" };
  public sorting: string = "Ascending";
  @ViewChild("grid") grid: GridComponent;
  public DateFormat: any = { type: "date", format: "dd/MM/yyyy" };
  constructor(
    private dashboardSer: DashboardService,
    public datepipe: DatePipe,
    private banchser: LoginService,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  ngOnInit() {
    this.GetAllUsers();
    this.GetBranch();
    this.initializeGrid();
    this.initializColumn();
  }
  initializeGrid() {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["Search", "PdfExport", "ExcelExport"];
    this.editOptions = {
      showDeleteConfirmDialog: true,
      allowEditing: true,
      allowDeleting: false
    };
    this.filterOptions = {
      type: "Menu"
    };
    this.commands = [
      {
        type: "Edit",
        buttonOption: { cssClass: "e-flat", iconCss: "e-edit e-icons" }
      },
      {
        type: "Save",
        buttonOption: { cssClass: "e-flat", iconCss: "e-update e-icons" }
      },
      {
        type: "Delete",
        buttonOption: { cssClass: "e-flat", iconCss: "e-delete e-icons" }
      },
      {
        type: "Cancel",
        buttonOption: { cssClass: "e-flat", iconCss: "e-cancel-icon e-icons" }
      }
    ];
  }

  initializColumn() {
    this.orderColumns = [
      {
        field: "AmountCash",
        headerText: "نفد",
        allowEditing: false,
        width: 80,
        textAlign: "Right",
        minWidth: 10
      },
      {
        field: "AmountDelay",
        headerText: "آجل",
        width: 80,
        allowEditing: false,
        textAlign: "Right",
        minWidth: 10
      },

      {
        field: "AmountVisa",
        headerText: "فيزا",
        width: 80,
        allowEditing: false,
        textAlign: "Right",
        minWidth: 10
      }
    ];

    this.returnColumns = [
      {
        field: "RTAmountCash",
        headerText: "نفد",
        allowEditing: false,
        width: 80,
        textAlign: "Right",
        minWidth: 10
      },
      {
        field: "RTAmountDelay",
        headerText: "آجل",
        width: 80,
        allowEditing: false,
        textAlign: "Right",
        minWidth: 10
      },
      {
        field: "RTAmountVisa",
        headerText: "فيزا",
        width: 80,
        allowEditing: false,
        textAlign: "Right",
        minWidth: 10
      }
    ];
  }

  // maps the appropriate column to fields property

  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === "Grid_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.grid.pdfExport();
    }
    if (args.item.id === "Grid_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.grid.excelExport();
    }
  }
  GetAllUsers() {
    this.dashboardSer.getAllUsersInfo().subscribe((res: any) => {
      this.users = res;
    });
  }

  GetBranch() {
    this.banchser.GetAllBranches().subscribe((res: any) => {
      this.Branch = res;
    });
  }

  GetEODReport() {
    var From = this.formatDate(this.dateFrom);
    var To = this.formatDate(this.dateTo);

    this.dashboardSer.getEODReport(this.userData, From, To).subscribe((res: any) => {
      this.EODReportData = [];
      this.EODReport = res["Item1"];

      var incominguser = res["Item2"];
      console.log(incominguser);
      this.EODReport.forEach((z) => {
        if (z && z.length > 0) {
          // this.EODReportData = z;
          z.forEach((zz) => {
            let icUser = incominguser.filter(
              (u) =>
                u.AppUserId == zz.CreatorUserId && this.formatDate2(u.CreationTime) == this.formatDate2(zz.CreateTime)
            )[0];
            if (icUser) {
              zz.ReceiveCashCashier = icUser.Amount;
            }
            this.EODReportData.push(zz);
          });
          this.EODReportData.forEach((x) => {
            /* incominguser.forEach(e => {
            x.ReceiveCashCashier =e.Amount;
            console.log( x.ReceiveCashCashier);
          }); */
            x.ReceiveCashCashier = 0;
            x.date = this.formatDate(x.CreateTime);
            x.deficit = x.Amount - x.RTAmount + x.ReceiveCashCashier - x.EEAmount;
            if (x.PayType == 10) {
              x.AmountCash = x.Amount;
              x.RTAmountCash = x.RTAmount;
            }
            if (x.PayType == 20) {
              x.AmountDelay = x.Amount;
              x.RTAmountDelay = x.RTAmount;
            }
            if (x.PayType == 30) {
              x.AmountVisa = x.Amount;
              x.RTAmountVisa = x.RTAmount;
            }
          });
        }
      });

      /* this.EODReport.Amount = res.Amount ;
      this.EODReport.CRAmount = res.CRAmount ;
      this.EODReport.CashierName = res.CashierName ;
      this.EODReport.CreatorUserId = res.CreatorUserId ;
      this.EODReport.DocumentId = res.DocumentId ;
      this.EODReport.CreationTime=this.formatDate(res.CreationTime);
      this.EODReport.EEAmount = res.EEAmount ;
      this.EODReport.Id = res.Id ;
      this.EODReport.PayType = res.PayType ;
      this.EODReport.PayTypeName = res.PayTypeName ;
      this.EODReport.RTAmount = res.RTAmount ;
      this.EODReport.Type = res.Type ; */
    });
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  formatDate2(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var newDate = [year, month, day].join("-");
    return new Date(newDate);
  }

  onResourceDelete(event): void {
    let row: HTMLTableRowElement = event.target.parentNode.parentNode.parentNode;
    let rowIndex = +row.getAttribute("aria-rowindex");
    this.grid.selectRow(rowIndex);
    let record = this.grid.getSelectedRecords()[0];
    var eodReportModel = record as EODReportModel;
    if (eodReportModel.IsSync) {
      this.toastr.warning(this.toastrMessage.GlobalMessages(7), "CashMovementFilter");
      return;
    } else {
      this.dashboardSer.deleteEODReport(eodReportModel).subscribe(
        (res) => {
          if (res == 3) {
            this.toastr.warning(this.toastrMessage.GlobalMessages(res), "CashMovementFilter");
            this.GetEODReport();
          } else {
            this.toastr.error(this.toastrMessage.GlobalMessages(res), "CashMovementFilter");
          }
        },
        (err) => {
          this.toastr.error(this.toastrMessage.GlobalMessages(err), "CashMovementFilter");
        }
      );
    }
  }

  onResource(args) {
    console.log(args);

    if (args.requestType === "beginEdit") {
      if (args.requestType === "save") {
        var eodReport = args.data as EODReportModel;

        // eodReport.ReceiveCashCashier;
      }
    }
  }
}
