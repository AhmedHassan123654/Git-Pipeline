import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ForgotPasswordModel } from "src/app/core/Models/Authentication/forgot-password-model";
import { LoginService } from "src/app/core/Services/Authentication/login.service";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { ToastrService } from "ngx-toastr";
declare var $: any;
@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.css"]
})
export class ForgetPasswordComponent implements OnInit {
  Forgotobj: ForgotPasswordModel = new ForgotPasswordModel();
  Message: string = "";
  loadHere: boolean = true;

  constructor(
    private LoginSer: LoginService,
    private errorMessage: HandlingBackMessages,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    $("#preloader-wrap").addClass("loaded");
  }
  loading() {
    $("#preloader-wrap").removeClass("loaded");
  }
  onSubmit() {
    this.LoginSer.FOrgotPassword(this.Forgotobj).subscribe(
      (res: any) => {
        let modalName = this.errorMessage.ForgetPassMessages(res)[1];
        // $('#preloader-wrap').removeClass('loaded');

        $(modalName).modal("show");
        this.Message = this.errorMessage.ForgetPassMessages(res)[0];
        if (this.Message) {
          $("#preloader-wrap").addClass("loaded");
        }
      },
      (err) => {
        this.loading();
        this.toastr.error(this.errorMessage.LoginMessages(err)[0], "ForgetPassword");
      }
    );
  }

  callkeyboard() {
    this.LoginSer.openkeyboard().subscribe(
      (res: any) => {
      },
      (err) => {
        this.toastr.error(this.errorMessage.LoginMessages(err), "ForgetPassword");
      }
    );
  }

  //  ngAfterViewInit(){
  //   $('#preloader-wrap').addClass('loaded');
  //  }
}
