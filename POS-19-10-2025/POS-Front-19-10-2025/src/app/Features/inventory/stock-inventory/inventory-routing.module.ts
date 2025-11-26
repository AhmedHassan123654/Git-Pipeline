import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";

import { InventoryComponent } from "./stockinventory/inventory.component";
import { InventorylistComponent } from "./stockinventorylist/inventorylist.component";
const routes: Routes = [
  {
    path: "",
    component: InventoryComponent,
    data: ["stockinventory", "stockinventorylist"]
  },
  {
    path: "stockinventorylist",
    component: InventorylistComponent,
    data: ["stockinventory", "stockinventorylist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {}
