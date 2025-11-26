import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SalesTargetListComponent } from "./sales-target-list/sales-target-list.component";
import { SalesTargetComponent } from "./sales-target/sales-target.component";

const routes: Routes = [
  {
    path: "",
    component: SalesTargetComponent,
    data: ["salestarget", "salestargetlist"]
  },
  {
    path: "salestargetlist",
    component: SalesTargetListComponent,
    data: ["salestarget", "salestargetlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesTargetRoutingModule {}
