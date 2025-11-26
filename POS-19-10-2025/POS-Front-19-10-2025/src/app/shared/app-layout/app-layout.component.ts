import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ShiftsService } from "src/app/core/Services/Transactions/shifts.service";
import { SetStylesComponent } from "../set-styles/set-styles.component";
import { UserLoginModel } from "src/app/core/Models/Transactions/user-login-model";
import { UserLoginService } from "src/app/core/Services/Transactions/user-login.service";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { BehaviorSubject } from "rxjs";
import { LoginService } from "src/app/core/Services/Authentication/login.service";

declare var $: any;

@Component({
  selector: "app-app-layout",
  templateUrl: "./app-layout.component.html",
  styleUrls: ["./app-layout.component.css"]
})
export class AppLayoutComponent implements OnInit , OnDestroy{
  //#region Declartions
  [key: string]: any;
  //#endregion

  bbb: boolean = true;
  showDropDown: boolean = false;
  OpenSideMenu: boolean = false;
  inputsB: boolean = false;
  ordersB: Boolean = false;
  orderB: boolean = false;
  deliveryB: Boolean = false;
  settingsB: boolean = false;
  stockB: boolean = false;
  returnOrder: any;
  newLocal: any;
  draggableElement;
  status: boolean;
  config: any;
  ShowingClock: boolean = true;
  stepclicked: boolean = false;
  reportB: boolean = false;
  getFlagPage: any;
  flag: boolean = false;
  ll: string = "ReturnOrder.Home";
  showKeyboard: boolean = false;
  UserInfo: any = new UserLoginModel();
  isAllowedToViewOrderScreen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  keyBoardOpened = false;
  @ViewChild(SetStylesComponent, { static: false })
  setStylesComponent: SetStylesComponent;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private translate: TranslateService,
    public shiftSer: ShiftsService,
    public UserLoginSer: UserLoginService,
    public loginService:LoginService,
    private languageSerService: LanguageSerService
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  ngOnDestroy(): void {
    if(this.keyBoardOpened) this.callkeyboard();
  }

  changeFlag(flagOut: boolean) {
    this.flag = flagOut;
  }

  onRouterOutletActivate(childComponent: any) {
    setTimeout(() => {
      if(this.keyBoardOpened) this.callkeyboard();
      if (childComponent.frmRef) this.frmRef = childComponent.frmRef;
    }, 100);
  }

  callkeyboard() {
    this.keyBoardOpened = !this.keyBoardOpened;
    this.loginService.openkeyboard().subscribe();
    // this.showKeyboard = !this.showKeyboard;

    // var url = "OSK:";
    // self.open(url, "_top");
  }

  tab() {
    this.focusNextElement();
  }

  focusNextElement() {
    //add all elements we want to include in our selection
    var focussableElements =
      'a:not([disabled]), button:not([disabled]), input, [tabindex]:not([disabled]):not([tabindex="-1"])';
    let activeElement: any = document.activeElement;
    if (activeElement && activeElement.form) {
      var focussable = Array.prototype.filter.call(
        activeElement.form.querySelectorAll(focussableElements),
        function (element) {
          //check for visibility while always include the current activeElement
          return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
        }
      );
      var index = focussable.indexOf(document.activeElement);
      if (index > -1) {
        var nextElement = focussable[index + 1] || focussable[0];
        nextElement.focus();
      }
    }
  }

  ngOnInit(): void {
    this.getAllScreens();
    // this.changeCssFile();
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.ReturnCounts = JSON.parse(localStorage.getItem("ReturnCounts"));
  }

  getAllScreens() {
    this.shiftSer.GetScreen().subscribe((res: any) => {
      this.Section = JSON.parse(localStorage.getItem("Section"));
      this.Screenlist = res.models as any;
      this.settings = res.setting;
      this.CurrentSectionScreens = [];
      let LicenseObj = JSON.parse(localStorage.getItem("LicenseObj"));
      // when cloud open all screens in side bar
      if (LicenseObj && LicenseObj.IsCloud) {
        this.IsCloud = true;
        this.SectionsList = [];
        this.Screenlist?.forEach((item) => {
          this.CurrentSectionScreens.push.apply(this.CurrentSectionScreens, item);

          if (
            this.settings &&
            !this.settings.UseStocksAndPurchase &&
            item[0] &&
            (item[0].SectionNumber == 5 || item[0].SectionNumber == 10)
          ) {
            // remove Stock Screens
          } else if (
            this.settings &&
            this.settings.UseStocksAndPurchase == true &&
            this.settings.DealingWithStockAs == 1 &&
            item[0] &&
            item[0].SectionNumber == 10
          ) {
            // remove Kitchen Screens
          } else {
            let section = {
              Name: item[0].SectionName,
              Icon: this.getSectionIcon(item[0].SectionName)
            };
            this.SectionsList.push(section);
          }

          // this.ScreenList.slice(item[2].SectionNumber == 2)
        });
        if (this.SectionList.filter((screen: any) => screen.ScreenNumber === 51)[0]) {
          this.isAllowedToViewOrderScreen.next(true);
        }
      }
      // when not cloud just open screens for current section only
      else {
        this.Screenlist?.forEach((item) => {
          if (this.Section?.SectionNumber == item[0]?.SectionNumber) {
            this.CurrentSectionScreens.push.apply(this.CurrentSectionScreens, item);
            this.SectionName = item[0].SectionName;
            this.SectionIcon = this.getSectionIcon(item[0].SectionName);
          } else if (this.SectionsList) {
            this.SectionsList.slice(item[5]?.SectionName == 2);
          }
          // console.log(this.CurrentSectionScreens);
        });
      }
      //  this.endShift = (this.ScreenList.item[1].SectionNumber == 2)
      //
      // if(this.Screenlist && this.Screenlist.length) {
      //
      //  this.ele = this.Screenlist.forEach((item: any) => {
      //     item.filter((x) => {
      //       return x.ScreenNumber == 64
      //     }).splice(this.ele,1)

      //   })
      // for (let index = 0; index < this.Screenlist.length; index++) {
      //   const section = this.Screenlist[index];
      //   let indexOfEndShift = section.find((x) => x.SectionNumber == 2 && x.ScreenNumber == 64)

      //   if(indexOfEndShift){
      //     let rr = section.findIndex((x) => {
      //       x.ScreenNumber == 64;
      //     });
      //     this.Screenlist.filter((x) =>
      //       x[0].SectionNumber == 64
      //     )[0].splice(rr, 1);
      //     console.log('filter item',rr);
      //   }
      // }
      // let indexOfEndShift = this.Screenlist.filter((x) => x.SectionNumber == 2)[0].findIndex((x) => {
      //   x.ScreenNumber == 64;
      // });

      // }

      //  this.Screenlist.splice(this.el,1)
      // console.log(this.ScreenList);

      //console.log(this.CurrentSectionScreens);
    });
  }

