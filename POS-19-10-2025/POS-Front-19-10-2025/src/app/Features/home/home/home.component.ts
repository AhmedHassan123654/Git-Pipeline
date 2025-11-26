import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  ViewChildren,
  QueryList,
  HostListener,
  ViewEncapsulation
} from "@angular/core";
import { formatDate } from "@angular/common";
import { DashboardService } from "src/app/core/Services/Transactions/dashboard.service";
import { PointOfSaleModel } from "src/app/core/Models/Transactions/point-of-sale-model";
import { ActivatedRoute, Router } from "@angular/router";
import { IncomingUserModel } from "src/app/core/Models/Transactions/incoming-user-model";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "src/app/core/Services/Common/common.service";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { LocalstorgeService } from "src/app/localstorge.service";
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from "@angular/common";
import { UserProfileServiceService } from "src/app/core/Services/Authentication/user-profile-service.service";
import { ProfileModel } from "src/app/core/Models/Authentication/profile-model";
import { ShiftsService } from "src/app/core/Services/Transactions/shifts.service";
import { WorktimesModel } from "src/app/core/Models/Transactions/worktimesModel";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { EndShiftService } from "src/app/core/Services/Transactions/endShift.service";
import { UserLoginService } from "src/app/core/Services/Transactions/user-login.service";
import { UserLoginModel } from "src/app/core/Models/Transactions/user-login-model";
import { OpenDayService } from "src/app/core/Services/Transactions/open-day.service";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { ILoadedEventArgs, ChartTheme, IAccTooltipRenderEventArgs } from "@syncfusion/ej2-angular-charts";
import { Browser } from "@syncfusion/ej2-base";
import { MatDialog } from "@angular/material/dialog";
import { BranchWizardComponent } from "../../branch-wizard/branch-wizard/branch-wizard.component";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
import { SettingService } from "src/app/core/Services/Settings/SettingService";
import { PrintDetailModel } from "src/app/core/Models/Shared/print-detail-model";
import { DatabaseDetailModel } from "src/app/core/Models/Authentication/database-detail-model";
import { ServerSyncService } from "src/app/core/Services/Authentication/server-sync.service";
import { PointOfSalesService } from "../../point-of-sale/pointofsaleimports";
import { ReceivingtransferService } from "../../receiving-transfer/receivingtransfer-imports";
import Swal from "sweetalert2";
import { UploadService } from "src/app/upload.service";
import { read, utils } from "xlsx";
import { BehaviorSubject } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { CustomerOrderListComponent } from "../../customer-order/customer-order-list/customer-order-list.component";
declare var $: any;
declare var Stimulsoft: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChildren("childRef", { read: ElementRef }) childs: QueryList<ElementRef>;
  @ViewChild("grid") grid: GridComponent;
  @ViewChild("grid2") grid2: GridComponent;
  public width: string = Browser.isDevice ? "100%" : "60%";
  public chartArea: Object = {
    border: {
      width: 0
    }
  };
  public format = { type: "date", format: "dd/MM/yyyy" };

  [key: string]: any;

  arr = [];
  InnerWidth: number;
  OpenDayobj: any = {};
  OpenDayFlag: boolean = false;
  orders: boolean = false;
  inputs: boolean = false;
  delivery: boolean = false;
  settings: boolean = false;
  dropdownInputs: boolean = false;
  dropdowntransaction: boolean = false;
  dropdowndelivery: boolean = false;
  status: boolean = false;
  setting: any = {};
  SideMenu: boolean = false;
  defaultIm: string;
  CheckedDisabled: boolean = false;
  DisabledShiftOpenClass: boolean = false;
  pointofsaleobj: PointOfSaleModel = new PointOfSaleModel();
  incominguserobj: IncomingUserModel = new IncomingUserModel();
  MyIncomingUserObj: IncomingUserModel = new IncomingUserModel();
  bestSeller: any;
  stoppedProducts: any = {};
  promos: any = {};
  userprofileobj: ProfileModel = new ProfileModel();
  Showing: boolean = false;
  Showing3: boolean = false;
  Showing2: boolean = false;
  imgURL: any = "";
  record: any;
  ShiftFld: any;
  shift: any;
  cashType: any[];
  SectionNumb: any;
  oading: boolean = true;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  printDetailobj: PrintDetailModel = new PrintDetailModel();
  public languages: any[] = [
    { Id: 1, Name: "English" },
    { Id: 2, Name: "Arabic" },
    { Id: 3, Name: "Turkish" },
    { Id: 4, Name: "French" }
  ];
  fields = { text: "Name", value: "Id" };
  result: any = {
    IsOpenShift: false,
    IsClosedShift: false,
    IncomingUser: {}
  };
  selectedInput = "";
  users: any;
  date = this.formatDate(new Date().toLocaleString());
  shiftlist: any;
  valss: any;
  incominguserArray: Array<IncomingUserModel> = [];
  newAttribute: any = {};

  fldArray: Array<any> = [];
  categories: any;
  Screenlist = [];
  ScreenNumber = [];
  UserInfo: any = new UserLoginModel();
  showMenuInfo: boolean = true;

  posSettings: SettingModel = new SettingModel();

  isAllowedToViewOrderScreen: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.ee = event;
    this.InnerWidth = event.target.innerWidth;
  }

  constructor(
    public OpenDaySer: OpenDayService,
    public router: Router,
    public route: ActivatedRoute,
    private common: CommonService,
    private dashboardSer: DashboardService,
    private errorMessage: HandlingBackMessages,
    private translate: TranslateService,
    private languageSerService: LanguageSerService,
    private endShiftServ: EndShiftService,
    private userprofileser: UserProfileServiceService,
    public shiftSer: ShiftsService,
    public UserLoginSer: UserLoginService,
    private LocalstorgeService: LocalstorgeService,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public settingService: SettingService,
    public ServerSyncService: ServerSyncService,
    public posService: PointOfSalesService,
    public receivingtransferService: ReceivingtransferService,
    public toastrMessage: HandlingBackMessages,
    private _UploadService: UploadService
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  editWidth(Width: any) {
    if (this.InnerWidth > 991) {
      let w = Math.ceil(Width / 6);
      return w * 10 + 4;
    } else {
      return 130 + "%";
    }
  }

  editHeight(height: any) {
    if (this.InnerWidth > 991) {
      if (height == 1) return 3.1;
      else if (height == 2) return 9;
      else if (height == 3) return 11;
      else if (height == 4) return 13;
      else if (height == 5) return 15;
      else if (height == 6) return 17;
      else return 15.1;
    }
  }

  // hide all screens when click outside screensSection
  @HostListener('document:click', ['$event'])
  clickOutsideSection(event: Event) {
    const elements:any = document.querySelectorAll('[id^="section_id"]');
    const sections = Array.from(elements) as any [];
    if (!sections.some(button => button.contains(event.target))) {
      this.toggleScreensCardVisibility(undefined);
    }
  }

  // toggle screens visiblity on scection select
  toggleScreensCardVisibility(sectionIndex){
    
    // check if section has one screen so navigate to it
    if(this.SectionList && this.SectionList[sectionIndex]){
      const sectionScreens =  this.GetSectionScreens(this.SectionList[sectionIndex]);
      if(sectionScreens?.length === 1){
        this.router.navigateByUrl(`/${sectionScreens[0].RouteName}`);
        return;
      }
    }
    if(sectionIndex >= 0) this.routToOrderIfHallPOS();

    // Get all elements whose id starts with 'screensCard_id'
    var elements = document.querySelectorAll('[id^="screensCard_id"]');

    elements.forEach(function(ele : any ,index) {
      if(index !== sectionIndex){
        ele.style.visibility = 'hidden';
        ele.style.opacity = '0';
      }
    });
    let screensCard = document.getElementById('screensCard_id' + sectionIndex);
    if(screensCard){
      const visible = screensCard.style.visibility === 'visible';
      screensCard.style.visibility = visible ? 'hidden' : 'visible';
      screensCard.style.opacity = visible ? '0' : '1';
    }
  }
  ngAfterViewChecked() {
    // set screens icons
    this.childs.forEach((div: ElementRef) => {
      for (let i = 0; i < div.nativeElement.querySelectorAll(".ms-panel-body").length; i++) {
        let v = div.nativeElement.querySelectorAll(".ms-panel-body")[i];

        if (v.querySelector(".HFive").innerHTML == 2) {
          v.querySelector("i.fas").classList.add("fa-clipboard-list");
        } else if (v.querySelector(".HFive").innerHTML == 3) {
          v.querySelector("i.fas").classList.add("fa-sort-amount-down");
        } else if (v.querySelector(".HFive").innerHTML == 5) {
          v.querySelector("i.fas").classList.add("fa-tasks");
        } else if (v.querySelector(".HFive").innerHTML == 6) {
          v.querySelector("i.fas").classList.add("fa-donate");
        } else if (v.querySelector(".HFive").innerHTML == 7) {
          v.querySelector("i.fas").classList.add("fa-receipt");
        } else if (v.querySelector(".HFive").innerHTML == 4) {
          v.querySelector("i.fas").classList.add("fa-cogs");
        } else if (v.querySelector(".HFive").innerHTML == 1) {
          v.querySelector("i.fas").classList.add("fa-cogs");
        } else if (v.querySelector(".HFive").innerHTML == 8) {
          let img = document.createElement("img");
          v.querySelector("i.fas").classList.add("fa-utensils");
        } else if (v.querySelector(".HFive").innerHTML == 9) {
        } else if (v.querySelector(".HFive").innerHTML == 10) {
          v.querySelector("i.fas").classList.add("fa-stream");
        } else if (v.querySelector(".HFive").innerHTML == 0) {
        }
      }
    });
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  changeCssFile() {
    let langsSet: string = this.LocalstorgeService.get("langs");
    let headTag = this.document.getElementsByTagName("head")[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById("langCss") as HTMLLinkElement;
    let bundleName = langsSet === "ar" ? "arabicStyle.css" : "englishStyle.css";
    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      let newLink = this.document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.type = "text/css";
      newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }
    this.translate.setDefaultLang(langsSet);
    this.translate.use(langsSet);
    let htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = langsSet === "ar" ? "rtl" : "ltr";
  }

  getAllshifts() {
    this.shiftSer.GetAllShifts().subscribe((res) => {
      this.shiftlist = res as WorktimesModel[];
      this.shift = this.shiftlist.first();
    });
  }

  onLogout() {
    let date = JSON.parse(localStorage.getItem("UserLoginDocumentId"));

    this.UserLoginSer.UserLogout(date).subscribe((res: any) => {
      this.UserInfo = res as UserLoginModel;
    });
    this.UserLoginSer.pushToServerInLogout().subscribe((res: any) => {});
    localStorage.removeItem("token");
    this.router.navigateByUrl("/login");
  }

  getAllScreens() {
    this.shiftSer.GetScreen().subscribe((res: any) => {
      this.isAllowed = res.user.UserNumber === 1 ? true : false;
      this.Screenlist = res.models as any;
      this.setting = res["setting"];
      let isCloud = res["isCloud"];
      let isDemo = res["isDemo"];
      this.checkWizardAndPos(this.setting, isCloud, isDemo);
      if (this.setting && this.setting.SystemMainLanguage > 0)
        this.printDetailobj.LanguageId = this.setting.SystemMainLanguage;
      else this.printDetailobj.LanguageId = 2;

      this.SectionList = [];
      this.Screenlist?.forEach((item) => {
        if (
          this.setting &&
          !this.setting.UseStocksAndPurchase &&
          item[0] &&
          (item[0].SectionNumber == 5 || item[0].SectionNumber == 10)
        ) {
          // remove Stock Screens
        } else if (
          this.setting &&
          this.setting.UseStocksAndPurchase == true &&
          this.setting.DealingWithStockAs == 1 &&
          item[0] &&
          item[0].SectionNumber == 10
        ) {
          // remove Kitchen Screens
        } else {
          this.SectionList.push(item[0]);
        }
      });
      if (this.SectionList.filter((screen: any) => screen.ScreenNumber === 51)[0]) {
        this.isAllowedToViewOrderScreen.next(true);
      }
      if (this.SectionList && this.SectionList.length) {
        /////////////// hide and show the screens based on a condition in the settings ////////////
        if (this.pointofsaleobj && (this.pointofsaleobj.IsHallPos || this.pointofsaleobj.IsTabletDevice)) {
          this.SectionList = this.SectionList.filter((x) => x.SectionNumber == 2);
        }

        if (this.setting && !this.setting.UseMinimumCharge) {
          let index = this.Screenlist.filter((x) => x[0].SectionNumber == 3)[0]?.findIndex((x) => x.ScreenNumber == 79);
          if (index != -1) this.Screenlist.filter((x) => x[0].SectionNumber == 3)[0]?.splice(index, 1);
        }
        if (this.setting && !this.setting.UseMyPoints) {
          let index = this.Screenlist.filter((x) => x[0].SectionNumber == 3)[0]?.findIndex((x) => x.ScreenNumber == 100);
          if (index != -1) this.Screenlist.filter((x) => x[0].SectionNumber == 3)[0]?.splice(index, 1);
        }
        if (this.setting && !this.setting.UseMyCoupons) {
          let index = this.Screenlist.filter((x) => x[0].SectionNumber == 3)[0]?.findIndex((x) => x.ScreenNumber == 50);
          if (index != -1) this.Screenlist.filter((x) => x[0].SectionNumber == 3)[0]?.splice(index, 1);
        }
        if (this.pointofsaleobj && this.pointofsaleobj.IsCallCenter) {
          let index = this.Screenlist.filter((x) => x[0].SectionNumber == 2)[0]?.findIndex((x) => x.ScreenNumber == 55);
          this.Screenlist.filter((x) => x[0].SectionNumber == 2)[0]?.splice(index, 1);
        } else {
          // debugWger
          let index = this.Screenlist.filter((x) => x[0].SectionNumber == 2)[0]?.findIndex((x) => x.ScreenNumber == 86);
          if (index != -1) {
            this.Screenlist.filter((x) => x[0].SectionNumber == 2)[0]?.splice(index, 1);
          }
        }
      }
    });
    // this.getDivs();
  }

  checkWizardAndPos(setting: SettingModel, isCloud: boolean, isDemo: boolean) {
    // debugger
    if (!setting.FirstLogIn && isCloud && this.pointofsaleobj && this.pointofsaleobj.DocumentId) {
      localStorage.setItem("PointOfSaleDocumentId", this.pointofsaleobj.DocumentId);
      const dialogRef = this.dialog.open(BranchWizardComponent);
      dialogRef.afterClosed().subscribe((result) => {});
    } else if (!localStorage.getItem("PointOfSaleDocumentId") && !isCloud) {
      this.posService.getAuthorizedPOSForOldUsers().subscribe((res: any) => {
        if (res && res.DocumentId) {
          this.pointofsaleobj = res;
          localStorage.setItem("PointOfSaleDocumentId", res.DocumentId);
        } else if (!this.pointofsaleobj || !this.pointofsaleobj.DocumentId) {
          this.toastr.info(this.translate.instant("messages.MissingPointofsale"));
          this.router.navigateByUrl("/pointofsale");
        }
      });
    } else if (!this.pointofsaleobj || !this.pointofsaleobj.DocumentId) {
      this.posService.getAuthorizedPOS().subscribe((res: any) => {
        //
        if (res && res.DocumentId) {
          this.pointofsaleobj = res;
          localStorage.setItem("PointOfSaleDocumentId", res.DocumentId);
        } else if (!this.pointofsaleobj || !this.pointofsaleobj.DocumentId) {
          this.toastr.info(this.translate.instant("messages.MissingPointofsale"));
          this.router.navigateByUrl("/pointofsale");
        }
      });
    }
    if (isDemo == true && !localStorage.getItem("PointOfSaleDocumentId")) {
      this.posService.getAuthorizedPOS().subscribe((res: any) => {
        //
        if (res && res.DocumentId) {
          this.pointofsaleobj = res;
          localStorage.setItem("PointOfSaleDocumentId", res.DocumentId);
        } else if (!this.pointofsaleobj || !this.pointofsaleobj.DocumentId) {
          this.toastr.info(this.translate.instant("messages.MissingPointofsale"));
          this.router.navigateByUrl("/pointofsale");
        }
      });
    }
  }

  addFieldValue() {
    this.newAttribute = { CategoryDetails: [] };
    this.incominguserArray.push(this.newAttribute);
  }

  getTranslationName(trSection: string, name: string) {
    return trSection + "." + (name ? name.toLowerCase() : "");
  }

  deleteCategoryDetail(index) {
    if (this.incominguserobj.CategoryDetails && this.incominguserobj.CategoryDetails[index])
      this.incominguserobj.CategoryDetails.splice(index, 1);
  }

  onChangeCashType(index) {
    this.incominguserArray.map((x) => x.CategoryDetails.splice(0));
  }

  addCategoryDetail() {
    if (!this.incominguserobj.CategoryDetails) {
      this.incominguserobj.CategoryDetails = [];
    }
    this.incominguserobj.CategoryDetails.push({ CategoryId: 0, Quantity: 0 });
  }

  deleteFldValue(index) {
    this.incominguserArray.map((x) => x.CategoryDetails.splice(index, 1));
  }

  onShiftChanged(event) {
    this.incominguserobj.WorkTimeId = event.itemData.shift;
  }

  GetUserInfo() {
    this.userprofileser.GetUserInfo().subscribe(
      (res: any) => {
        this.userprofileobj = res;
      },
      (err) => {
        this.toastr.error(this.errorMessage.UserProfileMessages(err), "User Profile");
      }
    );
  }

  clickEvent(IsEndShift = false) {
    this.status = !this.status;
    if (IsEndShift) {
      let format = "dd/MM/yyyy HH:mm";
      let myDate = new Date().toString();
      let locale = "en-US";
      let formattedDate = formatDate(myDate, format, locale);
      this.incominguserobj.EndDayMaping = formattedDate;
    }
  }

  clickEventmodal1(IsEndShift = false,checkUnapproveOrders = true) {
    if(IsEndShift && checkUnapproveOrders && this.checkUnApprovedReturnOrdersBeforeEndShift(false)) return;
    this.status = !this.status;
    if (IsEndShift) {
      let format = "dd/MM/yyyy HH:mm";
      let myDate = new Date().toString();
      let locale = "en-US";
      let formattedDate = formatDate(myDate, format, locale);
      this.incominguserobj.EndDayMaping = formattedDate;
      this.posSettings = new SettingModel();
      this.settingService.GetSettings().subscribe((res) => {
        this.posSettings = res as SettingModel;
        if(this.checkCanCloseShift("endshiftmodal" , this.posSettings)) 
          $("#endshiftmodal").modal("show");
      });
    }
  }
  checkUnApprovedReturnOrdersBeforeEndShift(endWithPayType:boolean){
    if(this.setting?.UsedApprovedScreen){
      this.dashboardSer.checkUnApprovedReturns(this.incominguserobj).subscribe(res=>{
        if(res)
        {
          Swal.fire({
            title: this.translate.instant("messages.UnapprovedReturnOrdersExist"),
            text: "",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: this.translate.instant("Dashboard.EndShift"),
            cancelButtonText:this.translate.instant("Shared.Cancel"),
          }).then((result) => {
            if (result.isConfirmed)
              this.continueOpenENdShiftModal(endWithPayType);
          });
        }
        else
          this.continueOpenENdShiftModal(endWithPayType);
      },e=>{
        this.continueOpenENdShiftModal(endWithPayType);
      });
      return true;
    }
    return false;
  }
  continueOpenENdShiftModal(endWithPayType:boolean){
    if(endWithPayType) this.GetPayList(false);
    else this.clickEventmodal1(true,false);
  }
  checkCanCloseShift(modalName:string ,posSettings :SettingModel){
    if (posSettings?.CloseCashAfterClosingAllopenOrders && posSettings?.NotClosedOrderCheck) {
      Swal.fire({
        title: this.translate.instant("Shared.UnClosedOrdersFor") + "(" + posSettings.CurrentUserName + ")",
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: this.translate.instant("Shared.Ok")
      }).then((result) => {
        if (result.isConfirmed) {
          $("#"+modalName).modal("hide");
          this.dashboardSer.isOpenShift = false;
          console.log('isOpenShift : ',this.dashboardSer.isOpenShift)
        }
      });
      return false;
    }
    return true;
  }
  closeNav() {
    this.SideMenu = false;
  }

  openNav(e: any) {
    this.SideMenu = true;
    this.router.navigate(["/dashboard", { data: e }]);
  }

  ngAfterViewInit() {}

  /* dropdown Function */

  ngOnInit() {
    this.autoLoadExcel();
    this.InnerWidth = window.innerWidth;

    if (!this.LocalstorgeService.get("langs")) this.translate.setDefaultLang("ar");
    else this.translate.setDefaultLang(this.LocalstorgeService.get("langs"));
    this.LicenseObj = this.LocalstorgeService.get("LicenseObj");
    this.changeCssFile();
    this.OpenDay();
    this.isOpened = true;
    this.GetUserData();
    this.GetNonAprovedReturnsCount();

    this.GetNotificationCustomerOrder();
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";

    // this.checkSettingsNeddTimer();
    this.GetFavoriteScreenList();
    this.getAllScreens();
    this.getUserNameBasedInShowPinAfterPayment();
  }

  // checkSettingsNeddTimer() {
  //   this.checkAutoAddingReceivingTransfer();
  // }

  // checkAutoAddingReceivingTransfer() {
  //   let setting = new SettingModel();
  //   this.settingService.GetSetting().subscribe((res) => {
  //     setting = res as SettingModel;
  //     if (setting) {
  //       if (setting.UseAutoReceivingTransfer == true)
  //         this.autoReceiveTransfersEvery(setting.AutoReceivingTransferMinutes);
  //       else if (this.interval) clearInterval(this.interval);
  //     }
  //   });
  // }

  // autoReceiveTransfersEvery(minutes) {
  //   const milleSecound = minutes != undefined && minutes > 0 ? minutes * 60000 : 600000;
  //   this.interval = setInterval(() => {
  //     this.autoInsertReceivingTransfer();
  //   }, milleSecound);
  // }

  // autoInsertReceivingTransfer() {
  //   this.receivingtransferService.autoInsertReceivingTransfer().subscribe((res) => {});
  // }

  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split("/")[1];
    selectedTheme = selectedTheme ? selectedTheme : "Material";
    args.chart.theme = <ChartTheme>(
      (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark")
    );
    if (selectedTheme === "highcontrast") {
      args.chart.series[0].marker.dataLabel.font.color = "#000000";
      args.chart.series[1].marker.dataLabel.font.color = "#000000";
      // args.chart.series[2].marker.dataLabel.font.color= '#000000';
    }
  }

  GetPayList(checkUnapproveOrders = true) {
    if(checkUnapproveOrders && this.checkUnApprovedReturnOrdersBeforeEndShift(true)) return;
    this.settingService.GetSettings().subscribe((res) => {
      this.posSettings = res as SettingModel;
      if (!this.checkCanCloseShift("endshiftmodal2",this.posSettings )) return;

      this.dashboardSer.GetPayList(this.incominguserobj.DocumentId).subscribe((res: any) => {
        this.MyIncomingUserObj = res;
        this.MyIncomingUserObj.DocumentId = this.incominguserobj.DocumentId;
        this.MyIncomingUserObj.UserName = this.incominguserobj.UserName;
        this.MyIncomingUserObj.WorkTimeName = this.incominguserobj.WorkTimeName;
        this.MyIncomingUserObj.EndDayMaping = this.incominguserobj.EndDayMaping;
        $("#endshiftmodal2").modal("show");
      });
    });
  }

  getStoppedProducts() {
    this.dashboardSer.getStoppedProducts().subscribe(
      (res: any) => {
        this.stoppedProducts = res;
      },
      (err) => {}
    );
  }

  getBestSellerProducts() {
    this.dashboardSer.getBestSellerProducts().subscribe(
      (res: any) => {
        this.bestSeller = res;
      },
      (err) => {
        this.toastr.error(this.errorMessage.GlobalMessages(err), "getBestSellerProducts");
      }
    );
  }

  GetNonAprovedReturnsCount() {
    this.dashboardSer.GetNonAprovedReturnsCount().subscribe((res: any) => {
      this.ReturnCounts = res;
      localStorage.setItem("ReturnCounts", JSON.stringify(this.ReturnCounts));
    });
  }

  checkOpenDay() {
    this.dashboardSer.checkUnclosedShiftfromUser().subscribe((res) => {
      this.result = res["checkModel"];
      this.pointofsaleobj = res["pointOfSale"] as PointOfSaleModel;
      this.categories = res["categories"];
      this.continueCheck();
      this.getAllScreens();
      this.dashboardSer.getAllUsersInfo().subscribe((res: any) => {
        this.users = res;
      });
      this.OpenDaySer.isOpened = true;
      this.dashboardSer.isSending = true;
    });
  }

  continueCheck() {
    if (this.result.IsOpenShift === true) {
      this.DisabledShiftOpenClass = true;
      this.CheckedDisabled = false;
      this.incominguserobj = this.result.IncomingUser;
    }
    if (this.result.IsClosedShift === true) {
      this.CheckedDisabled = true;
      // this.DisabledShiftOpenClass = false;
      this.incominguserobj = new IncomingUserModel();
    } else if (this.result.IsClosedShift === false && this.result.IsOpenShift === false) {
      this.CheckedDisabled = true;
      this.DisabledShiftOpenClass = false;
      this.incominguserobj = new IncomingUserModel();
    }

    if (!this.incominguserobj.OpenBalance) this.incominguserobj.OpenBalance = 0;
  }

  RedirectTo(Rout: string) {
    this.router.navigateByUrl("/" + Rout);
  }

  getCategories() {
    this.dashboardSer.GetCategories().subscribe((res: any) => {
      this.categories = res;
    });
  }

  openShift() {
    if (this.dashboardSer.isSending === false) return;
    this.incominguserobj.PointOfSaleId = this.pointofsaleobj.Id;
    this.incominguserobj.PointOfSaleDocumentId = this.pointofsaleobj.DocumentId;
    this.incominguserobj.PointOfSaleName = this.pointofsaleobj.Name;
    // this.incominguserobj.WorkTimeId = this.shift.Id;

    this.dashboardSer.OpenDay(this.incominguserobj).subscribe(
      (res: any) => {
        this.errorMessage.GlobalMessages(res);
        if (res == 1) {
          $("#openshiftmodal").modal("hide");
          this.checkOpenDay();
        }
        this.dashboardSer.isSending = true;
      }
    );
  }

  endShift() {
    this.settingService.GetSettings().subscribe((res) => {
      let setting = res as SettingModel;
      if (setting.CloseCashAfterClosingAllopenOrders) {
        if (setting.NotClosedOrderCheck) {
          this.toastr.error(this.toastrMessage.GlobalMessages(36));
        } else {
          this.endFunction();
        }
      } else {
        this.endFunction();
      }
    });
  }

  endFunction() {
    this.incominguserobj.EndDay = new Date();
    this.getEndShiftReportTranslationObj(this.incominguserobj);
    this.dashboardSer.EndShift(this.incominguserobj).subscribe(
      (res: any) => {

        this.errorMessage.GlobalMessages(res);
        if (res == 1) {
          this.toastr.success("Done");
          $("#endshiftmodal").modal("hide");
          $("#endshiftmodal2").modal("hide");
          this.PrintCashierEndShift(this.incominguserobj.DocumentId);
          this.onLogout();
        }
      },
      (err) => {
        this.toastr.error(this.errorMessage.GlobalMessages(err), "Open Shift");
      }
    );
  }

  MyEndShift() {
    this.MyIncomingUserObj.EndDay = new Date();
    this.getEndShiftReportTranslationObj(this.incominguserobj);
    this.dashboardSer.EndShift(this.MyIncomingUserObj).subscribe(
      (res: any) => {
        this.errorMessage.GlobalMessages(res);
        if (res == 1) {
          this.toastr.success("Done");
          $("#endshiftmodal2").modal("hide");
          this.PrintCashierEndShift(this.MyIncomingUserObj.DocumentId);
          this.onLogout();
        }
      },
      (err) => {
        this.toastr.error(this.errorMessage.GlobalMessages(err), "Open Shift");
      }
    );
  }

  PrintCashierEndShift(DocumentId: string) {
    this.model = [];
    if (this.printDetailobj.LanguageId == 1) {
      this.model.push(DocumentId);
      this.myjson = en["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.model.push(DocumentId);
      this.myjson = ar["Reports"];
      this.model.push(this.myjson);
      this.model.push("ar");
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.model.push(DocumentId);
      this.myjson = tr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.model.push(DocumentId);
      this.myjson = fr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }

    if (this.printDetailobj.DestinationId == 2) {
      this.model.push(this.printDetailobj.Reciever);
      this.model.push(this.printDetailobj.Title);
      this.model.push(this.printDetailobj.Message);
      this.ifPerview = false;
    } else {
      this.ifPerview = true;
    }

    this.endShiftServ.PrintCashierEndShiftFromHome(this.model).subscribe((data: Response) => {});
  }

  CheckCashAmount(index) {
    let totals = 0;
    this.incominguserobj.CategoryDetails.forEach((cd) => {
      if (!cd.CategoryId) {
        this.incominguserobj.CategoryDetails[index].Quantity = 0;
        this.toastr.warning("Please select Currency Category!");
        return;
      }
      let category = this.categories.find((c) => c.Id == cd.CategoryId);
      if (category) totals += Number(category.Value) * Number(cd.Quantity);
    });
    this.incominguserobj.Amount = totals;
  }

  endShift2() {
    this.incominguserArray.forEach((x) => (x.PointOfSaleId = this.pointofsaleobj.Id));
    this.incominguserArray.forEach((x) => (x.WorkTimeId = this.shift.Id));
    this.incominguserArray.forEach((x) => (x.UserName = this.userprofileobj.UserNumber));
    this.incominguserArray.forEach((x) => (x.UserId = this.userprofileobj.AppUserId));

    this.getEndShiftReportTranslationObj(this.incominguserobj);

    this.dashboardSer.EndShift(this.incominguserobj).subscribe(
      (res: any) => {
        this.errorMessage.GlobalMessages(res);
        if (res == 1) {
          $("#modal-420111024").modal("hide");
          $("#endshiftmodal").modal("hide");
          this.checkOpenDay();
          this.incominguserArray = [];
          this.toastr.success("Done");
        }
      },
      (err) => {
        this.toastr.error(this.errorMessage.GlobalMessages(err), "Open Shift");
      }
    );
  }

  GetSectionScreens(section) {
    let screens = this.Screenlist.filter((x) => x[0].SectionNumber == section.SectionNumber)[0];
    this.screensLength = screens.length;
    if (screens.length > 0) {
      const distinctArray = Array.from(new Set(screens.map((item) => item?.ScreenNumber))).map(
        (ScreenNumber) => screens.find((item) => item?.ScreenNumber === ScreenNumber)!
      );
      if (distinctArray && distinctArray.length > 0) {
        this.screensLength = distinctArray.length;
        screens = distinctArray;
      }
    }
    return screens;
  }

  setrSectionName(data, screen) {
    if (
      !this.OpenDayFlag &&
      (screen.ScreenNumber == 51 ||
        screen.ScreenNumber == 52 ||
        screen.ScreenNumber == 53 ||
        screen.ScreenNumber == 54 ||
        screen.ScreenNumber == 55 ||
        screen.ScreenNumber == 57 ||
        screen.ScreenNumber == 60 ||
        screen.ScreenNumber == 61 ||
        screen.ScreenNumber == 64 ||
        screen.ScreenNumber == 80 ||
        screen.ScreenNumber == 57 ||
        screen.ScreenNumber == 91 ||
        screen.ScreenNumber == 95 ||
        screen.ScreenNumber == 84 ||
        screen.ScreenNumber == 94)
    ) {
      debugger
      this.router.navigateByUrl("/home");
      this.toastr.warning(this.translate.instant("messages.MustBeOpenDay"));
      return false;
    }
    let isOrder = [51, 52, 61, 55].includes(screen.ScreenNumber);
    if (
      data.Name.toLowerCase() == "order" &&
      screen &&
      isOrder &&
      (!this.incominguserobj || !this.incominguserobj.DocumentId || !this.incominguserobj.WorkTime)
    ) {
      this.router.navigateByUrl("/home");
      if (!this.incominguserobj.DocumentId) {
        this.toastr.warning(this.translate.instant("messages.MustOpenShift"));
        return false;
      }
      if (!this.incominguserobj.WorkTime || !this.incominguserobj.WorkTimeDocumentId) {
        this.toastr.warning(this.translate.instant("messages.MustLinkUserWithShift"));
        return false;
      }
    } else if (screen.ScreenNumber == 94) {
      this.openCustomerDisplay(data);
    } else {
      localStorage.setItem("Section", JSON.stringify(data));
    }
  }

  async openCustomerDisplay(data) {
    let w: any = window;
    const screenDetails = await w.getScreenDetails();
    if (screenDetails.screens.length > 1 && screenDetails.screens[0].isExtended) {
      let url = window.location.href.replace("home", "order/customerdisplay");
      const newChildWindow = window.open(url, "_blank", `left=0,top=0`);
      newChildWindow.moveTo(screenDetails.screens[1].left, 0);
      if (
        newChildWindow.outerWidth < screenDetails.screens[1].availWidth ||
        newChildWindow.outerHeight < screenDetails.screens[1].availHeight
      )
        newChildWindow.resizeTo(screenDetails.screens[1].availWidth, screenDetails.screens[1].availHeight);

      this.router.navigateByUrl("/home");
    } else localStorage.setItem("Section", JSON.stringify(data));
  }

  GetUserData() {
    let date = JSON.parse(localStorage.getItem("UserLoginDocumentId"));
    this.UserLoginSer.getById(date.DocumentId).subscribe((res: any) => {
      this.UserInfo = res as UserLoginModel;
      if (this.UserInfo.NotAutorized) {
        this.toastr.error(this.errorMessage.LoginMessages(3));
        this.onLogout();
      }
      else if (this.UserInfo.NotAutorizedPOS) {
        this.toastr.error(this.errorMessage.LoginMessages(4));
        this.onLogout();
      }
      this.UserInfo.LastPublishDate = new Date(this.UserInfo.LastPublishDate).toLocaleDateString().replace(",", "");
    });
  }

  GetOpenDay() {
    this.OpenDaySer.firstOpen().subscribe((res: any) => {
      this.OpenDayobj = res as any;
    });
  }

  AddopenDay() {
    if (this.OpenDaySer.isOpened === false) return;
    this.OpenDaySer.AddOpenDay(this.OpenDayobj).subscribe((res: any) => {
      if (res != 1) {
        this.toastr.info(this.translate.instant("messages.DateFormat"));
      }else{
        $("#openDaymodal").modal("hide");
        this.OpenDay();
      }
    });
  }

  OpenDay() {
    this.OpenDaySer.CheckOpenDay().subscribe((res: any) => {
      this.OpenDayFlag = res as any;
      if (this.OpenDayFlag) {
        this.checkOpenDay();
      }
      if (!this.OpenDayFlag) {
        this.DisabledShiftOpenClass = true;
      }
    });
  }

  tooltipRenderproductGroupQuentity(args: IAccTooltipRenderEventArgs): void {
    this.value = (args.point.y / args.series.sumOfPoints) * 100;
    args["text"] = args.point.x + " : " + Math.ceil(this.value) + "" + "%" + "(" + args.point.y + ")";
    // console.log(this.value);
  }

  tooltipRenderproductGroupTotal(args: IAccTooltipRenderEventArgs): void {
    this.value = (args.point.y / args.series.sumOfPoints) * 100;
    args["text"] = args.point.x + " : " + Math.ceil(this.value) + "" + "%" + "(" + args.point.y + ")";
    // console.log(this.value);
  }

  routToOrderIfHallPOS() {
    if (
      this.pointofsaleobj &&
      (this.pointofsaleobj.IsHallPos || this.pointofsaleobj.IsTabletDevice) &&
      this.SectionList &&
      this.SectionList.length == 1 &&
      this.SectionList[0].ScreenNumber == 51
    ) {
      this.router.navigateByUrl("/order");
    }
  }

  GetNotificationCustomerOrder() {
    this.dashboardSer.GetNotificationCustomerOrder().subscribe(
      (data: any) => {
        this.CustomerOrders = data.Customerorders;
        this.CustomerorderNumers = data.CustomerorderNumers;
        this.ordersNumber = data.ordersNumber;
        this.server = data.server as DatabaseDetailModel;
        this.AllNotifiationNum = data.AllNotifiationNum - (data.CustomerorderNumers ?? 0);
        this.ProductList = data.ProductList;
        this.ProductListCount = data.ProductListCount;
      },
      (err) => {}
    );
  }

  SyncOrders() {
    this.ServerSyncService.PushToServer(this.server).subscribe((data: Response) => {
      this.GetNotificationCustomerOrder();
    });
  }

  // PrintNotificationDetails(e) {
  //   $("#modal-3").modal("hide");
  //   this.CurrentOrderCustomer = e;
  //   this.model = [];
  //   if (this.printDetailobj.LanguageId == 1) {
  //     this.model.push(e.DocumentId);
  //     this.myjson = en["Reports"];
  //     this.model.push(this.myjson);
  //     this.model.push("en");
  //   }
  //   if (this.printDetailobj.LanguageId == 2) {
  //     this.model.push(e.DocumentId);
  //     this.myjson = ar["Reports"];
  //     this.model.push(this.myjson);
  //     this.model.push("ar");
  //   }
  //   if (this.printDetailobj.LanguageId == 3) {
  //     this.model.push(e.DocumentId);
  //     this.myjson = tr["Reports"];
  //     this.model.push(this.myjson);
  //     this.model.push("en");
  //   }
  //   if (this.printDetailobj.LanguageId == 4) {
  //     this.model.push(e.DocumentId);
  //     this.myjson = fr["Reports"];
  //     this.model.push(this.myjson);
  //     this.model.push("en");
  //   }

  //   this.dashboardSer.printCustomerOrder(this.model).subscribe((data: Response) => {
  //     this.loading = false;
  //     this.report.loadDocument(data);
  //     this.viewer.report = this.report;
  //     this.viewer.renderHtml("viewer");
  //     $("#modal-2").modal("show");
  //   });

  //   return false;
  // }

  // setReport(data) {
  //   this.printDetailobj.LanguageId = data.value;
  //   this.PrintNotificationDetails(this.CurrentOrderCustomer);
  // }

  GetFavoriteScreenList() {
    this.dashboardSer.GetFavoriteScreenList().subscribe(
      (res: any) => {
        this.ScreenList = res.ScreenList;
        this.FavoritScreenList = res.FavoritScreenList;
      },
      (err) => {}
    );
  }

  AddToFavorite(Screen: any) {
    this.dashboardSer.InsertFavoritescreen(Screen).subscribe(
      (res: any) => {
        this.GetFavoriteScreenList();
        if (res == 37) {
          Swal.fire({
            title: this.translate.instant("Shared.attention"),
            text: this.translate.instant("Shared.Thenumberofpreferredscreensmustbelessthan6screens"),
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: this.translate.instant("Shared.Ok")
          }).then((result) => {
            if (result.isConfirmed) {
            }
          });
        }
      },
      (err) => {}
    );
  }

  RemoveFromFaforite(DocumentId: any) {
    this.dashboardSer.DeleteFavoritescreenAsync(DocumentId).subscribe(
      (res: any) => {
        this.GetFavoriteScreenList();
      },
      (err) => {}
    );
  }

  GetScreenRoute(RouteName: any) {
    this.router.navigateByUrl(RouteName);
  }

  // ==========================================================================================
  // ============================== handling what's new button ================================
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  // what's new handling
  badge: number = 1;
  hidden: boolean = false;
  titles = [];
  fileUploaded = [];
  displayedNews = {};
  isAllowed: boolean = false;

  // function to open or close the what's new modal
  openNews() {
    this.dashboardSer.isClicked = true;
    if (this.dashboardSer.isClicked === true) {
      $("#whatsNewModal").modal("show");
      this.toggleBadgeVisibility();
      setTimeout(() => {
        this.badge = 0;
      }, 4000);
    } else {
      $("#whatsNewModal")
        .modal("hide")
        .subscribe(() => {
          this.dashboardSer.isClicked = false;
          this.toggleBadgeVisibility();
        });
    }
  }

  // function to auto upload file and read data from it
  autoLoadExcel() {
    this._UploadService.getExcel().subscribe({
      next: (res) => {
        //
        const response = read(res);
        const responseObj = utils.sheet_to_json(response.Sheets[response.SheetNames[0]], {
          header: ["title", "imgPath", "description"],
          blankrows: false,
          raw: false
        });
        for (let i = 0; i < responseObj.length; i++) {
          if (i >= 2) {
            this.titles.push(responseObj[i]["title"]);
            this.fileUploaded.push(responseObj[i]);
            this.displayedNews = this.fileUploaded[0];
          }
        }
      }
    });
  }

  displayNews(index: number) {
    if (index === undefined || index === null) {
      this.displayedNews = this.fileUploaded[0];
    } else {
      this.displayedNews = this.fileUploaded[index];
    }
  }

  getDecodedToken(token: string): any {
    return new JwtHelperService().decodeToken(token);
  }

  getUserNameBasedInShowPinAfterPayment() {
    let token = localStorage.getItem("token");
    if (token) {
      this.userName = this.getDecodedToken(token)?.UserName;
    }
  }
  getEndShiftReportTranslationObj(incomingUser : IncomingUserModel){
    let Direction : string = "ar";
    let finalLang : any;
    if (this.printDetailobj.LanguageId == 1) {
      Direction = "en";
      finalLang = en["Reports"];
    }
    if (this.printDetailobj.LanguageId == 2) {
      Direction = "ar";
      finalLang = ar["Reports"];
    }
    if (this.printDetailobj.LanguageId == 3) {
      Direction = "en";
      finalLang = tr["Reports"];
    }
    if (this.printDetailobj.LanguageId == 4) {
      Direction = "en";
      finalLang = fr["Reports"];

    }
    let LanguageOptions = {
      CurrentUserLang: Direction,
      ReportsJson: finalLang
    };
    incomingUser.LanguageOptions = LanguageOptions;
    return incomingUser;
  }
  showCustomerPopUpAtOrderScr(){
      const type = "CustomerOrder" as any;
      this.router.navigateByUrl("/order",type);
  }
  showCustomerOrders(){
    this.dialog.open(CustomerOrderListComponent, {
      data: { isPopUp: true ,title:'Shared.customerorderlist', CustomerOrderIds :this.CustomerOrders?.map(x=>x.DocumentId)} ,// Optional: pass data to dialog component
      direction: JSON.parse(localStorage.getItem('langs')) == 'ar'? 'rtl' : 'ltr'
    });
  }

}
