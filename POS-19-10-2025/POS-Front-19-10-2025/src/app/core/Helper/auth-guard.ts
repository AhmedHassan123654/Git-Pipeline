import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "../Services/Authentication/login.service";
import { UserInterface } from "./user-interface";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private Logser: LoginService,
     private toastr: ToastrService, public translate: TranslateService
    ) {}
  result: UserInterface;
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.Logser.getUserScreensPermissions().subscribe((res: any) => {
      this.result = res;
      //Item1 == IsAdmin If Its true thats meant that the user is Admin
      if (this.result?.Item1 === true) {
        return true;
      } else {
        let screens: string[] = [];
        this.result?.Item2?.forEach((screen: string) => {
          screens.push(this.getFinalRoutName(screen));
        });
        if (screens.length === 0 || !screens) {
          this.router.navigateByUrl("/login");
          this.toastr.warning(this.translate.instant("messages.userHasNoPermission"));
          return false;
        }
        screens.push("home");
        // Fake screen
        screens.push("endofdayreport");
        screens.push("userprofile");
        let existscreen: string = screens?.find((s: string) =>
          window.location.href.toLowerCase().includes(s.toLowerCase())
        );
        if (!existscreen) {
          debugger
          this.router.navigateByUrl("/NotAuthorized");
          return false;
        }
      }
    });
    if (localStorage.getItem("token") != null) return true;
    else {
      this.router.navigateByUrl("/login");
      return false;
    }
  }
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (localStorage.getItem("token") != null) {
      // this.Logser.Getviewdata().subscribe(
      //   (res: any) => {
      //    if(res==true){
      //      return true;

      //    }
      //   if(res==false){
      //     this.router.navigateByUrl("/NotAuthorized");
      //   }
      //   },

      // );

      /*  let roles = next.data["permittedRoles"] as Array<string>;
      if (roles) {
        if (this.roleMatch(roles)) return true;
        else {
          this.router.navigateByUrl("/NotAuthorized");
          return false;
        }
      } */
      return true;
    } else {
      this.router.navigateByUrl("/login");
      return false;
    }
  }

  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    var payLoad = JSON.parse(window.atob(localStorage.getItem("token").split(".")[1]));
    var userRole = payLoad.role;
    allowedRoles.forEach((element) => {
      if (userRole == element) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }
// remane controllerName to RouteName in ScreenService 
  getFinalRoutName(rout:string ):string
  {
      switch (rout.toLowerCase())
      {
          case "usergroup":
              return "PermissionGroup";
          case "endofdayreport":
              return "endShift";
          case "foodplan": //controllerName
              return "Feedemployees";//RouteName 
          case "paymenttype":
              return "PayType";
          case "compoproduct":
              return "comboProducts";
          case "workshift":
              return "shifts";
          case "minimumcharge":
              return "minimumcharge";
          case "mypoints":
              return "mypoints";
          case "pricingclasses":
              return "PricingClass";
          case "endofday":
              return "endShift";
          case "returnorderinsurance":
              return "returnInsurances";
          default:
              return rout;
      }
  }
}
