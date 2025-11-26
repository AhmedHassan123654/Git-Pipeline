import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { PointofsaleComponent } from "./pointofsale/pointofsale.component";
import { PointofsalelistComponent } from "./pointofsalelist/pointofsalelist.component";

const routes: Routes = [
  {
    path: "",
    component: PointofsaleComponent,
    data: ["pointofsale", "pointofsalelist"]
  },
  {
    path: "pointofsalelist",
    component: PointofsalelistComponent,
    data: ["pointofsale", "pointofsalelist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointOfSaleRoutingModule {}
