import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ToastrService } from 'ngx-toastr';
import { CustomerMessageService } from 'src/app/core/Services/Transactions/customer-message.service';
import { GeneralGrid, HandlingBackMessages, SettingService, LanguageSerService } from '../../point-of-sale/pointofsaleimports';

@Component({
  selector: 'app-customer-message-list',
  templateUrl: './customer-message-list.component.html',
  styleUrls: ['./customer-message-list.component.scss']
})
export class CustomerMessageListComponent extends GeneralGrid implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: GridComponent;
  //#endregion
  constructor(
    public customerMessageService: CustomerMessageService,
    private toster: ToastrService,
    private messages: HandlingBackMessages,
    public SettingSer: SettingService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    public Rout: Router
  ) {
    super(toster, messages, SettingSer, Rout);
    this.initializeobjects();
  }
  //#region Angular Life Cycle
  ngOnInit() {
    this.GetGrideList().subscribe(() => {
      this.toolbarList = [];
      // if (this.showNew)
      //   this.toolbarList.push({
      //     text: "",
      //     tooltipText: "Add",
      //     prefixIcon: "e-add",
      //     id: "Add"
      //   });
      // if (this.showView)
      //   this.toolbarList.push({
      //     text: "",
      //     tooltipText: "View",
      //     prefixIcon: "e-view",
      //     id: "View"
      //   });
      // if (this.showEdit)
      //   this.toolbarList.push({
      //     text: "",
      //     tooltipText: "Edit",
      //     prefixIcon: "e-edit",
      //     id: "Edit"
      //   });
      // if (this.showDelete)
      //   this.toolbarList.push({
      //     text: "",
      //     tooltipText: "Delete",
      //     prefixIcon: "e-delete",
      //     id: "Delete"
      //   });
      /*  if(this.showPrint)
    this.toolbarList.push({ text: '', tooltipText: 'Print', prefixIcon: 'e-print', id: "Print" });  */
      this.toolbarOptions = this.toolbarList;
    });
    this.initializeGrid();
    setTimeout(() => {
      this.DisabledGridButton();
    }, 300);
  }
  //#endregion
  //#region Driver Methods
  initializeobjects(): void {
    this.responseobj = [];
    this.service = this.customerMessageService;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/CustomerMessage";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  //#endregion
}
