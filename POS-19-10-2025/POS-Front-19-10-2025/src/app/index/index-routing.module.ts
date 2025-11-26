import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { NotFoundComponent } from "../shared/not-found/not-found.component";
import { SpinnerModule } from "../shared/Directives/Spinner/spinner.module";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "forget_password", component: ForgetPasswordComponent },
  { path: "reset_password", component: ResetPasswordComponent }
  // {path: "**", component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule {}
