import { Component, OnInit } from "@angular/core";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
import { SettingService } from "src/app/core/Services/Settings/SettingService";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { Data, Router } from "@angular/router";
import { BranchService } from "src/app/core/Services/Transactions/branch.service";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TaxService } from "../../taxes/taximports";
import { PayTypeService } from "src/app/core/Services/Transactions/pay-type.service";
import { CustomerModel, CustomerService } from "../../customer/customerimport";
import { WhatsAppServiceService } from "src/app/core/Services/WhatsApp/whats-app-service.service";
import { PointOfSalesService } from "../../point-of-sale/pointofsaleimports";

@Component({
  selector: "app-pos-settings",
  templateUrl: "./pos-settings.component.html",
  styleUrls: ["./pos-settings.component.css"]
})
export class PosSettingsComponent implements OnInit {
  language: string;
  freeRegion: boolean = false;
  bigOrderB: boolean = false;
  FixedRegion: boolean = false;
  defaultLang: any = [];
  languages: any = [];
  [key: string]: any;
  printers: any = [];
  settings: SettingModel = new SettingModel();
  creditCustomers : CustomerModel [] = [];
  public FinancialSystems: any[] = [
    { Id: 1, Name: "FERP" },
    // { Id: 2, Name: "Motakamel" },
    { Id: 3, Name: "OfLine" },
    { Id: 4, Name:"Integration System"}

  ];

  public fields = { text: "Name", value: "Id" };
  public flds = { text: "Name", value: "DocumentId" };
  public Nameflds = { text: "Name", value: "Name" };
  public timeZoneFlds = { text: "TimeZone", value: "TimeZone" };
  CountryTypeList: any[];
  KOTSeparateList: any[];
  public Fld = { text: "Name", value: "Id" };
  constructor(
    private settingServ: SettingService,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages,
    public _translate: TranslateService,
    private languageSerService: LanguageSerService,
    public taxServ: TaxService,
    public payTypeServ: PayTypeService,
    public router: Router,
    public customerService : CustomerService,
    public whatsAppSevice:WhatsAppServiceService,
    public pointOfSalesService:PointOfSalesService,
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this._translate.use(this.language);

    this.RoundingMethods = [];
    this.RoundingLevels = [];
  }

