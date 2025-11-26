import { Component, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LocalstorgeService } from "./localstorge.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent{
  title = "POS";
  showLoadingIndicator: boolean = true;
  token:string = null;
  tabIndex?:string;
  constructor(
    public translate: TranslateService, // ,private spinnerSer:SpinnerService
    private router: Router,
    private localstorageServ:LocalstorgeService
  ) {
    translate.setDefaultLang("en");

    this.addTabIndex();
    this._listener();
    if (window.addEventListener) {
      window.addEventListener("storage", this._listener, false);
    }
  }

  // called in appComponent constractor it means only when new tab opend
  addTabIndex(){
    let tabsIndexes:string[] = this.localstorageServ.get('tabsIndexes');
    if(!tabsIndexes) tabsIndexes = [];
    this.tabIndex = Math.random().toString(36).substring(2, 15);
    tabsIndexes.push(this.tabIndex);
    this.localstorageServ.set('tabsIndexes',tabsIndexes)
  }
  // when tab is closed or reloded event
  @HostListener('window:beforeunload', ['$event'])
  removeTabIndex(event: Event) {
    let tabsIndexes:string[] = this.localstorageServ.get('tabsIndexes');
    if(!tabsIndexes) tabsIndexes = [];
    
    tabsIndexes = tabsIndexes.filter(x=> x != this.tabIndex);
    this.localstorageServ.set('tabsIndexes',tabsIndexes)
  }

  private _listener = () => {
    const token = localStorage.getItem("token");
    
    if(!token) this.router.navigateByUrl("/login");

    // if(token && this.token == token) return;
    // this.token = token;
    // if (!location.href.includes('login')) {
    //   // Token changed, reload the page
    //   if (token) {
    //     this.loginSer.UserLogin(new UserLoginModel()).subscribe((model: any) => {
    //       localStorage.setItem("UserLoginDocumentId", JSON.stringify(model));
    //         if(location.href.includes('home')){
    //           this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
    //             this.router.navigateByUrl("/home");
    //           });
    //         }
    //         else
    //           this.router.navigateByUrl("/home");
    //       });
    //   }
    //   else
    //     this.router.navigateByUrl("/login");
    // }
  }



}