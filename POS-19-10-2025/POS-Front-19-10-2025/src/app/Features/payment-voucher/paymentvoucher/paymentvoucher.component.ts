import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../payment-voucherimport";

declare var $: any;

@Component({
  selector: "app-paymentvoucher",
  templateUrl: "./paymentvoucher.component.html",
  styleUrls: ["./paymentvoucher.component.css"]
})
export class PaymentvoucherComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  responseobj: imp.PaymentVoucherModel = new imp.PaymentVoucherModel();
  //#endregion

  //#region Constructor
  constructor(
    public paymentvoucherSer: imp.PaymentVoucherService,
    private toastr: imp.ToastrService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private router: imp.Router
  ) {
    super();
    //this.pageNumber=this.router.getCurrentNavigation().extras as number;
    this.initializeobjects();
  }
  //#endregion

  //#region CashReceipt Methods
  initializeobjects(): void {
    this.service = this.paymentvoucherSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.comboflag = false;
    this.responseobj.CustomerOrEmployee = "2";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion

  //#region Angular Life Cycle
  ngOnInit() {
    this.scrFirstOpen();
  }
  //#endregion

  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({});
        this.comboflag = true;
        break;
    }
  }

  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }

  beforeinsert(event) {
    // this.paymentvoucherobj.EmpsList=[];
    // this.paymentvoucherobj.CustomerList=[];
    if (this.paymentvoucherobj.EmployeeId != null || this.paymentvoucherobj.EmployeeId == 0) {
      this.comboboxemployeesslist2.forEach((element) => {
        if (this.paymentvoucherobj.EmployeeId == element.Id) {
          this.DynamicCombo.FlagValue = this.paymentvoucherobj.EmployeeId;
          this.DynamicCombo.FlagName = element.Name;
          this.list.push(this.DynamicCombo);
          this.DynamicCombo = new imp.DynamicCombo();
        }
      });

      this.paymentvoucherobj.EmpsList = this.list;
      this.list = [];
    }
    if (this.paymentvoucherobj.CustomerId != null || this.paymentvoucherobj.CustomerId == 0) {
      this.comboboxcustomerslist2.forEach((element) => {
        if (this.paymentvoucherobj.CustomerId == element.Id) {
          this.DynamicCombo.FlagValue = this.paymentvoucherobj.CustomerId;
          this.DynamicCombo.FlagName = element.Name;
          this.list.push(this.DynamicCombo);
          this.DynamicCombo = new imp.DynamicCombo();
        }
      });

      this.paymentvoucherobj.CustomerList = this.list;
      this.list = [];
    }
  }

  CustomerChange(data) {
    var target = data.target;
    if (target.checked == true) {
    } else {
    }
  }
}
