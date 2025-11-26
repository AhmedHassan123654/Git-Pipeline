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
exports.IndexModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var login_component_1 = require("./login/login.component");
var forget_password_component_1 = require("./forget-password/forget-password.component");
var reset_password_component_1 = require("./reset-password/reset-password.component");
var index_routing_module_1 = require("./index-routing.module");
var forms_1 = require("@angular/forms");
var must_match_directive_resetpass_1 = require("../shared/Directives/must-match-directive-resetpass");
var shared_module_1 = require("../shared/shared.module");
var angular_wizard_form_1 = require("angular-wizard-form");
var ngx_perfect_scrollbar_1 = require("ngx-perfect-scrollbar");
var ngx_perfect_scrollbar_2 = require("ngx-perfect-scrollbar");
var DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
  suppressScrollX: true
};
var IndexModule = /** @class */ (function () {
  function IndexModule() {}
  IndexModule = __decorate(
    [
      core_1.NgModule({
        declarations: [
          login_component_1.LoginComponent,
          forget_password_component_1.ForgetPasswordComponent,
          reset_password_component_1.ResetPasswordComponent,
          must_match_directive_resetpass_1.MustMatchDirectiveResetPass
        ],
        imports: [
          common_1.CommonModule,
          index_routing_module_1.IndexRoutingModule,
          forms_1.FormsModule,
          forms_1.ReactiveFormsModule,
          angular_wizard_form_1.FormWizardModule,
          shared_module_1.SharedModule,
          ngx_perfect_scrollbar_1.PerfectScrollbarModule
        ],
        providers: [
          {
            provide: ngx_perfect_scrollbar_2.PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
          }
        ]
      })
    ],
    IndexModule
  );
  return IndexModule;
})();
exports.IndexModule = IndexModule;
