import { Component, DoCheck, OnInit, ViewChild } from "@angular/core";
import * as imp from "../itemtransferrequest-imports";
import {
  PageSettingsModel,
  EditSettingsModel,
  FilterSettingsModel,
  ToolbarItems,
  CommandModel,
  GridComponent
} from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { Router } from "@angular/router";
import { ItemtransferrequestService } from "src/app/core/Services/Transactions/itemtransferrequest.service";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-itemtransferrequestlist",
  templateUrl: "./itemtransferrequestlist.component.html",
  styleUrls: ["./itemtransferrequestlist.component.css"]
})
export class ItemtransferrequestlistComponent extends imp.GenericGridList implements imp.OnInit {
  [key: string]: any;
  @ViewChild("Grid", { static: false }) grid: imp.GridComponent;
  constructor(
    private itemtransferrequestService: imp.ItemtransferrequestService,
    public shared: imp.ISharedGridList,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    super(shared);
    this.initializeobjects();
  }
  // ngOnInit() {
  //   this.getAllItemtransfeRrequest();
  //   this.initializeGrid();
  // }
  ngOnInit() {
    super.getGrideList().subscribe(() => {
      this.itemtransferrequestlist = this.responseobj.List;
    });
    super.initializeGrid();
  }

  getAllItemtransfeRrequest() {
    this.itemtransferrequestService.GetAllItemTransferRequests().subscribe((res) => {
      this.itemtransferrequestlist = super.responseobj;
    });
  }

  initializeobjects() {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    super.setServiceAndRouteName(this.itemtransferrequestService, "/transferrequest");
    super.setCustomButton1ToolTipAndIcon("Sync", "e-sync");
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

  customButton1Action() {
    this.itemtransferrequestService.addItemTransferRequestToFerpAsync(this.rowData).subscribe((res) => {
      this.shared.toastr.success(this.shared.toastrMessage.GlobalMessages(res));
      this.ngOnInit();
      //this.itemtransferrequestlist = super.responseobj;
    });
  }
  deleteButtonAction() {
    if (this.rowData.Amount == 645) {
      this.shared.toastr.error(this.shared.toastrMessage.GlobalMessages(19));
      return;
    } else super.deleteButtonAction();
  }
  // editButtonAction(){
  //   // if(this.rowData.IsSync==true || this.rowData.Sent)
  //   //   super.showActionButton('Edit',false);
  //   // else
  //   //   super.editButtonAction();
  // }
}
