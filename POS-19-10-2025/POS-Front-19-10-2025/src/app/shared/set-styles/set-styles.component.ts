import { Component, OnInit } from "@angular/core";
import { GradientConfig } from "../../app-config";
import { UserProfileServiceService } from "src/app/core/Services/Authentication/user-profile-service.service";
import { ProfileModel } from "src/app/core/Models/Authentication/profile-model";

declare var $: any;
@Component({
  selector: "app-set-styles",
  templateUrl: "./set-styles.component.html",
  styleUrls: ["./set-styles.component.scss"]
})
export class SetStylesComponent implements OnInit {
  colorRespo: any;
  public gradientConfig: any;
  OpenLoged: boolean;
  userprofileobj: ProfileModel = new ProfileModel();
  public headerBackgroundColor: string; // header background color
  public layoutType: string; // layout type
  public isConfig: boolean;
  public darkTheme: string;

  constructor(public userServ: UserProfileServiceService, private userprofileser: UserProfileServiceService) {
    this.gradientConfig = GradientConfig.config;
  }

  ngOnInit() {
    this.GetUserInfo();
  }
  // change main layout
  setLayout(layout) {
    document.querySelector(".pcoded-navbar").classList.remove("menu-light");
    document.querySelector(".pcoded-navbar").classList.remove("menu-dark");
    document.querySelector(".pcoded-navbar").classList.remove("navbar-dark");
    document.querySelector(".pcoded-navbar").classList.remove("brand-dark");
    document.querySelector("body").classList.remove("gradient-dark");
    document.querySelector("body").classList.remove("ms-dark-theme");
    this.layoutType = layout;
    if (layout === "menu-light") {
      document.querySelector(".pcoded-navbar").classList.add(layout);
      (this.gradientConfig.darkTheme = "ms-primary-theme"),
        document.querySelector(".pcoded-navbar").classList.add(layout);
      this.gradientConfig.layoutType = layout;
      this.layoutType = layout;
      localStorage.setItem("user", JSON.stringify(this.gradientConfig));
    }
    if (layout === "menu-dark") {
      document.querySelector(".pcoded-navbar").classList.add(layout);
      (this.gradientConfig.darkTheme = "ms-primary-theme"),
        document.querySelector("body").classList.remove("ms-dark-theme");
      this.gradientConfig.layoutType = layout;
      this.layoutType = layout;
      localStorage.setItem("user", JSON.stringify(this.gradientConfig));
    }
    if (layout === "dark") {
      document.querySelector("body").classList.add("ms-dark-theme");
      (this.gradientConfig.darkTheme = "ms-dark-theme"),
        // document.querySelector('.pcoded-navbar').classList.add(layout);
        (this.gradientConfig.layoutType = layout);
      this.layoutType = layout;
      localStorage.setItem("user", JSON.stringify(this.gradientConfig));

      // this.gradientConfig.layoutType = 'dark';
      // this.layoutType = 'dark';
    }

    if (layout === "reset") {
      //this.reset();
    }
    this.setActiveColor(JSON.stringify(this.gradientConfig));
  }

  setActiveColor(e?: any) {
    let obj = { Color: e };
    this.userServ.UpdateUserStyle(obj).subscribe((res) => {});
  }

  setHeaderBackground(background) {
    this.headerBackgroundColor = background;
    this.gradientConfig.headerBackColor = background;
    document.querySelector(".pcoded-header").classList.remove("header-blue");
    document.querySelector(".pcoded-header").classList.remove("header-red");
    document.querySelector(".pcoded-header").classList.remove("header-purple");
    document.querySelector(".pcoded-header").classList.remove("header-info");
    document.querySelector(".pcoded-header").classList.remove("header-dark");
    document.querySelector(".pcoded-header").classList.remove("header-orenge");
    document.querySelector(".pcoded-header").classList.remove("header-green");
    document.querySelector(".pcoded-header").classList.remove("header-yellow");
    document.querySelector(".pcoded-header").classList.remove("header-orchidgreen");
    document.querySelector(".pcoded-header").classList.remove("header-indigogreen");
    document.querySelector(".pcoded-header").classList.remove("header-darkgreen");
    document.querySelector(".pcoded-header").classList.remove("header-darkblue");

    if (background !== "header-default") {
      document.querySelector(".pcoded-header").classList.add(background);
      this.gradientConfig.headerBackColor = background;
      this.headerBackgroundColor = background;
      this.setActiveColor(JSON.stringify(this.gradientConfig));
      // localStorage.setItem('user',JSON.stringify(this.gradientConfig));
      //     this.userServ.UpdateUserStyle({Color:e+"-font-theme"}).subscribe((res)=>{
      //       let c = res;
      //       let color = e+"-font-theme";

      //     })
    }
  }

  // get activeTheme(){
  //   return this.themeService.theme;
  // }
  // get activeTheme2(){
  //   return this.themeService.theme2;
  // }
  // changeThemeTo(selectedTheme: Theme){
  //   this.themeService.theme = selectedTheme;

  // }
  // chTheme(selectedTheme: Theme2){
  //   this.themeService.theme2 = selectedTheme;
  // }
  //return data
  GetUserInfo() {
    this.userprofileser.GetUserInfo().subscribe(
      (res: any) => {
        this.userprofileobj = res;
        //res
        if (this.userprofileobj && this.userprofileobj.Color) {
          this.colorRespo = JSON.parse(this.userprofileobj.Color);
          // console.log("colorRespo",this.colorRespo);
          this.UseData(this.colorRespo);
        }
      },
      (err) => {}
    );
  }
  //set data
  UseData(res?) {
    // res = JSON.parse(localStorage.getItem('user'));
    if (res) {
      this.gradientConfig.headerBackColor = res.headerBackColor;
      this.headerBackgroundColor = res.headerBackColor;
      document.querySelector(".pcoded-header").classList.add(this.gradientConfig.headerBackColor);
      this.gradientConfig.layoutType = res.layoutType;
      this.layoutType = res.layoutType;
      document.querySelector(".pcoded-navbar").classList.add(this.gradientConfig.layoutType);
      this.gradientConfig.darkTheme = res.darkTheme;

      document.querySelector("body").classList.add(this.gradientConfig.darkTheme);
    } else {
      this.gradientConfig.headerBackColor = "header-darkblue";
    }

    // this.stylingThemeService.currentStylingTheme.subscribe(u =>this.gradientConfig = u )
  }
}
