import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../return-insurance-import";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { CustomerModel } from "src/app/core/Models/Transactions/CustomerModel";
import { OrderService } from "src/app/core/Services/Transactions/order.service";

declare var Stimulsoft: any;
declare let $: any;
@Component({
  selector: "app-return-insurance",
  templateUrl: "./return-insurance.component.html",
  styleUrls: ["./return-insurance.component.scss"]
})
export class ReturnInsuranceComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  Flds = { text: "Name", value: "DocumentId" };
  oading: boolean = true;
  hasManyInsurance:boolean=false;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  returnOrderDetails:any[]=[];
  customerFlds = { text: "Name", value: "DocumentId" };
  //#endregion

  constructor(
    public ReturnOrderInsuranceSer: imp.ReturnOrderInsuranceService,
    public router: imp.Router,
    public toastr: imp.ToastrService,
    public toastrMessage: imp.HandlingBackMessages,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    public orderService: OrderService,
    private SettingSer: imp.SettingService
  ) {
    super();
    this.initializeobjects();
    this.getCustomers(this.responseobj.CustomerName);
  }
  //#region Angular Life Cycle
  ngOnInit(): void {
    this.hasManyInsurance = false;
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Edit = false;
      if (
        this.responseobj.ReturnOrderInsuranceDetails != undefined &&
        this.responseobj.ReturnOrderInsuranceDetails != null
      ) {      
        this.responseobj.ReturnOrderInsuranceDetails.forEach((item) => {
          item.Total = item.OrderInsurancePrice * item.ReturnOrderInsuranceQuentity;
          if (item.RemainingQuentity < 0) item.RemainingQuentity = 0;
        });
        this.returnOrderDetails=this.responseobj.ReturnOrderInsuranceDetails;
      }

      if (this.request.currentAction == "Add") {
        this.responseobj.ReturnInsuranceDate = new Date();
        this.responseobj.screenPermission.Edit = false;
        this.responseobj.ReturnOrderInsuranceDetails = [];
        if (this.request.secondcurrentAction == "AddFromOrder") {
          let screenPermission = this.responseobj.screenPermission
            ? this.cloneList(this.responseobj.screenPermission)
            : this.responseobj.screenPermission;
          let Count = this.responseobj.Count;
          let PayTypes = this.responseobj.PayTypes;
          if (this.request.DocumentId) {
            this.responseobj.OrderInsuranceNumber = this.request.SerialNumber;
            this.getInsuranceForReturn();
            this.responseobj.screenPermission = screenPermission;
            this.request.Count = Count;
            this.responseobj.Count = Count;
            this.responseobj.PayTypes = PayTypes;
          }
        } else {
          this.SelectReturnForOldInsurance();
        }
      }

      if (this.request.currentAction == "AddFromOrderInsurance") {
        this.responseobj.ReturnInsuranceDate = new Date();
        this.responseobj.screenPermission.Edit = false;
      }
    });
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));

    this.translate.use(this.language);
    this.GetSettings();
  }
  //#endregion
  SelectReturnForOldInsurance() {
    if (this.order) {
      let screenPermission = this.responseobj.screenPermission
        ? this.cloneList(this.responseobj.screenPermission)
        : this.responseobj.screenPermission;
      let Count = this.responseobj.Count;
      let PayTypes = this.responseobj.PayTypes;

      if (this.order.OrderInsurance && this.order.OrderInsurance.DocumentId) {
        this.responseobj.OrderInsuranceNumber = this.order.OrderInsurance.SerialNumber;
        this.getInsuranceForReturn();
      } else if (this.order.OrderInsuranceItems && this.order.OrderInsuranceItems.length > 0) {
        let returnInsurance = {
          OrderInsuranceDate: this.order.CreationTime,
          ReturnInsuranceDate: new Date(),
          ReturnOrderInsuranceDetails: [],
          OrderInsuranceCustomer: this.order.CustomerName,
          OrderInsuranceCustomerPhone: this.order.CustomerPhone
        };

        this.order.OrderInsuranceItems.forEach((i) => {
          returnInsurance.ReturnOrderInsuranceDetails.push({
            InsuranceName: i.Name,
            InsuranceDocumentId: i.InsuranceDocumentId,
            OrderInsuranceQuentity: i.Quantity,
            OrderInsurancePrice: i.Price,
            ReturnOrderInsuranceQuentity: 0,
            RemainingQuentity: Number(i.Quantity) - Number(i.ReturnQuantity)
          });
        });
        this.responseobj = this.clone(returnInsurance);

        if (
          this.responseobj.ReturnOrderInsuranceDetails != undefined &&
          this.responseobj.ReturnOrderInsuranceDetails != null
        ) {
          this.responseobj.ReturnOrderInsuranceDetails.forEach((item) => {
            item.Total = item.OrderInsurancePrice * item.ReturnOrderInsuranceQuentity;
            if (item.RemainingQuentity < 0) item.RemainingQuentity = 0;
          });
        }
        this.responseobj.OldOrderDocumentId = this.order.DocumentId;
        this.ReturnOrderInsuranceSer.GetMaxSerialNumber().subscribe((res: number) => {
          this.responseobj.SerialNumber = res;
        });
      }
      this.responseobj.screenPermission = screenPermission;
      this.request.Count = Count;
      this.responseobj.Count = Count;
      this.responseobj.PayTypes = PayTypes;
    }
  }
  //#region CashReceipt Methods
  initializeobjects(): void {
    this.languageSerService.currentLang.subscribe((lan) => this.translate.use(lan));
    this.responseobj = {};
    this.printDetailobj = {};
    this.service = this.ReturnOrderInsuranceSer;
    let request = this.router.getCurrentNavigation().extras as any;
    if (
      request &&
      ((request.OrderInsuranceItems && request.OrderInsuranceItems.length > 0) ||
        (request.OrderInsurance && request.OrderInsurance.DocumentId))
    ) {
      this.order = request;
      this.request = { currentAction: "Add" };
    } else this.request = request;
  }
  //#endregion

  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    // debugger
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({ dateFields: ["ReturnInsuranceDate"] }).subscribe(() => {
          //  let x = this.responsedata;
          //Empty
          this.enableChiled = true;
        });
        break;
      case imp.quickAction.beforeAdd:
        // this.enableChiled = false;
        if (
          !this.responseobj.ReturnOrderInsuranceDetails ||
          this.responseobj.ReturnOrderInsuranceDetails.length === 0
        ) {
          this.toastr.warning("The Return Order Insurance Details Is Required");
          if (this.frmRef.form.valid && this.frmRef.form.valid == true) this.frmRef.form.setErrors({ invalid: true });
        }
        if (this.responseobj.ReturnOrderInsuranceDetails || this.responseobj.ReturnOrderInsuranceDetails.length > 0) {
          let exist = this.responseobj.ReturnOrderInsuranceDetails.find((x) => {
            let num =  parseInt(x.ReturnOrderInsuranceQuentity)
            if(num > 0 && num <= x.RemainingQuentity)
              return x;
          });
          if (!exist) {
            this.toastr.warning("The ReturnOrderInsuranceQuentity Must be More Than 0");
            if (this.frmRef.form.valid && this.frmRef.form.valid == true) this.frmRef.form.setErrors({ invalid: true });
          }
        }
        break;
      case imp.quickAction.afterAdd:
        // this.afterAdd();
        this.enableChiled = false;

        this.PrintAfterAdd();
        this.hasManyInsurance=false;
        this.returnOrderDetails = null;
        this.responseobj.ReturnInsuranceDate=null;
        this.responseobj.PayTypeDocumentId=null;
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        break;
      case imp.quickAction.afterUndo:
        this.hasManyInsurance = false;
        this.scrFirstOpen().subscribe(() => {
          this.responseobj.screenPermission.Edit = false;
          if (
            this.responseobj.ReturnOrderInsuranceDetails != undefined &&
            this.responseobj.ReturnOrderInsuranceDetails != null
          ) {
            this.responseobj.ReturnOrderInsuranceDetails.forEach((item) => {
              item.Total = item.OrderInsurancePrice * item.ReturnOrderInsuranceQuentity;
            });
            this.returnOrderDetails=this.responseobj.ReturnOrderInsuranceDetails;
          }
        });
        break;
    }
  }
  //#endregion

  //#region Pagger
  afterPag(event: any): void {

    this.formPaging({ formObj: event });
    this.returnOrderDetails=event.ReturnOrderInsuranceDetails;
    this.returnOrderDetails.forEach((item) => {
      item.Total = item.OrderInsurancePrice * item.ReturnOrderInsuranceQuentity;
      if (item.RemainingQuentity < 0) item.RemainingQuentity = 0;
    });
  }
  //#endregion

  SetReturnOrderInsurance() {

    this.responseobj.ReturnOrderInsuranceDetails.forEach((item) => {
      let ReturnOrderInsuranceQuentity = Number(item.ReturnOrderInsuranceQuentity);
      if (ReturnOrderInsuranceQuentity == 0) {
        this.toastr.warning(this.toastrMessage.GlobalMessages(19));
        return true;
      }
      if (item.RemainingQuentity < ReturnOrderInsuranceQuentity) {
        item.ReturnOrderInsuranceQuentity = 0;
        this.toastr.warning(this.toastrMessage.GlobalMessages(18));
        return true;
      } else {
        item.Total = item.OrderInsurancePrice * ReturnOrderInsuranceQuentity;
      }
    });
  }
  getInsuranceForReturn() {
    this.ReturnOrderInsuranceSer.GetOrderInsirance(this.responseobj?.OrderInsuranceNumber).subscribe((res:any) => {
      // this.responseobj = res
      res.ReturnOrderInsuranceDetails.forEach((detail : any) => {
        detail.ReturnOrderInsuranceQuentity = detail.RemainingQuentity;
      });
      this.returnOrderDetails =  res.ReturnOrderInsuranceDetails

      this.responseobj.ReturnInsuranceDate = new Date();
      this.responseobj.PayTypeDocumentId = res.PayTypeDocumentId;
      this.responseobj.OrderInsuranceDate = res.OrderInsuranceDate;
      this.responseobj.ReturnOrderInsuranceDetails=this.returnOrderDetails;
      this.responseobj.CustomerDocumentId = res.CustomerDocumentId;
      this.responseobj.OrderInsuranceDocumentId = res.OrderInsuranceDocumentId;
    });
  }
  
  GetSettings() {
    this.SettingSer.GetSettings().subscribe((res) => {
      this.settings = res as any;
      this.printDetailobj.LanguageId = this.settings.SystemMainLanguage;
    });
  }
  PrintAfterAdd() {
    this.model = [];
    if (this.printDetailobj.LanguageId == 1) {
      this.model.push("");
      this.myjson = en["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.model.push("");
      this.myjson = ar["Reports"];
      this.model.push(this.myjson);
      this.model.push("ar");
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.model.push("");
      this.myjson = tr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.model.push("");
      this.myjson = fr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    this.model.push(this.printDetailobj.PrintModelId);
    this.model.push(this.printDetailobj.DestinationId);
    this.model.push(this.printDetailobj.FileFormatId);

    if (this.printDetailobj.DestinationId == 2) {
      this.model.push(this.printDetailobj.Reciever);
      this.model.push(this.printDetailobj.Title);
      this.model.push(this.printDetailobj.Message);
      this.ifPerview = false;
    } else {
      this.ifPerview = true;
    }

    this.ReturnOrderInsuranceSer.printAfterAdd(this.model).subscribe((data: Response) => {

      this.loading = false;
      this.report.loadDocument(data);
      this.viewer.report = this.report;
      this.viewer.renderHtml("myviewer");
      $("#modal-5").modal("show");
    });
    this.ifPerview = false;

    return false;
  }

  getCustomers(CustomerName) {
    let model: CustomerModel = new CustomerModel();
    if (!CustomerName) model.Phone = "0";
    model.Name = CustomerName;
    this.orderService.GetCustomerByMobileOrName(model).subscribe((res) => {
      this.customers = res as CustomerModel[];
    });
  }

// filterCustomers(searchterm: any) {
//     let model: CustomerModel = new CustomerModel();
//     if (searchterm.target.value.length >= 3) {
//       if (Number(searchterm.target.value) > 0) {
//         //search by phone
//         model.Phone=searchterm.target.value;
//       }else{
//         //search by name
//         model.Name=searchterm.target.value;
//       }
//       this.orderService.GetCustomerByMobileOrName(model).subscribe((res) => {
//         this.customers = res as CustomerModel[];
//         //assign first customer of the search result
//         this.setCustomer(this.customers[0]?.DocumentId);
//       });
//     }
//   }
  filterCustomers(searchterm?: any) {
    let model: CustomerModel = new CustomerModel();
    if (searchterm?.text?.length >= 3) {
      //search by phone
      if (Number(searchterm?.text) > 0)
        model.Phone = searchterm?.text;
        //search by name
      else
        model.Name = searchterm?.text;

        this.orderService.GetCustomerByMobileOrName(model).subscribe((res) => {
        this.customers = res as CustomerModel[];
        //assign first customer of the search result
        // this.setCustomer(this.customers[0]?.DocumentId);
      });
    }
  }
  
  setCustomer(CustomerDocumentId) {
    if (!this.customers) this.customers = [];
    let customer = this.customers.filter((c) => c.DocumentId == CustomerDocumentId)[0];
    if (customer) {
      this.ReturnOrderInsuranceSer.GetOrderInsiranceToCustomer(customer.DocumentId).subscribe((res) => {
        this.responseobj = res as any;
        this.responseobj.OrderInsuranceCustomer = customer;
        this.responseobj.CustomerId = customer.Id;
        this.responseobj.CustomerDocumentId = customer.DocumentId;
        this.responseobj.CustomerName = customer.Name;
        this.responseobj.OrderInsuranceCustomerPhone = customer.Phone;
        if(this.responseobj.length==1)
        { 
          this.responseobj=this.responseobj[0]
          this.responseobj.ReturnOrderInsuranceDetails.forEach((ReturnOrderInsuranceDetail) => {
          ReturnOrderInsuranceDetail.ReturnOrderInsuranceQuentity = ReturnOrderInsuranceDetail.RemainingQuentity;
          });
          this.responseobj.ReturnInsuranceDate = new Date();
          this.returnOrderDetails=this.responseobj.ReturnOrderInsuranceDetails;
          this.hasManyInsurance=false;
        }
        else{
          this.hasManyInsurance=true;
        }
      });
    }
  }
  clearCustomer(event: any) {
    if (!event.value) {
      // User cleared the ComboBox using the X
      this.responseobj.ReturnInsuranceDate = new Date();
      this.responseobj.PayTypeDocumentId = "";
      this.responseobj.OrderInsuranceNumber = undefined;
      this.responseobj.OrderInsuranceDate = undefined;
      this.responseobj.ReturnOrderInsuranceDetails=undefined;
      this.responseobj.CustomerDocumentId = undefined;
      this.responseobj.OrderInsuranceDocumentId = undefined;
      this.responseobj.OrderInsuranceCustomer = undefined;
      this.responseobj.OrderInsuranceCustomerPhone = undefined;
      this.responseobj.CustomerId = undefined;
      this.responseobj.CustomerName = "";
      this.returnOrderDetails = [];
      this.hasManyInsurance = false;
    }
  }
}
