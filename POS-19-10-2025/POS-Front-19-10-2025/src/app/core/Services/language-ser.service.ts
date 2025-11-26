import { Inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from "@angular/common";
import { LocalstorgeService } from "../../localstorge.service";
import { BehaviorSubject, Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class LanguageSerService {
  LangSetN = new BehaviorSubject<string>("");
  currentLang = this.LangSetN.asObservable();

  setRoute = new BehaviorSubject<Array<any>>([]);
  currentsetRoute = this.setRoute.asObservable();

  setcurrentsetRoute(lastRoute) {
    return this.setRoute.next(lastRoute);
  }

  langsSet: string;
  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private LocalstorgeService: LocalstorgeService
  ) {
    this.currentLang.subscribe((lang) => (this.langsSet = lang));
    if (this.LocalstorgeService.get("langs") == null) {
      this.LocalstorgeService.set("langs", "ar");
      this.LangSetN.next("ar");
    } else this.LangSetN.next(this.LocalstorgeService.get("langs"));
  }
  changeLang(Language: string) {
    this.LangSetN.next(Language);
  }

  // changeCssFile() {
  //   // debugger
  //  if(this.LocalstorgeService.get("langs")==null){
  //    this.LocalstorgeService.set("langs", "ar");
  //     this.LangSetN.next("ar");
  //  }else{
  //    this.langsSet = this.LocalstorgeService.get("langs");
  //    this.LangSetN.next(this.langsSet);
  //  }

  //   ;

  //  //let langsSet="en";
  //   let headTag = this.document.getElementsByTagName("head")[0] as HTMLHeadElement;
  //   let existingLink = this.document.getElementById("langCss") as HTMLLinkElement;
  //   let bundleName = this.langsSet === "ar" ? "arabicStyle.css":"englishStyle.css";
  //   if (existingLink) {
  //      existingLink.href = bundleName;
  //   } else {
  //      let newLink = this.document.createElement("link");
  //      newLink.rel = "stylesheet";
  //      newLink.type = "text/css";
  //      newLink.id = "langCss";
  //      newLink.href = bundleName;
  //      headTag.appendChild(newLink);
  //   }

  //   this.translate.setDefaultLang(this.langsSet);
  //   this.translate.use(this.langsSet);
  //   let htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
  //   htmlTag.dir = this.langsSet ==="ar" ?"rtl" :"ltr";
  //   // this.setLang =langsSet ;
  //   }
}
