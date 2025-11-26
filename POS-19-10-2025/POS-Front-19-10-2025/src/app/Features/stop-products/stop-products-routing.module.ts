import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StopProductsComponent } from "./stop-products/stop-products.component";

const routes: Routes = [{ path: "", component: StopProductsComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StopProductsRoutingModule {}
