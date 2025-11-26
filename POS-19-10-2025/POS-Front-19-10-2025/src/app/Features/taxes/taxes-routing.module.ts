import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { TaxComponent } from "./tax/tax.component";
import { TaxListComponent } from "./tax-list/tax-list.component";
import { AssignTaxProductsComponent } from "./assign-tax-products/assign-tax-products.component";

const routes: Routes = [
  { path: "", component: TaxComponent, data: ["tax", "taxlist"] },
  { path: "taxlist", component: TaxListComponent, data: ["tax", "taxlist"] },
  {
    path: "assignTaxProducts",
    component: AssignTaxProductsComponent,
    data: ["tax", "taxlist", "assignTaxProducts"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxesRoutingModule {}
