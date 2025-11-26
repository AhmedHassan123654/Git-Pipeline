import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { CashMovementFilterComponent } from "./cashmovementfilter/cash-movement-filter.component";

const routes: Routes = [
  // {
  //   path: '',
  //   component: AppLayoutComponent,
  //   canActivateChild:[AuthGuard],
  //   children: [
  { path: "", component: CashMovementFilterComponent }

  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashMovementFilterRoutingModule {}
