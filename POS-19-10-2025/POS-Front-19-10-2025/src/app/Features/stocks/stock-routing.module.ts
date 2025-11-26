import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { StockComponent } from "./stock/stock.component";
import { StocklistComponent } from "./stocklist/stocklist.component";

const routes: Routes = [
  // {
  //   path: "",
  //   component: AppLayoutComponent,
  //   canActivateChild: [AuthGuard],
  //   children: [
  { path: "", component: StockComponent },
  { path: "stocklist", component: StocklistComponent }
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule {}
