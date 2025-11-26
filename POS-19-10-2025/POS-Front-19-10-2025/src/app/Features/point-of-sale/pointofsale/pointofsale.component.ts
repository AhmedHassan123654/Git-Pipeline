import { Component, OnDestroy, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../pointofsaleimports";
import { ServerSyncService } from "src/app/core/Services/Authentication/server-sync.service";
import Swal from "sweetalert2";
declare var $: any;

const incr = 1;

@Component({
  selector: "app-pointofsale",
  templateUrl: "./pointofsale.component.html",
  styleUrls: ["./pointofsale.component.css"]
})
export class PointofsaleComponent extends imp.general implements imp.OnInit , OnDestroy{
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  settings: any = {};
  IsMain: boolean = true;
  showProgressbar: boolean = false;
  canPushInputsToOO: boolean = true;
  progressValue = 0;
  public fields = { text: "Name", value: "Id" };
  public DrawerTypes: any[] = [
    { Id: 1, Name: "USB" },
    { Id: 2, Name: "Printer" }
  ];
  //#endregion
  constructor(
    public PointOfSalesService: imp.PointOfSalesService,
    public serverSyncService: ServerSyncService,
    public ser: imp.SettingService,
    private router: imp.Router,
    public route: imp.ActivatedRoute,
    private toastr: imp.ToastrService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private toastrMessage: imp.HandlingBackMessages
  ) {
    super();
    this.initializeobjects();
  }
  //#region CashReceipt Methods
  initializeobjects(): void {
    this.enableChiled = false;
    this.responseobj = {};
    this.fawryobj = {};
    this.service = this.PointOfSalesService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.FLG = { text: "Name", value: "DocumentId" };
    this.FLGID = { text: "Name", value: "Id" };
    this.paymentCompanies = [
      { Id: 1, Name: "Geidea" },
      { Id: 2, Name: "Alhamrani" },
      { Id: 3, Name: "Neoleap" },
      { Id: 4, Name: "Apex" },
      { Id: 6, Name: "Revenue" },
      { Id: 10, Name: "KashierPay" },
      { Id: 12, Name: "Fawry" },
    ];
  }

  //#endregion
  quickEvents(event: imp.quickAction): void {
    if(this.responseobj?.StockList?.length) this.StockList = this.responseobj.StockList;

    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({});
        this.checkIfAuth();
        this.showAuth = false;
        this.enableChiled = true;
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        this.checkIfAuth();
        this.enableChiled = false;
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        this.enableChiled = true;
        break;
      case imp.quickAction.beforeAdd:
        if (
          this.responseobj != undefined &&
          (this.responseobj.IsHallPos == null || this.responseobj.IsHallPos == undefined)
        ) {
          this.responseobj.IsHallPos = false;
        }
        if (
          this.responseobj != undefined &&
          (this.responseobj.IsMobilePos == null || this.responseobj.IsMobilePos == undefined)
        ) {
          this.responseobj.IsMobilePos = false;
        }
        if (
          this.responseobj != undefined &&
          (this.responseobj.IsTabletDevice == null || this.responseobj.IsTabletDevice == undefined)
        ) {
          this.responseobj.IsTabletDevice = false;
        }
        break;
      case imp.quickAction.afterUndo:
        this.enableChiled = false;
        break;
    }
  }

  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
    this.checkIfAuth();
  }

  checkIfAuth() {
    this.showAuth = true;
    this.ClickedAuthor = this.responseobj.Authorized;
    this.responseobj.IsSync = false;
    // if (!this.responseobj || !this.responseobj.CallCenterUrl) this.responseobj.CallCenterUrl = this.CallCenterUrl;
    if (this.responseobj.AuthorizedToOther == true) {
      this.showAuthBtn = false;
      this.showAuthParag = true;
    } else {
      this.showAuthBtn = true;
      this.showAuthParag = false;
      if (this.ClickedAuthor == false) {
        this.AuthoStringVal = "UnAuthorized.";
      } else {
        this.AuthoStringVal = "Authorized.";
      }
    }
  }
  //#endregion
  clickedATH() {
    if (this.responseobj && this.responseobj.DocumentId && this.responseobj.DocumentId != "") {
      if (!this.ClickedAuthor) {
        localStorage.setItem("PointOfSaleDocumentId", this.responseobj.DocumentId);
        this.toastr.success(this.toastrMessage.GlobalMessages(1), "PointOfSale");
        this.AuthoStringVal = "Authorized.";
        this.ClickedAuthor = true;
        this.confirmRemovePushServiceLinks();

      } else {
        localStorage.setItem("PointOfSaleDocumentId", "");
        this.toastr.success(this.toastrMessage.GlobalMessages(1), "PointOfSale");
        this.AuthoStringVal = "UnAuthorized.";
        this.ClickedAuthor = false;
      }
    }
  }
  confirmRemovePushServiceLinks(){
    if(!this.RMSConnecton?.PusUrl && !this.RMSConnecton?.FerpUrl) return;

    Swal.fire({
      title: this.translate.instant("messages.RemovePushServerLinks"),
      // text: this.translate.instant("messages.RemovePushServerLinks"),
      icon: "warning",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("Shared.No"),
      confirmButtonText: this.translate.instant("Shared.Yes?")
    }).then((result) => {
      if (result.isConfirmed) {
        this.PointOfSalesService.removePushServiceLinks().subscribe((res) => {
          if(res)
            this.toastr.success(this.toastrMessage.GlobalMessages(1));
          else
            this.toastr.error(this.toastrMessage.GlobalMessages(0));
        });
      }
    });
  }

  OLDclickedATH() {
    if (this.responseobj && this.responseobj.DocumentId && this.responseobj.DocumentId != "") {
      if (!this.ClickedAuthor) {
        this.PointOfSalesService.AuthorizeDevice(this.responseobj).subscribe((res) => {
          if (res && res["Item1"] == 1) {
            this.responseobj = res["Item2"];
            this.toastr.success(this.toastrMessage.GlobalMessages(1), "PointOfSale");
            this.AuthoStringVal = "Authorized.";
            this.ClickedAuthor = true;
          } else {
            this.toastr.error(this.toastrMessage.GlobalMessages(res), "PointOfSale");
          }
        });
      } else {
        this.PointOfSalesService.AuthorizeDevice({}).subscribe((res) => {
          if (res == 1) {
            this.toastr.success(this.toastrMessage.GlobalMessages(res), "PointOfSale");
            this.AuthoStringVal = "UnAuthorized.";
            this.ClickedAuthor = false;
          } else {
            this.toastr.error(this.toastrMessage.GlobalMessages(res), "PointOfSale");
          }
        });
      }
    }
  }
  ngOnInit() {
    this.GetOrderTypes();
    //  this.driverFirstOpen();
    this.scrFirstOpen().subscribe((res) => {
      this.responseobj.screenPermission.Print = false;
      this.IsMain = this.responseobj.IsMain;
      this.CallCenterUrl = this.responseobj.CallCenterUrl;
      this.settings = this.responseobj?.Setting ?? {};
      this.PayTypes = this.responseobj.PayTypes;
      this.RMSConnecton = this.responseobj.RMSConnecton;
      if(this.responseobj?.StockList?.length) this.StockList = this.responseobj.StockList;
      this.IsMainServer = this.responseobj.IsMainServer;
      this.checkIfAuth();
      this.pointOfSaleFirstOpen();
    });
    this.comboflag = false;
  }
  pointOfSaleFirstOpen() {

    this.PointOfSalesService.PointOfSaleFirstOpen().subscribe((res: any) => {
      this.POSList = res.AllPos;
      this.canPushInputsToOO = res.rmsConnectionIsMain;
      if (this.POSList) {
        this.POSList.forEach((pos) => {
          // let clone = {...pos.CallCenterUrl}
          this.responseobj.CallCenterUrl = pos.CallCenterUrl;
        });
      } else {
        if (!this.responseobj || !this.responseobj.CallCenterUrl) this.responseobj.CallCenterUrl = this.CallCenterUrl;
      }
    });
  }

  /*  driverFirstOpen() {
    this.PointOfSalesSer.FirstOpen().subscribe((res) => {
      this.pointOfSaleobj = res as PointOfSaleModel;
      this.comboboxPricingClasslist = this.pointOfSaleobj.PricingClassDropDownModels;
      this.comboboxPrinterlist = this.pointOfSaleobj.NetworkPrinterDropDownModels;
      if (this.pointOfSaleobj.PricingClassId == 0) {
        this.pointOfSaleobj.PricingClassId = null;
      }
      this.comboboxPricingClassfields = { text: "Name", value: "Id" };
      this.comboboxPrinterfields = { text: "Name", value: "Name" };
    });
  } */
  /*   checkPricingClass(){
    if(this.pointOfSaleobj.PricingClassId){
      if(this.comboboxPricingClasslist==null || this.comboboxPricingClasslist.findIndex(x=>x.Id==this.pointOfSaleobj.PricingClassId)==-1)
      this.pointOfSaleobj.PricingClassId=null;
    }
  }
  checkPrinter(){
    if(this.pointOfSaleobj.PrinterName){
      if(this.comboboxPrinterlist==null || this.comboboxPrinterlist.findIndex(x=>x.Name==this.pointOfSaleobj.PrinterName)==-1)
      this.pointOfSaleobj.PrinterName=null;
    }
  }
  CheckEdit(){
    if (this.pageNumber > 0) {
      return true;
    }
    else
    return false;
  }
  returnobjEvent(event){
    this.pointOfSaleobj = event;
    this.showAuth=true;
    this.ClickedAuthor=this.pointOfSaleobj.Authorized;
    if(this.pointOfSaleobj.AuthorizedToOther==true)
    {
      this.showAuthBtn=false;
      this.showAuthParag=true;
    }
    else
    {
      this.showAuthBtn=true;
      this.showAuthParag=false;
      if(this.ClickedAuthor==false)
      {
        this.AuthoStringVal = 'UnAuthorized.'
      }
      else
      {
        this.AuthoStringVal = 'Authorized.'
      }
    }

  }
  Newobject(){

    this.driverFirstOpen();
    this.showAuth=false;
  } */

  /*   clearobject() {
    this.pointOfSaleobj = new PointOfSaleModel();
  }
 */

  GetOrderTypes() {
    this.PointOfSalesService.GetOrderTypes().subscribe((res) => {
      this.ApplaiedOrderTypeList = [];
      this.ApplaiedOrderTypeList = res as any;
      this.Flds = { text: "Name", value: "DocumentId" };
    });
  }
  downloadExe() {
    window.open("https://drive.google.com/file/d/12uC-FfoUD_JNBuNzz6ls4wyY-dbka5dx/view?usp=sharing", "_blank");
  }

  addPaymentDevice() {
    if (!this.responseobj.PaymentDevices) this.responseobj.PaymentDevices = [];
    this.responseobj.PaymentDevices.push({ WatingSeconds: 60 });
  }
  checkForSameCompanyOrPay(id, index, IsPay = false) {
    if (this.responseobj.PaymentDevices && this.responseobj.PaymentDevices.length > 1) {
      let exist, elem;
      let otherPaymentDevices = this.deepCopy(this.responseobj.PaymentDevices);
      otherPaymentDevices.splice(index, 1);
      if (IsPay) {
        exist = otherPaymentDevices.find((p) => p.PayTypeDocumentId == id);
        if (exist) {
          this.responseobj.PaymentDevices[index].PayTypeDocumentId = undefined;
          this.toastr.warning(this.translate.instant("messages.PaymentExist"));
          elem = document.getElementById("PayTypeDocumentId" + index);
        }
      } else {
        exist = otherPaymentDevices.find((p) => p.CompanyNumber == id);
        if (exist) {
          this.responseobj.PaymentDevices[index].CompanyNumber = undefined;
          this.toastr.warning(this.translate.instant("messages.CompanyExist"));
          elem = document.getElementById("CompanyNumber" + index);
        }
      }
      if (elem) {
        let text = elem.children[0].querySelectorAll("input")[0];
        if (text) text.value = "";
      }
    }
  }
  deletePaymentDevice(index) {
    if (this.responseobj.PaymentDevices) this.responseobj.PaymentDevices.splice(index, 1);
  }

  startProgressbar(syncToNumber) {
    if(!this.canPushInputsToOO){
      this.canPushInputsToOO = false;
    }
    else{
      this.showProgressbar = true;
      this.progressValue = 0; // Initialize progressValue
  
      const incr = 1; // Increment step for the progress bar
      const interval = setInterval(() => {
          if (this.progressValue < 99) {
            this.progressValue += incr; // Increment progressValue
          } 
      }, 400);
      if(syncToNumber == 1) this.responseobj.SyncTo = 1;
      else this.responseobj.SyncTo = 2;
      const subscription = this.serverSyncService.pushInputsToOnlineOrder(this.responseobj);
  
      subscription.subscribe({
          next: (res: any) => {
              // Handle response data if needed
          },
          complete: () => {
              clearInterval(interval); // Clear the interval when the request is done
              this.progressValue = 100; // Set progressValue to 100
  
              this.toastr.success(this.toastrMessage.GlobalMessages(1), "ServerSync");
              this.showProgressbar = false;
          },
          error: (err: any) => {
              clearInterval(interval); // Clear the interval on error as well
              this.progressValue = 0; // Reset progressValue
  
              this.toastr.error(this.toastrMessage.GlobalMessages(err), "ServerSync");
              this.showProgressbar = false;
          }
      });

    }
}

  ngOnDestroy() {
    this.clearAllIntervals();
  }
  setFawryData() {
    if(this.responseobj?.PaymentDevices?.length){
      let fawryPay = this.responseobj?.PaymentDevices?.find(x=> x.CompanyNumber == 12);
      if(!fawryPay) return;
      fawryPay.FawryPosSerialNumber = this.fawryobj?.FawryPosSerialNumber;
      fawryPay.FawryMerchantCode = this.fawryobj?.FawryMerchantCode;
      fawryPay.FawrySecret_Key = this.fawryobj?.FawrySecret_Key;
      fawryPay.Fawry_Url = this.fawryobj?.Fawry_Url;
      $("#modal-3").modal("hide");
    }
  }

  showFawryData(row:any) {
    this.fawryobj.FawryPosSerialNumber = row.FawryPosSerialNumber ;
    this.fawryobj.FawryMerchantCode = row.FawryMerchantCode ;
    this.fawryobj.FawrySecret_Key =  row.FawrySecret_Key ;
    this.fawryobj.Fawry_Url =  row.Fawry_Url;
  }
}
