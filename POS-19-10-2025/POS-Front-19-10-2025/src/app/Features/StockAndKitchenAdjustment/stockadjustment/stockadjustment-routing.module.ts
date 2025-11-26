import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";

import { StockadjutmentComponent } from "./stockadjutment/stockadjutment.component";
import { StockadjutmentlistComponent } from "./stockadjutmentlist/stockadjutmentlist.component";

const routes: Routes = [
  {
    path: "",
    component: StockadjutmentComponent,
    data: ["StockAdjustment", "stockadjustmentlist"]
  },
  {
    path: "stockadjustmentlist",
    component: StockadjutmentlistComponent,
    data: ["StockAdjustment", "stockadjustmentlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockAdjustmentRoutingModule {}
