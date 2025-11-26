"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
exports.ResetPasswordComponent = void 0;
var core_1 = require("@angular/core");
var reset_password_model_1 = require("src/app/core/Models/Authentication/reset-password-model");
var login_model_1 = require("src/app/core/Models/Authentication/login-model");
var ResetPasswordComponent = /** @class */ (function () {
  function ResetPasswordComponent(LoginSer, activatedRoute, router, errorMessage, toastr) {
    this.LoginSer = LoginSer;
    this.activatedRoute = activatedRoute;
    this.router = router;
    this.errorMessage = errorMessage;
    this.toastr = toastr;
    this.Resetobj = new reset_password_model_1.ResetPasswordModel();
    this.Message = "";
    this.showform = true;
    this.showlink = false;
    this.loginobj = new login_model_1.LoginModel();
  }
  ResetPasswordComponent.prototype.ngOnInit = function () {
    $("#preloader-wrap").addClass("loaded");
    var snapshot = this.activatedRoute.snapshot;
    var params = __assign({}, snapshot.queryParams);
    this.Resetobj.Token = params.token;
    this.Resetobj.UserId = params.UserId;
    delete params.token;
    delete params.UserId;
    this.router.navigate([], { queryParams: params });
  };
  ResetPasswordComponent.prototype.onSubmit = function () {
    var _this = this;
    this.LoginSer.ResetPassword(this.Resetobj).subscribe(
      function (res) {
        var modalName = _this.errorMessage.UserMessages(res)[1];
        $(modalName).modal("show");
        _this.Message = _this.errorMessage.UserMessages(res)[0];
      },
      function (err) {
        _this.toastr.error(_this.errorMessage.LoginMessages(err)[0], "Resetpassword");
      }
    );
  };
  ResetPasswordComponent.prototype.onModelClose = function () {
    var _this = this;
    this.showform = false;
    this.showlink = true;
    this.loginobj.LoginUserId = this.Resetobj.UserId;
    this.loginobj.LoginPassword = this.Resetobj.Password;
    this.LoginSer.Post(this.loginobj).subscribe(
      function (res) {
        if (res.token != null) {
          localStorage.setItem("token", res.token);
        }
      },
      function (err) {
        if (err.status == 400) {
          _this.toastr.error(_this.errorMessage.LoginMessages(err), "ResetPassword");
        } else console.log(err);
      }
    );
  };
  ResetPasswordComponent.prototype.callkeyboard = function () {
    var _this = this;
    this.LoginSer.openkeyboard().subscribe(
      function (res) {
      },
      function (err) {
        _this.toastr.error(_this.errorMessage.LoginMessages(err), "ResetPassword");
      }
    );
  };
  ResetPasswordComponent = __decorate(
    [
      core_1.Component({
        selector: "app-reset-password",
        templateUrl: "./reset-password.component.html",
        styleUrls: ["./reset-password.component.css"]
      })
    ],
    ResetPasswordComponent
  );
  return ResetPasswordComponent;
})();
exports.ResetPasswordComponent = ResetPasswordComponent;
