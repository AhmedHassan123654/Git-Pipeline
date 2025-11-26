import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";

import { KitchenInventoryComponent } from "./kitchenstockinventory/kitcheninventory.component";
import { KitchenInventorylistComponent } from "./kitchenstockinventorylist/kitcheninventorylist.component";
const routes: Routes = [
  {
    path: "",
    component: KitchenInventoryComponent,
    data: ["kitcheninventory", "kitcheninventorylist"]
  },
  {
    path: "kitcheninventorylist",
    component: KitchenInventorylistComponent,
    data: ["kitcheninventory", "kitcheninventorylist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitchenInventoryRoutingModule {}
