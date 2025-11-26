import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../paymentsystemimport";
declare let $: any;

@Component({
  selector: "app-payment-system",
  templateUrl: "./payment-system.component.html",
  styleUrls: ["./payment-system.component.scss"]
})
export class PaymentSystemComponent extends imp.general implements imp.OnInit {
  language: string;
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public Flld = { text: "Name", value: "DocumentId" };
  public Flds = { text: "Name", value: "Id" };
  // public paymentSystems=[{"Name":"Ingenico","Id":1},{"Name":"Infoteks","Id":2}];
  constructor(
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public PaymentSystemSer: imp.PaymentSystemService,
    private router: imp.Router,
    public SettingSer: imp.SettingService
  ) {
    super();
    this.initializeobjects();
  }

  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      this.paymentSystemFirstOpen();
      this.enableChiled = false;
      if (this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
    });
  }
  paymentSystemFirstOpen() {
    this.PaymentSystemSer.paymentSystemFirstOpen().subscribe((res) => {
      this.orderPayTypes = res["orderPayTypes"];
      this.paymentSystems = res["paymentSystems"];
      this.ingenicoPaymentTypes = res["ingenicoPaymentTypes"];
    });
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.PaymentSystemSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;

    this.languageSerService.currentLang.subscribe((lan) => {
      this.language = lan;
      this.translate.use(this.language);
    });
  }

  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({});
        this.enableChiled = true;
        if (this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        this.enableChiled = false;
        if (this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        break;
      case imp.quickAction.afterModify:
        if (this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        this.enableChiled = true;
        break;
      case imp.quickAction.afterUndo:
        if (this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        this.enableChiled = false;
        break;
    }
  }

  //#region
  addSystemPayments() {
    if (!this.responseobj.SystemPayments) this.responseobj.SystemPayments = [];
    this.responseobj.SystemPayments.push({});
  }
  deleteSystemPayments(index) {
    this.responseobj.SystemPayments.splice(index, 1);
  }
  //#endregion
}
