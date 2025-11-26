import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { PaymentvoucherComponent } from "./paymentvoucher/paymentvoucher.component";
import { PaymentvoucherlistComponent } from "./paymentvoucherlist/paymentvoucherlist.component";

const routes: Routes = [
  // {
  //   path: '',
  //   component: AppLayoutComponent,
  //   canActivateChild:[AuthGuard],
  //   children: [
  { path: "", component: PaymentvoucherComponent },
  { path: "paymentvoucherlist", component: PaymentvoucherlistComponent }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentVoucherRoutingModule {}
