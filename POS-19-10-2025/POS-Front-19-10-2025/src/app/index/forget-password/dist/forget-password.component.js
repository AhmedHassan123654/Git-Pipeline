"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
exports.__esModule = true;
exports.ForgetPasswordComponent = void 0;
var core_1 = require("@angular/core");
var forgot_password_model_1 = require("src/app/core/Models/Authentication/forgot-password-model");
var ForgetPasswordComponent = /** @class */ (function () {
  function ForgetPasswordComponent(LoginSer, errorMessage, toastr) {
    this.LoginSer = LoginSer;
    this.errorMessage = errorMessage;
    this.toastr = toastr;
    this.Forgotobj = new forgot_password_model_1.ForgotPasswordModel();
    this.Message = "";
    this.loadHere = true;
  }
  ForgetPasswordComponent.prototype.ngOnInit = function () {
    $("#preloader-wrap").addClass("loaded");
  };
  ForgetPasswordComponent.prototype.loading = function () {
    $("#preloader-wrap").removeClass("loaded");
  };
  ForgetPasswordComponent.prototype.onSubmit = function () {
    var _this = this;
    this.LoginSer.FOrgotPassword(this.Forgotobj).subscribe(
      function (res) {
        var modalName = _this.errorMessage.ForgetPassMessages(res)[1];
        // $('#preloader-wrap').removeClass('loaded');
        $(modalName).modal("show");
        _this.Message = _this.errorMessage.ForgetPassMessages(res)[0];
        if (_this.Message) {
          $("#preloader-wrap").addClass("loaded");
        }
      },
      function (err) {
        _this.loading();
        _this.toastr.error(_this.errorMessage.LoginMessages(err)[0], "ForgetPassword");
      }
    );
  };
  ForgetPasswordComponent.prototype.callkeyboard = function () {
    var _this = this;
    this.LoginSer.openkeyboard().subscribe(
      function (res) {
      },
      function (err) {
        _this.toastr.error(_this.errorMessage.LoginMessages(err), "ForgetPassword");
      }
    );
  };
  ForgetPasswordComponent = __decorate(
    [
      core_1.Component({
        selector: "app-forget-password",
        templateUrl: "./forget-password.component.html",
        styleUrls: ["./forget-password.component.css"]
      })
    ],
    ForgetPasswordComponent
  );
  return ForgetPasswordComponent;
})();
exports.ForgetPasswordComponent = ForgetPasswordComponent;
