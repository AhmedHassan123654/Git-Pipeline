import * as imp from "../cash-receiptimport";
import { Component, Inject, Optional, ViewChild } from "@angular/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
declare let $: any;
@Component({
  selector: "app-cashreceiptlist",
  templateUrl: "./cashreceiptlist.component.html",
  styleUrls: ["./cashreceiptlist.component.css"]
})
export class CashreceiptlistComponent extends imp.GenericGridList implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("Grid", { static: false }) grid: imp.GridComponent;
  //#endregion

  //#region Constructor
  constructor(
    public cashreceiptService: imp.CashreceiptService,
    public shared: imp.ISharedGridList,
    public languageSerService: LanguageSerService,
    private translate: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: any,
  ) {
    super(shared);
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.initializeobjects();
  }
  //#endregion
  ngOnInit() {
    super.getGrideList().subscribe(() => {
      if(this.dialogData?.isPopUp){
        this.toolbarOptions = null;
        if(!this.dialogData.CashReceiptIds) this.dialogData.CashReceiptIds = [];
        this.responseobj.List = this.responseobj.List.filter(x=> this.dialogData?.CashReceiptIds?.includes(x.CustomerOrderDocumentId));
      }
    });
    super.initializeGrid();
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  initializeobjects(): void {
    super.setServiceAndRouteName(this.cashreceiptService, "/cashreceipt");
  }
  PrintReceipt(cashreceipt){
    this.rowData = cashreceipt;
    super.Print();
    // this.removeBackdrop();

    setTimeout(() => {
      $('.modal-backdrop.fade.show').removeClass('modal-backdrop');
      
    }, 450);
  }

}
