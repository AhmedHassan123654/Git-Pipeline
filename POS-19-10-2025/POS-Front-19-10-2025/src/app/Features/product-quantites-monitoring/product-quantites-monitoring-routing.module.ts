import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/core/Guards/auth.guard";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { ProductsQuantitiesMonitoringComponent } from "./product-quantity-monitoring/products-quantities-monitoring.component";

const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [{ path: "", component: ProductsQuantitiesMonitoringComponent }]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsQuantitiesMonitoringRoutingModule {}
