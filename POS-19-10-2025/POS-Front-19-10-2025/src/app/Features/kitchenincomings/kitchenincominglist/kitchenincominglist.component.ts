import { Component, OnInit, ViewChild } from "@angular/core";
import {
  PageSettingsModel,
  EditSettingsModel,
  FilterSettingsModel,
  ToolbarItems,
  CommandModel,
  GridComponent
} from "@syncfusion/ej2-angular-grids";
import { IncomingService } from "src/app/core/Services/Transactions/incoming.service";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { GenericGridList } from "src/app/core/Helper/generic-grid-list";
import { ISharedGridList } from "src/app/core/Helper/ISharedGridList";
export * from "../../../shared/Imports/featureimports";
@Component({
  selector: "app-kitchenincominglist",
  templateUrl: "./kitchenincominglist.component.html",
  styleUrls: ["./kitchenincominglist.component.scss"]
})
export class KitchenincominglistComponent extends GenericGridList implements OnInit {
  incominglist: any;
  pageSettings: PageSettingsModel;
  editOptions: EditSettingsModel;
  filterOptions: FilterSettingsModel;
  cashreceiptobj: any; // = new CashReceiptModel();
  toolbarOptions: ToolbarItems[];
  commands: CommandModel[];
  orderData: object;
  pageNumber: object;
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: GridComponent;
  constructor(
    public incomingService: IncomingService,
    private languageSerService: LanguageSerService,
    public shared: ISharedGridList
  ) {
    super(shared);
    this.initializeobjects();
  }
  ngOnInit() {
    super.getGrideList().subscribe(() => {});
    super.initializeGrid();
  }

  getAllIncoming() {
    this.incomingService.GetAllIncomings().subscribe((res) => {
      this.incominglist = res as any; // CashReceiptModel[];
    });
  }
  initializeobjects(): void {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.shared.translate.use(this.language);
    super.setServiceAndRouteName(this.incomingService, "/incoming");
    super.showActionButton("Edit", false);
    super.showActionButton("Delete", false);
    // this.responseobj=[];
    // this.service = this.incomingService;
    // this.showEdit=false;
    // this.showDelete =false;
  }
}
