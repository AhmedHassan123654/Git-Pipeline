import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { IndexRoutingModule } from "./index-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MustMatchDirectiveResetPass } from "../shared/Directives/must-match-directive-resetpass";
import { SharedModule } from "../shared/shared.module";
import { FormWizardModule } from "angular-wizard-form";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { KeyboardModule } from "../Features/keyboard/keyboard/keyboard.module";
import { SpinnerModule } from "../shared/Directives/Spinner/spinner.module";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [LoginComponent, ForgetPasswordComponent, ResetPasswordComponent, MustMatchDirectiveResetPass],
  imports: [
    CommonModule,
    IndexRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FormWizardModule,
    SharedModule,
    PerfectScrollbarModule,
    KeyboardModule,
    SpinnerModule
  ],

  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class IndexModule {}
