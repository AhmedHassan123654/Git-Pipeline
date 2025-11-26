import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { GeneralGrid, HandlingBackMessages, SettingService, LanguageSerService } from '../../adminstration/permission-imports';
import { CouponService } from 'src/app/core/Services/Transactions/coupon.service';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.scss']
})
export class CouponListComponent extends GeneralGrid implements OnInit {
  //#region Constructor
  constructor(
    public couponSer: CouponService,
    public toast: ToastrService,
    public messages: HandlingBackMessages,
    public SettingSer: SettingService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    public Router: Router
  ) {
    super(toast, messages, SettingSer, Router);
    this.initializeobjects();
  }
  //#endregion
  //#region Angular Life Cycle
  ngOnInit(): void {
    this.GetGrideList().subscribe(() => {
      this.toolbarList = [];
      if (this.showNew)
        this.toolbarList.push({
          text: "",
          tooltipText: "Add",
          prefixIcon: "e-add",
          id: "Add"
        });
      if (this.showView)
        this.toolbarList.push({
          text: "",
          tooltipText: "View",
          prefixIcon: "e-view",
          id: "View"
        });
      if (this.showEdit)
        this.toolbarList.push({
          text: "",
          tooltipText: "Edit",
          prefixIcon: "e-edit",
          id: "Edit"
        });
      if (this.showDelete)
        this.toolbarList.push({
          text: "",
          tooltipText: "Delete",
          prefixIcon: "e-delete",
          id: "Delete"
        });
      /* if(this.showPrint)
  this.toolbarList.push({ text: '', tooltipText: 'Print', prefixIcon: 'e-print', id: "Print" }); */
      this.toolbarOptions = this.toolbarList;
    });
    this.initializeGrid();
    setTimeout(() => {
      this.DisabledGridButton();
    }, 300);
  }

  //#endregion

  //#region CashReceiptList Methods

  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.couponSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/coupon";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
}
