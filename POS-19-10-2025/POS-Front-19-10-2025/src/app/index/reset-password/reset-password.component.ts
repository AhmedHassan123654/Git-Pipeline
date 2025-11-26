import { Component, OnInit } from "@angular/core";
import { ResetPasswordModel } from "src/app/core/Models/Authentication/reset-password-model";
import { LoginService } from "src/app/core/Services/Authentication/login.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { ToastrService } from "ngx-toastr";
import { LoginModel } from "src/app/core/Models/Authentication/login-model";
declare var $: any;
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit {
  Resetobj: ResetPasswordModel = new ResetPasswordModel();
  Message: string = "";
  showform: boolean = true;
  showlink: boolean = false;
  loginobj: LoginModel = new LoginModel();
  constructor(
    private LoginSer: LoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private errorMessage: HandlingBackMessages,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    $("#preloader-wrap").addClass("loaded");
    var snapshot = this.activatedRoute.snapshot;
    const params = { ...snapshot.queryParams };
    this.Resetobj.Token = params.token;
    this.Resetobj.UserId = params.UserId;
    delete params.token;
    delete params.UserId;
    this.router.navigate([], { queryParams: params });
  }
  onSubmit() {
    this.LoginSer.ResetPassword(this.Resetobj).subscribe(
      (res: any) => {
        let modalName = this.errorMessage.UserMessages(res)[1];
        $(modalName).modal("show");
        this.Message = this.errorMessage.UserMessages(res)[0];
      },
      (err) => {
        this.toastr.error(this.errorMessage.LoginMessages(err)[0], "Resetpassword");
      }
    );
  }
  onModelClose() {
    this.showform = false;
    this.showlink = true;
    this.loginobj.LoginUserId = this.Resetobj.UserId;
    this.loginobj.LoginPassword = this.Resetobj.Password;
    this.LoginSer.Post(this.loginobj).subscribe(
      (res: any) => {
        if (res.token != null) {
          localStorage.setItem("token", res.token);
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toastr.error(this.errorMessage.LoginMessages(err), "ResetPassword");
        } else console.log(err);
      }
    );
  }
  callkeyboard() {
    this.LoginSer.openkeyboard().subscribe(
      (res: any) => {
      },
      (err) => {
        this.toastr.error(this.errorMessage.LoginMessages(err), "ResetPassword");
      }
    );
  }
}
