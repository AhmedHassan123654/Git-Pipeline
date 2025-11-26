import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { general } from "src/app/core/Helper/general";
import { ApprovedReturnOrderService, LanguageSerService, DashboardService, HandlingBackMessages } from "../approved-imports";

@Component({
  selector: "app-return-order-approved",
  templateUrl: "./return-order-approved.component.html",
  styleUrls: ["./return-order-approved.component.scss"]
})
export class ReturnOrderApprovedComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  //#endregion
  constructor(
    public ApprovedService: ApprovedReturnOrderService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private router: Router,
    public dashboardSer: DashboardService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages
  ) {
    super();
    this.initializeobjects();
  }

  ngOnInit(): void {
    this.GetData();
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.ApprovedService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  GetData() {
    this.ApprovedService.GetReturnOrderEnumList().subscribe((data) => {
      this.ReturnOrderEnumList = data;
      this.ReturnOrderEnumList = this.ReturnOrderEnumList.map((val) => {
        return {
          Name: this.translate.instant("setting." + val.Name),
          Id: val.Id
        };
      });
      this.Flds = { text: "Name", value: "Id" };
    });
    this.dashboardSer.getAllUsersInfo().subscribe((res) => {

      this.UserList = res as any;
      this.UserFlds = { text: "UserName", value: "AppUserId" };
    });

    this.ApprovedService.GetNotApprovedReturns().subscribe((res) => {
      this.ReturnOrders = res;
    });
  }
  Save() {
    let list = [];
    this.ReturnOrders.forEach((item) => {
      if (item.Approved) {
        list.push(item);
      }
    });

    this.ApprovedService.UpdateReturnOrder(list).subscribe((res) => {
      if (res == 2) {
        this.toastr.info(this.toastrMessage.GlobalMessages(res));
        this.GetData();
      }
    });
  }
}
