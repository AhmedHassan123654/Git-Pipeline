import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { CashreceiptComponent } from "./cashreceipt/cashreceipt.component";
import { CashreceiptlistComponent } from "./cashreceiptlist/cashreceiptlist.component";

const routes: Routes = [
  {
    path: "",
    component: CashreceiptComponent,
    data: ["cashreceipt", "cashreceiptlist"]
  },
  {
    path: "cashreceiptlist",
    component: CashreceiptlistComponent,
    data: ["cashreceipt", "cashreceiptlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashReceiptRoutingModule {}
