import { Component, Inject, Optional, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../orderInsuranceimport";
import { InsuranceModel } from "src/app/core/Models/Transactions/insurance-model";
import { HandlingBackMessages, OrderModel, ToastrService } from "../../manage-order/manageorderimport";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { DatePipe } from "@angular/common";
import { CustomerModel } from "src/app/core/Models/Transactions/CustomerModel";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { DetailsCustomerComponent } from "../../order/dialogs/details-customer/details-customer.component";
import { BsModalService } from "ngx-bootstrap/modal";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

declare var Stimulsoft: any;
declare let $: any;
@Component({
  selector: "app-order-insurance",
  templateUrl: "./order-insurance.component.html",
  styleUrls: ["./order-insurance.component.scss"]
})
export class OrderInsuranceComponent extends imp.general implements imp.OnInit {
  language: string;
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  oading: boolean = true;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  FLG = { text: "Name", value: "DocumentId" };
  langDirection: string = '';
  loadSettings: boolean = false;
  disableDiscription: boolean = true;
  hidePagination: boolean = true;

  customerFlds = { text: "Name", value: "DocumentId" };

  constructor(
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public datepipe: DatePipe,
    public orderInsuranceSer: imp.OrderInsuranceService,
    public orderSer: OrderService,
    private router: imp.Router,
    public SettingSer: imp.SettingService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages,
    @Optional()  public dialogRef?: MatDialogRef<OrderInsuranceComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: any,
  ) {
    super();
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
    this.initializeobjects();
    this.getCustomers(this.responseobj.CustomerName);
    this.langDirection = localStorage.getItem('langs')
  }

  ngOnInit(): void {
    if(this.dialogData?.isPopUp){
      this.enableChiled = true;
      this.orderInsuranceFirstOpen();
      if(this.dialogData?.customerOrder?.DocumentId){
        this.responseobj.CustomerOrderDocumentId = this.dialogData?.customerOrder?.DocumentId;
        this.orderInsuranceSer.getByCustomerOrderDocumentID(this.responseobj.CustomerOrderDocumentId).subscribe((res) => {
          if(res) this.responseobj = res;
        });
      }
    }
    else{
      this.scrFirstOpen().subscribe(() => {
        this.orderInsuranceFirstOpen();
        // this.responseobj.screenPermission.Print=false;
        this.enableChiled = false;
      });
    }

  }
  initializeobjects(): void {
    this.responseobj = {};
    this.printDetailobj = {};
    this.service = this.orderInsuranceSer;
    this.request = this.router.getCurrentNavigation()?.extras as unknown;

    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = [];
    this.editOptions = {
      showDeleteConfirmDialog: true,
      allowEditing: true,
      allowDeleting: true
    };
    this.filterOptions = {
      type: "Menu"
    };
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  toolbarClick(args: imp.ClickEventArgs): void {}
  orderInsuranceFirstOpen() {
    // this.FLG = { text: "Name", value: "DocumentId" };
    this.orderInsuranceSer.orderInsuranceFirstOpen().subscribe((res) => {
      this.orderPayTypes = res["OrderPayTypes"];
      this.products = res["Products"];
      this.allinsurancelist = res["Insurances"];
      this.allOrderInsurances = res["OrderInsurances"];
      this.settings = res["Settings"];
      this.getOrderNumbers();
      this.insurances = this.cloneList(this.allinsurancelist);
      if (this.settings && this.settings.SystemMainLanguage > 0)
        this.printDetailobj.LanguageId = this.settings.SystemMainLanguage;
      else this.printDetailobj.LanguageId = 2;

      if (this.request.DocumentId && this.request.currentAction != "View"){
        this.enableChiled = true;
        this.disableDiscription = false;
      }

      this.checkOrderInsuranceHideListContition();
      this.loadSettings = true;
      // this.responseobj.screenPermission.Print=false;
      // this.SetOrderInsurance();
    });
  }
  getOrderNumbers() {
    if (!this.responseobj.CreationTime) this.responseobj.CreationTime = new Date();
    this.OrderNumber = undefined;
    let date = this.datepipe.transform(new Date(this.responseobj.CreationTime), "yyyy-MM-dd");
    this.OrderNumbers = this.allOrderInsurances?.filter((x) => this.datepipe.transform(new Date(x.CreationTime), "yyyy-MM-dd") == date)
      .map((x) => x.OrderNumber);
  }
  ChangeObjDate() {
    this.getOrderNumbers();
    this.SelectOrderInsurance("");
  }
  SelectOrderInsurance(orderNumber) {
    if (this.allOrderInsurances && this.allOrderInsurances.length > 0 && this.responseobj.Count) {
      let date = this.datepipe.transform(new Date(this.responseobj.CreationTime), "yyyy-MM-dd");
      let orderInsurance = this.allOrderInsurances.find(
        (x) => x.OrderNumber == orderNumber && this.datepipe.transform(new Date(x.CreationTime), "yyyy-MM-dd") == date
      );
      let screenPermission = this.responseobj.screenPermission
        ? this.cloneList(this.responseobj.screenPermission)
        : this.responseobj.screenPermission;
      let Count = this.responseobj.Count;
      if (!orderInsurance) orderInsurance = { CreationTime: this.responseobj.CreationTime };
      this.responseobj = this.clone(orderInsurance);

      this.responseobj.screenPermission = screenPermission;
      this.responseobj.Count = Count;
    }
  }
  afterPag(event: any): void {
    this.formPaging({ formObj: event });
    if (this.settings && this.settings?.OrderInsuranceHideList)
      this.responseobj = {};
  }
  quickEvents(event: imp.quickAction): void {
    if(this.dialogData?.customerOrder?.DocumentId) this.responseobj.CustomerOrderDocumentId = this.dialogData?.customerOrder?.DocumentId;
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({});
        this.setInitValues();
        this.enableChiled = true;
        break;
      case imp.quickAction.beforeAdd:
        // this.frmRef.form.value["InsuranceDocumentId"]
        if (this.responseobj && this.responseobj.OrderInsuranceDetails?.length > 0) {
          this.responseobj.OrderInsuranceDetails.forEach((x) => {
            if (!x.InsuranceName || x.InsuranceName == "") {
              let Insurance = this.allinsurancelist.find((i) => {
                if (i.DocumentId == x.InsuranceDocumentId) return i;
              });
              x.InsuranceName = Insurance.Name;
            }
            if (!x.ProductName || x.ProductName == "") {
              let Product = this.products.find((p) => {
                if (p.DocumentId == x.ProductDocumentId) return p.Name;
              });
              x.ProductName = Product?.Name;
            }
          });
        } else {
          this.toastr.warning("The  Order Insurance Details Is Required");
          if (this.frmRef.form.valid && this.frmRef.form.valid == true) this.frmRef.form.setErrors({ invalid: true });
        }
        this.OrderNumbers =[];
        this.OrderNumber = "";
        break;
      case imp.quickAction.afterAdd:
        // this.afterAdd();
        this.enableChiled = false;
        this.PrintAfterAdd();
        this.OrderNumbers =[];
        this.OrderNumber = "";
        this.searchCustomer = ""
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        this.enableChiled = true;
        // if(this.responseobj && this.responseobj.screenPermission)this.responseobj.screenPermission.Print=false;
        break;
      case imp.quickAction.afterUndo:
        this.enableChiled = false;
        this.searchterm = ""
        break;
    }
  }

  //#region
  setInitValues() {
    if (this.responseobj) {
      this.responseobj.CreationTime = new Date();
    }
  }
  getCustomers(CustomerName) {
    let model: CustomerModel = new CustomerModel();
    if (!CustomerName) model.Phone = "0";
    model.Name = CustomerName;
    this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
      this.customers = res as CustomerModel[];
    });
  }
  onFiltering = (e) => {
    this.getCustomers(e?.text);
    let model: CustomerModel = new CustomerModel();
    if (!e?.text) model.Phone = "0";
    model.Name = e?.text;
    this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
      this.customers = res as CustomerModel[];
      e.updateData(this.customers, "");
    });
  };
  setCustomer(CustomerDocumentId) {
    if (!this.customers) this.customers = [];
    let customer = this.customers.filter((c) => c.DocumentId == CustomerDocumentId)[0];
    if (customer) {
      this.responseobj.Customer = customer;
      this.responseobj.CustomerId = customer.Id;
      this.responseobj.CustomerDocumentId = customer.DocumentId;
      this.responseobj.CustomerName = customer.Name;
      this.responseobj.CustomerPhone = customer.Phone;
    }
  }
  SetOrderInsurance() {
    if (!this.responseobj.OrderInsuranceDetails) {
      this.responseobj.OrderInsuranceDetails = [];
    }
    this.responseobj.OrderInsuranceDetails.forEach((di) => {
      if (!di.Price) di.Price = 0;
    });
    this.responseobj.Amount = this.responseobj.OrderInsuranceDetails.map(
      (x) => Number(x.Quantity) * Number(x.Price)
    ).reduce((next, current) => next + current, 0);
    if (this.responseobj.PayTypeDocumentId) {
      let payType = this.orderPayTypes.find((p) => p.DocumentId == this.responseobj.PayTypeDocumentId);
      this.responseobj.PayTypeName = payType.Name;
      this.responseobj.PayTypeDocumentId = payType.DocumentId;
      this.responseobj.PayTypeId = payType.Id;
    }
  }
  addToInsuranceList(I: InsuranceModel) {

    if (!this.responseobj.OrderInsuranceDetails) {
      this.responseobj.OrderInsuranceDetails = [];
    }
    let exist = this.responseobj.OrderInsuranceDetails.find(
      (x) => x.InsuranceDocumentId == I.DocumentId && !x.ProductDocumentId
    );
    if (!exist) {
      this.responseobj.OrderInsuranceDetails.push({
        InsuranceDocumentId: I.DocumentId,
        InsuranceId: I.Id,
        InsuranceName: I.Name,
        Price: I.Price,
        Quantity: 1
      });
    } else {
      let index = this.responseobj.OrderInsuranceDetails.indexOf(exist);
      this.responseobj.OrderInsuranceDetails[index].Quantity += 1;
    }
    this.SetOrderInsurance();
  }
  deleteInsurance(inedx) {
    this.responseobj.OrderInsuranceDetails.splice(inedx, 1);
    this.SetOrderInsurance();
  }
  PlusInsuranceItems(inedx) {
    if (this.responseobj.OrderInsuranceDetails[inedx]) {
      this.responseobj.OrderInsuranceDetails[inedx].Quantity =
        Number(this.responseobj.OrderInsuranceDetails[inedx].Quantity) + 1;
      this.SetOrderInsurance();
    }
  }
  MinusInsuranceItems(inedx) {
    if (this.responseobj.OrderInsuranceDetails[inedx] && this.responseobj.OrderInsuranceDetails[inedx].Quantity > 1) {
      this.responseobj.OrderInsuranceDetails[inedx].Quantity =
        Number(this.responseobj.OrderInsuranceDetails[inedx].Quantity) - 1;
      this.SetOrderInsurance();
    }
  }
  searchInsurance(SearchInsurance: string) {
    this.insurances = this.cloneList(
      this.allinsurancelist.filter((x) => x.Name.toLowerCase().includes(SearchInsurance.toLowerCase()))
    );
  }
  getOrderForInsurance() {
    if (this.responseobj.OrderNumber) {
      this.orderInsuranceSer.getOrderWithOrderInsurance(this.responseobj).subscribe((order: OrderModel) => {
        if (order && order.OrderDetails && order.OrderDetails.length > 0) {
          this.responseobj.OrderInsuranceDetails = [];
          this.responseobj.OrderDocumentId = order.DocumentId;
          order.OrderDetails.forEach((d) => {
            this.responseobj.OrderInsuranceDetails.push({
              ProductDocumentId: d.Product?.DocumentId,
              ProductId: d.Product?.Id,
              ProductName: d.Product?.Name,
              Quantity: 1
            });
          });
          this.SetOrderInsurance();
        }
      });
    }
  }
  setInsuranceDetail(index) {
    if (this.responseobj.OrderInsuranceDetails?.index) {
      let insurance = this.allinsurancelist.find(
        (i) => i.DocumentId == this.responseobj.OrderInsuranceDetails[index].InsuranceDocumentId
      );
      if (insurance) {
        this.responseobj.OrderInsuranceDetails[index].InsuranceId = insurance.Id;
        this.responseobj.OrderInsuranceDetails[index].InsuranceName = insurance.Name;
        this.responseobj.OrderInsuranceDetails[index].Price = insurance.Price;
        this.SetOrderInsurance();
      }
    }
  }
  setProductDetail(index) {
    if (this.responseobj.OrderInsuranceDetails?.index) {
      let product = this.products.find(
        (i) => i.DocumentId == this.responseobj.OrderInsuranceDetails[index].ProductDocumentId
      );
      if (product) {
        this.responseobj.OrderInsuranceDetails[index].ProductId = product.Id;
        this.responseobj.OrderInsuranceDetails[index].ProductName = product.Name;
        this.SetOrderInsurance();
      }
    }
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

    this.orderInsuranceSer.printAfterAdd(this.model).subscribe((data: Response) => {
      this.loading = false;
      this.report.loadDocument(data);
      this.viewer.report = this.report;
      this.viewer.renderHtml("myviewer");
      $("#modal-5").modal("show");
    });
    this.ifPerview = false;

    return false;
  }
  //#endregion
  searchCustomer: string;
  filteredCustomers: any[];

  // filterCustomers(searchterm: any) {
  //   let model: CustomerModel = new CustomerModel();
  //   if (searchterm.target.value.length >= 3) {
  //     if (Number(searchterm.target.value) > 0) {
  //       //search by phone
  //       model.Phone=searchterm.target.value;
  //     }else{
  //       //search by name
  //       model.Name=searchterm.target.value;
  //     }
  //     this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
  //       this.customers = res as CustomerModel[];
  //       //assign first customer of the search result
  //       this.setCustomer(this.customers[0]?.DocumentId);
  //     });
  //   }
  // }
  filterCustomers(searchterm?: any) {
    let model: CustomerModel = new CustomerModel();
    if (searchterm?.text?.length >= 3) {
      //search by phone
      if (Number(searchterm?.text) > 0)
        model.Phone = searchterm?.text;
      //search by name
      else
        model.Name = searchterm?.text;

      this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
        this.customers = res as CustomerModel[];
        //assign first customer of the search result
        // this.setCustomer(this.customers[0]?.DocumentId);
      });
    }
  }

  addCustomer() {
    const customerInfoModalRef = this.modalService.show(DetailsCustomerComponent, { class: "second" });

    customerInfoModalRef.onHide.subscribe((reason: any) => {
      const result = customerInfoModalRef.content.modalResult;
      if (result && result.role == "save") {
        this.getCustomers("");
      }
    });
  }
  saveInsurance(frmRef){
    if(frmRef.form.valid && this.dialogData?.isPopUp){
      if(this.dialogData?.customerOrder?.DocumentId) this.responseobj.CustomerOrderDocumentId = this.dialogData?.customerOrder?.DocumentId;
      const formType =  !this.responseobj?.DocumentId ?'Post': 'Edit'
      this.orderInsuranceSer.Transactions(this.responseobj , formType).subscribe(res=>{
        if (res == 1 || res == 2){
          this.toastr.success(this.toastrMessage.GlobalMessages(res));
          this.PrintAfterAdd();
          setTimeout(() => {
            this.dialogRef.close();
          }, 200);
        }
        else
          this.toastr.error(this.toastrMessage.GlobalMessages(res));
      });
    }
  }
  closeDialoge(){
    if (this.dialogRef) this.dialogRef.close();
  }

  checkOrderInsuranceHideListContition() {
    if (this.settings && this.settings?.OrderInsuranceHideList) {
      this.hidePagination = false;
      if (!this.responseobj.screenPermission)
        this.responseobj.screenPermission = {};

      if (!this.request?.DocumentId) {
        const screenPermission = this.responseobj.screenPermission;
        this.responseobj = {};
        this.responseobj.screenPermission = screenPermission;
      }
      this.responseobj.screenPermission.Edit = false;
    }
  }

}
