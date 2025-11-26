import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { MeaslAmountComponent } from "./measl-amount/measl-amount.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
const routes: Routes = [
  // {
  //   path: "",
  //   component: AppLayoutComponent,
  //   canActivateChild: [AuthGuard],
  //   children: [
  { path: "", component: MeaslAmountComponent }

  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MealsAmountRoutingModule {}