  // freeAllRegion(event){
  //   if ( event.target.checked ) {
  //     this.freeRegion = true;
  //     this.FixedRegion=false;
  //     this.bigOrderB =false;
  //   }else{
  //     this.freeRegion = false;
  //   }
  // }
  // bigOrders(event){
  //   if ( event.target.checked ) {
  //     this.bigOrderB =true;
  //     this.FixedRegion =false;
  //     this.freeRegion =false;
  //   }else{
  //     this.bigOrderB =false;
  //   }
  // }
  // FixedRegin(event){
  //   if ( event.target.checked ) {
  //     this.FixedRegion =true;
  //     this.freeRegion =false;
  //     this.bigOrderB =false;
  //   }else{
  //     this.FixedRegion =false;
  //   }
  // }
  ngOnInit() {
    this.GetSettings();
    this.GetLanguage();
    this.GetPrinters();
    this.GetTaxes();
    this.getPaymentTypes();
    this.getCreditCustomers();
    this.GetTimeZoneList();
  }
  GetSettings() {
    this.settingServ.GetSettings().subscribe((res) => {
      this.settings = res as SettingModel;
      if (this.settings.Pull == 4) {
        this.showPullMintes = true;
      } else {
        this.showPullMintes = false;
      }
      if (this.settings.Push == 4) {
        this.showMintes = true;
      } else {
        this.showMintes = false;
        this.settings.PushMintes = 0;
      }
      if (this.settings.CountryType == 2) this.SaudiArabiaFlag = true;
      else this.SaudiArabiaFlag = false;
      //his._translate.instant('msg.' + res.message)

      this.disableAllInputs();

      if (this.settings.CalculateTaxBeforeDiscount) {
        this.settings.CalculateTaxBeforeDiscountNum = 1;
      } else {
        this.settings.CalculateTaxBeforeDiscountNum = 0;
      }
      if (this.settings.IsServiceFromRealPrice) {
        this.settings.IsServiceFromRealPriceNum = 1;
      } else {
        this.settings.IsServiceFromRealPriceNum = 0;
      }
      this.settings.IsServiceFromRealPriceList = this.settings.IsServiceFromRealPriceList.map((val) => {
        return {
          Name: this._translate.instant("setting." + val.Name),
          Id: val.Id
        };
      });
      this.settings.CalculateTaxBeforeDiscountList = this.settings.CalculateTaxBeforeDiscountList.map((val) => {
        return {
          Name: this._translate.instant("setting." + val.Name),
          Id: val.Id
        };
      });
      this.initDropDown();
      if (!this.settings.CountryType) this.settings.CountryType = 1;
      this.CountryTypeList = [
        { Id: 1, Name: this._translate.instant("manageorder.General") },
        { Id: 2, Name: this._translate.instant("Shared.SaudiArabia") },
        { Id: 3, Name: this._translate.instant("Shared.Egypt") },
        { Id: 4, Name: this._translate.instant("Shared.Tanzania") },
        { Id: 5, Name: this._translate.instant("Shared.Ethiopia") },
        { Id: 6, Name: this._translate.instant("Shared.Malaysia") },
      ];

      this.KOTSeparateList = [
        { Id: 1, Name: this._translate.instant("Shared.productgroup") },
        { Id: 2, Name: this._translate.instant("Shared.printer") },
        { Id: 3, Name: this._translate.instant("products.Products") }
      ];
      this.settings.DealingWithStocList = [
        { Id: 2, Name: this._translate.instant("stock.Kitchen") },
        { Id: 1, Name: this._translate.instant("stock.Stock") },
        { Id: 3, Name: this._translate.instant("Reports.pos") },
      ];

      this.settings.PostingOrdersList = [
        { Id: 1, Name: this._translate.instant("PosSettings.Detailed") },
        { Id: 2, Name: this._translate.instant("PosSettings.Bundled") }
      ];

      this.RoundingMethods = [
        { Id: 0, Name: this._translate.instant("PosSettings.None") },
        { Id: 1, Name: this._translate.instant("PosSettings.Up") },
        { Id: 2, Name: this._translate.instant("PosSettings.Down") },
        { Id: 3, Name: this._translate.instant("PosSettings.Average") }
      ];
      this.RoundingLevels = [
        { Id: 10, Name: 10 },
        { Id: 5, Name: 5 },
        { Id: 1, Name: 1 },
        { Id: 0.5, Name: 0.5 },
        { Id: 0.25, Name: 0.25 },
        { Id: 0.05, Name: 0.05 },
        { Id: 0.1, Name: 0.1 },
        { Id: 0.01, Name: 0.01 }
      ];
      this.CustomerScreenModelList = this.settings.OrderModelList.slice(0, 2);
      this.GetOrderTypes();
    });
    // this.settings.AutoReceivingTransferMinutes=10;
  }
  structuredClone(ob:any){
    return JSON.parse(JSON.stringify(ob));
  }
  GetLanguage() {
    this.settingServ.GetLanguage().subscribe((res) => {
      this.languages = res;
      this.defaultLang = this.languages.filter((x) => x.IsDefault)[0];
      if (!this.defaultLang) this.defaultLang = this.languages.filter((x) => x.Name.toLowerCase() == "en")[0];
    });
  }
  GetTimeZoneList() {
    this.settingServ.GetTimeZoneList().subscribe((res) => {
      // this.filteredTimeZones = this.structuredClone(this.settings?.TimeZoneList)
      this.timeZones = res;
      this.filteredTimeZones = this.structuredClone(this.timeZones);
    });
  }

getCreditCustomers(){
  this.customerService.getCreditCustomers().subscribe((res :any) => {
    this.creditCustomers = res;
  })
}

  GetTaxes() {
    this.taxServ.taxFirstOpen().subscribe((res) => {
      this.taxes = res["Taxes"];
      if (this.taxes && this.taxes.length > 0) this.taxes = this.taxes.filter((x) => x.Type == 1);
    });
  }
  getPaymentTypes() {
    this.payTypeServ.getAllPaymentTypes().subscribe((res: any) => {
      if (res && res.length > 0) this.payTypes = res.filter((p) => p.PayType == 20);
    });
  }

