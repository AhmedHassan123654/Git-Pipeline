import { Router } from "@angular/router";
import { Component, OnInit, HostListener, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import {
  PageSettingsModel,
  EditSettingsModel,
  ToolbarItems,
  SaveEventArgs,
  CommandModel,
  FilterSettingsModel,
  GridComponent,
  DataStateChangeEventArgs
} from "@syncfusion/ej2-angular-grids";
import { DataManager, ODataAdaptor } from "@syncfusion/ej2-data";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { ClickEventArgs } from "@syncfusion/ej2-navigations";
import { Observable } from "rxjs/Observable";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import { PaymentVoucherModel } from "src/app/core/Models/Transactions/payment-voucher-model";

import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { PaymentVoucherService } from "../payment-voucherimport";

@Component({
  selector: "app-paymentvoucherlist",
  templateUrl: "./paymentvoucherlist.component.html",
  styleUrls: ["./paymentvoucherlist.component.css"]
})
export class PaymentvoucherlistComponent implements OnInit {
  language: string;
  paymentvoucherlist: any;
  pageSettings: PageSettingsModel;
  editOptions: EditSettingsModel;
  filterOptions: FilterSettingsModel;
  paymentvoucherobj: PaymentVoucherModel = new PaymentVoucherModel();
  toolbarOptions: ToolbarItems[];
  commands: CommandModel[];
  orderData: object;
  pageNumber: object;
  @ViewChild("grid") grid: GridComponent;
  constructor(
    public paymentvoucherSer: PaymentVoucherService,
    private toastr: ToastrService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private toastrMessage: HandlingBackMessages,
    private router: Router
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  ngOnInit() {
    this.getAllPaymentVouchers();
    this.initializeGrid();
  }
  getAllPaymentVouchers() {
    this.paymentvoucherSer.GetAllPaymentVouchers().subscribe((res) => {
      this.paymentvoucherlist = res as PaymentVoucherModel[];
    });
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
      var paymentvoucherModel = args.rowData as PaymentVoucherModel;
      if (paymentvoucherModel.IsSync) {
        this.toastr.warning(this.toastrMessage.GlobalMessages(7), "PaymentVoucherList");
        //this.grid.endEdit();
        args.cancel = true;
        return;
      } else {
        this.orderData = Object.assign({}, paymentvoucherModel);
        this.pageNumber =
          this.paymentvoucherlist.findIndex((x) => x.DocumentId == (this.orderData as PaymentVoucherModel).DocumentId) +
          1;
        this.router.navigateByUrl("/paymentvoucher", this.pageNumber);
      }
    }
    if (args.requestType === "delete") {
      var paymentvoucherModel = args.data[0] as PaymentVoucherModel;
      if (paymentvoucherModel.IsSync) {
        this.toastr.warning(this.toastrMessage.GlobalMessages(7), "PaymentVoucherList");
        args.cancel = true;
        return;
      } else {
        this.paymentvoucherSer.Transactions(paymentvoucherModel, "Delete").subscribe(
          (res) => {
            if (res == 3) {
              this.toastr.warning(this.toastrMessage.GlobalMessages(res), "PaymentVoucherList");
              this.getAllPaymentVouchers();
            } else {
              this.toastr.error(this.toastrMessage.GlobalMessages(res), "PaymentVoucherList");
            }
          },
          (err) => {
            this.toastr.error(this.toastrMessage.GlobalMessages(err), "PaymentVoucherList");
          }
        );
      }
    }
  }

  // if (args.requestType === 'save') {
  //   this.orderData = Object.assign({}, args.data);
  //   this.cashreceiptobj=this.orderData as CashReceiptModel;
  //   this.cashreceiptSer.Transactions(this.cashreceiptobj,"Edit").subscribe(
  //     res=>{
  //       if(res==2)
  //       {
  //         this.toastr.info(this.toastrMessage.GlobalMessages(res),'CashRecieptList');
  //       }
  //       else
  //       {
  //         this.toastr.error(this.toastrMessage.GlobalMessages(res),'CashRecieptList');
  //       }
  //     },
  //       err=>{
  //       this.toastr.error(this.toastrMessage.GlobalMessages(err),'CashRecieptList');
  // });

  // onResourceEdit(event): void {
  //   //alert('row index: ' + event.row.getAttribute('aria-rowindex'));
  //   // let row: HTMLTableRowElement = event.target.parentNode.parentNode.parentNode;
  //   // let rowIndex = +row.getAttribute('aria-rowindex');
  //   // this.grid.selectRow(rowIndex);
  //   // let record = this.grid.getSelectedRecords()[0];
  //   var paymentvoucherModel = event.rowData as PaymentVoucherModel;
  //   if (paymentvoucherModel.IsSync) {
  //     this.toastr.warning(this.toastrMessage.GlobalMessages(7),'PaymentVoucherList');
  //     //this.grid.endEdit();
  //     event.cancel = true;
  //     return;
  //   }
  //   else {
  //     this.orderData = Object.assign({}, paymentvoucherModel);
  //     this.pageNumber=this.paymentvoucherlist.findIndex(x=>x.DocumentId==(this.orderData as PaymentVoucherModel).DocumentId)+1;
  //     this.router.navigateByUrl('/paymentvoucher',this.pageNumber)
  //   }
  // }

  // onResourceDelete(event): void {
  //   let row: HTMLTableRowElement = event.target.parentNode.parentNode.parentNode;
  //   let rowIndex = +row.getAttribute('aria-rowindex');
  //   this.grid.selectRow(rowIndex);
  //   let record = this.grid.getSelectedRecords()[0];

  //   var paymentvoucherModel = record as PaymentVoucherModel;
  //   if (paymentvoucherModel.IsSync) {
  //     this.toastr.warning(this.toastrMessage.GlobalMessages(7),'PaymentVoucherList');
  //     return;
  //   }
  //   else {
  //       this.paymentvoucherSer.Transactions(paymentvoucherModel,"Delete").subscribe(
  //         res => {
  //           if(res ==3)
  //           {
  //             this.toastr.warning(this.toastrMessage.GlobalMessages(res),'PaymentVoucherList');
  //             this.getAllPaymentVouchers();
  //           }
  //           else
  //           {
  //             this.toastr.error(this.toastrMessage.GlobalMessages(res),'PaymentVoucherList');
  //             }
  //           } ,
  //         err => {
  //           this.toastr.error(this.toastrMessage.GlobalMessages(err),'PaymentVoucherList');
  //         }
  //       )
  //     }
  // }

  otherdata: Object;
}
