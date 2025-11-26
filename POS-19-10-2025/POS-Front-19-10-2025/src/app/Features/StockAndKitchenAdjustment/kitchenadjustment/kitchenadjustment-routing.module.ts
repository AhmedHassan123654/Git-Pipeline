import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";

import { KitchenadjutmentComponent } from "./kitchenadjutment/kitchenadjutment.component";
import { KitchenadjutmentlistComponent } from "./kitchenadjutmentlist/kitchenadjutmentlist.component";

const routes: Routes = [
  {
    path: "",
    component: KitchenadjutmentComponent,
    data: ["KitchenAdjustment", "kitchenadjustmentlist"]
  },
  {
    path: "kitchenadjustmentlist",
    component: KitchenadjutmentlistComponent,
    data: ["KitchenAdjustment", "kitchenadjustmentlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitchenAdjustmentRoutingModule {}
