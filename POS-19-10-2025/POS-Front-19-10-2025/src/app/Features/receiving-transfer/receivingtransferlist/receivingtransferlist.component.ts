import { Component, OnInit, ViewChild } from "@angular/core";
import {
  PageSettingsModel,
  EditSettingsModel,
  FilterSettingsModel,
  ToolbarItems,
  CommandModel,
  GridComponent
} from "@syncfusion/ej2-angular-grids";
import { ReceivingtransferService } from "src/app/core/Services/Transactions/receivingtransfer.service";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { Router } from "@angular/router";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import * as imp from "../../../shared/Imports/featureimports";

@Component({
  selector: "app-receivingtransferlist",
  templateUrl: "./receivingtransferlist.component.html",
  styleUrls: ["./receivingtransferlist.component.css"]
})
export class ReceivingtransferlistComponent extends imp.GenericGridList implements OnInit {
  language: string;
  receivingtransferlist: any;
  pageSettings: PageSettingsModel;
  editOptions: EditSettingsModel;
  filterOptions: FilterSettingsModel;
  cashreceiptobj: any; // = new CashReceiptModel();
  toolbarOptions: ToolbarItems[];
  commands: CommandModel[];
  orderData: object;
  pageNumber: object;
  // public data: Observable<DataStateChangeEventArgs>;
  // public state: DataStateChangeEventArgs;

  @ViewChild("grid") grid: GridComponent;
  constructor(
    public receivingtransferService: ReceivingtransferService,
    public shared: imp.ISharedGridList,
    // private toastr: ToastrService,
    // private toastrMessage: HandlingBackMessages,
    private languageSerService: LanguageSerService,
    public translate: TranslateService // private router: Router
  ) {
    super(shared);
    this.initializeobjects();
  }
  ngOnInit() {
    super.getGrideList().subscribe(() => {});
    super.initializeGrid();
  }

  getAllReceivingTransfers() {
    this.receivingtransferService.getAllReceivingTransfers().subscribe((res) => {
      this.receivingtransferlist = res as any;
    });
  }
  initializeobjects() {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    super.setServiceAndRouteName(this.receivingtransferService, "/RreceivingTransfer");
  }
  onRowSelectedEvent() {
    if (this.rowData.Sent) super.showActionButton("customButton1", false);
    else super.showActionButton("customButton1", true);
    if (this.rowData.IsSync == true || this.rowData.Sent) {
      super.showActionButton("Edit", false);
      super.showActionButton("Delete", false);
    } else {
      super.showActionButton("Edit", true);
      super.showActionButton("Delete", true);
    }
  }
}
