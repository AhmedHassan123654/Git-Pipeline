import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../customerimport";
import { SettingModel } from "../../sales-target/sales-target-imports";
import { OrderHelper } from "../../order/OrderHelper";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.css"]
})
export class CustomerComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  required:boolean = false;
  //#endregion

  constructor(
    public CustomerService: imp.CustomerService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private router: imp.Router,
    private settingServ: imp.SettingService,
  ) {
    super();
    this.initializeobjects();
    this.getSettings();
  }

  ngOnInit() {
    this.scrFirstOpen().subscribe((res) => {
         this.setUseTaxNo();
    });
  }
  //#region OperationMenu
  setUseTaxNo(){
    if(this.responseobj?.TaxNo)
      this.responseobj.UseTaxNumber = true;
  }
  quickEvents(event: imp.quickAction): void {
    this.setUseTaxNo();
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({});
        this.enableChiled = true;
        break;
      case imp.quickAction.beforeAdd:
        if (
          this.responseobj != undefined &&
          (this.responseobj.InActive == null || this.responseobj.InActive == undefined)
        ) {
          this.responseobj.InActive = false;
        }
        this.beforeAdd({ comboLists: [], comboValues: [] });
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        this.enableChiled = false;
        break;
      case imp.quickAction.afterModify:
        this.preAddUpdate({});
        this.enableChiled = true;
        break;
      case imp.quickAction.afterUndo:
        this.enableChiled = false;
        break;
    }
    setTimeout(() => {
      if(this.responseobj && !this.responseobj.CustomerGroupDocumentId )
        this.responseobj.CustomerGroupDocumentId = OrderHelper.getDefaultCustomerGroup(this.CustomerGroupList)?.FlagValue;
    }, 100);

  }
  //#endregion
  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
    this.setUseTaxNo();
  }
  //#endregion
  /*  customerFirstOpen() {
    this.customerSer.FirstOpen().subscribe((res) => {
      this.customerobj = res as imp.CustomerModel ;
    });
  } */

  // Start : First open
  clearobject() {
    this.customerobj = new imp.CustomerModel();
  }

  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.CustomerService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  getSettings(){
    this.settingServ.GetSettings().subscribe(res=>{
      this.Settings = res as SettingModel;
      if(this.Settings.FinancialSystem === 4){
        this.required = true;
      }
    })
  }

}
