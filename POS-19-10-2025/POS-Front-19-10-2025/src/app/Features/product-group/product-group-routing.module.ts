import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/core/Helper/auth-guard";

import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { ProductGroupListComponent } from "./product-group-list/product-group-list.component";
import { ProductGroupComponent } from "./product-group/product-group.component";

const routes: Routes = [
  {
    path: "",
    component: ProductGroupComponent,
    data: ["productgroup", "ProductGroupList"]
  },
  {
    path: "ProductGroupList",
    component: ProductGroupListComponent,
    data: ["productgroup", "ProductGroupList"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductGroupRoutingModule {}
