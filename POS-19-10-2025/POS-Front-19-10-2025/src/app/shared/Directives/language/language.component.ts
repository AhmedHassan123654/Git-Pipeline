import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LocalstorgeService } from "src/app/localstorge.service";
import { DOCUMENT } from "@angular/common";
import { Location } from "@angular/common";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";

@Component({
  selector: "app-language",
  templateUrl: "./language.component.html",
  styleUrls: ["./language.component.css"]
})
export class LanguageComponent implements OnInit {
  @ViewChild("changeLang") changeLang: ElementRef;
  setLang: string;
  Language: string;
  NewLang: string;
  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private Router: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private LocalstorgeService: LocalstorgeService,
    private languageSerService: LanguageSerService
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.Language = lan));
    this.translate.use(this.Language);
  }

  ngOnInit() {
    this.languageSerService.currentLang.subscribe((lang) => (this.Language = lang));
    this.translate.use(this.Language);
    if (!this.LocalstorgeService.get("langs") && !this.Language) {
      this.setLang = "ar";
      this.languageSerService.LangSetN.next("ar");
    } else this.setLang = this.LocalstorgeService.get("langs");

    this.languageSerService.LangSetN.next(this.setLang);
    if (!this.LocalstorgeService.get("langs")) this.translate.setDefaultLang("ar");
    else this.translate.setDefaultLang(this.LocalstorgeService.get("langs"));

    this.changeCssFile(this.Language);
    this.languageSerService.currentLang.subscribe((lan) => (this.Language = lan));
    this.translate.use(this.Language);
  }

  switchLocalization(lang: string) {
    //  let currentUrl = this.router.url;
    //  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    //  this.router.onSameUrlNavigation = 'reload';
    //  this.router.navigate([currentUrl]);
    this.NewLang = this.LocalstorgeService.get("langs");
    this.LocalstorgeService.set("langs", lang);
    this.languageSerService.changeLang(lang);
    this.setLang = lang;
    this.changeCssFile(lang);

    this.reloadCurrentRoute();
  }
  reloadCurrentRoute() {
    this.languageSerService.currentLang.subscribe((lan) => (this.Language = lan));
    this.translate.use(this.Language);
    let currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.languageSerService.currentLang.subscribe((lan) => (this.Language = lan));
      this.translate.use(this.Language);
      this.router.navigate([currentUrl]);
      this.languageSerService.currentLang.subscribe((lan) => (this.Language = lan));
      this.translate.use(this.Language);
    });
  }
  changeCssFile(lang) {
    if (this.LocalstorgeService.get("langs") == null) {
      this.LocalstorgeService.set("langs", "ar");
      this.languageSerService.changeLang("ar");
    } else {
      //  this.languageSerService.langsSet = this.LocalstorgeService.get("langs");
      this.languageSerService.changeLang(lang);
    }

    //let langsSet="en";
    let headTag = this.document.getElementsByTagName("head")[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById("langCss") as HTMLLinkElement;
    let bundleName = this.languageSerService.langsSet === "ar" ? "arabicStyle.css" : "englishStyle.css";
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

    this.translate.setDefaultLang(this.languageSerService.langsSet);
    this.translate.use(this.languageSerService.langsSet);
    let htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = this.languageSerService.langsSet === "ar" ? "rtl" : "ltr";
    // this.setLang =langsSet ;
  }
}
