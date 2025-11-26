import { Component, OnInit, ViewChild } from "@angular/core";
import {
  PageSettingsModel,
  EditSettingsModel,
  FilterSettingsModel,
  ToolbarItems,
  CommandModel,
  GridComponent
} from "@syncfusion/ej2-angular-grids";
import { StockService } from "src/app/core/Services/Transactions/stock.service";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { Router } from "@angular/router";
import { ClickEventArgs } from "@syncfusion/ej2-angular-buttons";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-stocklist",
  templateUrl: "./stocklist.component.html",
  styleUrls: ["./stocklist.component.scss"]
})
export class StocklistComponent implements OnInit {
  stocklist: any;
  pageSettings: PageSettingsModel;
  editOptions: EditSettingsModel;
  filterOptions: FilterSettingsModel;
  cashreceiptobj: any; // = new CashReceiptModel();
  toolbarOptions: ToolbarItems[];
  commands: CommandModel[];
  orderData: object;
  pageNumber: object;
  language: string;
  @ViewChild("grid", { static: false }) grid: GridComponent;
  constructor(
    public stockService: StockService,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages,
    private router: Router,
    private languageSerService: LanguageSerService,
    public translate: TranslateService
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  ngOnInit() {
    this.getAllStocks();
    this.initializeGrid();
  }

  getAllStocks() {
    this.stockService.GetAllStocks().subscribe((res) => {
      this.stocklist = res as any; // CashReceiptModel[];
    });
  }

  initializeGrid() {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["Search", "PdfExport", "ExcelExport"];
    this.editOptions = {
      showDeleteConfirmDialog: true,
      allowEditing: true,
      allowDeleting: true
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
        type: "Delete",
        buttonOption: { cssClass: "e-flat", iconCss: "e-delete e-icons" }
      },
      {
        type: "Save",
        buttonOption: { cssClass: "e-flat", iconCss: "e-update e-icons" }
      },
      {
        type: "Cancel",
        buttonOption: { cssClass: "e-flat", iconCss: "e-cancel-icon e-icons" }
      }
    ];
  }

  onResource(args): void {
    if (args.requestType === "beginEdit") {
      var usergroupModel = args.rowData as any;
      if (usergroupModel.IsSync) {
        this.toastr.warning(this.toastrMessage.GlobalMessages(7), "stocklist");
        args.cancel = true;
        return;
      } else {
        this.orderData = Object.assign({}, usergroupModel);
        this.pageNumber = this.stocklist.findIndex((x) => x.Id == (this.orderData as any).Id) + 1;
        this.router.navigateByUrl("/stock", this.pageNumber);
      }
    }
    if (args.requestType === "delete") {
      var usergroupModel = args.data[0] as any;
      if (usergroupModel.IsSync) {
        this.toastr.warning(this.toastrMessage.GlobalMessages(7), "stocklist");
        args.cancel = true;
        return;
      } else {
        this.stockService.Transactions(usergroupModel, "Delete").subscribe(
          (res) => {
            if (res == 3) {
              this.toastr.warning(this.toastrMessage.GlobalMessages(res), "stocklist");
              this.getAllStocks();
            } else {
              this.toastr.error(this.toastrMessage.GlobalMessages(res), "stocklist");
            }
          },
          (err) => {
            this.toastr.error(this.toastrMessage.GlobalMessages(err), "stocklist");
          }
        );
      }
    }
  }

  otherdata: Object;
  toolbarClick(args: ClickEventArgs): void {
    // if (args.item.id === "Grid_pdfexport") {
    //   // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
    //   this.grid.pdfExport();
    // }
    // if (args.item.id === "Grid_excelexport") {
    //   // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
    //   this.grid.excelExport();
    // }
  }
}
