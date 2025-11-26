import { Component, Inject,ElementRef, Optional, ViewChild } from "@angular/core";
import * as imp from "../customerorderimport";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { CashreceiptService, HandlingBackMessages } from "../../cash-receipt/cash-receiptimport";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";import { PrintDetailModel } from "src/app/core/Models/Shared/print-detail-model";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CashreceiptlistComponent } from "../../cash-receipt/cashreceiptlist/cashreceiptlist.component";
import { OrderService } from "../../follow-call-center-order/follow-call-center-order-imports";
import { OrderInsuranceComponent } from "../../order-insurance/order-insurance/order-insurance.component";
declare var $: any;

@Component({
  selector: "app-customer-order-list",
  templateUrl: "./customer-order-list.component.html",
  styleUrls: ["./customer-order-list.component.scss"]
})
export class CustomerOrderListComponent extends imp.GenericGridList implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  public orderDateFormat: any = { type: "date", format: "dd-MM-yyyy hh:mm a" };
  public onlyDateFormat: any = { type: "date", format: "dd-MM-yyyy" };
  @ViewChild("Grid", { static: false }) grid: imp.GridComponent;
  @ViewChild("searchKeyList", { static: false }) searchKeyList: ElementRef;

  //#endregion

  //#region Constructor
  constructor(
    public customerOrderSer: imp.CustomerOrderService,
    public cashreceiptSer: CashreceiptService,
    public toastr: imp.ToastrService,
    public toastrMessage:HandlingBackMessages,
    public shared: imp.ISharedGridList,
    public messages: imp.HandlingBackMessages,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private general: imp.general,
    public orderServ:OrderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: any,
  ) {
    super(shared);
    this.initializeobjects();
  }
  //#endregion
  //#region Angular Life Cycle
  ngOnInit(): void {
    this.payFlds = { text: "Name", value: "DocumentId" };
    this.initScreen();
  }
  initScreen() {
    this.getGrideList().subscribe(() => {
      if (this.responseobj && this.responseobj.List && this.responseobj.List.length > 0) {
        this.dataList = this.general.deepCopy(this.responseobj.List);
        if(this.dialogData?.isPopUp){
          this.toolbarOptions = null;
          if(!this.dialogData?.CustomerOrderIds) this.dialogData.CustomerOrderIds = []
          this.responseobj.List = this.responseobj.List.filter(x=> this.dialogData?.CustomerOrderIds.includes(x.DocumentId));
        }

        this.responseobj.List.forEach((o) => {
          o.PayedAmount = 0;
          if (this.responseobj.CashReceiptList && this.responseobj.CashReceiptList.length > 0) {
            let cashRec = this.responseobj.CashReceiptList.filter((c) => c.CustomerOrderDocumentId == o.DocumentId);
            if (cashRec && cashRec.length > 0)
              o.PayedAmount = cashRec.map((x) => Number(x.Amount)).reduce((next, current) => next + current, 0);
          }
          if(o.Processed){
            o.RemainingAmount = 0;
            o.PayedAmount = o.SubTotal;
          }else{
            o.RemainingAmount = o.SubTotal - o.PayedAmount;
          }
        });
      }

    });
  }

  //#endregion

  //#region CashReceiptList Methods

  initializeobjects(): void {
    this.responseobj = {};
    if (!this.printDetailobj) this.printDetailobj = new PrintDetailModel();
    this.setServiceAndRouteName(this.customerOrderSer,'/CustomerOrders');
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.filterOptions = {
      type: "Menu"
    };
  }
  openCashReceiptPopUp(data) {
    this.orderPayTypes = [];
    this.cashreceiptSer.cashFirstOpen().subscribe((res: any) => {
      this.orderPayTypes = res?.orderPayTypes?.filter(p=>p.PayType == 10 || p.PayType == 30 );
    });
    this.cashReceipt = {
      CustomerName: data.CustomerName,
      Date: new Date(),
      CustomerId: data.CustomerId,
      CustomerDocumentId: data.CustomerDocumentId,
      CustomerOrderDocumentId: data.DocumentId
    };
    setTimeout(() => {
      $("#CashReceipt").modal("show");
      this.removeBackdrop();
    }, 50);
  }
  submitCashReceipt(form) {
    if (!form || !form.form || !form.form.valid) return false;
    if (this.cashReceipt) {
      this.cashreceiptSer.Transactions(this.cashReceipt, "Post").subscribe((res) => {
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
        $("#CashReceipt").modal("hide");
        this.PrintCashReceipt();
        this.initScreen();
      });
    }
  }

  PrintCashReceipt() {
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
    this.cashreceiptSer.print(this.model).subscribe((data: Response) => {
      this.loading = false;
      this.report.loadDocument(data);
      this.viewer.report = this.report;
      this.viewer.renderHtml("myviewer");
      $("#modal-5").modal("show");
    });
    this.ifPerview = false;
    this.removeBackdrop();

    return false;
  }
  public onRowDataBound(args: any): void {
    const remainingAmount = args.data.RemainingAmount;
    if (remainingAmount > 0) 
      // args.row.style.backgroundColor = 'yellow';
      args.row.style.backgroundColor = 'orange';
  }

  openCashReceiptListPopUp(customerOrder){
    const cashRec = this.responseobj.CashReceiptList.filter((c) => c.CustomerOrderDocumentId == customerOrder.DocumentId);
    this.cashReceiptOpen = true;
    const dialogRef = this.dialog.open(CashreceiptlistComponent, {
      width:"50%",
      data: { isPopUp: true ,title:'manageorder.PaymentDetails', CashReceiptIds :cashRec?.map(x=>x.CustomerOrderDocumentId)} ,// Optional: pass data to dialog component
      direction: JSON.parse(localStorage.getItem('langs')) == 'ar'? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.cashReceiptOpen = false;
    });
    this.removeBackdrop();
  }
  PrintReceipt(customerOrder){
    this.rowData = customerOrder;
    super.Print();
    this.removeBackdrop();
  }

  // PrintBundeldReceipt(customerOrder){
  //   this.orderServ.PrintBundeldReceipt(customerOrder).subscribe();
  // }

  removeBackdrop(){

    // setTimeout(() => {
    //   $('.modal-backdrop.fade.show').removeClass('modal-backdrop');
    // }, 450);

    let counter = 0;
    const interval = setInterval(() => {
      $('.modal-backdrop.fade.show').removeClass('modal-backdrop');
      counter++;
      if (counter >= 10) {
        clearInterval(interval); // Stop the interval after 10 iterations
      }
    }, 150);
  }
  openOrderInsuranceComponent(customerOrder){
    const dialogRef = this.dialog.open(OrderInsuranceComponent, {
      width:"70%",
      maxHeight: '95vh',
      data: { isPopUp: true ,title:'manageorder.PaymentDetails', customerOrder} ,// Optional: pass data to dialog component
      direction: JSON.parse(localStorage.getItem('langs')) == 'ar'? 'rtl' : 'ltr'
    });
  }
  ngAfterViewInit() {
    // Focus the input element after the view has been initialized
    this.searchKeyList?.nativeElement?.focus();
  }
  filterList(searchterm: any) {
    this.searchBySerial = undefined
    if (!searchterm.key) this.searchKey = undefined;
    if (searchterm.target.value && searchterm.key) {
      if (Number(searchterm.target.value) >= 0) {
        //search by phone 
        this.responseobj.List = this.dataList.filter(
          (x) =>
            x?.CustomerPhone?.includes(searchterm.target.value) ||
            x.Customer?.CustomerBarcode?.includes(searchterm.target.value)||
            searchterm.target.value.includes(x.Customer?.CustomerBarcode)
            // x.SerialNumber == searchterm.target.value
        );
      } else {
        //search by name
        this.responseobj.List = this.dataList.filter((x) =>
          x?.CustomerName?.toLowerCase().includes(searchterm.target.value.toLowerCase() ||
          x.Customer?.CustomerBarcode?.includes(searchterm.target.value)) || 
          searchterm.target.value.includes(x.Customer?.CustomerBarcode)
        );
      }
    } else {
      this.responseobj.List = this.dataList;
    }
  }

  fileterBySerial(searchterm: any) {
    this.searchKey = undefined
    if (!searchterm.key) this.searchBySerial = undefined;
    if (searchterm.target.value && searchterm.key) {
      if (Number(searchterm.target.value) >= 0) {
        //search by serial 
        this.responseobj.List = this.dataList.filter(
          (x) =>
            x.SerialNumber == searchterm.target.value
        );
      } 
    } else {
      this.responseobj.List = this.dataList;
    }
  }
  fileterByReceiver(searchterm: any) {
    this.searchKey = undefined
    this.searchBySerial = undefined;
    if (searchterm?.target?.value && searchterm?.key) {
      this.responseobj.List = this.dataList?.filter((x) =>x?.ReceiverName?.toLowerCase().includes(searchterm.target.value.toLowerCase()) );
    }
    else{
      this.responseobj.List = this.dataList; /// should be refactored
    }
  }
}
