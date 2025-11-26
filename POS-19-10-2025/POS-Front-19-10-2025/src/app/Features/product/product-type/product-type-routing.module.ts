import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { ProductTypeComponent } from "./product-type/product-type.component";
import { ProductTypeListComponent } from "./product-type-list/product-type-list.component";

const routes: Routes = [
  {
    path: "",
    component: ProductTypeComponent,
    data: ["productType", "productTypelist"]
  },
  {
    path: "productTypelist",
    component: ProductTypeListComponent,
    data: ["productType", "productTypelist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductTypeRoutingModule {}
