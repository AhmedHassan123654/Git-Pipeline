import * as imp from "../cash-receiptimport";
import { Component, ViewChild } from "@angular/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import { CustomerModel } from "../../../core/Models/Transactions/CustomerModel";
import { OrderService } from "../../../core/Services/Transactions/order.service";
import { HandlingBackMessages } from "../cash-receiptimport";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";

declare let $: any;

@Component({
  selector: "app-cashreceipt",
  templateUrl: "./cashreceipt.component.html",
  styleUrls: ["./cashreceipt.component.css"]
})
export class CashreceiptComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;

  @ViewChild("frmRef") frmRef;
  //#endregion

  //#region Constructor
  constructor(
    public cashreceiptSer: imp.CashreceiptService,
    public orderSer: OrderService,
    public router: imp.Router,
    public toastr: imp.ToastrService,
    public toastrMessage: HandlingBackMessages,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private settingServ: imp.SettingService,
  ) {
    super();
    this.initializeobjects();
    this.getCustomers(this.responseobj.CustomerName);
    this.getSettings();
  }

  //#endregion

  searchCustomer: string;

  initObj() {
    if (!this.responseobj) this.responseobj = {};
    // this.getCustomers(this.responseobj.CustomerName);
    if (!this.noteobj) this.noteobj = {};
    if (!this.responseobj.CreationTime) this.responseobj.CreationTime = new Date();
  }

  //#region Angular Life Cycle
  ngOnInit(): void {
    this.payFlds = { text: "Name", value: "DocumentId" };
    this.scrFirstOpen().subscribe(() => {
      this.cashFirstOpen();
      if (this.request && (this.request.currentAction == "Edit" || this.request.currentAction == "Add"))
        this.enableChiled = true;
      else this.enableChiled = false;
    });
  }
  //#endregion

  //#region CashReceipt Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.noteobj = {};
    this.service = this.cashreceiptSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  cashFirstOpen() {
    this.cashreceiptSer.cashFirstOpen().subscribe((res: any) => {
      this.orderPayTypes = res.orderPayTypes;
      this.initObj();
    });
  }
  //#endregion


  setCustomer(CustomerDocumentId) {
    if (!this.customers) this.customers = [];
    const customer = this.customers.filter((c) => c.DocumentId == CustomerDocumentId)[0];
    if (customer) {
      this.responseobj.Customer = customer;
      this.responseobj.CustomerId = customer.Id;
      this.responseobj.CustomerDocumentId = customer.DocumentId;
      this.responseobj.CustomerName = customer.Name;
      this.responseobj.CustomerPhone = customer.Phone;
    }
  }

  getCustomers(CustomerName) {
    const model: CustomerModel = new CustomerModel();
    if (!CustomerName) model.Phone = "0";
    model.Name = CustomerName;
    this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
      this.customers = res as CustomerModel[];
    });
  }


  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
    this.initObj();
  }
  //#endregion

  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
        this.initObj();
        this.enableChiled = true;
        this.searchCustomer = "";
        this.afterNew({ dateFields: ["Date"] }).subscribe(() => {
          //  let x = this.responsedata;
          //Empty
        });
        break;
      case imp.quickAction.beforeAdd:
        this.integrationSysCheckValidation();
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        this.initObj();
        this.enableChiled = false;
        break;
      case imp.quickAction.beforeUpdate:
        this.integrationSysCheckValidation();
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        this.initObj();
        this.enableChiled = true;
        break;
      case imp.quickAction.afterUndo:
        this.initObj();
        this.enableChiled = false;
        break;
    }
  }

  //#endregion

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  closedCalender():void {
    console.log();
  }

  submitCustomer(form) {
    if (!form.form.valid) return false;
    this.orderSer.GetCustomerByPhone(this.customerToAdd.Phone).subscribe((res) => {
      if ((res as boolean) == true) {
        this.toastr.warning("this Customer already exist", "Customer");
      } else {
        this.orderSer.PostCustomer(this.customerToAdd).subscribe((res) => {
          if (res == 1) this.toastr.success(this.toastrMessage.GlobalMessages(res));
          else this.toastr.warning(this.toastrMessage.GlobalMessages(res));
          $("#DetailsCustomer").modal("hide");
        });
      }
    });
  }

  filterCustomers(searchterm: any) {
    const model: CustomerModel = new CustomerModel();
    if (searchterm.target.value.length >= 3) {
      if (Number(searchterm.target.value) > 0) {
        //search by phone
        model.Phone = searchterm.target.value;
      } else {
        //search by name
        model.Name = searchterm.target.value;
      }
      model.UseCredit = true;
      this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
        this.customers = res as CustomerModel[];
        //assign first customer of the search result
        this.setCustomer(this.customers[0]?.DocumentId);
      });
    }
  }

  getCustomerBalance() {
    if (!this.requestStarted) {
      this.requestStarted = true;
      if (this.responseobj.CustomerDocumentId) {
        this.cashreceiptSer.getCustomerBalance(this.responseobj.CustomerDocumentId).subscribe(
          (res) => {
            this.CustomerBalance = res;
            this.toastr.success("Done");
            this.requestStarted = false;
          },
          (err) => {
            this.toastr.error(err.error);
            this.requestStarted = false;
          }
        );
      }
    }
  }
  getSettings(){
    this.settingServ.GetSettings().subscribe(res=>{
      this.Settings = res as SettingModel;
      if(this.Settings.FinancialSystem === 4){
        this.required = true;
      }
    })
  }
  integrationSysCheckValidation(){
    if(this.Settings && this.Settings.FinancialSystem === 4 && this.responseobj.Customer && !this.responseobj.Customer.IntegrationCode){
      this.toastr.warning(this.translate.instant("messages.customerHasNoIntegrationCode"));
      this.frmRef.form.setErrors({ 'invalid': true });
      return;
    }
  }

  /*  beforeinsert(event){


this.comboboxcustomerslist2.forEach(element => {
  if(this.cashreceiptobj.CustomerId== element.Id){
    this.DynamicCombo.FlagValue=this.cashreceiptobj.CustomerId;
    this.DynamicCombo.FlagName=element.Name;
  this.list.push(this.DynamicCombo);
  this.DynamicCombo=new imp.DynamicCombo();
  }
});


this.cashreceiptobj.CustomerList=this.list;
this.list=[];


  } */
}