  getSectionIcon(SectionName: string) {
    let icon = "settings";
    switch (SectionName) {
      case "Setting":
        icon = "settings";
        break;
      case "Order":
        icon = "receipt";
        break;
      case "Transaction":
        icon = "event_note";
        break;
      case "Report":
        icon = "print";
        break;
      case "KDS":
        icon = "kitchen";
        break;
      case "Input":
        icon = "input";
        break;
    }
    return icon;
  }

  closeAllColapsed(index) {
    //
    let elems = Array.from(document.getElementsByClassName("show"));
    if (elems) {
      elems.forEach((element) => {
        if (element.id != "collapseOne" + index) element.classList.remove("show");
      });
    }
  }

  GetSectionScreensForCloud(section) {
    let screens = this.CurrentSectionScreens.filter((x) => x.SectionName == section);
    return screens;
  }

  GetSectionScreens(section) {
    //
    let screens = this.Screenlist.filter((x) => x[0].SectionNumber == section.SectionNumber)[0];
    return screens;
  }

  onLogout() {
    //
    let date = JSON.parse(localStorage.getItem("UserLoginDocumentId"));

    this.UserLoginSer.UserLogout(date).subscribe((res: any) => {
      //
      this.UserInfo = res as UserLoginModel;
    });
    this.UserLoginSer.pushToServerInLogout().subscribe((res: any) => {
      //
    });
    localStorage.removeItem("token");
    this.router.navigateByUrl("/login");
  }

  showClick() {
    if (this.ShowingClock) {
      this.ShowingClock = false;
    } else {
      this.ShowingClock = true;
    }
  }

  isConfigureMode() {
    return $(".ms-quick-bar-list").hasClass("ms-qa-configure-mode");
  }

  /*  Custom Toggle Actions */
  customToggleActions(event): any {
    this.OpenSideMenu = !this.OpenSideMenu;
    $("body").toggleClass("ms-aside-left-open");
  }

  overlay() {
    this.OpenSideMenu = !this.OpenSideMenu;
    $("body").toggleClass("ms-aside-left-open");
  }

  uickBarToggle() {
    $(".ms-quick-bar").removeClass("ms-quick-bar-open");
    $(".ms-quick-bar-item > a").removeClass("active show");
    $(".ms-quick-bar-item > a").attr("aria-selected", "false");
    $(".ms-quick-bar > .tab-content .tab-pane").removeClass("active show");

    if (this.isConfigureMode() == false) {
      $(".ms-quick-bar").toggleClass("ms-quick-bar-open");
      $(".ms-quick-bar-title").text($(this).data("title"));
    }

    $(".ms-toggler").bind("click", function () {
      // tslint:disable-next-line: no-var-keyword
      var target = $(this).data("target");
      var toggleType = $(this).data("toggle");

      switch (toggleType) {
        case "slideDown":
          $(target).toggleClass("ms-slide-down");
          break;
        // Quick bar
        case "hideQuickBar":
          $(".ms-quick-bar").removeClass("ms-quick-bar-open");
          $(".ms-quick-bar-item > a").removeClass("active show");
          $(".ms-quick-bar-item > a").attr("aria-selected", "false");
          $(".ms-quick-bar > .tab-content .tab-pane").removeClass("active show");

          break;
        default:
          return;
      }
    });
  }

  clickedSlideDown() {
    this.showDropDown = !this.showDropDown;
  }

  DarkMode() {
    $("body").toggleClass("ms-dark-theme");
  }

  RemoveQk() {
    $("body").toggleClass("ms-has-quickbar");
  }

  purpleMode() {
    $("body").toggleClass("ms-purple-theme");
  }

  getTranslationName(trSection: string, name: string) {
    return trSection + "." + (name ? name.toLowerCase() : "");
  }
}
