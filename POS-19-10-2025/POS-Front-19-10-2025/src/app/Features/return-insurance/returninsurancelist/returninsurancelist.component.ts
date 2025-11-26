import { Component, OnInit, ViewChild } from "@angular/core";
import { ReturnInsuranseService } from "src/app/core/Services/order/ReturnInsuranseService";
import {
  PageSettingsModel,
  EditSettingsModel,
  FilterSettingsModel,
  ToolbarItems,
  CommandModel,
  SaveEventArgs,
  GridComponent
} from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from "@syncfusion/ej2-navigations";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-returninsurancelist",
  templateUrl: "./returninsurancelist.component.html",
  styleUrls: ["./returninsurancelist.component.css"]
})
export class ReturninsurancelistComponent implements OnInit {
  language: string;
  returnInsurances: any;
  pageSettings: PageSettingsModel;
  editOptions: EditSettingsModel;
  filterOptions: FilterSettingsModel;
  toolbarOptions: ToolbarItems[];
  commands: CommandModel[];
  orderData: any = {};
  @ViewChild("grid") grid: GridComponent;
  constructor(
    private returnInsuranceService: ReturnInsuranseService,
    public datepipe: DatePipe,
    private toastr: ToastrService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    private toastrMessage: HandlingBackMessages,
    private router: Router
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  ngOnInit() {
    this.GetAllOrdersWithInsuranceAsync();
    this.initializeGrid();
  }
  GetAllOrdersWithInsuranceAsync() {
    this.returnInsuranceService.GetAllOrdersWithInsurances().subscribe((res) => {
      this.returnInsurances = res;
      this.returnInsurances.forEach((element) => {
        element.CloseDate = this.datepipe.transform(new Date(element.CloseDate), "yyyy-MM-dd");
      });
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
    this.filterOptions = { type: "Menu" };
    this.commands = [
      {
        type: "Edit",
        buttonOption: { cssClass: "e-flat", iconCss: "e-edit e-icons" }
      },
      //{ type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
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

  // actionBegin(args: SaveEventArgs)
  // {
  //   if (args.requestType === 'beginEdit' || args.requestType === 'add') {
  //       this.orderData = Object.assign({}, args.rowData);
  //       this.router.navigateByUrl("/returninsurancelist/returninsurance",this.orderData);
  //   }
  //   if (args.requestType === 'delete') {
  //     var Id = args.data[0].DocumentId;
  //     // this.manageorderser.DeleteOrder(Id).subscribe(
  //     //     res => {
  //     //       if(res ==3)
  //     //       {
  //     //         this.toastr.warning(this.toastrMessage.GlobalMessages(res),'manageorderlist');
  //     //       }
  //     //       else
  //     //       {

  //     //         this.toastr.error(this.toastrMessage.GlobalMessages(res),'manageorderlist');
  //     //        }
  //     //       } ,
  //     //     err => {
  //     //       this.toastr.error(this.toastrMessage.GlobalMessages(err),'manageorderlist');
  //     //     }
  //     //   )

  //   }
  // }

  onResource(args): void {
    if (args.requestType === "beginEdit") {
      var orderModel = args.rowData as OrderModel;
      if (orderModel.IsSync) {
        this.toastr.warning(this.toastrMessage.GlobalMessages(7), "ReturnInsuranceList");
        args.cancel = true;
        return;
      } else {
        this.orderData = Object.assign({}, orderModel);
        this.router.navigateByUrl("/returninsurancelist/returninsurance", this.orderData);
      }
    }
  }
  // onResourceEdit(event): void {
  //   let row: HTMLTableRowElement = event.target.parentNode.parentNode.parentNode;
  //   let rowIndex = +row.getAttribute('aria-rowindex');
  //   this.grid.selectRow(rowIndex);
  //   let record = this.grid.getSelectedRecords()[0];

  //   var extraExpenseModel = record as OrderModel;
  //   if (extraExpenseModel.IsSync) {
  //     this.toastr.warning(this.toastrMessage.GlobalMessages(7),'ReturnInsuranceList');
  //     return;
  //   }
  //   else {
  //     this.orderData = Object.assign({}, extraExpenseModel);
  //     this.router.navigateByUrl("/returninsurancelist/returninsurance",this.orderData);
  //   }
  // }
}
