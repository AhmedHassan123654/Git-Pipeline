import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonService, SettingService } from "../../branch/branchimport";
import {
  LanguageSerService,
  OrderModel,
  OrderService
} from "../../follow-call-center-order/follow-call-center-order-imports";
import { SettingModel } from "../../sales-target/sales-target-imports";
import { LocalstorgeService } from "../../../localstorge.service";
import { ProductModel } from "../../../core/Models/Transactions/product-model";
import { TranslateService } from "@ngx-translate/core";

declare let $: any;

@Component({
  selector: "app-customer-display",
  templateUrl: "./customer-display.component.html",
  styleUrls: ["./customer-display.component.scss"]
})
export class CustomerDisplayComponent implements OnInit, OnDestroy {
  [key: string]: any;

  order: OrderModel = new OrderModel();
  slideIndex = 0;
  isInit = true;
  firstImage = "";
  logo = true;

  /*suggestions carousel*/
  itemsPerSlide = 3;
  singleSlideOffset = false;
  noWrapSlides = false;
  cycleInterval = 3000;
  slidesChangeMessage = "";
  suggestedProducts: ProductModel[] = [];

  imgURL = "";
  localImgURL = "";
  defaultIm = "assets/images/v10.jpg";

  constructor(
    public orderService: OrderService,
    public settingService: SettingService,
    private languageSerService: LanguageSerService,
    private common: CommonService,
    public translate: TranslateService,
    private LocalstorgeService: LocalstorgeService
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  ngOnInit(): void {
    this._listener();
    if (window.addEventListener) {
      window.addEventListener("storage", this._listener, false);
    }

    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";
    this.localImgURL = this.common.rooturl.replace("api", "");
    //this.imgURL = this.common.rooturl.replace("api", "");
    if (!this.LocalstorgeService.get("langs")) this.translate.setDefaultLang("en");
    else this.translate.setDefaultLang(this.LocalstorgeService.get("langs"));
    this.changeCssFile();

    this.GetAllImages();

    this.productSuggestionOpen();

    this.showSuggestion();
  }

  productSuggestionOpen(): void {
    this.responseobj = {};
    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";
  }

  showSuggestion(): void {
    const suggestions = this.LocalstorgeService.get("suggestions");
    if (!suggestions) {
      this.suggestedProducts = [];
      return;
    }

    this.suggestedProducts = suggestions;
  }

  changeCssFile() {
    if (!this.LocalstorgeService.get("langs")) this.LocalstorgeService.set("langs", "en");

    let langsSet: string = this.LocalstorgeService.get("langs");
    //let langsSet="en";
    let headTag = document.getElementsByTagName("head")[0] as HTMLHeadElement;
    let existingLink = document.getElementById("langCss") as HTMLLinkElement;
    let bundleName = langsSet === "ar" ? "arabicStyle.css" : "englishStyle.css";
    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      let newLink = document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.type = "text/css";
      newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }

    this.translate.setDefaultLang(langsSet);
    this.translate.use(langsSet);
    let htmlTag = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = langsSet === "ar" ? "rtl" : "ltr";
    this.setLang = langsSet;
  }

  GetAllImages() {
    this.orderService.GetAllImages().subscribe((res) => {
      this.imagePathes = res;
      this.firstImage = this.imagePathes[this.imagePathes.length - 1];
      this.showSlides(this.slideIndex, true);
      this.interval();
      this.setLogoForCUstomerDisplay();
    });
    this.settingService.GetSetting().subscribe((res: SettingModel) => {
      this.settings = res;
      if (this.settings) this.fraction = "." + this.settings.Round + "-" + this.settings.Round;
    });
  }

  private _listener = () => {
    const order = JSON.parse(localStorage.getItem("orderobj"));
    this.order = order ? order : new OrderModel();
    if (this.order && (!this.order.OrderDetails || !this.order.OrderDetails.length)) {
      this.order.SubTotal = 0;
      this.order.DeliveryPersonDeliveryPrice = 0;
    } else this.order.OrderDetails = this.order.OrderDetails.reverse();

    //console.log("order", order);

    this.showSuggestion();
  };

  ngOnDestroy() {
    window.removeEventListener("storage", this._listener, false);
  }

  interval() {
    setInterval(() => {
      this.showSlides(this.slideIndex);
    }, 5000);
  }

  // Next/previous controls
  plusSlides(n) {
    this.showSlides((this.slideIndex += n));
  }

  // Thumbnail image controls
  currentSlide(n) {
    this.showSlides((this.slideIndex = n));
  }

  showSlides(n, isInit = false) {
    let i;
    this.isInit = isInit;
    let slides = document.getElementsByClassName("mySlides") as any;
    if (n > slides.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    if (slides[this.slideIndex - 1] && slides[this.slideIndex - 1].style) {
      slides[this.slideIndex - 1].style.display = "block";
      if (this.slideIndex) this.slideIndex++;
    }
  }

  openFullscreen() {
    if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => console.log("Document Exited form Full screen mode"))
        .catch((err) => console.error(err));
    } else document.documentElement.requestFullscreen();
  }

  setLogoForCUstomerDisplay() {
    setTimeout(() => {
      let ele: any = document.getElementsByClassName("logo-version")[0];
      if (ele) ele.style.backgroundImage = "url(" + this.imgURL + this.firstImage + ")";
    }, 50);
  }
  onSlideRangeChange(indexes: number[] | void): void {
    this.slidesChangeMessage = `Slides have been switched: ${indexes}`;
  }
  protected readonly OrderModel = OrderModel;
}