  ChangeCountry() {
    if (this.settings.CountryType == 2) {
      this.settings.UseTax = true;
      this.settings.ShowQrCode = true;
      this.settings.ApplyTaxOnDeliveryPrice = true;
      this.SaudiArabiaFlag = true;
    } else this.SaudiArabiaFlag = false;
  }
  GetPrinters() {
    this.settingServ.GetServerPrinters().subscribe((res) => {
      this.printers = res;
    });
  }
  initDropDown() {
    if (this.settings.OrderNumberGenerationPeriod == 0) this.settings.OrderNumberGenerationPeriod = 20;
    if (this.settings.OrderNumberGenerationType == 0) this.settings.OrderNumberGenerationType = 20;
    if (this.settings.KitchenProductNamePrintingOption == 0) this.settings.KitchenProductNamePrintingOption = 1;
    if (this.settings.CustomerProductNamePrintingOption == 0) this.settings.CustomerProductNamePrintingOption = 1;
    if (this.settings.SalesReceiptType == 0) this.settings.SalesReceiptType = 1;

    this.settings.DeliveryFromTime = this.settings.DeliveryFromTime ? this.setTime(new Date(this.settings.DeliveryFromTime)) : '';
    this.settings.DeliveryToTime = this.settings.DeliveryToTime ? this.setTime(new Date(this.settings.DeliveryToTime)) :'';
  }
  setTime(date: Date) {
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let str = hours + ":" + minutes;
    return str;
  }
  save() {
    if (this.settings.CalculateTaxBeforeDiscountNum == 1) {
      this.settings.CalculateTaxBeforeDiscount = true;
    } else {
      this.settings.CalculateTaxBeforeDiscount = false;
    }

    if (this.settings.IsServiceFromRealPriceNum == 1) {
      this.settings.IsServiceFromRealPrice = true;
    } else {
      this.settings.IsServiceFromRealPrice = false;
    }
    this.settingServ.SaveSettings(this.settings).subscribe(
      (res) => {
        this.toastr.success(this.toastrMessage.GlobalMessages(1), "settings");
        this.saveDefaultLang();
        this.GetSettings();
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err), "settings");
      }
    );
  }
  saveDefaultLang() {
    this.settingServ.SaveDefaultLanguage(this.defaultLang).subscribe((res) => {});
  }
  getTranslationName(trSection: string, name: string) {
    return trSection + "." + (name ? name.toLowerCase() : "");
  }
  ShowImage() {
    this.router.navigateByUrl("EmailSetting");
  }
  disableAllInputs() {
    if (this.settings && this.settings.PullAllTablesFromPOS) {
      const inputs: any = document.getElementsByTagName("input");
      let allInputs = [...inputs];
      for (const input of allInputs) {
        if (!input.classList.contains('enabled'))
          input.disabled = true;
      }
      const selects: any = document.getElementsByTagName("select");
      let allselects = [...selects];
      for (const input of allselects) {
        if (!input.classList.contains('enabled'))
          input.disabled = true;
      }
      const buttons: any = document.getElementsByTagName("button");
      let allbuttons = [...buttons];
      for (const input of allbuttons) {
        if (!input.classList.contains('enabled'))
          input.disabled = true;
      }
    }
  }
  setPullvalue(data) {
    if (data == 4) {
      this.showPullMintes = true;
    } else {
      this.showPullMintes = false;
      this.settings.PullMintes = 0;
    }
  }
  setpushvalue(data) {
    if (data == 4) {
      this.showMintes = true;
    } else {
      this.showMintes = false;
      this.settings.PushMintes = 0;
    }
  }
  generateQrCode(){
    this.requestStarted = true;
    this.whatsAppSevice.generateQRCode().subscribe((res:any) => {
        this.requestStarted = false;
        if(res.IsQrCode){
          // this.qrCode = 'data:image/jpg;base64,' + res.Data;
          this.qrCode = res.Data;
          if(!res.Data) this.toastr.success(this.toastrMessage.GlobalMessages(9));
          console.log(this.qrCode);
        }
      },
      (err) => {
        this.requestStarted = false;
      }
    );
  }
  testWhatsApp(){
    const model = [{Number:this.settings.CountryCode + this.testNumber , Message:"Test WhatsApp"}];
    this.requestStarted = true;
    this.whatsAppSevice.sendMessage(model).subscribe((res:any)=>{
      this.requestStarted = false;
      if(res && res.Data == true){
          this.toastr.success(this.toastrMessage.GlobalMessages(9));
          this.saveDefaultLang();
          this.GetSettings();
      }
      else
        this.toastr.error(this._translate.instant("setting.FaildConnect"));
    },(err) => {
        this.requestStarted = false;
        this.toastr.error(this.toastrMessage.GlobalMessages(err));
      } 
    );
  }
  saveWhatsAppPath(){
    this.settingServ.saveWhatsAppPath(this.settings).subscribe((res) => {
        this.toastr.success(this.toastrMessage.GlobalMessages(1), "settings");
      });
  }
  GetOrderTypes() {
    this.pointOfSalesService.GetOrderTypes().subscribe((res) => {
      this.OrderTypeList = [];
      this.OrderTypeList = res as any;
    });
  }
  onFiltering(e: any){
    if(this.timeZones?.length)
      this.filteredTimeZones = this.structuredClone(this.timeZones?.filter(x=> x.TimeZone && x.TimeZone.toLowerCase().includes(e.text?.toLowerCase())))
  }

}
