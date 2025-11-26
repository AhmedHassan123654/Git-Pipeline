import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { ProductComponent } from "./product/product.component";
import { ProductListComponent } from "./product-list/product-list.component";

const routes: Routes = [
  { path: "", component: ProductComponent },
  { path: "productlist", component: ProductListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
