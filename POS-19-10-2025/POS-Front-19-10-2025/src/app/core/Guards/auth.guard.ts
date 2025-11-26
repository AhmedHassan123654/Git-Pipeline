import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../Services/Authentication/auth.service";
import { ToastrService } from "ngx-toastr";
@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private authservice: AuthService, private router: Router, public toastr: ToastrService) {}

  canActivate(): boolean {
    if (this.authservice.loggedIn()) {
      return true;
    }
    this.toastr.error("يجب تسجيل الدخول اولا");
    this.router.navigate([""]);
    return false;
  }
}
